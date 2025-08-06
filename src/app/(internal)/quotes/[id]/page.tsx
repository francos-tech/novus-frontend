'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GeneralLiabilityQuoteDetails } from '../../../../components/features/GeneralLiabilityQuoteDetails';
import { GeneralLiabilityQuote } from '../../../../types/general-liability-quote';
import { Card } from '../../../../components/ui';
import { useQuotes } from '@/hooks/useQuotes';

export default function QuoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params?.id as string;
  const { getQuoteById, selectedQuote: quote, isLoadingQuote: loading } = useQuotes();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quoteId) {
      setError('Quote ID is required');
      return;
    }

    getQuoteById(quoteId);

  }, [quoteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Quote Details</h2>
          <p className="text-gray-600">Please wait while we fetch the quote information...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Quote</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/quotes')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Back to Quotes
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
          <p className="text-gray-600 mb-4">
            The quote with ID "{quoteId}" could not be found.
          </p>
          <button
            onClick={() => router.push('/quotes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Quotes
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/quotes')}
                className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Quotes</span>
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-lg font-medium text-gray-900">Quote Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">ID:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {quoteId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <GeneralLiabilityQuoteDetails quote={quote} quoteId={quoteId} />
      </div>
    </div>
  );
}