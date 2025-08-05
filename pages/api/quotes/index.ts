import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../src/lib/supabase'
import type { ApiResponse, Quote } from '../../../types/quotes'

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
        premium,
        currency,
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
    phone
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
    created_by
  })

  const { data, error } = await supabaseAdmin
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

  if (error) {
    console.error('Error creating quote:', error)
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }

  res.status(201).json({
    success: true,
    data: data,
    message: 'Quote created successfully'
  })
} 