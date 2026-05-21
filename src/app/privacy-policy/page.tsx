
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Info } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="h-8 w-8" />
          {t('privacyPolicy')}
        </h1>
        <p className="text-muted-foreground mt-2">Last updated: June 2024</p>
      </header>

      <div className="space-y-8 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              1. Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              Mantravaahini ("we", "our", or "us") is dedicated to your spiritual privacy. This policy explains how we collect, use, and safeguard your data when using the Mantravaahini APK or web services.
            </p>
            <p>
              By using our services, you consent to the data practices described in this statement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              2. Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-foreground">A. Authentication</h3>
              <p>We use Firebase Auth to manage your account via email or anonymous tokens.</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground">B. Spiritual Progress</h3>
              <p>We store your practitioner level and referral lineage to manage the Prana Vidya hierarchy.</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground">C. Advertisements</h3>
              <p>We use Google AdMob. AdMob may collect and use personal data for its own purposes. You can find more about AdMob's data collection in the Google Privacy Policy.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              3. Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              We implement industry-standard Firestore Security Rules to ensure only you can access your private profile data. Testimonials and videos submitted by practitioners are stored in secure Firebase Storage buckets.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              4. Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>For data removal requests or privacy queries, contact our nodal officer:</p>
            <p className="font-bold mt-2">Email: privacy@mantravaahini.com</p>
            <p className="font-bold">WhatsApp: +91 7022070287</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
