'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sun, 
  Moon, 
  Bell,
  FileText,
  Users,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Zap,
  ChevronLeft,
  Eye,
  EyeOff,
  ArrowUpRight,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield,
  Clock,
  Receipt,
  BarChart3,
  Target
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useQuotes } from '@/hooks/useQuotes'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme, isDark } = useTheme()
  const [showValues, setShowValues] = useState(true)
  const { totalQuotes } = useQuotes()
  const pathname = usePathname()
  
  // Check if we're on a public route that should render without the full layout
  const isPublicRoute = pathname === '/contractor-form' || (pathname && pathname.startsWith('/public/'))

  const toggleValues = () => setShowValues(!showValues)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const menuItems = [
    // { icon: BarChart3, label: 'Dashboard', path: '/dashboard', group: 'dashboard' },
    { icon: FileText, label: 'Quotes', path: '/quotes', group: 'quotes' },
    // { icon: Users, label: 'Users', path: '/users', group: 'users' },
    // { icon: Zap, label: 'Integrations', path: '/integrations/api', group: 'integrations' },
    // { icon: CheckSquare, label: 'Tasks', path: '/tasks', group: 'tasks' },
    // { icon: DollarSign, label: 'Finance', path: '/finance/overview', group: 'finance' },
    // { icon: TrendingUp, label: 'Productivity', path: '/productivity/roi', group: 'productivity' }
  ]

  // Get current active group based on path
  const getCurrentGroup = () => {
    if (!pathname) return 'dashboard'
    if (pathname === '/dashboard') return 'dashboard'
    if (pathname.startsWith('/quotes')) return 'quotes'
    if (pathname === '/users') return 'users'
    if (pathname.startsWith('/integrations')) return 'integrations'
    if (pathname === '/tasks') return 'tasks'
    if (pathname.startsWith('/finance')) return 'finance'
    if (pathname.startsWith('/productivity')) return 'productivity'
    return 'dashboard'
  }

  // Get page-specific submenu and quick summary data
  const getPageData = () => {
    if (pathname === '/dashboard') {
      return {
        title: 'Dashboard',
        submenu: [
          { label: 'Overview', active: true },
          { label: 'Analytics', active: false },
          { label: 'Reports', active: false },
          { label: 'Settings', active: false }
        ],
        quickSummary: [
          { icon: FileText, label: 'Total Quotes', value: showValues ? '847' : '**', color: 'bg-blue-500' },
          { icon: CheckCircle, label: 'Conversions', value: showValues ? '542' : '**', color: 'bg-green-500' },
          { icon: DollarSign, label: 'Revenue', value: showValues ? '****' : '****', color: 'bg-green-500' },
          { icon: Users, label: 'Active Leads', value: showValues ? '156' : '**', color: 'bg-purple-500' }
        ]
      }
    }
    
    if (pathname && pathname.startsWith('/quotes')) {
      return {
        title: 'Quotes & Proposals',
        submenu: [
          { label: 'All Quotes', active: pathname === '/quotes', link: '/quotes' },
          { label: 'New Quote', active: pathname === '/quotes/new', link: '/quotes/new' },
          // { label: 'Quote History', active: pathname === '/quotes/history', link: '/quotes/history' },
          // { label: 'Templates', active: false },
          // { label: 'Compare Quotes', active: false }
        ],
        quickSummary: [
          { icon: FileText, label: 'Active Quotes', value: showValues ? totalQuotes : '**', color: 'bg-blue-500' },
          { icon: Users, label: 'Leads', value: showValues ? '0' : '**', color: 'bg-purple-500' },
          { icon: CheckSquare, label: 'Tasks', value: showValues ? '0' : '**', color: 'bg-green-500' },
          { icon: DollarSign, label: 'Finance', value: showValues ? '0' : '****', color: 'bg-green-500' },
          { icon: TrendingUp, label: 'ROI', value: showValues ? '0%' : '**%', color: 'bg-orange-500' }
        ]
      }
    }
    
    if (pathname === '/users') {
      return {
        title: 'User Management',
        submenu: [
          { label: 'All Users', active: true },
          { label: 'Add User', active: false },
          { label: 'User Roles', active: false },
          { label: 'Permissions', active: false },
          { label: 'Activity Log', active: false }
        ],
        quickSummary: [
          { icon: Users, label: 'Total Users', value: showValues ? '15' : '**', color: 'bg-blue-500' },
          { icon: UserPlus, label: 'New This Month', value: showValues ? '3' : '*', color: 'bg-green-500' },
          { icon: Shield, label: 'Admin Users', value: showValues ? '4' : '*', color: 'bg-purple-500' },
          { icon: Activity, label: 'Active Sessions', value: showValues ? '8' : '*', color: 'bg-orange-500' }
        ]
      }
    }
    
    if (pathname && pathname.startsWith('/integrations')) {
      return {
        title: 'APIs & Integrations',
        submenu: [
          { label: 'API Settings', active: pathname === '/integrations/api', link: '/integrations/api' },
          { label: 'Test APIs', active: pathname === '/test-apis', link: '/test-apis' },
          { label: 'Webhooks', active: false },
          { label: 'API Logs', active: false },
          { label: 'Rate Limits', active: false }
        ],
        quickSummary: [
          { icon: Zap, label: 'Active APIs', value: showValues ? '8' : '*', color: 'bg-blue-500' },
          { icon: CheckCircle, label: 'Healthy', value: showValues ? '7' : '*', color: 'bg-green-500' },
          { icon: AlertTriangle, label: 'Issues', value: showValues ? '1' : '*', color: 'bg-red-500' },
          { icon: Activity, label: 'Requests/min', value: showValues ? '**' : '**', color: 'bg-purple-500' }
        ]
      }
    }
    
    if (pathname === '/tasks') {
      return {
        title: 'Task Management',
        submenu: [
          { label: 'All Tasks', active: true },
          { label: 'My Tasks', active: false },
          { label: 'Completed', active: false },
          { label: 'Overdue', active: false },
          { label: 'Create Task', active: false }
        ],
        quickSummary: [
          { icon: CheckSquare, label: 'Total Tasks', value: showValues ? '24' : '**', color: 'bg-blue-500' },
          { icon: Clock, label: 'Pending', value: showValues ? '8' : '*', color: 'bg-yellow-500' },
          { icon: CheckCircle, label: 'Completed', value: showValues ? '12' : '*', color: 'bg-green-500' },
          { icon: AlertTriangle, label: 'Overdue', value: showValues ? '4' : '*', color: 'bg-red-500' }
        ]
      }
    }
    
    if (pathname && pathname.startsWith('/finance')) {
      return {
        title: 'Finance Overview',
        submenu: [
          { label: 'Overview', active: pathname === '/finance/overview', link: '/finance/overview' },
          { label: 'Transactions', active: false },
          { label: 'Reports', active: false },
          { label: 'Budget', active: false },
          { label: 'Taxes', active: false }
        ],
        quickSummary: [
          { icon: DollarSign, label: 'Revenue', value: showValues ? '$312K' : '****', color: 'bg-green-500' },
          { icon: Receipt, label: 'Expenses', value: showValues ? '$216K' : '****', color: 'bg-red-500' },
          { icon: TrendingUp, label: 'Profit', value: showValues ? '$96K' : '****', color: 'bg-blue-500' },
          { icon: BarChart3, label: 'Margin', value: showValues ? '30.8%' : '**%', color: 'bg-purple-500' }
        ]
      }
    }
    
    if (pathname && pathname.startsWith('/productivity')) {
      return {
        title: 'Productivity & ROI',
        submenu: [
          { label: 'ROI Analysis', active: pathname === '/productivity/roi', link: '/productivity/roi' },
          { label: 'Performance', active: false },
          { label: 'Efficiency', active: false },
          { label: 'Reports', active: false },
          { label: 'Goals', active: false }
        ],
        quickSummary: [
          { icon: TrendingUp, label: 'ROI', value: showValues ? '18.3%' : '**%', color: 'bg-green-500' },
          { icon: BarChart3, label: 'Efficiency', value: showValues ? '85%' : '**%', color: 'bg-blue-500' },
          { icon: Target, label: 'Goals', value: showValues ? '12/15' : '**/**', color: 'bg-purple-500' },
          { icon: Activity, label: 'Performance', value: showValues ? '92%' : '**%', color: 'bg-orange-500' }
        ]
      }
    }
    
    // Default fallback to quotes
    return {
      title: 'Quotes & Proposals',
      submenu: [
        { label: 'All Quotes', active: true, link: '/quotes' },
        { label: 'New Quote', active: false },
        { label: 'Quote History', active: false, link: '/quotes/history' }
      ],
      quickSummary: [
        { icon: FileText, label: 'Active Quotes', value: showValues ? '24' : '**', color: 'bg-blue-500' },
        { icon: Users, label: 'Leads', value: showValues ? '42' : '**', color: 'bg-purple-500' },
        { icon: CheckSquare, label: 'Tasks', value: showValues ? '8' : '**', color: 'bg-green-500' },
        { icon: DollarSign, label: 'Finance', value: showValues ? '****' : '****', color: 'bg-green-500' },
        { icon: TrendingUp, label: 'ROI', value: showValues ? '**%' : '**%', color: 'bg-orange-500' }
      ]
    }
  }

  const currentGroup = getCurrentGroup()
  const pageData = getPageData()

  // If it's a public route, render without sidebar
  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Two Column Layout */}
      <div className="flex bg-sidebar border-r border-sidebar-border">
        {/* Left Column - Icons Only */}
        <div className="w-20 flex flex-col border-r-2 border-sidebar-border/50">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
          </div>
          
          {/* Icon Menu */}
          <nav className="flex-1 py-4">
            {menuItems.map((item, index) => {
              const isActive = currentGroup === item.group
              
              return (
                <Link
                  key={index}
                  href={item.path}
                  className={`flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Column - Submenu and Quick Summary */}
        <div className="w-64 flex flex-col">
          {/* Header with title and back arrow */}
          <div className="h-16 flex items-center justify-between px-4">
            <h2 className="font-semibold text-sidebar-foreground">{pageData.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-sidebar-foreground/60 hover:bg-sidebar-accent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Submenu */}
          {pageData.submenu.length > 0 && (
            <div className="px-4 py-4 border-b border-sidebar-border/50">
              <div className="space-y-1">
                {pageData.submenu.map((item, index) => (
                  <div key={index}>
                    {(item as any).link ? (
                      <Link
                        href={(item as any).link}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          (item as any).active 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className={`px-3 py-2 text-sm rounded-lg ${
                        (item as any).active 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                          : 'text-sidebar-foreground/80'
                      }`}>
                        {item.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Summary */}
          {pageData.quickSummary.length > 0 && (
            <div className="flex-1 px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide">
                  QUICK SUMMARY
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleValues}
                  className="w-5 h-5 text-sidebar-foreground/60 hover:bg-sidebar-accent"
                >
                  {showValues ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
              </div>
              
              <div className="space-y-3">
                {pageData.quickSummary.map((item, index) => (
                  <Card key={index} className="bg-summarycard px-2 py-3 border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-colors rounded-xl">
                    <CardContent className="p-3">
                      {(item as any).link ? (
                        <Link href={(item as any).link} className="flex items-center gap-3 group">
                          <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-sidebar-foreground">{item.label}</p>
                            <p className="text-sm font-bold text-sidebar-foreground">{item.value}</p>
                          </div>
                          <ArrowUpRight className="w-3 h-3 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60 transition-colors" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-sidebar-foreground">{item.label}</p>
                            <p className="text-sm font-bold text-sidebar-foreground">{item.value}</p>
                          </div>
                          <ArrowUpRight className="w-3 h-3 text-sidebar-foreground/40" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-foreground"></span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="text-foreground"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 