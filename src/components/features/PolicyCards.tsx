import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuoteHistoryItem } from '@/types/general-liability-quote';
import { 
  Shield, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Building, 
  Eye, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface PolicyCardsProps {
  quotes: QuoteHistoryItem[];
  onViewDetails?: (quoteId: string) => void;
  onDownloadQuote?: (quoteId: string) => void;
}

export function PolicyCards({ quotes, onViewDetails, onDownloadQuote }: PolicyCardsProps) {
  const formatCurrency = (amount: string | number) => {
    if (!amount || amount === '0') return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'quoted':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'pending':
      case 'new':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'authority':
      case 'under_review':
        return <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Shield className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'quoted':
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'pending':
      case 'new':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'authority':
      case 'under_review':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Filter quotes that have GeneralLiabilityQuote response data
  const policyQuotes = quotes.filter(quote => quote.response_data?.cnfPolicyService);

  if (policyQuotes.length === 0) {
      return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Shield className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">No Policy Quotes Available</h3>
      <p className="text-muted-foreground max-w-md">
        Policy cards will appear here when quotes receive responses from insurance carriers with detailed policy information.
      </p>
    </div>
  );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {policyQuotes.map((quote) => {
        const policyData = quote.response_data!.cnfPolicyService;
        const header = policyData.cnfPolicyHeader;
        const data = policyData.cnfPolicyData.data;
        const account = data.account;
        const policy = data.policy;
        
        // Normalize risk data to always be an array for consistent handling
        const risks = Array.isArray(policy.line.risk) ? policy.line.risk : [policy.line.risk];
        const primaryRisk = risks[0]; // Use first risk for card display

        return (
          <Card key={quote.id} className="hover:shadow-lg bg-summarycard transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">
                    {account.Name || 'Unknown Company'}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(header.Status)}
                    <Badge className={`text-xs ${getStatusColor(header.Status)}`}>
                      {header.Status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span>Quote #{header.CNFQuoteNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{account.location.address.City}, {account.location.address.State}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Premium Information */}
              <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Policy Premium</span>
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(policy.PolicyPremium)}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  GL Premium: {formatCurrency(policy.line.GLPremium)}
                </div>
              </div>

              {/* Coverage Limits */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Coverage Limits</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Per Occurrence:</span>
                    <div className="font-medium text-foreground">{formatCurrency(policy.line.PolicyPerOccurenceLimit)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aggregate:</span>
                    <div className="font-medium text-foreground">{formatCurrency(policy.line.PolicyAggregateLimit)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Products/Ops:</span>
                    <div className="font-medium text-foreground">{formatCurrency(policy.line.ProductCompletedOperationLimit)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Medical:</span>
                    <div className="font-medium text-foreground">{formatCurrency(policy.line.MedicalLimit)}</div>
                  </div>
                </div>
              </div>

              {/* Business Classification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Business Details</h4>
                  {risks.length > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      +{risks.length - 1} more
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {primaryRisk.ClassDescription}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    <span>Class Code: {primaryRisk.GLClassCode}</span>
                    <span className="mx-2">•</span>
                    <span>Exposure: {formatCurrency(primaryRisk.Exposure)}</span>
                  </div>
                  {risks.length > 1 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Total Exposure: {formatCurrency(risks.reduce((sum, r) => sum + parseFloat(r.Exposure), 0).toString())}
                    </div>
                  )}
                </div>
              </div>

              {/* Policy Period */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(policy.EffectiveDate)} - {formatDate(policy.ExpirationDate)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => onViewDetails?.(quote.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDownloadQuote?.(quote.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}