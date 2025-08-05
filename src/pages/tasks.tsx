import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import MetricCard from '@/components/MetricCard'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User,
  Download,
  Bell,
  Plus,
  Search
} from 'lucide-react'

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('all')

  const tasks = [
    {
      id: 1,
      title: 'Risk assessment review',
      description: 'Review and approve risk assessment for Retail Dynamics Corp',
      lead: 'Retail Dynamics Corp',
      dueDate: 'Jan 22, 2025',
      assignee: 'Lisa Rodriguez',
      priority: 'Low',
      status: 'Completed',
      tags: ['risk-assessment', 'review']
    },
    {
      id: 2,
      title: 'Follow up with TechCorp Solutions',
      description: 'Call to discuss the Professional Liability quote terms and answer their questions about deductibles',
      lead: 'TechCorp Solutions',
      dueDate: 'Jan 24, 2025',
      assignee: 'Michael Chen',
      priority: 'High',
      status: 'Todo',
      tags: ['follow-up', 'quote']
    },
    {
      id: 3,
      title: 'Update CRM with client feedback',
      description: 'Document client feedback from yesterday\'s meeting and update opportunity status',
      lead: 'TechCorp Solutions',
      dueDate: 'Jan 24, 2025',
      assignee: 'Michael Chen',
      priority: 'Low',
      status: 'Todo',
      tags: ['crm', 'feedback']
    },
    {
      id: 4,
      title: 'Prepare Healthcare Partners proposal',
      description: 'Create detailed malpractice insurance proposal with coverage options and pricing',
      lead: 'Healthcare Partners LLC',
      dueDate: 'Jan 25, 2025',
      assignee: 'Sarah Martinez',
      priority: 'Medium',
      status: 'In Progress',
      tags: ['proposal', 'healthcare']
    },
    {
      id: 5,
      title: 'Prepare quarterly report',
      description: 'Compile Q1 performance metrics and client acquisition data',
      lead: null,
      dueDate: 'Jan 25, 2025',
      assignee: 'Emma Thompson',
      priority: 'Urgent',
      status: 'In Progress',
      tags: ['report', 'quarterly']
    },
    {
      id: 6,
      title: 'Policy renewal reminder - Global Manufacturing',
      description: 'Send renewal reminder and schedule meeting to discuss coverage updates',
      lead: 'Global Manufacturing Inc',
      dueDate: 'Jan 26, 2025',
      assignee: 'Emma Thompson',
      priority: 'Medium',
      status: 'Todo',
      tags: ['renewal', 'reminder']
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Todo': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTabCount = (status: string) => {
    switch (status) {
      case 'all': return tasks.length
      case 'my': return tasks.filter(task => task.assignee === 'Michael Chen').length
      case 'completed': return tasks.filter(task => task.status === 'Completed').length
      case 'overdue': return tasks.filter(task => task.priority === 'Urgent' || task.priority === 'High').length
      default: return 0
    }
  }

  const filteredTasks = (): any[] => {
    switch (activeTab) {
      case 'my': return tasks.filter(task => task.assignee === 'Michael Chen')
      case 'completed': return tasks.filter(task => task.status === 'Completed')
      case 'overdue': return tasks.filter(task => task.priority === 'Urgent' || task.priority === 'High')
      default: return tasks
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Follow-ups</h1>
          <p className="text-muted-foreground">Manage tasks, follow-ups, and action items for leads and clients</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Tasks
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminders
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('all')}
        >
          All Tasks ({getTabCount('all')})
        </Button>
        <Button
          variant={activeTab === 'my' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('my')}
        >
          My Tasks ({getTabCount('my')})
        </Button>
        <Button
          variant={activeTab === 'completed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('completed')}
        >
          Completed ({getTabCount('completed')})
        </Button>
        <Button
          variant={activeTab === 'overdue' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overdue')}
        >
          Overdue ({getTabCount('overdue')})
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tasks"
          value="6"
          icon={CheckSquare}
        />
        <MetricCard
          title="Completed"
          value="1"
          subtitle="17% completion rate"
          icon={CheckSquare}
        />
        <MetricCard
          title="Overdue"
          value="5"
          subtitle="Needs attention"
          icon={AlertTriangle}
        />
        <MetricCard
          title="My Tasks"
          value="2"
          icon={User}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tasks, descriptions, or tags..."
            className="pl-10"
          />
        </div>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>Priority</option>
          <option>Urgent</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>Assignee</option>
          <option>Michael Chen</option>
          <option>Lisa Rodriguez</option>
          <option>Sarah Martinez</option>
          <option>Emma Thompson</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>Status</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-md text-sm">
          <option>Sort by</option>
          <option>Due Date</option>
          <option>Priority</option>
          <option>Status</option>
          <option>Assignee</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks().map((task) => (
          <Card key={task.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{task.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {task.lead && (
                    <div>
                      <p className="text-sm text-muted-foreground">Lead:</p>
                      <p className="font-medium">{task.lead}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date:</p>
                    <p className="font-medium">{task.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assignee:</p>
                    <p className="font-medium">{task.assignee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority:</p>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                {task.status !== 'Completed' && (
                  <Button size="sm">
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { priority: 'Urgent', count: 1, percentage: 17 },
                { priority: 'High', count: 1, percentage: 17 },
                { priority: 'Medium', count: 2, percentage: 33 },
                { priority: 'Low', count: 2, percentage: 33 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <span className="text-sm">{item.count} tasks</span>
                  </div>
                  <span className="font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { assignee: 'Michael Chen', tasks: 2, completed: 0 },
                { assignee: 'Lisa Rodriguez', tasks: 1, completed: 1 },
                { assignee: 'Sarah Martinez', tasks: 1, completed: 0 },
                { assignee: 'Emma Thompson', tasks: 2, completed: 0 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.assignee}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.tasks} tasks • {item.completed} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.tasks > 0 ? Math.round((item.completed / item.tasks) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">completion</p>
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

export default Tasks

