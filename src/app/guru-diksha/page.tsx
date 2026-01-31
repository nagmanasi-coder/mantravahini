
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Sparkles, Footprints, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const GuruDikshaPageSkeleton = () => (
  <div className="relative flex min-h-screen flex-col">
    <main className="flex-1">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto mt-4" />
        </header>
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center items-center h-48">
                  <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-1/3 mx-auto mt-8" />
            </CardContent>
          </Card>
          <Separator />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Skeleton className="h-8 w-1/4 mx-auto" />
              <Skeleton className="h-4 w-1/3 mx-auto" />
              <div className="pt-4">
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
          <Separator />
          <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3 mx-auto" />
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-5/6 mx-auto" />
            </CardContent>
          </Card>
           <Separator />
          <Card>
            <CardHeader>
                <Skeleton className="h-8 w-2/3 mx-auto" />
            </CardHeader>
            <CardContent className="text-center">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
);


export default function GuruDikshaPage() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const freeConditions = [
    t('guruDikshaFreeCondition1'),
    t('guruDikshaFreeCondition2'),
  ];

  if (!isMounted) {
    return <GuruDikshaPageSkeleton />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('guruDikshaTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('guruDikshaSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center items-center h-48">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping"></div>
                        <div className="relative flex items-center justify-center rounded-full bg-primary h-24 w-24 shadow-lg">
                            <Sparkles className="h-12 w-12 text-primary-foreground" />
                        </div>
                    </div>
                </div>
                <p className="mt-8 font-semibold text-foreground">
                  {t('guruDikshaComingSoon')}
                </p>
              </CardContent>
            </Card>

            <Separator />
            
            {/* Fee Information Card */}
            <Card className="border-primary border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center text-primary">{t('guruDikshaFeeTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-2xl font-bold text-accent">{t('guruDikshaFee')}</p>
                <p className="text-muted-foreground">{t('guruDikshaMode')}</p>
                 <Card className="bg-secondary/50 mt-4">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-center">{t('guruDikshaFreeConditionsTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-left">
                        {freeConditions.map((condition, index) => (
                             <p key={index} className="flex items-start">
                                <Check className="mr-2 mt-1 h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-muted-foreground">{condition}</span>
                            </p>
                        ))}
                    </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-center">{t('guruMantraTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="font-headline text-xl whitespace-pre-line text-primary">{t('guruMantra')}</p>
                <p className="text-muted-foreground">{t('guruMantraMeaning')}</p>
              </CardContent>
            </Card>

            <Separator />

            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                  <Footprints className="h-6 w-6 text-primary" />
                  {t('guruDikshaNathaTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-foreground">
                <p>{t('guruDikshaNathaContent')}</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
