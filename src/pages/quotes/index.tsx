'use client'

import { useState } from 'react'
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
  Trash2
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

export default function Quotes() {
  const [activeView, setActiveView] = useState('board')
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [showAPIModal, setShowAPIModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Seguradoras integradas via API (usando APIs do novus-plataform)
  const apiInsurers = [
    { 
      id: 'markel', 
      name: 'Markel International', 
      integrated: true,
      description: 'Professional Liability & General Liability',
      endpoint: '/api/submissions'
    },
    { 
      id: 'cf', 
      name: 'C&F Insurance', 
      integrated: true,
      description: 'Commercial Property & Liability',
      endpoint: '/api/submissions'
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

  // Seguradoras via email
  const emailInsurers = [
    { id: 'liberty', name: 'Liberty Seguros', email: 'cotacoes@liberty.com.br' },
    { id: 'mapfre', name: 'Mapfre Seguros', email: 'quotes@mapfre.com.br' },
    { id: 'chubb', name: 'Chubb Seguros', email: 'underwriting@chubb.com.br' },
    { id: 'tokio', name: 'Tokio Marine', email: 'cotacao@tokio.com.br' },
  ]

  const quotes = [
    {
      id: 'Q-2025-001',
      company: 'Tech Solutions Inc.',
      description: 'E&O coverage for tech company with 250 employees',
      type: 'Professional Liability',
      broker: 'John Smith',
      value: '$125,000',
      priority: 'High Priority',
      status: 'Pending',
      updated: '2 hours ago',
      date: '2025-06-10',
      tag: 'Urgent'
    },
    {
      id: 'Q-2025-005',
      company: 'StartupCo Ltd',
      description: 'M&A insurance for startup acquisition deal',
      type: 'ma_insurance',
      broker: 'David Wilson',
      value: '$180,000',
      priority: 'Medium Priority',
      status: 'Pending',
      updated: '2 days ago',
      date: '2025-05-25'
    },
    {
      id: 'Q-2025-002',
      company: 'Downtown Office Complex',
      description: 'Property insurance for 15-story office building',
      type: 'Commercial Property',
      broker: 'Sarah Johnson',
      value: '$285,000',
      priority: 'Review',
      status: 'Under Review',
      updated: '1 day ago',
      date: '2025-06-08'
    },
    {
      id: 'Q-2025-006',
      company: 'Logistics Solutions',
      description: 'Inland marine coverage for transportation equipment',
      type: 'Inland Marine',
      broker: 'Lisa Garcia',
      value: '$75,000',
      priority: 'Low Priority',
      status: 'Under Review',
      updated: '1 week ago',
      date: '2025-05-20'
    },
    {
      id: 'Q-2025-003',
      company: 'Manufacturing Corp',
      description: 'General liability for manufacturing facility',
      type: 'General Liability',
      broker: 'Mike Davis',
      value: '$95,000',
      priority: 'High Priority',
      status: 'Quoted',
      updated: '3 hours ago',
      date: '2025-06-05'
    },
    {
      id: 'Q-2025-004',
      company: 'Retail Chain Holdings',
      description: 'Multi-location retail property coverage',
      type: 'Commercial Property',
      broker: 'Emily Brown',
      value: '$450,000',
      priority: 'High Priority',
      status: 'Negotiating',
      updated: '5 hours ago',
      date: '2025-05-28',
      tag: 'Revision'
    }
  ]



  const getPriorityColor = (priority: string) => {
    if (priority?.includes('High')) return 'bg-red-100 text-red-800'
    if (priority?.includes('Medium')) return 'bg-yellow-100 text-yellow-800'
    if (priority?.includes('Low')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const groupedQuotes = quotes.reduce((acc: { [key: string]: any[] }, quote) => {
    if (!acc[quote.status]) acc[quote.status] = []
    acc[quote.status].push(quote)
    return acc
  }, {})

  const statusCounts = {
    'Pending': groupedQuotes['Pending']?.length || 0,
    'Under Review': groupedQuotes['Under Review']?.length || 0,
    'Quoted': groupedQuotes['Quoted']?.length || 0,
    'Negotiating': groupedQuotes['Negotiating']?.length || 0
  }

  // Funções de ação das APIs
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
    // TODO: Implementar modal de visualização
  }

  const handleEditQuote = (quote: any) => {
    console.log('Editando cotação:', quote.id)
    // TODO: Implementar modal de edição
  }

  const handleDeleteQuote = (quote: any) => {
    if (confirm(`Are you sure you want to delete quote ${quote.id}?`)) {
      console.log('Deleting quote:', quote.id)
      // TODO: Implementar exclusão
    }
  }

  // Função para enviar cotações via API (Markel e CF)
  const handleSendQuotesToAPI = async () => {
    if (selectedInsurers.length === 0) return

    setLoading(true)
    
    try {
      const responses = await Promise.allSettled(
        selectedInsurers.map(async (insurerId) => {
          const insurer = apiInsurers.find(i => i.id === insurerId)
          if (!insurer || !insurer.integrated) return null

          console.log(`Enviando cotação ${selectedQuote?.id} para ${insurer.name}...`)
          
          // Usar as APIs já implementadas no novus-plataform
          const response = await fetch('/api/submissions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quote_id: selectedQuote.id,
              channel: insurer.id  // 'markel' ou 'cf'
            })
          })

          if (!response.ok) {
            throw new Error(`Erro da ${insurer.name}: ${response.statusText}`)
          }

          const data = await response.json()
          console.log(`✅ ${insurer.name} respondeu:`, data)
          
          return {
            insurer: insurer.name,
            success: true,
            data: data
          }
        })
      )

      // Processar resultados
      const successful = responses.filter(r => r.status === 'fulfilled' && (r as PromiseFulfilledResult<any>).value).map(r => (r as PromiseFulfilledResult<any>).value)
      const failed = responses.filter(r => r.status === 'rejected')

      console.log(`✅ Enviado com sucesso para: ${successful.map(s => s.insurer).join(', ')}`)
      if (failed.length > 0) {
        console.error(`❌ Falhou para ${failed.length} seguradora(s)`)
      }

      alert(`Quote sent to ${successful.length} insurer(s) successfully!`)
      
      // TODO: Após clicar OK no alert, redirecionar para modal de detalhes da cotação
      // setShowAPIModal(false)
      // setSelectedQuoteForView(selectedQuote)
      // setShowQuoteDetailModal(true)
      
    } catch (error) {
      console.error('Error sending quotes:', error)
      alert('Error sending quotes. Check console.')
    } finally {
      setLoading(false)
      setShowAPIModal(false)
    }
  }

  // Função para enviar cotações via Email
  const handleSendQuotesToEmail = async () => {
    if (selectedInsurers.length === 0) return

    setLoading(true)
    
    try {
      const selectedEmails = selectedInsurers.map(id => {
        const insurer = emailInsurers.find(i => i.id === id)
        return insurer ? { name: insurer.name, email: insurer.email } : null
      }).filter(Boolean)

      console.log('Enviando cotação por email para:', selectedEmails)
      
      // TODO: Implementar envio de email real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Email sent to ${selectedEmails.length} insurer(s): ${selectedEmails.map(s => s?.name).join(', ')}`)
      
    } catch (error) {
      console.error('Error sending emails:', error)
      alert('Error sending emails.')
    } finally {
      setLoading(false)
      setShowEmailModal(false)
    }
  }

  const toggleInsurerSelection = (insurerId: string) => {
    setSelectedInsurers(prev => 
      prev.includes(insurerId) 
        ? prev.filter(id => id !== insurerId)
        : [...prev, insurerId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Active Quotes"
          value="6"
          subtitle="In progress"
          icon={Clock}
        />
        <MetricCard
          title="Won Quotes"
          value="1"
          subtitle="50.0% win rate"
          icon={CheckCircle}
        />
        <MetricCard
          title="Lost Quotes"
          value="1"
          subtitle="Closed lost"
          icon={XCircle}
        />
        <MetricCard
          title="Active Value"
          value="$1,210,000"
          subtitle="Pipeline value"
          icon={TrendingUp}
        />
        <MetricCard
          title="Won Value"
          value="$200,000"
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
          <Button size="sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{status}</h3>
                  <Badge variant="secondary">{count}</Badge>
                </div>
                
                <div className="space-y-3">
                  {groupedQuotes[status]?.map((quote) => (
                    <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{quote.company}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Ações da Cotação</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem onClick={() => handleViewQuote(quote)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem onClick={() => handleSendToInsurersAPI(quote)}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Send to APIs (Markel/CF)
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
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {quote.id}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {quote.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {quote.type}
                          </Badge>
                          {quote.tag && (
                            <Badge variant="destructive" className="text-xs">
                              {quote.tag}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-muted-foreground">{quote.broker}</div>
                          <div className="font-semibold">{quote.value}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getPriorityColor(quote.priority)}`}>
                            {quote.priority}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Updated {quote.updated}
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {quote.date}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal para Seguradoras API - Markel e CF */}
      <Dialog open={showAPIModal} onOpenChange={setShowAPIModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send to Insurers via API</DialogTitle>
            <DialogDescription>
              Select integrated insurers to send quote "{selectedQuote?.company}" via API
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Quote: <strong>{selectedQuote?.id}</strong> - {selectedQuote?.company}
            </div>
            
            <div className="space-y-3">
              {apiInsurers.map((insurer) => (
                <div key={insurer.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={insurer.id}
                    checked={selectedInsurers.includes(insurer.id)}
                    onCheckedChange={() => toggleInsurerSelection(insurer.id)}
                    disabled={!insurer.integrated}
                  />
                  <div className="flex-1">
                    <label htmlFor={insurer.id} className="text-sm font-medium cursor-pointer">
                      {insurer.name}
                    </label>
                    <div className="text-xs text-muted-foreground">{insurer.description}</div>
                    {insurer.endpoint && (
                      <div className="text-xs text-blue-600 font-mono">
                        Endpoint: {insurer.endpoint}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {insurer.integrated ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Building2 className="w-3 h-3 mr-1" />
                        API Ativa
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Em Desenvolvimento</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAPIModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendQuotesToAPI}
                disabled={selectedInsurers.length === 0 || loading}
              >
                {loading ? 'Sending...' : `Send to ${selectedInsurers.length} insurer(s)`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Seguradoras Email */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send to Insurers via Email</DialogTitle>
            <DialogDescription>
              Select insurers to send quote "{selectedQuote?.company}" via email
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Quote: <strong>{selectedQuote?.id}</strong> - {selectedQuote?.company}
            </div>
            
            <div className="space-y-3">
              {emailInsurers.map((insurer) => (
                <div key={insurer.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Checkbox
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
              <Button variant="outline" onClick={() => setShowEmailModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendQuotesToEmail}
                disabled={selectedInsurers.length === 0 || loading}
              >
                {loading ? 'Sending...' : `Send to ${selectedInsurers.length} insurer(s)`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

