
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, BookOpen, UserCheck, AlertCircle, ShieldAlert } from "lucide-react";
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
        <Card className="border-destructive border-2 bg-destructive/5 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-6 w-6" />
              IMPORTANT: MEDICAL DISCLAIMER
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-bold leading-relaxed text-destructive/90">
            <p>
              Mantravaahini is a spiritual and educational tool. The mantras, wellness protocols, and traditional methods provided are spiritual in nature and are <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or heard on this application.
            </p>
            <p>
              By using this app, you acknowledge that you are using these spiritual practices of your own free will and at your own risk.
            </p>
          </CardContent>
        </Card>

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
            <CardTitle>2. Content & Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              Our app contains sacred shlokas, mantras, and spiritual educational materials. All content, including but not limited to audio recordings, text, graphics, and logos, is the property of Mantravaahini or its content creators.
            </p>
            <p>
              You may not distribute, modify, transmit, reuse, download, or use said content for commercial purposes without express written permission from us.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertCircle className="h-5 w-5" />
              3. Service Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            The results of spiritual practices vary by individual and are not guaranteed. The app provides vibrational and sound-based support for wellness and does not claim to provide psychological or physical cures.
          </CardContent>
        </Card>
        
        <footer className="text-center pt-12">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Mantravaahini Legal Department</p>
        </footer>
      </div>
    </div>
  );
}
