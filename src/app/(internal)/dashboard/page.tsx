'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MetricCard from '@/components/ui/MetricCard'
import { 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Users,
  Clock,
  AlertTriangle,
  Plus,
  BarChart3,
  Eye
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const performanceData = [
    { month: 'Jan', quotes: 35, conversions: 25 },
    { month: 'Feb', quotes: 42, conversions: 30 },
    { month: 'Mar', quotes: 38, conversions: 28 },
    { month: 'Apr', quotes: 45, conversions: 35 },
    { month: 'May', quotes: 40, conversions: 32 },
    { month: 'Jun', quotes: 48, conversions: 38 }
  ]

  const recentActivities = [
    { text: 'New quote request from ABC Corp', time: '2 min ago' },
    { text: 'Quote converted to policy - XYZ Ltd', time: '15 min ago' },
    { text: 'New lead from referral partner', time: '1 hour ago' },
    { text: 'Quote expired - follow up needed', time: '2 hours ago' },
    { text: 'New lead assigned to John Smith', time: '3 hours ago' }
  ]

  const pendingTasks = [
    { task: 'Review quote for Manufacturing Co.', due: 'Due in 2 hours', priority: 'high' },
    { task: 'Follow up on expired quote - Retail Ltd', due: 'Due in 1 day', priority: 'medium' },
    { task: 'Schedule client meeting - Tech Solutions', due: 'Due in 3 days', priority: 'low' },
    { task: 'Prepare monthly performance report', due: 'Due in 2 days', priority: 'medium' }
  ]

  const brokerPerformance = [
    { name: 'John Smith', quotes: 24, conversions: 18, rate: 75 },
    { name: 'Sarah Johnson', quotes: 19, conversions: 12, rate: 63 },
    { name: 'Mike Davis', quotes: 31, conversions: 22, rate: 71 },
    { name: 'Emily Brown', quotes: 15, conversions: 9, rate: 60 }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Novus Underwriters</h1>
        <p className="text-muted-foreground">Managing General Agency - Performance Overview</p>
        
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Period:</span>
          <select className="px-3 py-1 border border-border rounded-md text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Quotes"
          value="847"
          icon={FileText}
          trend="up"
          trendValue="12.5% vs last month"
        />
        <MetricCard
          title="Conversions"
          value="542"
          icon={CheckCircle}
          trend="up"
          trendValue="8.3% vs last month"
        />
        <MetricCard
          title="Revenue Generated"
          value="••••••••"
          icon={DollarSign}
          trend="up"
          trendValue="15.7% vs last month"
        />
        <MetricCard
          title="Active Leads"
          value="156"
          icon={Users}
          trend="up"
          trendValue="5.2% vs last month"
        />
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quotes" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activities
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pending Tasks
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.task}</p>
                    <p className="text-xs text-gray-500">{task.due}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broker Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Broker Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brokerPerformance.map((broker, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{broker.name}</p>
                    <p className="text-sm text-gray-500">{broker.quotes} quotes, {broker.conversions} conversions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{broker.rate}%</p>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 