import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse } from '@/types/quotes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const {
      requester_name,
      requester_email,
      requester_company,
      requester_phone,
      form_data
    } = req.body

    // Validate required fields
    if (!requester_name || !requester_email || !form_data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: requester_name, requester_email, and form_data are required'
      })
    }

    // Save to public_submissions table
    const { data: submissionData, error: submissionError } = await supabaseAdmin
      .from('public_submissions')
      .insert({
        requester_name,
        requester_email,
        requester_company,
        requester_phone,
        form_data,
        status: 'submitted',
        submission_type: 'public',
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown'
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Error creating public submission:', submissionError)
      return res.status(400).json({ 
        success: false, 
        error: submissionError.message 
      })
    }

    console.log('Public submission created successfully:', submissionData.id)

    // Create a new quote in the quotes table for the Kanban board
    const companyName = form_data.applicant_name || requester_company || 'Unknown Company'
    const { data: quoteData, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .insert({
        company_name: companyName,
        status: 'new',
        form_data: form_data,
        source: 'public_form',
        requester_name: requester_name,
        requester_email: requester_email,
        requester_company: requester_company,
        requester_phone: requester_phone,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (quoteError) {
      console.error('Error creating new quote:', quoteError)
      // Don't fail the entire request, just log the error
      console.log('Public submission saved but quote creation failed')
    } else {
      console.log('New quote created successfully:', quoteData.id)
    }

    res.status(201).json({
      success: true,
      data: submissionData,
      message: 'Public submission created successfully'
    })

  } catch (error: any) {
    console.error('Public submission handler error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}