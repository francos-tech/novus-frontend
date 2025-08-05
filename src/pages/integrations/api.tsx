import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import MetricCard from '@/components/MetricCard'
import { 
  Zap, 
  CheckCircle, 
  FileText, 
  AlertTriangle,
  Download,
  Filter,
  Search,
  Plus,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react'

const IntegrationsApi = () => {
  const [activeTab, setActiveTab] = useState('integrations')

  const integrations = [
    {
      id: 1,
      provider: 'Lloyd\'s of London',
      type: 'Reinsurance API',
      status: 'Connected',
      lastSync: '2 hours ago',
      apiKey: 'lloyds_api_***7892',
      endpoint: 'https://api.lloyds.com/v2/reinsurance',
      features: ['Quote Submission', 'Risk Assessment', 'Policy Management'],
      quotesEnabled: true,
      errorCount: 0,
      uptime: '99.9%'
    },
    {
      id: 2,
      provider: 'Zurich Insurance',
      type: 'Underwriting API',
      status: 'Connected',
      lastSync: '1 hour ago',
      apiKey: 'zurich_api_***4521',
      endpoint: 'https://api.zurich.com/v1/underwriting',
      features: ['Risk Evaluation', 'Premium Calculation', 'Policy Issuance'],
      quotesEnabled: true,
      errorCount: 2,
      uptime: '98.5%'
    },
    {
      id: 3,
      provider: 'AXA Group',
      type: 'Claims API',
      status: 'Connected',
      lastSync: '30 minutes ago',
      apiKey: 'axa_api_***9876',
      endpoint: 'https://api.axa.com/v3/claims',
      features: ['Claims Processing', 'Status Updates', 'Documentation'],
      quotesEnabled: false,
      errorCount: 0,
      uptime: '99.7%'
    },
    {
      id: 4,
      provider: 'Munich Re',
      type: 'Reinsurance API',
      status: 'Error',
      lastSync: '2 days ago',
      apiKey: 'munich_api_***3456',
      endpoint: 'https://api.munichre.com/v2/reinsurance',
      features: ['Catastrophe Modeling', 'Risk Transfer', 'Portfolio Analysis'],
      quotesEnabled: false,
      errorCount: 15,
      uptime: '85.2%'
    },
    {
      id: 5,
      provider: 'Allianz Global',
      type: 'Underwriting API',
      status: 'Connected',
      lastSync: '45 minutes ago',
      apiKey: 'allianz_api_***7890',
      endpoint: 'https://api.allianz.com/v1/underwriting',
      features: ['Risk Assessment', 'Quote Generation', 'Policy Binding'],
      quotesEnabled: true,
      errorCount: 1,
      uptime: '99.1%'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800'
      case 'Error': return 'bg-red-100 text-red-800'
      case 'Disconnected': return 'bg-gray-100 text-gray-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    if (type.includes('Reinsurance')) return 'bg-blue-100 text-blue-800'
    if (type.includes('Underwriting')) return 'bg-purple-100 text-purple-800'
    if (type.includes('Claims')) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getUptimeColor = (uptime: string) => {
    const percentage = parseFloat(uptime)
    if (percentage >= 99) return 'text-green-600'
    if (percentage >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Integrations</h1>
          <p className="text-muted-foreground">Manage external API connections and data synchronization</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Bulk Sync
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Global Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Integration
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'integrations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('integrations')}
        >
          Active Integrations
        </Button>
        <Button
          variant={activeTab === 'webhooks' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('webhooks')}
        >
          Webhooks
        </Button>
        <Button
          variant={activeTab === 'logs' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('logs')}
        >
          API Logs
        </Button>
        <Button
          variant={activeTab === 'documentation' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('documentation')}
        >
          Documentation
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Integrations"
          value="5"
          icon={Zap}
        />
        <MetricCard
          title="Connected"
          value="4"
          subtitle="80% success rate"
          icon={CheckCircle}
        />
        <MetricCard
          title="Quote Enabled"
          value="3"
          subtitle="Active for quotes"
          icon={FileText}
        />
        <MetricCard
          title="Errors"
          value="18"
          subtitle="Needs attention"
          icon={AlertTriangle}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search integrations, providers, or endpoints..."
            className="pl-10"
          />
        </div>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Status</option>
          <option>Connected</option>
          <option>Error</option>
          <option>Disconnected</option>
          <option>Pending</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Types</option>
          <option>Reinsurance API</option>
          <option>Underwriting API</option>
          <option>Claims API</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Providers</option>
          <option>Lloyd's of London</option>
          <option>Zurich Insurance</option>
          <option>AXA Group</option>
          <option>Munich Re</option>
          <option>Allianz Global</option>
        </select>
      </div>

      {/* Active Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Integrations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage API connections and monitor integration health
              </p>
            </div>
            <Button variant="outline" size="sm">
              Refresh All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-6 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{integration.provider}</h4>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        <Badge className={getTypeColor(integration.type)}>
                          {integration.type}
                        </Badge>
                        {integration.quotesEnabled && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Quote Enabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {integration.lastSync}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">API Key:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {integration.apiKey}
                      </code>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Endpoint:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded truncate">
                        {integration.endpoint}
                      </code>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Performance:</p>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${getUptimeColor(integration.uptime)}`}>
                        {integration.uptime} uptime
                      </span>
                      {integration.errorCount > 0 && (
                        <span className="text-red-600 text-sm">
                          {integration.errorCount} errors
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Available Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'Average Uptime', value: '96.5%', status: 'good' },
                { metric: 'Total API Calls', value: '12,847', status: 'excellent' },
                { metric: 'Failed Requests', value: '18', status: 'warning' },
                { metric: 'Response Time', value: '245ms', status: 'good' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.metric}</span>
                  <span className={`font-semibold ${
                    item.status === 'excellent' ? 'text-green-600' :
                    item.status === 'good' ? 'text-blue-600' :
                    item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add New Integration
              </Button>
              <Button variant="outline" className="justify-start">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All Integrations
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Global Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default IntegrationsApi

