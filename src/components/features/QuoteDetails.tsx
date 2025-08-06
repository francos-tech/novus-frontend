import React from 'react'
import { Card, Badge, Button, Separator } from '@/components/ui'

interface QuoteItem {
  id: string
  insurer: string
  quote_number: string
  policy_number?: string
  premium?: string
  status: 'quoted' | 'referred' | 'declined' | 'bound' | 'issued'
  message: string
  documents?: Array<{
    type: string
    url: string
  }>
  created_at: string
}

interface QuoteDetailsProps {
  quote: {
    id: string
    company_name: string
    status: string
    items: QuoteItem[]
  }
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  const downloadPDF = async (quoteId: string, documentType: string, insurer: string) => {
    try {
      const response = await fetch(
        `/api/quotes/${quoteId}/download?documentType=${documentType}&insurer=${insurer}`,
        {
          method: 'GET',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao baixar PDF')
      }

      // Criar blob e download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${insurer}-${documentType}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao baixar PDF:', error)
      alert('Erro ao baixar PDF. Tente novamente.')
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted': return 'bg-green-100 text-green-800'
      case 'referred': return 'bg-yellow-100 text-yellow-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'bound': return 'bg-blue-100 text-blue-800'
      case 'issued': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInsurerIcon = (insurer: string) => {
    switch (insurer) {
      case 'CF': return '🏢'
      case 'Markel': return '🛡️'
      default: return '📋'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header da Cotação */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{quote.company_name}</h1>
            <p className="text-gray-600">Cotação #{quote.id}</p>
          </div>
          <Badge className={getStatusColor(quote.status)}>
            {quote.status.toUpperCase()}
          </Badge>
        </div>
      </Card>

      {/* Respostas das Seguradoras */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Respostas das Seguradoras</h2>
        
        {quote.items.map((item, index) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getInsurerIcon(item.insurer)}</span>
                <div>
                  <h3 className="text-lg font-semibold">{item.insurer}</h3>
                  <p className="text-sm text-gray-600">
                    #{item.quote_number}
                    {item.policy_number && ` • Apólice: ${item.policy_number}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(item.status)}>
                  {item.status.toUpperCase()}
                </Badge>
                {item.premium && (
                  <p className="text-lg font-bold text-green-600 mt-1">
                    ${item.premium}
                  </p>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-4">{item.message}</p>

            {/* Documentos */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Documentos:</h4>
              <div className="flex flex-wrap gap-2">
                {/* Quote Letter */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPDF(quote.id, 'quote', item.insurer)}
                  disabled={!item.quote_number}
                >
                  📄 Quote Letter
                </Button>
                
                {/* Bind Letter - só disponível se bound */}
                {item.status === 'bound' && item.policy_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPDF(quote.id, 'bind', item.insurer)}
                  >
                    📋 Bind Letter
                  </Button>
                )}
                
                {/* Policy Packet - só disponível se issued */}
                {item.status === 'issued' && item.policy_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPDF(quote.id, 'policy', item.insurer)}
                  >
                    📑 Policy Packet
                  </Button>
                )}
                
                {/* Documentos adicionais da API */}
                {item.documents && item.documents.map((doc, docIndex) => (
                  <Button
                    key={docIndex}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    📄 {doc.type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              {item.status === 'quoted' && (
                <>
                  <Button variant="default" size="sm">
                    Vincular Apólice
                  </Button>
                  <Button variant="outline" size="sm">
                    Comparar
                  </Button>
                </>
              )}
              {item.status === 'bound' && (
                <Button variant="default" size="sm">
                  Emitir Apólice
                </Button>
              )}
              <Button variant="outline" size="sm">
                Ver Logs
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Criado em: {new Date(item.created_at).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      {/* Comparação de Preços */}
      {quote.items.length > 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Comparação de Preços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quote.items
              .filter(item => item.premium)
              .sort((a, b) => parseFloat(a.premium!) - parseFloat(b.premium!))
              .map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{getInsurerIcon(item.insurer)} {item.insurer}</span>
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-800">Melhor Preço</Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ${item.premium}
                  </p>
                  <p className="text-sm text-gray-600">{item.status}</p>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
} 