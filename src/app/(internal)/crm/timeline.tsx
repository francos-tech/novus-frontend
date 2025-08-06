import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import MetricCard from '@/components/ui/MetricCard'
import { 
  Calendar, 
  CheckCircle, 
  DollarSign, 
  Users,
  Download,
  Bell,
  Plus,
  Search
} from 'lucide-react'

const CrmTimeline = () => {
  const [activeTab, setActiveTab] = useState('timeline')

  const timelineEvents = [
    {
      id: 1,
      title: 'Lead Created',
      description: 'New lead generated from website contact form',
      client: 'TechCorp Solutions',
      date: '2025-01-20 at 09:30 AM',
      contact: 'Michael Chen',
      status: 'Completed',
      initials: 'SJ',
      value: null
    },
    {
      id: 2,
      title: 'First Contact Call',
      description: 'Initial discovery call to understand insurance needs',
      client: 'TechCorp Solutions',
      date: '2025-01-20 at 02:15 PM',
      contact: 'Michael Chen',
      status: 'Completed',
      initials: 'SJ',
      value: null
    },
    {
      id: 3,
      title: 'Quote Request Received',
      description: 'Formal quote request for Professional Liability coverage',
      client: 'TechCorp Solutions',
      date: '2025-01-21 at 11:00 AM',
      contact: 'Michael Chen',
      status: 'Completed',
      initials: 'SJ',
      value: '$125,000'
    },
    {
      id: 4,
      title: 'Risk Assessment Completed',
      description: 'Comprehensive risk evaluation and underwriting review',
      client: 'TechCorp Solutions',
      date: '2025-01-21 at 03:45 PM',
      contact: 'Lisa Rodriguez',
      status: 'Completed',
      initials: 'SJ',
      value: null
    },
    {
      id: 5,
      title: 'Quote Generated',
      description: 'Professional Liability quote prepared and reviewed',
      client: 'TechCorp Solutions',
      date: '2025-01-22 at 10:30 AM',
      contact: 'Michael Chen',
      status: 'Completed',
      initials: 'SJ',
      value: '$125,000'
    },
    {
      id: 6,
      title: 'Quote Presentation Meeting',
      description: 'Presented quote and discussed coverage details with client',
      client: 'TechCorp Solutions',
      date: '2025-01-22 at 02:00 PM',
      contact: 'Michael Chen',
      status: 'Completed',
      initials: 'SJ',
      value: null
    },
    {
      id: 7,
      title: 'Terms Negotiation',
      description: 'Negotiating deductible and coverage limits',
      client: 'TechCorp Solutions',
      date: '2025-01-23 at 11:15 AM',
      contact: 'Michael Chen',
      status: 'In Progress',
      initials: 'SJ',
      value: null
    },
    {
      id: 8,
      title: 'Policy Issued',
      description: 'General Liability policy successfully issued',
      client: 'Global Manufacturing Inc',
      date: '2025-01-19 at 04:30 PM',
      contact: 'Emma Thompson',
      status: 'Completed',
      initials: 'RD',
      value: '$285,000'
    },
    {
      id: 9,
      title: 'Lead Created',
      description: 'New healthcare client inquiry for malpractice insurance',
      client: 'Healthcare Partners LLC',
      date: '2025-01-18 at 10:45 AM',
      contact: 'Sarah Martinez',
      status: 'Completed',
      initials: 'DA',
      value: null
    },
    {
      id: 10,
      title: 'Initial Consultation',
      description: 'Comprehensive consultation about medical malpractice coverage needs',
      client: 'Healthcare Partners LLC',
      date: '2025-01-19 at 09:00 AM',
      contact: 'Sarah Martinez',
      status: 'Completed',
      initials: 'DA',
      value: null
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitialsColor = (initials: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500'
    ]
    return colors[initials.length % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Timeline</h1>
          <p className="text-muted-foreground">Track complete client journey from lead to policy conversion</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Timeline
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminders
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'timeline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('timeline')}
        >
          Timeline View
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
          title="Total Events"
          value="13"
          icon={Calendar}
        />
        <MetricCard
          title="Completed"
          value="11"
          subtitle="85% completion rate"
          icon={CheckCircle}
        />
        <MetricCard
          title="Pipeline Value"
          value="$535,000"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Clients"
          value="4"
          icon={Users}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search events, clients, or descriptions..."
          className="pl-10"
        />
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Journey Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Chronological view of all client interactions and milestones
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Client</span>
                <span>Category</span>
                <span>Period</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index !== timelineEvents.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full ${getInitialsColor(event.initials)} flex items-center justify-center text-white font-semibold text-sm`}>
                    {event.initials}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">{event.client}</span>
                          <span className="text-muted-foreground">{event.date}</span>
                          <span className="text-muted-foreground">{event.contact}</span>
                          {event.value && (
                            <span className="font-semibold text-green-600">{event.value}</span>
                          )}
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Lead Generation', count: 3, percentage: 23 },
                { category: 'Client Meetings', count: 4, percentage: 31 },
                { category: 'Quote Activities', count: 3, percentage: 23 },
                { category: 'Policy Management', count: 2, percentage: 15 },
                { category: 'Follow-ups', count: 1, percentage: 8 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-muted-foreground">{item.count} events</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { milestone: 'Policy Issued - Global Manufacturing', date: '2 days ago', value: '$285,000' },
                { milestone: 'Quote Generated - TechCorp Solutions', date: '3 days ago', value: '$125,000' },
                { milestone: 'New Lead - Healthcare Partners', date: '5 days ago', value: 'TBD' },
                { milestone: 'Contract Signed - Retail Dynamics', date: '1 week ago', value: '$180,000' },
                { milestone: 'Initial Contact - Construction LLC', date: '2 weeks ago', value: 'TBD' }
              ].map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{milestone.milestone}</p>
                    <p className="text-xs text-muted-foreground">{milestone.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{milestone.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CrmTimeline

