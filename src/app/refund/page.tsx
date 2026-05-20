
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <header className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backButton')}
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
          <RotateCcw className="h-8 w-8" />
          {t('refundPolicy')}
        </h1>
        <p className="text-muted-foreground mt-2">Effective Date: May 2024</p>
      </header>

      <div className="space-y-8 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>1. Digital Content Nature</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            Mantravaahini provides digital content (audio mantras, shlokas, and courses). Once a subscription is activated or digital content is accessed, we generally do not offer refunds due to the immediate nature of digital consumption.
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              2. Subscription Cancellations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-amber-900">
            You may cancel your subscription at any time. Your access will continue until the end of the current billing cycle. No partial refunds will be provided for the remaining days in a cycle.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              3. Exceptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>Refunds may be considered in the following rare cases:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Technical errors that prevent access to paid content for more than 48 hours.</li>
              <li>Duplicate accidental charges for the same subscription period.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. How to Request</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            To request a refund under the exception criteria, please email us with your User ID (found in your profile menu) and a screenshot of your payment receipt.
            <p className="font-bold mt-4">Contact: 7022070287 / contact@mantravaahini.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
