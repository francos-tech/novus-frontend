import type { NextApiRequest, NextApiResponse } from 'next'
import { getMarkelQuoteLetter } from '@/services/insurers/markel'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse } from '@/types/quotes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Submission ID is required' 
      })
    }

    // Find the quote item by submission number
    const { data: quoteItem, error } = await supabaseAdmin
      .from('quote_items')
      .select('*, quotes(*)')
      .eq('id', id)
      .single()

    if (error || !quoteItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Submission not found' 
      })
    }

    let quoteLetter: any

    // Get quote letter based on insurer
    switch (quoteItem.insurer.toLowerCase()) {
      case 'markel':
        const submissionNumber = quoteItem.payload?.SubmissionNumber
        if (!submissionNumber) {
          return res.status(400).json({
            success: false,
            error: 'No submission number found for Markel quote'
          })
        }
        quoteLetter = await getMarkelQuoteLetter(submissionNumber)
        break
      
      case 'cf':
        // C&F quote letter handling would go here
        quoteLetter = {
          letterUrl: `${process.env.CF_BASE_URL}/quote-letter/${quoteItem.payload?.cnfPolicyService?.cnfPolicyHeader?.CNFQuoteNumber}`
        }
        break
      
      default:
        return res.status(400).json({
          success: false,
          error: `Quote letter not supported for insurer: ${quoteItem.insurer}`
        })
    }

    // Log API call
    await supabaseAdmin.from('api_logs').insert({
      quote_id: quoteItem.quote_id,
      service: quoteItem.insurer,
      endpoint: `/submissions/${id}/quote`,
      method: 'GET',
      request_data: { submission_id: id },
      response_data: quoteLetter,
      status_code: 200,
      duration_ms: 0
    })

    res.status(200).json({
      success: true,
      data: {
        submission_id: id,
        insurer: quoteItem.insurer,
        quote_letter_url: quoteLetter.letterUrl,
        premium: quoteItem.premium,
        created_at: quoteItem.created_at
      },
      message: 'Quote letter retrieved successfully'
    })

  } catch (error: any) {
    console.error('Quote letter API error:', error)
    
    // Log the error
    await supabaseAdmin.from('api_logs').insert({
      service: 'unknown',
      endpoint: `/submissions/${req.query.id}/quote`,
      method: 'GET',
      request_data: req.query,
      status_code: 500,
      error_message: error.message,
      duration_ms: 0
    })

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve quote letter'
    })
  }
} 