import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import MetricCard from '@/components/MetricCard'
import { 
  Users as UsersIcon, 
  UserCheck, 
  Shield, 
  UserPlus,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  UserX,
  Trash2,
  MoreHorizontal
} from 'lucide-react'

const Users = () => {
  const [activeTab, setActiveTab] = useState('users')

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@novusunderwriters.com',
      role: 'Senior Broker',
      department: 'Sales',
      status: 'Active',
      lastLogin: '2 hours ago',
      avatar: 'SJ',
      permissions: ['quotes', 'leads', 'reports'],
      joinDate: 'Jan 15, 2023'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@novusunderwriters.com',
      role: 'Underwriter',
      department: 'Underwriting',
      status: 'Active',
      lastLogin: '1 day ago',
      avatar: 'MC',
      permissions: ['quotes', 'risk-assessment'],
      joinDate: 'Mar 22, 2023'
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@novusunderwriters.com',
      role: 'Administrator',
      department: 'IT',
      status: 'Active',
      lastLogin: '30 minutes ago',
      avatar: 'LR',
      permissions: ['admin', 'users', 'settings', 'reports'],
      joinDate: 'Nov 8, 2022'
    },
    {
      id: 4,
      name: 'David Park',
      email: 'david.park@novusunderwriters.com',
      role: 'Junior Broker',
      department: 'Sales',
      status: 'Active',
      lastLogin: '3 hours ago',
      avatar: 'DP',
      permissions: ['quotes', 'leads'],
      joinDate: 'Jun 10, 2024'
    },
    {
      id: 5,
      name: 'Emma Thompson',
      email: 'emma.thompson@novusunderwriters.com',
      role: 'Finance Manager',
      department: 'Finance',
      status: 'Active',
      lastLogin: '1 hour ago',
      avatar: 'ET',
      permissions: ['finance', 'reports'],
      joinDate: 'Feb 3, 2023'
    },
    {
      id: 6,
      name: 'James Wilson',
      email: 'james.wilson@novusunderwriters.com',
      role: 'Broker',
      department: 'Sales',
      status: 'Inactive',
      lastLogin: '2 weeks ago',
      avatar: 'JW',
      permissions: ['quotes', 'leads'],
      joinDate: 'Sep 15, 2023'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    if (role.includes('Administrator')) return 'bg-purple-100 text-purple-800'
    if (role.includes('Manager')) return 'bg-blue-100 text-blue-800'
    if (role.includes('Senior')) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ]
    return colors[name.length % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>
        <Button
          variant={activeTab === 'roles' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </Button>
        <Button
          variant={activeTab === 'permissions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('permissions')}
        >
          Permissions
        </Button>
        <Button
          variant={activeTab === 'new' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('new')}
        >
          New User
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="6"
          icon={UsersIcon}
        />
        <MetricCard
          title="Active Users"
          value="5"
          subtitle="83% active rate"
          icon={UserCheck}
        />
        <MetricCard
          title="Administrators"
          value="1"
          icon={Shield}
        />
        <MetricCard
          title="Brokers"
          value="3"
          subtitle="Sales team"
          icon={UserPlus}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users by name, email, or role..."
            className="pl-10"
          />
        </div>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Roles</option>
          <option>Administrator</option>
          <option>Senior Broker</option>
          <option>Broker</option>
          <option>Junior Broker</option>
          <option>Underwriter</option>
          <option>Finance Manager</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Departments</option>
          <option>Sales</option>
          <option>Underwriting</option>
          <option>Finance</option>
          <option>IT</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Directory</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage user accounts and access permissions
              </p>
            </div>
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white font-semibold`}>
                    {user.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{user.name}</h4>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email:</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Department:</p>
                        <p className="font-medium">{user.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Login:</p>
                        <p className="font-medium">{user.lastLogin}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Join Date:</p>
                        <p className="font-medium">{user.joinDate}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserX className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: 'Sales', count: 3, percentage: 50 },
                { department: 'Underwriting', count: 1, percentage: 17 },
                { department: 'Finance', count: 1, percentage: 17 },
                { department: 'IT', count: 1, percentage: 17 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.department}</p>
                    <p className="text-sm text-muted-foreground">{item.count} users</p>
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Sarah Johnson logged in', time: '2 hours ago' },
                { action: 'Lisa Rodriguez updated user permissions', time: '4 hours ago' },
                { action: 'Michael Chen logged in', time: '1 day ago' },
                { action: 'New user David Park created', time: '2 days ago' },
                { action: 'Emma Thompson logged in', time: '1 hour ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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

export default Users

