import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MetricCard from '@/components/MetricCard'
import { 
  DollarSign, 
  Users, 
  FileText, 
  Target,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Award,
  BarChart3
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const ProductivityRoi = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const revenueByEmployee = [
    { name: 'Sarah Johnson', revenue: 1250000, quotes: 24, conversion: 75 },
    { name: 'Michael Chen', revenue: 980000, quotes: 19, conversion: 63 },
    { name: 'David Park', revenue: 890000, quotes: 31, conversion: 71 },
    { name: 'Emma Thompson', revenue: 750000, quotes: 15, conversion: 60 },
    { name: 'Lisa Rodriguez', revenue: 650000, quotes: 12, conversion: 58 },
    { name: 'James Wilson', revenue: 420000, quotes: 8, conversion: 50 }
  ]

  const categoryData = [
    { name: 'Professional Liability', value: 35, revenue: 1750000, color: '#3b82f6' },
    { name: 'Commercial Property', value: 28, revenue: 1400000, color: '#10b981' },
    { name: 'General Liability', value: 20, revenue: 1000000, color: '#f59e0b' },
    { name: 'Inland Marine', value: 12, revenue: 600000, color: '#ef4444' },
    { name: 'Cyber Liability', value: 5, revenue: 250000, color: '#8b5cf6' }
  ]

  const employeePerformance = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      department: 'Sales',
      revenue: '$1,250,000',
      quotes: 24,
      conversion: '75%',
      efficiency: 'Excellent',
      growth: '+15%'
    },
    {
      rank: 2,
      name: 'Michael Chen',
      department: 'Underwriting',
      revenue: '$980,000',
      quotes: 19,
      conversion: '63%',
      efficiency: 'Good',
      growth: '+8%'
    },
    {
      rank: 3,
      name: 'David Park',
      department: 'Sales',
      revenue: '$890,000',
      quotes: 31,
      conversion: '71%',
      efficiency: 'Good',
      growth: '+12%'
    },
    {
      rank: 4,
      name: 'Emma Thompson',
      department: 'Finance',
      revenue: '$750,000',
      quotes: 15,
      conversion: '60%',
      efficiency: 'Average',
      growth: '+5%'
    },
    {
      rank: 5,
      name: 'Lisa Rodriguez',
      department: 'IT',
      revenue: '$650,000',
      quotes: 12,
      conversion: '58%',
      efficiency: 'Average',
      growth: '+3%'
    },
    {
      rank: 6,
      name: 'James Wilson',
      department: 'Sales',
      revenue: '$420,000',
      quotes: 8,
      conversion: '50%',
      efficiency: 'Below Average',
      growth: '-2%'
    }
  ]

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'Excellent': return 'bg-green-100 text-green-800'
      case 'Good': return 'bg-blue-100 text-blue-800'
      case 'Average': return 'bg-yellow-100 text-yellow-800'
      case 'Below Average': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGrowthIcon = (growth: string) => {
    return growth.startsWith('+') ? TrendingUp : TrendingDown
  }

  const getGrowthColor = (growth: string) => {
    return growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productivity & ROI Analytics</h1>
          <p className="text-muted-foreground">Track employee performance, revenue generation, and business efficiency</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced Analytics
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'employees' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('employees')}
        >
          Employee Performance
        </Button>
        <Button
          variant={activeTab === 'categories' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('categories')}
        >
          Category Analysis
        </Button>
        <Button
          variant={activeTab === 'trends' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$4,940,000"
          icon={DollarSign}
          trend="up"
          trendValue="+12.5% vs last quarter"
        />
        <MetricCard
          title="Active Employees"
          value="6"
          subtitle="Revenue generators"
          icon={Users}
        />
        <MetricCard
          title="Total Quotes"
          value="109"
          icon={FileText}
          trend="up"
          trendValue="+8.3% vs last quarter"
        />
        <MetricCard
          title="Conversion Rate"
          value="64.2%"
          icon={Target}
          trend="up"
          trendValue="+2.1% improvement"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Employee */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Employee</CardTitle>
            <p className="text-sm text-muted-foreground">
              Individual revenue contribution and performance metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByEmployee} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Employee: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <p className="text-sm text-muted-foreground">
              Insurance category performance and market share
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}% ($${props.payload.revenue.toLocaleString()})`,
                      'Market Share'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Performance Ranking</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive performance metrics and efficiency ratings
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeePerformance.map((employee) => {
              const GrowthIcon = getGrowthIcon(employee.growth)
              return (
                <div key={employee.rank} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold">
                      {employee.rank}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{employee.name}</h4>
                        <Badge variant="outline">{employee.department}</Badge>
                        <Badge className={getEfficiencyColor(employee.efficiency)}>
                          {employee.efficiency}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Revenue:</p>
                          <p className="font-semibold text-green-600">{employee.revenue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quotes:</p>
                          <p className="font-medium">{employee.quotes}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversion:</p>
                          <p className="font-medium">{employee.conversion}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Growth:</p>
                          <div className="flex items-center gap-1">
                            <GrowthIcon className={`w-4 h-4 ${getGrowthColor(employee.growth)}`} />
                            <p className={`font-medium ${getGrowthColor(employee.growth)}`}>
                              {employee.growth}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {employee.rank <= 3 && (
                      <Award className="w-6 h-6 text-yellow-500" />
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of insurance category performance and trends
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map((category, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h4 className="font-semibold">{category.name}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Market Share:</span>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue:</span>
                    <span className="font-semibold text-green-600">
                      ${category.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Deal Size:</span>
                    <span className="font-medium">
                      ${Math.round(category.revenue / (category.value * 2)).toLocaleString()}
                    </span>
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

export default ProductivityRoi

