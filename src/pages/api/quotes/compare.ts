import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse, CompareQuotesResponse } from '@/types/quotes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CompareQuotesResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { quote_ids } = req.body

    if (!quote_ids || !Array.isArray(quote_ids) || quote_ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'quote_ids array is required' 
      })
    }

    // Fetch quote items with premiums
    const { data: quoteItems, error } = await supabaseAdmin
      .from('quote_items')
      .select(`
        id,
        quote_id,
        insurer,
        premium,
        currency,
        payload,
        created_at,
        quotes (
          id,
          company_name,
          status
        )
      `)
      .in('quote_id', quote_ids)
      .not('premium', 'is', null)
      .order('premium', { ascending: true })

    if (error) {
      console.error('Error fetching quote items:', error)
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch quote items' 
      })
    }

    if (!quoteItems || quoteItems.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No quote items with premiums found' 
      })
    }

    // Process and compare quotes
    const quotes = quoteItems.map((item, index) => ({
      id: item.id,
      quote_id: item.quote_id,
      insurer: item.insurer,
      premium: item.premium!,
      currency: item.currency || 'USD',
      coverage_details: item.payload,
      created_at: item.created_at,
      company_name: 'Unknown Company',
      isLowest: index === 0 // First item is lowest due to ordering
    }))

    const lowestPremium = quotes[0]?.premium || 0
    const highestPremium = quotes[quotes.length - 1]?.premium || 0
    const savings = highestPremium - lowestPremium

    // Highlight the lowest 3 or lowest 1 if less than 5 quotes
    const highlightCount = quotes.length < 5 ? 1 : 3
    quotes.forEach((quote, index) => {
      quote.isLowest = index < highlightCount
    })

    const compareResult: CompareQuotesResponse = {
      quotes,
      lowest_premium: lowestPremium,
      savings
    }

    // Log the comparison
    await supabaseAdmin.from('api_logs').insert({
      service: 'comparison',
      endpoint: '/quotes/compare',
      method: 'POST',
      request_data: { quote_ids },
      response_data: { 
        quote_count: quotes.length, 
        lowest_premium: lowestPremium,
        savings 
      },
      status_code: 200,
      duration_ms: 0
    })

    res.status(200).json({
      success: true,
      data: compareResult,
      message: `Compared ${quotes.length} quotes successfully`
    })

  } catch (error: any) {
    console.error('Compare quotes API error:', error)
    
    // Log the error
    await supabaseAdmin.from('api_logs').insert({
      service: 'comparison',
      endpoint: '/quotes/compare',
      method: 'POST',
      request_data: req.body,
      status_code: 500,
      error_message: error.message,
      duration_ms: 0
    })

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to compare quotes'
    })
  }
} 