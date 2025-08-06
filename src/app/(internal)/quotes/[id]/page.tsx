"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GeneralLiabilityQuoteDetails } from "../../../../components/features/GeneralLiabilityQuoteDetails";
import { Button, Card } from "../../../../components/ui";
import { useQuotes } from "@/hooks/useQuotes";
import { useTheme } from "../../../../hooks/useTheme";
import { CardContent } from "@/components/ui/card";
import { Flex, Typography } from "antd";
import { ArrowLeft } from "lucide-react";

const { Title } = Typography;

export default function QuoteDetailsPage() {
  const { isDark } = useTheme();
  const params = useParams();
  const router = useRouter();
  const quoteId = params?.id as string;
  const {
    getQuoteById,
    selectedQuote: quote,
    isLoadingQuote: loading,
  } = useQuotes();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quoteId) {
      setError("Quote ID is required");
      return;
    }

    getQuoteById(quoteId);
  }, [quoteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading Quote Details
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the quote information...
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 dark:text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Quote
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/quotes")}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-muted-foreground text-4xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Quote Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The quote with ID "{quoteId}" could not be found.
          </p>
          <button
            onClick={() => router.push("/quotes")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Quotes
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quote Details</h1>
            <p className="text-muted-foreground">
              View the details of the quote
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/quotes")}
            variant="secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Flex gap={16} className="pt-6">
        <GeneralLiabilityQuoteDetails quote={quote} quoteId={quoteId} />
        <Card className="w-1/4 h-min px-3 py-6 sticky top-0">
          <CardContent>
            <Title level={5}>Quote Actions</Title>
            <Flex gap={16} vertical className="pt-4">
              <Button>📋 Bind Policy</Button>
              <Button variant="secondary">📊 Compare Quotes</Button>
              <Button variant="secondary">📧 Email Quote</Button>
              <Button variant="secondary">🖨️ Print Quote</Button>
              <Button variant="secondary">📝 Edit Quote</Button>
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    </div>
  );
}
