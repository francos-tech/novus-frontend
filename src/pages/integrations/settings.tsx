import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import MetricCard from '@/components/MetricCard'
import { 
  Key, 
  Clock, 
  Shield, 
  Database,
  Download,
  Save,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-react'

const IntegrationsSettings = () => {
  const [activeTab, setActiveTab] = useState('security')
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})

  const apiCredentials = [
    {
      id: 1,
      name: 'Lloyd\'s API Key',
      key: 'lloyds_sk_live_***************************7892',
      status: 'Active',
      expires: 'Dec 31, 2025',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write', 'quotes'],
      environment: 'Production'
    },
    {
      id: 2,
      name: 'Zurich API Token',
      key: 'zurich_tk_prod_***************************4521',
      status: 'Active',
      expires: 'Jun 15, 2025',
      lastUsed: '1 hour ago',
      permissions: ['read', 'write'],
      environment: 'Production'
    },
    {
      id: 3,
      name: 'AXA Integration Key',
      key: 'axa_ik_live_***************************9876',
      status: 'Active',
      expires: 'Sep 30, 2025',
      lastUsed: '30 minutes ago',
      permissions: ['read', 'claims'],
      environment: 'Production'
    },
    {
      id: 4,
      name: 'Munich Re API Key',
      key: 'munich_sk_prod_***************************3456',
      status: 'Expired',
      expires: 'Jan 15, 2025',
      lastUsed: '2 weeks ago',
      permissions: ['read', 'write', 'reinsurance'],
      environment: 'Production'
    },
    {
      id: 5,
      name: 'Allianz Test Key',
      key: 'allianz_sk_test_***************************7890',
      status: 'Active',
      expires: 'Dec 31, 2025',
      lastUsed: '1 day ago',
      permissions: ['read'],
      environment: 'Sandbox'
    }
  ]

  const securitySettings = [
    { id: 'rate_limiting', label: 'Rate Limiting', description: 'Limit API requests per minute', enabled: true },
    { id: 'api_key_rotation', label: 'API Key Rotation', description: 'Automatically rotate API keys monthly', enabled: true },
    { id: 'webhook_signatures', label: 'Webhook Signatures', description: 'Verify webhook authenticity', enabled: true },
    { id: 'real_time_sync', label: 'Real-time Sync', description: 'Enable real-time data synchronization', enabled: false },
    { id: 'failure_notifications', label: 'Failure Notifications', description: 'Send alerts on integration failures', enabled: true },
    { id: 'data_backup', label: 'Data Backup', description: 'Backup integration data daily', enabled: true }
  ]

  const environmentConfig = {
    production: {
      name: 'Production',
      url: 'https://api.novusunderwriters.com',
      status: 'Active',
      lastDeployment: '2 days ago',
      version: 'v2.1.3'
    },
    sandbox: {
      name: 'Sandbox',
      url: 'https://sandbox-api.novusunderwriters.com',
      status: 'Active',
      lastDeployment: '1 hour ago',
      version: 'v2.2.0-beta'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Expired': return 'bg-red-100 text-red-800'
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEnvironmentColor = (env: string) => {
    return env === 'Production' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const maskApiKey = (key: string) => {
    const parts = key.split('_')
    if (parts.length >= 3) {
      return `${parts[0]}_${parts[1]}_${'*'.repeat(parts[2].length - 4)}${parts[2].slice(-4)}`
    }
    return key
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integration Settings</h1>
          <p className="text-muted-foreground">Configure security, credentials, and global integration settings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'security' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('security')}
        >
          Security & Global Settings
        </Button>
        <Button
          variant={activeTab === 'credentials' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('credentials')}
        >
          API Credentials
        </Button>
        <Button
          variant={activeTab === 'environment' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('environment')}
        >
          Environment Configuration
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Credentials"
          value="4"
          icon={Key}
        />
        <MetricCard
          title="Expired Credentials"
          value="1"
          subtitle="Needs renewal"
          icon={Clock}
        />
        <MetricCard
          title="Security Settings"
          value="5/6"
          subtitle="Enabled"
          icon={Shield}
        />
        <MetricCard
          title="Last Backup"
          value="2 hours ago"
          icon={Database}
        />
      </div>

      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security & Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Global Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure security policies and global integration behavior
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {securitySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{setting.label}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Global Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Global Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Request Timeout (seconds)</label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Retry Attempts</label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Rate Limit (requests/minute)</label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Webhook Timeout (seconds)</label>
                  <Input type="number" defaultValue="10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'credentials' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Credentials</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage API keys, tokens, and access credentials
                </p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiCredentials.map((credential) => (
                <div key={credential.id} className="p-6 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{credential.name}</h4>
                        <Badge className={getStatusColor(credential.status)}>
                          {credential.status}
                        </Badge>
                        <Badge className={getEnvironmentColor(credential.environment)}>
                          {credential.environment}
                        </Badge>
                        {credential.status === 'Expired' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
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
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {showApiKeys[credential.id] ? credential.key : maskApiKey(credential.key)}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(credential.id.toString())}
                        >
                          {showApiKeys[credential.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Expires:</p>
                      <p className="font-medium">{credential.expires}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Last Used:</p>
                      <p className="font-medium">{credential.lastUsed}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {credential.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'environment' && (
        <div className="space-y-6">
          {/* Environment Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(environmentConfig).map(([key, env]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{env.name} Environment</CardTitle>
                    <Badge className={getStatusColor(env.status)}>
                      {env.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Base URL:</p>
                      <code className="text-sm bg-muted px-2 py-1 rounded block">
                        {env.url}
                      </code>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Version:</p>
                        <p className="font-medium">{env.version}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Last Deployment:</p>
                        <p className="font-medium">{env.lastDeployment}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure environment-specific variables and settings
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'API_BASE_URL', value: 'https://api.novusunderwriters.com', env: 'Production' },
                  { key: 'WEBHOOK_SECRET', value: '***************************', env: 'Production' },
                  { key: 'DATABASE_URL', value: 'postgresql://***************************', env: 'Production' },
                  { key: 'REDIS_URL', value: 'redis://***************************', env: 'Production' },
                  { key: 'LOG_LEVEL', value: 'INFO', env: 'Production' }
                ].map((variable, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <code className="text-sm font-medium">{variable.key}</code>
                        <Badge variant="outline" className="text-xs">
                          {variable.env}
                        </Badge>
                      </div>
                      <code className="text-sm text-muted-foreground">
                        {variable.value}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default IntegrationsSettings

