import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse, Quote } from '../../../types/quotes'
import { addCFQuote } from '../../../services/insurers/cf'
import { addMarkelQuote } from '../../../services/insurers/markel'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res)
      case 'POST':
        return await handlePost(req, res)
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' })
    }
  } catch (error: any) {
    console.error('Quotes API error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { status, policy_type, page = 1, limit = 50 } = req.query

  let query = supabaseAdmin
    .from('quotes')
    .select(`
      *,
      quote_items (
        id,
        insurer,
        channel,
        premium,
        currency,
        payload,
        submission_id,
        response_status,
        created_at
      )
    `)

  // Apply filters
  if (status && typeof status === 'string') {
    query = query.eq('status', status)
  }
  if (policy_type && typeof policy_type === 'string') {
    query = query.eq('policy_type', policy_type)
  }

  // Pagination
  const pageNum = parseInt(page as string)
  const limitNum = parseInt(limit as string)
  const offset = (pageNum - 1) * limitNum

  query = query
    .range(offset, offset + limitNum - 1)
    .order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching quotes:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch quotes' 
    })
  }

  res.status(200).json({
    success: true,
    data: {
      quotes: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count
      }
    },
    message: `Retrieved ${data?.length || 0} quotes`
  })
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const {
    company_name,
    email,
    policy_type,
    classification,
    exposure_value,
    start_date,
    end_date,
    address_street,
    address_city,
    address_state,
    address_zip,
    address_country = 'USA',
    coverage_limits,
    additional_info,
    destination,
    created_by,
    form_data,
    applicant_name,
    phone,
    selected_insurers = [] // Array of selected insurers: ['CF', 'Markel']
  } = req.body

  // Validate required fields
  const requiredFields = [
    'company_name', 'email', 'policy_type', 'classification',
    'exposure_value', 'start_date', 'end_date', 'destination', 'created_by'
  ]

  const missingFields = requiredFields.filter(field => !req.body[field])
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields)
    console.error('Request body:', req.body)
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      data: { missingFields }
    })
  }

  // Log para debug
  console.log('Creating quote with data:', {
    company_name,
    email,
    policy_type,
    classification,
    exposure_value,
    start_date,
    end_date,
    address_street,
    destination,
    created_by,
    selected_insurers
  })

  // Create the quote in database first
  const { data: quoteData, error: quoteError } = await supabaseAdmin
    .from('quotes')
    .insert({
      company_name,
      applicant_name,
      email,
      phone,
      policy_type,
      classification,
      exposure_value,
      start_date,
      end_date,
      address_street,
      city: address_city, // Map address_city to city column
      state: address_state, // Map address_state to state column
      zip: address_zip, // Map address_zip to zip column
      address_zip,
      country: address_country,
      coverage_limits,
      additional_info,
      destination,
      created_by,
      form_data, // Include form_data
      submission_source: 'internal_form',
      status: 'pending', // Quote submitted and waiting for review
      submitted_at: new Date().toISOString()
    })
    .select()
    .single()

  if (quoteError) {
    console.error('Error creating quote:', quoteError)
    return res.status(400).json({ 
      success: false, 
      error: quoteError.message 
    })
  }

  // Prepare quote object for API calls
  const quote: Quote = {
    id: quoteData.id,
    quote_number: quoteData.quote_number,
    company_name,
    applicant_name,
    email,
    phone,
    policy_type,
    classification,
    exposure_value,
    policy_start_date: start_date,
    policy_end_date: end_date,
    address_street,
    address_city,
    address_state,
    address_zip,
    coverage_limits,
    form_data,
    ...quoteData
  }

  // Send to selected insurers
  const insurerResponses = []
  const quoteItems = []

  // Send to CF if selected
  if (selected_insurers.includes('CF')) {
    try {
      console.log('Sending quote to CF...')
      const cfResponse = await addCFQuote(quote)
      insurerResponses.push(cfResponse)
      
      // Save CF response to quote_items
      const { error: cfItemError } = await supabaseAdmin
        .from('quote_items')
        .insert({
          quote_id: quoteData.id,
          insurer: 'CF',
          channel: 'direct',
          premium: cfResponse.premium,
          currency: 'USD',
          payload: cfResponse.rawResponse,
          submission_id: cfResponse.quoteNumber,
          response_status: cfResponse.success ? 'success' : 'error',
          quote_number: cfResponse.quoteNumber,
          policy_number: undefined,
          status: cfResponse.status,
          documents: cfResponse.documents,
          carrier: 'CF'
        })

      if (cfItemError) {
        console.error('Error saving CF quote item:', cfItemError)
      } else {
        quoteItems.push({
          insurer: 'CF',
          response: cfResponse
        })
      }
    } catch (error: any) {
      console.error('Error sending to CF:', error)
      insurerResponses.push({
        success: false,
        quoteId: quoteData.id,
        quoteNumber: '',
        status: 'declined',
        message: error.message || 'Failed to send to CF',
        carrier: 'CF',
        rawResponse: error
      })
    }
  }

  // Send to Markel if selected
  if (selected_insurers.includes('Markel')) {
    try {
      console.log('Sending quote to Markel...')
      const markelResponse = await addMarkelQuote(quote)
      insurerResponses.push(markelResponse)
      
      // Save Markel response to quote_items
      const { error: markelItemError } = await supabaseAdmin
        .from('quote_items')
        .insert({
          quote_id: quoteData.id,
          insurer: 'Markel',
          channel: 'direct',
          premium: markelResponse.premium,
          currency: 'USD',
          payload: markelResponse.rawResponse,
          submission_id: markelResponse.quoteNumber,
          response_status: markelResponse.success ? 'success' : 'error',
          quote_number: markelResponse.quoteNumber,
          policy_number: undefined,
          status: markelResponse.status,
          documents: markelResponse.documents,
          carrier: 'Markel'
        })

      if (markelItemError) {
        console.error('Error saving Markel quote item:', markelItemError)
      } else {
        quoteItems.push({
          insurer: 'Markel',
          response: markelResponse
        })
      }
    } catch (error: any) {
      console.error('Error sending to Markel:', error)
      insurerResponses.push({
        success: false,
        quoteId: quoteData.id,
        quoteNumber: '',
        status: 'declined',
        message: error.message || 'Failed to send to Markel',
        carrier: 'Markel',
        rawResponse: error
      })
    }
  }

  // Update quote status based on responses
  let finalStatus = 'pending'
  if (insurerResponses.length > 0) {
    const hasSuccessfulQuotes = insurerResponses.some(r => r.success && r.status === 'quoted')
    const hasReferredQuotes = insurerResponses.some(r => r.success && r.status === 'referred')
    
    if (hasSuccessfulQuotes) {
      finalStatus = 'quoted'
    } else if (hasReferredQuotes) {
      finalStatus = 'referred'
    } else {
      finalStatus = 'declined'
    }
  }

  // Update quote with final status
  await supabaseAdmin
    .from('quotes')
    .update({ status: finalStatus })
    .eq('id', quoteData.id)

  res.status(201).json({
    success: true,
    data: {
      quote: quoteData,
      insurerResponses,
      quoteItems,
      finalStatus
    },
    message: `Quote created successfully and sent to ${selected_insurers.length} insurers`
  })
} 