import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MetricCard from '@/components/ui/MetricCard'
import { 
  Users, 
  Target, 
  DollarSign, 
  Clock,
  Download,
  BarChart3,
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const CrmLeads = () => {
  const [activeTab, setActiveTab] = useState('pipeline')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM & Lead Management</h1>
          <p className="text-muted-foreground">Intelligent lead tracking and conversion pipeline for insurance brokers</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics Report
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Leads
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'pipeline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('pipeline')}
        >
          Sales Pipeline
        </Button>
        <Button
          variant={activeTab === 'leads' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('leads')}
        >
          All Leads
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value="156"
          icon={Users}
          trend="up"
          trendValue="+23 new this month"
        />
        <MetricCard
          title="Conversion Rate"
          value="23.5%"
          icon={Target}
          trend="up"
          trendValue="+2.3% improvement"
        />
        <MetricCard
          title="Pipeline Value"
          value="$4,200,000"
          icon={DollarSign}
          trend="up"
          trendValue="+15% growth"
        />
        <MetricCard
          title="Avg Sales Cycle"
          value="45 days"
          icon={Clock}
          trend="down"
          trendValue="-5 days faster"
        />
      </div>

      {/* Lead Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Conversion Pipeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track leads through different stages of the sales process
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* New Leads */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-3">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-sm text-blue-600">New Leads</div>
              </div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>

            {/* Qualified */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-6 mb-3">
                <div className="text-2xl font-bold text-purple-600">28</div>
                <div className="text-sm text-purple-600">Qualified</div>
              </div>
              <div className="text-xs text-muted-foreground">66.7% Rate</div>
            </div>

            {/* Proposal */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-6 mb-3">
                <div className="text-2xl font-bold text-orange-600">18</div>
                <div className="text-sm text-orange-600">Proposal</div>
              </div>
              <div className="text-xs text-muted-foreground">64.3% Rate</div>
            </div>

            {/* Negotiation */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-lg p-6 mb-3">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-yellow-600">Negotiation</div>
              </div>
              <div className="text-xs text-muted-foreground">66.7% Rate</div>
            </div>

            {/* Closed Won */}
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-6 mb-3">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-green-600">Closed Won</div>
              </div>
              <div className="text-xs text-muted-foreground">66.7% Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Lead Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: 'TechStart Solutions', action: 'New lead created', time: '2 hours ago', value: '$125,000' },
                { company: 'Global Manufacturing', action: 'Moved to Proposal stage', time: '4 hours ago', value: '$285,000' },
                { company: 'Retail Chain Corp', action: 'Quote requested', time: '1 day ago', value: '$180,000' },
                { company: 'Healthcare Partners', action: 'Initial contact made', time: '2 days ago', value: '$95,000' },
                { company: 'Construction LLC', action: 'Lead qualified', time: '3 days ago', value: '$220,000' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.company}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{activity.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Website Contact Form', leads: 28, conversion: '24%', trend: 'up' },
                { source: 'Referral Partners', leads: 22, conversion: '31%', trend: 'up' },
                { source: 'Cold Outreach', leads: 18, conversion: '18%', trend: 'down' },
                { source: 'Trade Shows', leads: 15, conversion: '27%', trend: 'up' },
                { source: 'Social Media', leads: 12, conversion: '15%', trend: 'down' }
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{source.source}</p>
                    <p className="text-xs text-muted-foreground">{source.leads} leads</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{source.conversion}</span>
                    {source.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Performance by Broker */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Performance by Broker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Sarah Johnson', leads: 38, converted: 12, rate: '31.6%', value: '$1,250,000' },
              { name: 'Mike Rodriguez', leads: 32, converted: 8, rate: '25.0%', value: '$980,000' },
              { name: 'Lisa Chen', leads: 28, converted: 6, rate: '21.4%', value: '$750,000' },
              { name: 'David Park', leads: 24, converted: 7, rate: '29.2%', value: '$890,000' }
            ].map((broker, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">{broker.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Leads:</span>
                    <span>{broker.leads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Converted:</span>
                    <span>{broker.converted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-semibold text-green-600">{broker.rate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-semibold">{broker.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CrmLeads

