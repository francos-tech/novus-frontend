"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Send, ArrowLeft } from "lucide-react";
import ContractorForm, { GeneralLiabilityRef } from "./ContractorForm";
import { Flex } from "antd";
import { Typography } from "antd";
import { useEffect, useRef } from "react";
import { useQuotes } from "@/hooks/useQuotes";

const { Title } = Typography;

export default function NewQuotePage() {
  const router = useRouter();
  const { isSubmittingQuote, submitQuote, lastSubmittedQuoteId, clearLastSubmittedQuoteId } = useQuotes();
  const formRef = useRef<GeneralLiabilityRef>(null);

  useEffect(() => {
    if (lastSubmittedQuoteId) {
      clearLastSubmittedQuoteId();
      router.push(`/quotes/${lastSubmittedQuoteId}`);
    }
  }, [lastSubmittedQuoteId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              General Liability Quote
            </h1>
            <p className="text-muted-foreground">
              Create a new insurance quote
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/quotes/new")}
            variant="secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Type Selection
          </Button>
        </div>
      </div>

      {/* Form Container */}
      <Flex gap={16}>
        <Card className="w-3/4">
          <CardContent className="pt-8">
            {/* React Form Component */}
            <ContractorForm
              ref={formRef}
              onSubmit={(v) => submitQuote({ quoteData: v })}
              onDraft={(v) => {}}
            />
          </CardContent>
        </Card>
        <Card className="w-1/4 h-min px-3 py-6 sticky top-0">
          <CardContent>
            <Title level={5}>Application Actions</Title>
            <Flex gap={16} vertical className="pt-4">
              <Button onClick={() => formRef.current?.submit()} disabled={isSubmittingQuote}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmittingQuote ? "Submitting..." : "Submit Quote"}
              </Button>
              <Button variant="secondary">
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Card className="bg-summarycard border-0">
                <CardContent className="p-5">
                  <Title level={5}>Important Instructions</Title>
                  <ul className="list-disc list-inside text-sm justify-start text-stone-500">
                    <li className="mb-2">
                      Answer all question completely and accurately.
                    </li>
                    <li>Incomplete applications may be discarded.</li>
                  </ul>
                </CardContent>
              </Card>
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    </div>
  );
}
