import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Menu, 
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
  Home,
  Filter,
  UserPlus,
  Briefcase,
  BookOpen,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Activity,
  Bookmark,
  Search,
  Crown,
  Shield,
  Phone,
  PieChart,
  Gauge,
  BarChart,
  Calendar
} from 'lucide-react'

const Layout = ({ children }) => {
  const { theme, setTheme } = useTheme()
  const [showValues, setShowValues] = useState(true)
  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  const toggleValues = () => setShowValues(!showValues)

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/', group: 'dashboard' },
    { icon: FileText, label: 'Quotes', path: '/quotes', group: 'quotes' },
    { icon: Filter, label: 'CRM', path: '/crm/leads', group: 'crm' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', group: 'tasks' },
    { icon: DollarSign, label: 'Finance', path: '/finance/overview', group: 'finance' },
    { icon: Users, label: 'Users', path: '/users', group: 'users' },
    { icon: TrendingUp, label: 'Productivity', path: '/productivity/roi', group: 'productivity' },
    { icon: Zap, label: 'Integrations', path: '/integrations/api', group: 'integrations' }
  ]

  // Get current active group based on path
  const getCurrentGroup = () => {
    const path = location.pathname
    if (path === '/') return 'dashboard'
    if (path.startsWith('/quotes')) return 'quotes'
    if (path.startsWith('/crm')) return 'crm'
    if (path === '/tasks') return 'tasks'
    if (path.startsWith('/finance')) return 'finance'
    if (path === '/users') return 'users'
    if (path.startsWith('/productivity')) return 'productivity'
    if (path.startsWith('/integrations')) return 'integrations'
    return 'dashboard'
  }

  // Get page-specific submenu and quick summary data
  const getPageData = () => {
    const path = location.pathname
    
    if (path === '/' || path === '/quotes') {
      return {
        title: 'Quotes & Proposals',
        submenu: [
          { label: 'All Quotes', active: true },
          { label: 'New Quote' },
          { label: 'Quote History', link: '/quotes/history' }
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
    
    // Default fallback
    return {
      title: 'Dashboard',
      submenu: [],
      quickSummary: []
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
                  to={item.path}
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
                        to={item.link}
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
                        <Link to={item.link} className="flex items-center gap-3 group">
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
            <span className="font-semibold text-foreground">Novus Underwriters</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

