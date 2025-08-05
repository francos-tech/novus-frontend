import type { NextApiRequest, NextApiResponse } from 'next'
import { bindMarkelQuote } from '@/services/insurers/markel'
import { bindCFQuote } from '@/services/insurers/cf'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse, Quote } from '../../types/quotes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const startTime = Date.now()

  try {
    const { quote_id, insurer, submission_number } = req.body

    if (!quote_id || !insurer) {
      return res.status(400).json({ 
        success: false, 
        error: 'quote_id and insurer are required' 
      })
    }

    // Fetch quote from database
    const { data: quote, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('id', quote_id)
      .single()

    if (quoteError || !quote) {
      return res.status(404).json({ 
        success: false, 
        error: 'Quote not found' 
      })
    }

    let bindResponse: any

    // Bind with appropriate insurer
    switch (insurer.toLowerCase()) {
      case 'markel':
        if (!submission_number) {
          return res.status(400).json({
            success: false,
            error: 'submission_number is required for Markel binding'
          })
        }
        bindResponse = await bindMarkelQuote(submission_number)
        break
      
      case 'cf':
        // Para CF, precisamos do CNFQuoteNumber que deveria estar salvo no external_id
        const cnfQuoteNumber = quote.external_id || ''
        if (!cnfQuoteNumber) {
          throw new Error('CNF Quote Number not found. Quote must be created first.')
        }
        bindResponse = await bindCFQuote(quote.id, cnfQuoteNumber)
        break
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported insurer for binding: ${insurer}`
        })
    }

    const duration = Date.now() - startTime

    // Update quote status to 'approved'
    await supabaseAdmin
      .from('quotes')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', quote_id)

    // Update quote item with bind information
    await supabaseAdmin
      .from('quote_items')
      .update({
        payload: {
          ...bindResponse,
          bind_timestamp: new Date().toISOString()
        }
      })
      .eq('quote_id', quote_id)
      .eq('insurer', insurer)

    // Log API call
    await supabaseAdmin.from('api_logs').insert({
      quote_id,
      service: insurer,
      endpoint: '/bind',
      method: 'POST',
      request_data: req.body,
      response_data: bindResponse,
      status_code: 200,
      duration_ms: duration
    })

    res.status(200).json({
      success: true,
      data: {
        quote_id,
        insurer,
        bind_number: bindResponse.SubmissionNumber || bindResponse.cnfPolicyService?.cnfPolicyHeader?.CNFQuoteNumber,
        status: bindResponse.Status || bindResponse.cnfPolicyService?.cnfPolicyHeader?.Status,
        bind_response: bindResponse
      },
      message: 'Quote bound successfully'
    })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('Bind API error:', error)
    
    // Log the error
    await supabaseAdmin.from('api_logs').insert({
      quote_id: req.body?.quote_id,
      service: req.body?.insurer || 'unknown',
      endpoint: '/bind',
      method: 'POST',
      request_data: req.body,
      status_code: 500,
      error_message: error.message,
      duration_ms: duration
    })

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to bind quote'
    })
  }
} 