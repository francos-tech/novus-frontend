import type { NextApiRequest, NextApiResponse } from 'next'
import { getMarkelToken } from '@/services/insurers/markel'
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
    const { insurer } = req.body

    if (!insurer) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insurer parameter is required' 
      })
    }

    let token: string

    switch (insurer.toLowerCase()) {
      case 'markel':
        token = await getMarkelToken()
        break
      
      case 'cf':
        // C&F uses different auth mechanism (username/password per request)
        return res.status(200).json({
          success: true,
          message: 'C&F uses per-request authentication',
          data: { insurer: 'cf', auth_type: 'per_request' }
        })
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported insurer: ${insurer}`
        })
    }

    // Log the token request
    await supabaseAdmin.from('api_logs').insert({
      service: insurer,
      endpoint: '/auth/token',
      method: 'POST',
      request_data: { insurer },
      response_data: { success: true },
      status_code: 200,
      duration_ms: 0 // Would need to measure actual duration
    })

    res.status(200).json({
      success: true,
      data: { 
        insurer, 
        token_obtained: true,
        expires_in: 3600 // Approximate
      },
      message: 'Token obtained successfully'
    })

  } catch (error: any) {
    console.error('Token API error:', error)
    
    // Log the error
    await supabaseAdmin.from('api_logs').insert({
      service: req.body?.insurer || 'unknown',
      endpoint: '/auth/token',
      method: 'POST',
      request_data: req.body,
      status_code: 500,
      error_message: error.message,
      duration_ms: 0
    })

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to obtain token'
    })
  }
} 