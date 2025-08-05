import type { NextApiRequest, NextApiResponse } from 'next'
import { addMarkelQuote } from '../../../src/services/insurers/markel'
import { addCFQuote } from '../../../src/services/insurers/cf'
import { supabaseAdmin } from '../../../src/lib/supabase'
import type { ApiResponse } from '../../../src/types/quotes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { quote_id, channel, test_quote_data } = req.body

    if (!quote_id || !channel) {
      return res.status(400).json({ 
        success: false, 
        error: 'quote_id and channel are required' 
      })
    }

    let quote: any

    // Se tiver dados de teste, usar eles ao invés de buscar no banco
    if (test_quote_data) {
      console.log('🧪 Using test quote data instead of database lookup')
      quote = test_quote_data
    } else {
      // Buscar a cotação no banco de dados
      const { data: dbQuote, error: fetchError } = await supabaseAdmin
        .from('quotes')
        .select('*')
        .eq('id', quote_id)
        .single()

      if (fetchError || !dbQuote) {
        console.error('Error fetching quote:', fetchError)
        return res.status(404).json({ 
          success: false, 
          error: 'Quote not found' 
        })
      }
      
      quote = dbQuote
    }

    let result: any
    let submission_data: any

    // Enviar para a seguradora apropriada
    switch (channel.toLowerCase()) {
      case 'markel':
        try {
          result = await addMarkelQuote(quote)
          submission_data = {
            quote_id,
            destination: 'markel',
            status: 'submitted',
            external_id: result.submissionNumber,
            request_data: quote,
            response_data: result,
            submitted_at: new Date().toISOString()
          }
        } catch (error: any) {
          console.error('Markel submission failed:', error.message)
          submission_data = {
            quote_id,
            destination: 'markel',
            status: 'failed',
            error_message: error.message,
            request_data: quote,
            response_data: error.details || { error: error.message }, // Include detailed error info
            submitted_at: new Date().toISOString()
          }
        }
        break

      case 'cf':
        try {
          result = await addCFQuote(quote)
          submission_data = {
            quote_id,
            destination: 'cf',
            status: 'submitted',
            external_id: result.cnfPolicyService.cnfPolicyHeader.CNFQuoteNumber,
            request_data: quote,
            response_data: result,
            submitted_at: new Date().toISOString()
          }
        } catch (error: any) {
          console.error('C&F submission failed:', error.message)
          submission_data = {
            quote_id,
            destination: 'cf',
            status: 'failed',
            error_message: error.message,
            request_data: quote,
            response_data: error.details || { error: error.message }, // Include detailed error info
            submitted_at: new Date().toISOString()
          }
        }
        break

      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported channel: ${channel}`
        })
    }

    // Salvar o submission no banco
    const { error: insertError } = await supabaseAdmin
      .from('submissions')
      .insert(submission_data)

    if (insertError) {
      console.error('Error saving submission:', insertError)
    }

    // Atualizar cotação com dados da API (sucesso ou erro)
    const quoteUpdateData: any = {
      status: submission_data.status === 'submitted' ? 'under_review' : 'pending',
      response_data: submission_data.response_data || { 
        error: submission_data.error_message,
        request_data: submission_data.request_data,
        destination: submission_data.destination 
      },
      external_id: submission_data.external_id || null,
      updated_at: new Date().toISOString()
    }

    const { error: updateError } = await supabaseAdmin
      .from('quotes')
      .update(quoteUpdateData)
      .eq('id', quote_id)

    if (updateError) {
      console.error('Error updating quote:', updateError)
    }

    res.status(200).json({
      success: submission_data.status === 'submitted',
      data: result || { error: submission_data.error_message },
      message: submission_data.status === 'submitted' 
        ? `Quote submitted to ${channel} successfully`
        : `Failed to submit quote to ${channel}`
    })

  } catch (error: any) {
    console.error('Submission handler error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
} 