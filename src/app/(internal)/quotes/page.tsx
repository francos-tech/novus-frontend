'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MetricCard from '@/components/ui/MetricCard'
import { PolicyCards } from '@/components/features/PolicyCards'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Shield
} from 'lucide-react'
import { useQuotes } from '@/hooks/useQuotes'

export default function QuotesPage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState('policies')
  const { getQuoteHistory, quoteHistory, isLoadingQuoteHistory, totalQuotes } = useQuotes()

  useEffect(() => {
    getQuoteHistory({
      page: 1,
      limit: 10,
    });
  }, [])

  if (isLoadingQuoteHistory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quotes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Active Quotes"
          value={totalQuotes.toString()}
          subtitle="In progress"
          icon={Clock}
        />
        <MetricCard
          title="Won Quotes"
          value="0"
          subtitle={`0% win rate`}
          icon={CheckCircle}
        />
        <MetricCard
          title="Lost Quotes"
          value="0"
          subtitle="Closed lost"
          icon={XCircle}
        />
        <MetricCard
          title="Active Value"
          value="0"
          subtitle="Pipeline value"
          icon={TrendingUp}
        />
        <MetricCard
          title="Won Value"
          value="0"
          subtitle="Revenue closed"
          icon={DollarSign}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveView('policies')}
            >
              <Shield className="w-4 h-4 mr-1" />
              Policy Quotes
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Cards</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed policy information for quotes that have received responses from insurance carriers
          </p>
        </CardHeader>
        <CardContent>
          {activeView === 'policies' && (
            <div>
              <PolicyCards 
                quotes={quoteHistory}
                onViewDetails={(quoteId) => {
                  router.push(`/quotes/${quoteId}`)
                }}
                onDownloadQuote={(quoteId) => {
                  alert(`Download functionality for quote ${quoteId} will be implemented soon.`);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 