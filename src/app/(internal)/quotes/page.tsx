'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MetricCard from '@/components/MetricCard'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Filter,
  Settings,
  Plus,
  MoreHorizontal,
  Send,
  Mail,
  Building2,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export default function QuotesPage() {
  const [activeView, setActiveView] = useState('board')
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [showAPIModal, setShowAPIModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [kanbanColumns, setKanbanColumns] = useState(['pending', 'new', 'under_review', 'quoted', 'negotiating'])
  const [showAddColumnModal, setShowAddColumnModal] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')
  const [showQuoteDetailModal, setShowQuoteDetailModal] = useState(false)
  const [selectedQuoteForView, setSelectedQuoteForView] = useState<any>(null)
  const [apiResponses, setApiResponses] = useState<any[]>([])

  // Load quotes from Supabase on mount
  useEffect(() => {
    const loadQuotes = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/quotes')
        if (response.ok) {
          const result = await response.json()
          console.log('API Response:', result)
          if (result.success) {
            // A API retorna { data: { quotes: [...], pagination: {...} } }
            const quotesData = result.data?.quotes || []
            console.log('Quotes data:', quotesData, 'Is array:', Array.isArray(quotesData))
            setQuotes(quotesData)
          }
        }
      } catch (error) {
        console.error('Error loading quotes:', error)
        // Fallback to localStorage if API fails
        const savedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        setQuotes(savedQuotes)
      } finally {
        setLoading(false)
      }
    }

    loadQuotes()
  }, [])

  // API-integrated insurers (using direct insurer services)
  const apiInsurers = [
    { 
      id: 'markel', 
      name: 'Markel International', 
      integrated: true,
      description: 'Professional Liability & General Liability',
      service: 'markel'
    },
    { 
      id: 'cf', 
      name: 'C&F Insurance', 
      integrated: true,
      description: 'Commercial Property & Liability',  
      service: 'cf'
    },
    { 
      id: 'zurich', 
      name: 'Zurich Insurance', 
      integrated: false,
      description: 'Em desenvolvimento'
    },
    { 
      id: 'axa', 
      name: 'AXA Seguros', 
      integrated: false,
      description: 'Em desenvolvimento'
    }
  ]

  const emailInsurers = [
    { id: 'liberty', name: 'Liberty Seguros', email: 'cotacoes@liberty.com.br' },
    { id: 'mapfre', name: 'Mapfre Seguros', email: 'quotes@mapfre.com.br' },
    { id: 'chubb', name: 'Chubb Seguros', email: 'underwriting@chubb.com.br' },
    { id: 'tokio', name: 'Tokio Marine', email: 'quotes@tokio.com.br' },
  ]

  // Static quotes moved to useEffect - using state quotes now

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-green-100 text-green-800'
      case 'negotiating': return 'bg-purple-100 text-purple-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'bound': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    if (priority?.includes('High')) return 'bg-red-100 text-red-800'
    if (priority?.includes('Medium')) return 'bg-yellow-100 text-yellow-800'
    if (priority?.includes('Low')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getColumnDisplayName = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Pending'
      case 'new': return 'New'
      case 'under_review': return 'Under Review'
      case 'quoted': return 'Quoted'
      case 'negotiating': return 'Negotiating'
      case 'approved': return 'Approved'
      case 'bound': return 'Bound'
      case 'cancelled': return 'Cancelled'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const groupedQuotes = Array.isArray(quotes) ? quotes.reduce((acc: any, quote) => {
    if (!acc[quote.status]) acc[quote.status] = []
    acc[quote.status].push(quote)
    return acc
  }, {}) : {}

  const statusCounts = kanbanColumns.reduce((acc, column) => {
    acc[column] = groupedQuotes[column]?.length || 0
    return acc
  }, {} as Record<string, number>)

  // Actions handlers
  const handleSendToInsurersAPI = (quote: any) => {
    setSelectedQuote(quote)
    setSelectedInsurers([])
    setShowAPIModal(true)
  }

  const handleSendToInsurersEmail = (quote: any) => {
    setSelectedQuote(quote)
    setSelectedInsurers([])
    setShowEmailModal(true)
  }

  const handleViewQuote = (quote: any) => {
    console.log('Visualizando cotação:', quote.id)
    setSelectedQuoteForView(quote)
    setShowQuoteDetailModal(true)
  }

  const handleEditQuote = (quote: any) => {
    console.log('Editando cotação:', quote.id)
    // TODO: Implementar edição da cotação
  }

  const handleDeleteQuote = (quote: any) => {
    console.log('Excluindo cotação:', quote.id)
    // TODO: Implementar exclusão da cotação
  }

  const handleDuplicateQuote = async (quote: any) => {
    try {
      // Generate new ID and reset status
      const newQuoteId = `Q-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      
      // Create duplicate with fresh data
      const duplicatedQuote = {
        ...quote,
        id: newQuoteId,
        quote_number: newQuoteId,
        status: 'pending',
        created_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Reset workflow fields
        completed_at: null,
        assigned_to: null,
        // Add suffix to company name for clarity
        company_name: `${quote.company_name} (Copy)`,
        // Reset any external references
        external_id: null,
        response_data: null
      }

      console.log('Duplicating quote:', duplicatedQuote)

      // Save to Supabase via API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: duplicatedQuote.company_name,
          applicant_name: duplicatedQuote.applicant_name,
          email: duplicatedQuote.email,
          phone: duplicatedQuote.phone,
          policy_type: duplicatedQuote.policy_type,
          classification: duplicatedQuote.classification,
          exposure_value: duplicatedQuote.exposure_value,
          start_date: duplicatedQuote.start_date,
          end_date: duplicatedQuote.end_date,
          address_street: duplicatedQuote.address_street,
          address_city: duplicatedQuote.city,
          address_state: duplicatedQuote.state,
          address_zip: duplicatedQuote.zip,
          address_country: duplicatedQuote.country || 'USA',
          coverage_limits: duplicatedQuote.coverage_limits,
          additional_info: duplicatedQuote.additional_info,
          destination: duplicatedQuote.destination,
          created_by: 'duplicate_action',
          form_data: duplicatedQuote.form_data
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to duplicate quote')
      }

      console.log('Quote duplicated successfully:', result.data)
      
      // Refresh quotes list by reloading from API
      const quotesResponse = await fetch('/api/quotes')
      if (quotesResponse.ok) {
        const quotesResult = await quotesResponse.json()
        if (quotesResult.success) {
          setQuotes(quotesResult.data?.quotes || [])
        }
      }
      
      alert(`Cotação duplicada com sucesso! Nova cotação: ${newQuoteId}`)

    } catch (error: any) {
      console.error('Error duplicating quote:', error)
      alert(`Error duplicating quote: ${error.message}`)
    }
  }

  const handleSendQuotesToAPI = async () => {
    if (!selectedQuote || selectedInsurers.length === 0) {
      alert('Please select a quote and at least one insurer')
      return
    }

    console.log(`🚀 Sending quote via API to:`, selectedInsurers)
    
    try {
      const responses = await Promise.allSettled(
        selectedInsurers.map(async (insurerId) => {
          const insurer = apiInsurers.find(i => i.id === insurerId)
          if (!insurer || !insurer.integrated) return null

          console.log(`Sending quote ${selectedQuote.id} to ${insurer.name}...`)
          
          try {
            let result
            
            // Use the API route to send to insurers
            const response = await fetch('/api/submissions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                quote_id: selectedQuote.id,
                channel: insurer.service // 'markel' ou 'cf'
              })
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`${insurer.name} Error: ${errorData.error || response.statusText}`)
            }

            result = await response.json()

            console.log(`✅ ${insurer.name} respondeu:`, result)

            // Salvar resultado no Supabase
            // TODO: Implementar salvamento da resposta da cotação
            
            return {
              insurer: insurer.name,
              success: true,
              data: result,
              type: 'quote' // Indica que é uma cotação, não submission
            }
            
          } catch (error: any) {
            console.error(`❌ Error quoting with ${insurer.name}:`, error.message)
            throw error
          }
        })
      )

      // Processar resultados
      const successful = responses
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value)
      const failed = responses.filter(r => r.status === 'rejected')

      console.log(`✅ Cotações enviadas com sucesso para: ${successful.map(s => s.insurer).join(', ')}`)
      if (failed.length > 0) {
        console.error(`❌ Falhou para ${failed.length} seguradora(s)`)
      }

      // Mostrar resultados das cotações para aprovação
      if (successful.length > 0) {
        alert(`Cotações recebidas de ${successful.length} seguradora(s)! Verifique os resultados para aprovação.`)
        
        // Armazenar respostas das APIs
        setApiResponses(successful)
        
        // Fechar modal de API e abrir modal de detalhes da cotação
        setShowAPIModal(false)
        setSelectedQuoteForView(selectedQuote)
        setShowQuoteDetailModal(true)
      } else {
        alert('Nenhuma cotação foi realizada com sucesso.')
      }
      
    } catch (error) {
      console.error('Error sending quotes:', error)
      alert('Error sending quotes. Check console for details.')
    }
  }

  const handleSendQuotesToEmail = () => {
    console.log('Sending quote via Email to:', selectedInsurers)
    setShowEmailModal(false)
    // TODO: Implement email sending
  }

  const toggleInsurerSelection = (insurerId: string) => {
    setSelectedInsurers(prev => 
      prev.includes(insurerId) 
        ? prev.filter(id => id !== insurerId)
        : [...prev, insurerId]
    )
  }

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      setKanbanColumns([...kanbanColumns, newColumnName.trim()])
      setNewColumnName('')
      setShowAddColumnModal(false)
    }
  }

  // Calculate dynamic metrics
    const quotesArray = Array.isArray(quotes) ? quotes : []
  const activeQuotes = quotesArray.filter(q => !['completed', 'cancelled', 'rejected'].includes(q.status?.toLowerCase() || ''))
  const wonQuotes = quotesArray.filter(q => ['completed', 'approved', 'bound'].includes(q.status?.toLowerCase() || ''))
  const lostQuotes = quotesArray.filter(q => ['cancelled', 'rejected'].includes(q.status?.toLowerCase() || ''))

  const totalQuotes = quotesArray.length
  const winRate = totalQuotes > 0 ? ((wonQuotes.length / totalQuotes) * 100).toFixed(1) : '0.0'
  
  const activeValue = activeQuotes.reduce((sum, q) => {
    const value = parseFloat(q.value?.replace(/[$,]/g, '') || q.exposure_value || '0')
    return sum + value
  }, 0)
  
  const wonValue = wonQuotes.reduce((sum, q) => {
    const value = parseFloat(q.value?.replace(/[$,]/g, '') || q.exposure_value || '0')
    return sum + value
  }, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando cotações...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Active Quotes"
          value={activeQuotes.length.toString()}
          subtitle="In progress"
          icon={Clock}
        />
        <MetricCard
          title="Won Quotes"
          value={wonQuotes.length.toString()}
          subtitle={`${winRate}% win rate`}
          icon={CheckCircle}
        />
        <MetricCard
          title="Lost Quotes"
          value={lostQuotes.length.toString()}
          subtitle="Closed lost"
          icon={XCircle}
        />
        <MetricCard
          title="Active Value"
          value={`$${activeValue.toLocaleString()}`}
          subtitle="Pipeline value"
          icon={TrendingUp}
        />
        <MetricCard
          title="Won Value"
          value={`$${wonValue.toLocaleString()}`}
          subtitle="Revenue closed"
          icon={DollarSign}
        />
      </div>

      {/* View Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeView === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('board')}
            >
              Board View
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('list')}
            >
              List View
            </Button>
            <Button
              variant={activeView === 'wonlost' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('wonlost')}
            >
              Won & Lost
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={() => setShowAddColumnModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Column
          </Button>
        </div>
      </div>

      {/* Quotes Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Quotes Pipeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your quotes through different stages
          </p>
        </CardHeader>
        <CardContent>
          {activeView === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{getColumnDisplayName(status)}</h3>
                  <Badge variant="secondary">{count}</Badge>
                </div>
                
                <div className="space-y-3">
                  {groupedQuotes[status]?.map((quote: any) => (
                    <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{quote.company_name || quote.applicant_name || 'Sem nome'}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="" inset={false}>Ações da Cotação</DropdownMenuLabel>
                              <DropdownMenuSeparator className="" />
                              
                              <DropdownMenuItem className="" inset={false} onClick={() => handleViewQuote(quote)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem className="" inset={false} onClick={() => handleEditQuote(quote)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem className="" inset={false} onClick={() => handleDuplicateQuote(quote)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="" />
                              
                              <DropdownMenuItem className="" inset={false} onClick={() => handleSendToInsurersAPI(quote)}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Send to Insurers (API)
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem className="" inset={false} onClick={() => handleSendToInsurersEmail(quote)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send to Insurers (Email)
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="" />
                              
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                inset={false}
                                onClick={() => handleDeleteQuote(quote)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {quote.quote_number || quote.id}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {quote.description || `${quote.policy_type || 'General Liability'} - ${quote.classification || 'Insurance Quote'}`}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {quote.policy_type?.replace('_', ' ') || 'General Liability'}
                          </Badge>
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(quote.status)}`}>
                            {getColumnDisplayName(quote.status)}
                          </Badge>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-muted-foreground">{quote.created_by || 'System Generated'}</div>
                          <div className="font-semibold">${quote.exposure_value?.toLocaleString() || '0'}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getPriorityColor(quote.priority || 'Medium Priority')}`}>
                            {quote.priority || 'Medium Priority'}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {quote.updated_at ? new Date(quote.updated_at).toLocaleDateString() : 'Hoje'}
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {quote.email || 'No email'}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            </div>
          )}

          {activeView === 'list' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">ID</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Company</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Type</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Broker</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Value</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Status</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Priority</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Updated</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotesArray.map((quote: any) => (
                      <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono text-sm">{quote.id}</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{quote.company}</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <Badge variant="outline" className="text-xs">
                            {quote.type}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">{quote.broker}</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold">{quote.value}</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <Badge className={`text-xs ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <Badge className={`text-xs ${getPriorityColor(quote.priority)}`}>
                            {quote.priority}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm text-muted-foreground">{quote.updated}</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Quote Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewQuote(quote)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateQuote(quote)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSendToInsurersAPI(quote)}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Send to APIs
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendToInsurersEmail(quote)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send via Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteQuote(quote)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'wonlost' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Won Quotes</h3>
                <div className="space-y-3">
                                      {quotesArray.filter(q => q.status === 'Quoted').map((quote: any) => (
                    <Card key={quote.id} className="p-4 border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{quote.company}</h4>
                          <p className="text-sm text-muted-foreground">{quote.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{quote.value}</div>
                          <div className="text-xs text-muted-foreground">{quote.updated}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Lost Quotes</h3>
                <div className="space-y-3">
                  <div className="text-center text-muted-foreground py-8">
                    No lost quotes to display
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Insurers Modal */}
      <Dialog open={showAPIModal} onOpenChange={setShowAPIModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="">
            <DialogTitle className="">Send to Insurers (API)</DialogTitle>
            <DialogDescription className="">
              Select the integrated insurers to send the quote "{selectedQuote?.company}" via API
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Cotação: <strong>{selectedQuote?.id}</strong> - {selectedQuote?.company}
            </div>
            
            <div className="space-y-3">
              {apiInsurers.map((insurer) => (
                <div key={insurer.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    className=""
                    id={insurer.id}
                    checked={selectedInsurers.includes(insurer.id)}
                    onCheckedChange={() => toggleInsurerSelection(insurer.id)}
                    disabled={!insurer.integrated}
                  />
                  <div className="flex-1">
                    <label htmlFor={insurer.id} className="text-sm font-medium cursor-pointer">
                      {insurer.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {(insurer as any).description || (insurer.integrated ? 'API integrated' : 'Not integrated')}
                    </div>
                    {(insurer as any).endpoint && (
                      <div className="text-xs text-blue-600 font-mono">
                        Endpoint: {(insurer as any).endpoint}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {insurer.integrated ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">API Ativa</Badge>
                    ) : (
                      <Badge variant="secondary">Indisponível</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAPIModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendQuotesToAPI}
                disabled={selectedInsurers.length === 0}
              >
                Enviar para {selectedInsurers.length} seguradora(s)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Seguradoras Email */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="">
            <DialogTitle className="">Enviar para Seguradoras (Email)</DialogTitle>
            <DialogDescription className="">
              Selecione as seguradoras para enviar a cotação "{selectedQuote?.company}" por email
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Cotação: <strong>{selectedQuote?.id}</strong> - {selectedQuote?.company}
            </div>
            
            <div className="space-y-3">
              {emailInsurers.map((insurer) => (
                <div key={insurer.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    className=""
                    id={`email-${insurer.id}`}
                    checked={selectedInsurers.includes(insurer.id)}
                    onCheckedChange={() => toggleInsurerSelection(insurer.id)}
                  />
                  <div className="flex-1">
                    <label htmlFor={`email-${insurer.id}`} className="text-sm font-medium cursor-pointer">
                      {insurer.name}
                    </label>
                    <div className="text-xs text-muted-foreground">{insurer.email}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendQuotesToEmail}
                disabled={selectedInsurers.length === 0}
              >
                Enviar para {selectedInsurers.length} seguradora(s)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar Coluna */}
      <Dialog open={showAddColumnModal} onOpenChange={setShowAddColumnModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
            <DialogDescription>
              Create a new status column for your kanban board
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Column Name</label>
              <Input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="e.g., Approved, Rejected, On Hold"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddColumn()
                  }
                }}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddColumnModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddColumn}
                disabled={!newColumnName.trim()}
              >
                Add Column
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Detail Modal */}
      <Dialog open={showQuoteDetailModal} onOpenChange={setShowQuoteDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Cotação</DialogTitle>
            <DialogDescription>
              {selectedQuoteForView && `${selectedQuoteForView.quote_number || selectedQuoteForView.id} - ${selectedQuoteForView.company_name || selectedQuoteForView.applicant_name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuoteForView && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Número da Cotação</label>
                      <p className="text-sm">{selectedQuoteForView.quote_number || selectedQuoteForView.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge className={`ml-2 ${getStatusColor(selectedQuoteForView.status)}`}>
                        {getColumnDisplayName(selectedQuoteForView.status)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                      <p className="text-sm">{selectedQuoteForView.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Solicitante</label>
                      <p className="text-sm">{selectedQuoteForView.applicant_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{selectedQuoteForView.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                      <p className="text-sm">{selectedQuoteForView.phone || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações da Apólice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tipo de Apólice</label>
                      <p className="text-sm">{selectedQuoteForView.policy_type?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Classificação</label>
                      <p className="text-sm">{selectedQuoteForView.classification || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Valor de Exposição</label>
                      <p className="text-sm">${selectedQuoteForView.exposure_value?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Destino</label>
                      <p className="text-sm">{selectedQuoteForView.destination || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                      <p className="text-sm">{selectedQuoteForView.start_date ? new Date(selectedQuoteForView.start_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Fim</label>
                      <p className="text-sm">{selectedQuoteForView.end_date ? new Date(selectedQuoteForView.end_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Rua</label>
                      <p className="text-sm">{selectedQuoteForView.address_street || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                      <p className="text-sm">{selectedQuoteForView.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estado</label>
                      <p className="text-sm">{selectedQuoteForView.state || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CEP</label>
                      <p className="text-sm">{selectedQuoteForView.zip || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coverage Limits */}
              {selectedQuoteForView.coverage_limits && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Limites de Cobertura</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto max-h-60 overflow-y-auto">
                      {JSON.stringify(selectedQuoteForView.coverage_limits, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* API Response Data */}
              {selectedQuoteForView.response_data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resposta da API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto max-h-60">
                      {JSON.stringify(selectedQuoteForView.response_data, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Form Data */}
              {selectedQuoteForView.form_data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados do Formulário Original</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto max-h-60">
                      {JSON.stringify(selectedQuoteForView.form_data, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Datas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                      <p className="text-sm">{selectedQuoteForView.created_at ? new Date(selectedQuoteForView.created_at).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Atualizado em</label>
                      <p className="text-sm">{selectedQuoteForView.updated_at ? new Date(selectedQuoteForView.updated_at).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Enviado em</label>
                      <p className="text-sm">{selectedQuoteForView.submitted_at ? new Date(selectedQuoteForView.submitted_at).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Concluído em</label>
                      <p className="text-sm">{selectedQuoteForView.completed_at ? new Date(selectedQuoteForView.completed_at).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Responses */}
              {apiResponses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Respostas das APIs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {apiResponses.map((response, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-green-600">{response.insurer}</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            ✅ Sucesso
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Dados enviados:</strong>
                        </div>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-60 overflow-y-auto">
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              {selectedQuoteForView.additional_info && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Adicionais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{selectedQuoteForView.additional_info}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 