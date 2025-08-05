import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../src/lib/supabase'
import type { ApiResponse } from '../../src/types/quotes'

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

    // Convert to quote automatically
    const quoteData = {
      company_name: form_data.company_name || form_data.applicant_name || requester_company || 'Unknown Company',
      applicant_name: form_data.applicant_name || requester_name,
      email: form_data.email || requester_email,
      phone: form_data.phone || requester_phone,
      policy_type: form_data.policy_type || 'general_liability',
      classification: form_data.classification || 'General',
      exposure_value: form_data.exposure_value || 0,
      policy_start_date: form_data.policy_start_date || form_data.start_date,
      policy_end_date: form_data.policy_end_date || form_data.end_date,
      address_street: form_data.location_address || form_data.address_street,
      address_city: form_data.city,
      address_state: form_data.state,
      address_zip: form_data.zip || form_data.address_zip,
      coverage_limits: {
        deductible: form_data.deductible || 5000,
        per_occurrence: form_data.per_occurrence || 1000000,
        aggregate: form_data.general_aggregate || 2000000
      },
      status: 'new',
      submission_type: 'public',
      submission_source: 'public_form',
      form_data: form_data,
      requester_info: {
        name: requester_name,
        email: requester_email,
        company: requester_company,
        phone: requester_phone
      },
      description: `Public submission from ${requester_name}`,
      broker: 'Public Form',
      value_display: form_data.exposure_value ? `$${parseInt(form_data.exposure_value).toLocaleString()}` : 'N/A'
    }

    const { data: quoteDataResult, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .insert(quoteData)
      .select()
      .single()

    if (quoteError) {
      console.error('Error creating quote from public submission:', quoteError)
      // Don't fail the request, just log the error
    } else {
      console.log('Quote created from public submission:', quoteDataResult.id)
      
      // Update the public_submission with the quote reference
      await supabaseAdmin
        .from('public_submissions')
        .update({ 
          converted_to_quote_id: quoteDataResult.id,
          status: 'converted'
        })
        .eq('id', submissionData.id)
    }

    res.status(201).json({
      success: true,
      data: {
        submission: submissionData,
        quote: quoteDataResult
      },
      message: 'Public submission created and converted to quote successfully'
    })

  } catch (error: any) {
    console.error('Public submission handler error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}