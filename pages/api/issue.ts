import type { NextApiRequest, NextApiResponse } from 'next'
import { issueMarkelPolicy } from '../../src/services/insurers/markel'
import { issueCFPolicy } from '../../src/services/insurers/cf'
import { supabaseAdmin } from '../../src/lib/supabase'
import type { ApiResponse } from '../../types/quotes'

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

    if (!quote_id || !insurer || !submission_number) {
      return res.status(400).json({ 
        success: false, 
        error: 'quote_id, insurer, and submission_number are required' 
      })
    }

    // Verify quote exists and is in approved status
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

    if (quote.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Quote must be approved before issuing policy'
      })
    }

    let issueResponse: any

    // Issue policy with appropriate insurer
    switch (insurer.toLowerCase()) {
      case 'markel':
        issueResponse = await issueMarkelPolicy(submission_number)
        break
      
      case 'cf':
        // Para CF, precisamos do CNFQuoteNumber que deveria estar salvo no external_id
        const cnfQuoteNumber = quote.external_id || ''
        if (!cnfQuoteNumber) {
          throw new Error('CNF Quote Number not found. Quote must be created and bound first.')
        }
        issueResponse = await issueCFPolicy(quote.id, cnfQuoteNumber)
        break
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported insurer for policy issuance: ${insurer}`
        })
    }

    const duration = Date.now() - startTime

    // Update quote item with policy information
    await supabaseAdmin
      .from('quote_items')
      .update({
        payload: {
          ...issueResponse,
          policy_issued: true,
          issue_timestamp: new Date().toISOString()
        }
      })
      .eq('quote_id', quote_id)
      .eq('insurer', insurer)

    // Log API call
    await supabaseAdmin.from('api_logs').insert({
      quote_id,
      service: insurer,
      endpoint: '/issue',
      method: 'POST',
      request_data: req.body,
      response_data: issueResponse,
      status_code: 200,
      duration_ms: duration
    })

    res.status(200).json({
      success: true,
      data: {
        quote_id,
        insurer,
        policy_number: issueResponse.PolicyNumber || issueResponse.cnfPolicyService?.cnfPolicyData?.data?.policy?.QuoteNumber,
        submission_number,
        status: issueResponse.Status || issueResponse.cnfPolicyService?.cnfPolicyHeader?.Status,
        issue_response: issueResponse
      },
      message: 'Policy issued successfully'
    })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('Issue API error:', error)
    
    // Log the error
    await supabaseAdmin.from('api_logs').insert({
      quote_id: req.body?.quote_id,
      service: req.body?.insurer || 'unknown',
      endpoint: '/issue',
      method: 'POST',
      request_data: req.body,
      status_code: 500,
      error_message: error.message,
      duration_ms: duration
    })

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to issue policy'
    })
  }
} 