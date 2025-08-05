import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id, documentType, insurer } = req.query

  try {
    // Buscar informações da cotação
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (quoteError || !quote) {
      return res.status(404).json({ error: 'Cotação não encontrada' })
    }

    // Buscar item específico da seguradora
    const { data: item, error: itemError } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', id)
      .eq('insurer', insurer)
      .single()

    if (itemError || !item) {
      return res.status(404).json({ error: 'Item da seguradora não encontrado' })
    }

    let pdfUrl = ''
    let filename = ''

    // Determinar URL do PDF baseado no tipo e seguradora
    switch (insurer) {
      case 'CF':
        pdfUrl = await getCFDocumentUrl(item, documentType as string)
        filename = `CF-${item.quote_number}-${documentType}.pdf`
        break
      
      case 'Markel':
        pdfUrl = await getMarkelDocumentUrl(item, documentType as string)
        filename = `Markel-${item.quote_number}-${documentType}.pdf`
        break
      
      default:
        return res.status(400).json({ error: 'Seguradora não suportada' })
    }

    if (!pdfUrl) {
      return res.status(404).json({ error: 'PDF não disponível' })
    }

    // Fazer download do PDF
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${process.env.MARKEL_TOKEN}`,
        'X-API-Key': process.env.CF_API_KEY
      }
    })

    // Configurar headers para download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', (response.data as Buffer).length)

    // Enviar PDF
    res.send(response.data)

  } catch (error) {
    console.error('Error downloading PDF:', error)
    return res.status(500).json({ error: 'Erro ao baixar PDF' })
  }
}

async function getCFDocumentUrl(item: any, documentType: string): Promise<string> {
  switch (documentType) {
    case 'quote':
      return item.payload?.cnfPolicyService?.cnfPolicyHeader?.CNFExpressURL || ''
    
    case 'bind':
      // CF bind letter URL
      return `${process.env.CF_BASE_URL}/bind/${item.quote_number}/letter`
    
    case 'policy':
      // CF policy packet URL
      return `${process.env.CF_BASE_URL}/policy/${item.policy_number}/packet`
    
    default:
      return ''
  }
}

async function getMarkelDocumentUrl(item: any, documentType: string): Promise<string> {
  const baseUrl = process.env.MARKEL_BASE_URL || 'https://api-sandbox.markelcorp.com'
  
  switch (documentType) {
    case 'quote':
      return `${baseUrl}/mol/v2/Submission/${item.quote_number}/QuoteLetter?format=PDF`
    
    case 'bind':
      return `${baseUrl}/mol/v2/Policy/${item.policy_number}/BindLetter?format=PDF`
    
    case 'policy':
      return `${baseUrl}/mol/v2/Policy/${item.policy_number}/PolicyPacket?format=PDF`
    
    default:
      return ''
  }
} 