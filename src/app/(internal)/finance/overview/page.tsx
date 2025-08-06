'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MetricCard from '@/components/ui/MetricCard'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Receipt,
  PiggyBank,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function FinanceOverview() {
  const [activeView, setActiveView] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const financialData = [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
    { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
    { month: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 }
  ]

  const revenueByCategory = [
    { name: 'Professional Liability', value: 35, color: '#3B82F6' },
    { name: 'General Liability', value: 25, color: '#10B981' },
    { name: 'Property Insurance', value: 20, color: '#F59E0B' },
    { name: 'Workers Comp', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' }
  ]

  const recentTransactions = [
    { id: 'TXN-001', description: 'Markel Premium Payment', amount: 12500, type: 'revenue', date: '2025-01-15', status: 'completed' },
    { id: 'TXN-002', description: 'C&F Commission', amount: 3200, type: 'revenue', date: '2025-01-14', status: 'completed' },
    { id: 'TXN-003', description: 'Office Rent', amount: -3500, type: 'expense', date: '2025-01-13', status: 'completed' },
    { id: 'TXN-004', description: 'Software Licenses', amount: -1200, type: 'expense', date: '2025-01-12', status: 'pending' },
    { id: 'TXN-005', description: 'Zurich Premium', amount: 8900, type: 'revenue', date: '2025-01-11', status: 'completed' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'revenue' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your financial performance and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$312,000"
          trend="up"
          trendValue="+12.5%"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Expenses"
          value="$216,000"
          trend="down"
          trendValue="+8.2%"
          icon={Receipt}
        />
        <MetricCard
          title="Net Profit"
          value="$96,000"
          trend="up"
          trendValue="+18.3%"
          icon={TrendingUp}
        />
        <MetricCard
          title="Profit Margin"
          value="30.8%"
          trend="up"
          trendValue="+2.1%"
          icon={BarChart3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Trend
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod('week')}>Week</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod('month')}>Month</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod('year')}>Year</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Transactions
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'revenue' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
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