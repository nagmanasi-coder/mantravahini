"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Shield, Sparkles, Check } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

const PranaVidyaPageSkeleton = () => (
  <div className="relative flex min-h-screen flex-col">
    <main className="flex-1">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto mt-4" />
        </header>
        <div className="space-y-8">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="aspect-video w-full max-w-md mx-auto" />
              <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
);


export default function PranaVidyaPage() {
  const { t } = useLanguage();
  const whatsAppMessage = "Hello! I'm interested in Prana Vidya activation. Please help me.";
  const whatsAppUrl = `https://wa.me/917022070287?text=${encodeURIComponent(whatsAppMessage)}`;
  const pranaImage = PlaceHolderImages.find(img => img.id === 'hanuman-healing');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <PranaVidyaPageSkeleton />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('pranaVidyaTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
             {t('pranaVidyaSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            <Card className="overflow-hidden shadow-xl border-2 border-primary">
              <CardHeader className="bg-primary/5">
                <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
                   <Zap className="h-8 w-8" />
                   {t('hanumanPranaTherapyTitle')}
                </CardTitle>
                <CardDescription className="text-center font-bold">
                  {t('untimelyDeathTitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-xl border shadow-inner">
                  {pranaImage && <Image
                    src={pranaImage.imageUrl}
                    alt={pranaImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={pranaImage.imageHint}
                  />}
                </div>
                <div className="text-center text-muted-foreground space-y-4">
                  <p className="font-medium text-foreground">{t('pranaInfo1')}</p>
                  <p>{t('pranaInfo2')}</p>
                </div>

                <div className="my-6 rounded-md border border-primary/20 bg-primary/5 p-6 text-center shadow-sm">
                   <p className="font-headline text-xl font-bold text-primary">{t('hanumanDoha')}</p>
                   <p className="mt-2 text-sm italic text-muted-foreground">
                     {t('hanumanDohaMeaning')}
                   </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-secondary/50 border-none shadow-none">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                {t('pranaTherapyFee')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-muted-foreground">{t('pranaTherapyFeeDetails')}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-primary">
                                <Sparkles className="h-4 w-4" />
                                {t('freePranaTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            <p className="flex items-start text-[10px] font-bold">
                                <Check className="mr-1 h-3 w-3 text-green-600 shrink-0" />
                                <span>{t('freePranaCondition1')}</span>
                            </p>
                            <p className="flex items-start text-[10px] font-bold">
                                <Check className="mr-1 h-3 w-3 text-green-600 shrink-0" />
                                <span>{t('freePranaCondition2')}</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center pt-4">
                   <p className="font-black text-primary animate-pulse">{t('pranaContact')}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-6">
                <div className="text-center">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">{t('contact')}:</p>
                  <p className="font-black text-2xl text-primary tracking-tighter">7022070287, {t('hosadurga')}</p>
                </div>
                <Button asChild size="lg" className="h-14 px-8 font-black text-lg">
                  <Link href={whatsAppUrl} target="_blank">
                    <WhatsAppIcon />
                    {t('contactOnWhatsApp')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="ghost" className="text-muted-foreground">
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