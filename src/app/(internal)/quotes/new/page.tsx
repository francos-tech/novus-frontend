"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Send, Link, ArrowLeft, Shield } from "lucide-react";
import { Flex } from "antd";
import { Typography } from "antd";

const { Title } = Typography;

export default function NewQuotePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">New Quote Submission</h1>
            <p className="text-muted-foreground">
              Select the type of insurance quote you want to create
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <Flex gap={16}>
        <Card className="w-1/3 h-min px-3 pt-6 pb-3 sticky top-0">
          <CardContent>
            <Title level={4} className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-primary" />
              General Liability
            </Title>
            <p className="text-sm my-5 text-muted-foreground">
              General Liability is a type of insurance that protects businesses
              from financial losses due to bodily injury or property damage
              caused by their employees or products.
            </p>
            <Button
              onClick={() => router.push("/quotes/new/general-liability")}
              className="w-full mt-4"
            >
              Select this type
            </Button>
          </CardContent>
        </Card>
      </Flex>
    </div>
  );
}
