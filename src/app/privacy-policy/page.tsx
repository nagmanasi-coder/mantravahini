
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage();

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
        <p className="text-muted-foreground mt-2">Last updated: May 2024</p>
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
              Mantravaahini ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our mobile application and related services.
            </p>
            <p>
              By using Mantravaahini, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              2. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-foreground">A. Account Information</h3>
              <p>When you register, we collect your email address and display name via Firebase Authentication.</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground">B. Usage Data</h3>
              <p>We may collect information on how the service is accessed and used, such as shloka playback history and ad interaction events.</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground">C. Device & Ad IDs</h3>
              <p>Since we use Google AdMob, we may collect mobile advertising identifiers (like Android Advertising ID) to provide personalized advertisements.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              3. Use of Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our spiritual healing service.</li>
              <li>To notify you about changes to our app.</li>
              <li>To provide advertisements that support our free tier.</li>
              <li>To track subscription status and ad-free pass eligibility.</li>
              <li>To monitor the usage of our shlokas and mantras.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>We use third-party service providers to monitor and analyze the use of our service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Firebase (Google):</strong> Used for database management, user authentication, and storage.</li>
              <li><strong>Google AdMob:</strong> Used to display advertisements to free users.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>5. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="font-bold mt-2">Email: contact@mantravaahini.com</p>
            <p className="font-bold">Phone: +91 7022070287</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
