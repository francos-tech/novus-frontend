import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import MetricCard from '@/components/MetricCard'
import { 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Clock,
  Download,
  BarChart3,
  Search,
  Copy,
  Eye,
  File
} from 'lucide-react'

const QuotesHistory = () => {
  const [activeTab, setActiveTab] = useState('history')

  const historicalQuotes = [
    {
      id: 'Q-2024-156',
      company: 'TechCorp Solutions',
      submitted: '2024-12-15',
      closed: '2024-12-28',
      status: 'Won',
      premium: '$185,000',
      type: 'Professional Liability',
      broker: 'Sarah Johnson',
      businessType: 'Technology',
      processingTime: '13 days',
      reused: '2x',
      similar: '3 similar',
      tags: ['Tech', 'High-Value', 'Cyber Risk']
    },
    {
      id: 'Q-2024-142',
      company: 'Metro Construction LLC',
      submitted: '2024-11-20',
      closed: '2024-12-05',
      status: 'Won',
      premium: '$320,000',
      type: 'Commercial Property',
      broker: 'Mike Rodriguez',
      businessType: 'Construction',
      processingTime: '15 days',
      reused: '4x',
      similar: '5 similar',
      tags: ['Construction', 'High-Premium', 'Equipment']
    },
    {
      id: 'Q-2024-138',
      company: 'Healthcare Partners Group',
      submitted: '2024-11-10',
      closed: '2024-11-25',
      status: 'Lost',
      premium: '$275,000',
      type: 'Professional Liability',
      broker: 'Lisa Chen',
      businessType: 'Healthcare',
      processingTime: '15 days',
      reused: '1x',
      similar: '2 similar',
      tags: ['Healthcare', 'Compliance', 'High-Risk']
    },
    {
      id: 'Q-2024-125',
      company: 'Global Logistics Inc',
      submitted: '2024-10-15',
      closed: '2024-10-30',
      status: 'Won',
      premium: '$145,000',
      type: 'Inland Marine',
      broker: 'David Park',
      businessType: 'Transportation',
      processingTime: '15 days',
      reused: '3x',
      similar: '4 similar',
      tags: ['Transportation', 'Cargo', 'Weather Risk']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won': return 'bg-green-100 text-green-800'
      case 'Lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    return colors[tag.length % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotes History & Intelligence</h1>
          <p className="text-muted-foreground">Historical quotes, reusable templates, and performance analytics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics Report
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
        >
          Quote History
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('templates')}
        >
          Smart Templates
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
        >
          Performance Analytics
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Quotes"
          value="156"
          subtitle="Historical data"
          icon={FileText}
        />
        <MetricCard
          title="Won Quotes"
          value="89"
          subtitle="57.1% win rate"
          icon={CheckCircle}
        />
        <MetricCard
          title="Total Premium"
          value="$12,500,000"
          subtitle="Revenue generated"
          icon={DollarSign}
        />
        <MetricCard
          title="Avg Processing"
          value="14.2 days"
          subtitle="Time to close"
          icon={Clock}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by client, quote ID, or business type..."
            className="pl-10"
          />
        </div>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Status</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Types</option>
          <option>Professional Liability</option>
          <option>Commercial Property</option>
          <option>Inland Marine</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Brokers</option>
          <option>Sarah Johnson</option>
          <option>Mike Rodriguez</option>
          <option>Lisa Chen</option>
          <option>David Park</option>
        </select>
      </div>

      {/* Historical Quotes List */}
      <div className="space-y-4">
        {historicalQuotes.map((quote) => (
          <Card key={quote.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-semibold">{quote.company}</h3>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{quote.id}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{quote.submitted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Closed</p>
                    <p className="font-medium">{quote.closed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium</p>
                    <p className="font-medium text-green-600">{quote.premium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                    <p className="font-medium">{quote.processingTime}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Insurance Type</p>
                    <p className="font-medium">{quote.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Broker</p>
                    <p className="font-medium">{quote.broker}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Business Type</p>
                    <p className="font-medium">{quote.businessType}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-muted-foreground">
                    Reused {quote.reused} • {quote.similar}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {quote.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className={`text-xs ${getTagColor(tag)}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <File className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default QuotesHistory

