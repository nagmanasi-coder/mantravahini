"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Star } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function UpgradePage() {
  const { t } = useLanguage();
  const whatsAppUrl = "https://wa.me/917022070287";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const freeFeatures = [
    t('featurePainMantra'),
    t('featureLimitedPlays'),
  ];
  
  const premiumFeatures = [
    t('featureAllMantras'),
    t('featureUnlimitedPlays'),
    t('featureNewMantras'),
    t('featureOfflineAccess'),
    t('featureAiChatbot'),
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('upgradeTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('upgradeSubtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Free Plan */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{t('freePlanTitle')}</CardTitle>
                <CardDescription>{t('freePlanDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {isMounted && freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full" disabled>{t('currentPlan')}</Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-primary border-2 shadow-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <CardTitle className="font-headline text-3xl text-primary">{t('premiumPlanTitle')}</CardTitle>
                    <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <CardDescription className="text-xl font-bold text-accent">{t('premiumPlanPrice')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {isMounted && premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                 <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t('contactToActivate')}</p>
                    <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
                </div>
                <Button asChild className="w-full" size="lg">
                    <Link href={whatsAppUrl} target="_blank">
                        <WhatsAppIcon />
                        <span>{t('upgradeButton')}</span>
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('backButton')}
                </Link>
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
