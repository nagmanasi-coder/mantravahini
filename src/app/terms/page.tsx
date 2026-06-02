
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, BookOpen, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
          <Scale className="h-8 w-8" />
          {t('termsOfService')}
        </h1>
        <p className="text-muted-foreground mt-2">Effective Date: May 2024</p>
      </header>

      <div className="space-y-8 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            By accessing or using the Mantravaahini application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              2. User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Content & Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              Our app contains sacred shlokas, mantras, and educational materials. All content, including but not limited to audio recordings, text, graphics, and logos, is the property of Mantravaahini or its content creators.
            </p>
            <p>
              You may not distribute, modify, transmit, reuse, download, or use said content for commercial purposes without express written permission from us.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              5. Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs italic leading-relaxed text-muted-foreground">
            The healing mantras and therapies provided are spiritual in nature and should not be considered a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
