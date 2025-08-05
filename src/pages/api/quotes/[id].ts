import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    // Buscar a cotação principal
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (quoteError || !quote) {
      return res.status(404).json({ error: 'Cotação não encontrada' })
    }

    // Buscar todas as respostas das seguradoras
    const { data: items, error: itemsError } = await supabase
      .from('quote_items')
      .select(`
        id,
        insurer,
        quote_number,
        policy_number,
        premium,
        status,
        documents,
        payload,
        created_at
      `)
      .eq('quote_id', id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      return res.status(500).json({ error: 'Erro ao buscar respostas das seguradoras' })
    }

    // Buscar logs de API para esta cotação
    const { data: logs, error: logsError } = await supabase
      .from('api_logs')
      .select(`
        id,
        service,
        endpoint,
        method,
        status_code,
        operation_type,
        carrier,
        created_at
      `)
      .eq('quote_id', id)
      .order('created_at', { ascending: false })

    // Formatar a resposta
    const response = {
      quote: {
        id: quote.id,
        company_name: quote.company_name,
        status: quote.status,
        carrier: quote.carrier,
        quote_number: quote.quote_number,
        policy_number: quote.policy_number,
        premium: quote.premium,
        eligibility_status: quote.eligibility_status,
        policy_url: quote.policy_url,
        created_at: quote.created_at,
        updated_at: quote.updated_at
      },
      items: items?.map(item => ({
        id: item.id,
        insurer: item.insurer,
        quote_number: item.quote_number,
        policy_number: item.policy_number,
        premium: item.premium,
        status: item.status,
        documents: item.documents || [],
        message: getMessageFromStatus(item.status),
        created_at: item.created_at
      })) || [],
      logs: logs?.map(log => ({
        id: log.id,
        service: log.service,
        endpoint: log.endpoint,
        method: log.method,
        status_code: log.status_code,
        operation_type: log.operation_type,
        carrier: log.carrier,
        created_at: log.created_at
      })) || []
    }

    return res.status(200).json(response)

  } catch (error) {
    console.error('Error fetching quote details:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

function getMessageFromStatus(status: string): string {
  switch (status) {
    case 'quoted':
      return 'Cotação criada com sucesso'
    case 'referred':
      return 'Cotação em análise pela seguradora'
    case 'declined':
      return 'Cotação recusada pela seguradora'
    case 'bound':
      return 'Apólice vinculada com sucesso'
    case 'issued':
      return 'Apólice emitida com sucesso'
    default:
      return 'Status desconhecido'
  }
} 