'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sun, 
  Moon, 
  Bell,
  BarChart3,
  FileText,
  Users,
  CheckSquare,
  DollarSign,
  Settings,
  TrendingUp,
  Zap,
  ChevronLeft,
  Eye,
  EyeOff,
  ArrowUpRight,
  UserPlus,
  Target,
  Phone,
  PieChart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  CreditCard,
  Activity,
  Crown,
  Briefcase,
  Shield,
  Gauge,
  BarChart,
  Filter
} from 'lucide-react'

interface SidebarLayoutProps {
  children: React.ReactNode
}

interface SubMenuItem {
  label: string
  active?: boolean
  link?: string
}

interface QuickSummaryItem {
  icon: any
  label: string
  value: string
  color: string
  link?: string
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [showValues, setShowValues] = useState(true)
  const pathname = usePathname()

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }
  const toggleValues = () => setShowValues(!showValues)

  const menuItems = [
    { icon: FileText, label: 'Quotes', path: '/quotes', group: 'quotes' },
    { icon: Users, label: 'Users', path: '/users', group: 'users' },
    { icon: Zap, label: 'Integrations', path: '/integrations/api', group: 'integrations' }
  ]

  // Get current active group based on path
  const getCurrentGroup = () => {
    if (!pathname) return 'quotes'
    if (pathname.startsWith('/quotes')) return 'quotes'
    if (pathname === '/users') return 'users'
    if (pathname.startsWith('/integrations')) return 'integrations'
    return 'quotes'
  }

  // Get page-specific submenu and quick summary data
  const getPageData = (): { title: string; submenu: SubMenuItem[]; quickSummary: QuickSummaryItem[] } => {
    if (pathname && pathname.startsWith('/quotes')) {
      return {
        title: 'Quotes & Proposals',
        submenu: [
          { label: 'All Quotes', active: pathname === '/quotes', link: '/quotes' },
          { label: 'New Quote', active: false },
          { label: 'Quote History', active: pathname === '/quotes/history', link: '/quotes/history' },
          { label: 'Templates', active: false },
          { label: 'Compare Quotes', active: false }
        ],
        quickSummary: [
          { icon: FileText, label: 'Active Quotes', value: showValues ? '3' : '**', color: 'bg-blue-500' },
          { icon: Clock, label: 'Pending Proposals', value: showValues ? '3' : '*', color: 'bg-yellow-500' },
          { icon: CheckCircle, label: 'Won Quotes', value: showValues ? '0' : '**', color: 'bg-green-500' },
          { icon: DollarSign, label: 'Active Value', value: showValues ? '$1.110.000' : '****', color: 'bg-green-500' },
          { icon: PieChart, label: 'Win Rate', value: showValues ? '0.0%' : '**%', color: 'bg-purple-500' }
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
    
    // Default fallback to quotes
    return {
      title: 'Quotes & Proposals',
      submenu: [
        { label: 'All Quotes', active: true, link: '/quotes' },
        { label: 'New Quote', active: false },
        { label: 'Quote History', active: false, link: '/quotes/history' }
      ],
      quickSummary: [
        { icon: FileText, label: 'Active Quotes', value: showValues ? '18' : '**', color: 'bg-blue-500' },
        { icon: Clock, label: 'Pending Proposals', value: showValues ? '6' : '*', color: 'bg-yellow-500' },
        { icon: CheckCircle, label: 'Approved', value: showValues ? '12' : '**', color: 'bg-green-500' }
      ]
    }
  }

  const currentGroup = getCurrentGroup()
  const pageData = getPageData()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Two Column Layout */}
      <div className="flex bg-sidebar border-r border-sidebar-border">
        {/* Left Column - Icons Only */}
        <div className="w-16 flex flex-col border-r border-sidebar-border/50">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-sidebar-border/50">
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
                  className={`flex items-center justify-center w-12 h-12 mx-2 mb-2 rounded-lg transition-colors ${
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
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/50">
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
                    {item.link ? (
                      <Link
                        href={item.link}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          item.active 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className={`px-3 py-2 text-sm rounded-lg ${
                        item.active 
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
                  <Card key={index} className="bg-summaryCard border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-colors">
                    <CardContent className="p-3">
                      {item.link ? (
                        <Link href={item.link} className="flex items-center gap-3 group">
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
              onClick={toggleTheme}
              className="text-foreground"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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