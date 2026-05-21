
"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Shield, Sparkles, Check, Crown, Flame, HeartPulse, AlertCircle, Video, Users, Home as HomeIcon } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

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
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ isPranaPractitioner?: boolean }>(userDocRef);
  const isPractitioner = !!userProfile?.isPranaPractitioner;

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

  const levels = [
    {
        id: 1,
        title: t('pranaLevel1Title'),
        description: t('pranaLevel1Desc'),
        fee: t('pranaLevel1Fee'),
        icon: <Zap className="h-6 w-6 text-primary" />,
        color: "border-primary/50",
    },
    {
        id: 2,
        title: t('pranaLevel2Title'),
        description: t('pranaLevel2Desc'),
        fee: t('pranaLevel2Fee'),
        icon: <HeartPulse className="h-6 w-6 text-green-500" />,
        color: "border-green-500/50",
    },
    {
        id: 3,
        title: t('pranaLevel3Title'),
        description: t('pranaLevel3Desc'),
        fee: t('pranaLevel3Fee'),
        icon: <AlertCircle className="h-6 w-6 text-red-500" />,
        color: "border-red-500/50",
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('pranaVidyaTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
             {t('pranaVidyaSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            {/* Lineage & Authority Card */}
            <Card className="bg-primary/5 border-primary/20 shadow-md">
              <CardContent className="p-6 text-center space-y-4">
                 <div className="flex justify-center gap-4 mb-2">
                    <Crown className="h-8 w-8 text-amber-500" />
                    <Flame className="h-8 w-8 text-primary" />
                 </div>
                 <p className="font-headline text-xl font-bold text-foreground leading-relaxed">
                   {t('pranaLineage')}
                 </p>
                 <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    <span>Guru Gorakhnath</span>
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span>Mahavatar Babaji</span>
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span>Lord Hanuman</span>
                 </div>
              </CardContent>
            </Card>

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
                
                {/* Levels Grid */}
                <div className="grid gap-4">
                    {levels.map((level) => (
                        <div key={level.id} className={cn("bg-muted/50 p-4 rounded-xl border-2 border-dashed space-y-2", level.color)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {level.icon}
                                    <h3 className="font-headline text-xl font-bold text-primary">{level.title}</h3>
                                </div>
                            </div>
                            <p className="font-bold text-muted-foreground text-sm">{level.description}</p>
                            <p className="text-sm font-black text-accent">{level.fee}</p>
                        </div>
                    ))}
                </div>

                {/* Level 1 Practitioner Guide Section - ONLY VISIBLE TO LOGGED IN PRACTITIONERS */}
                {isPractitioner && (
                  <Card className="border-accent border-2 bg-accent/5 shadow-inner animate-fade-in">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-accent flex items-center gap-2 font-headline text-2xl">
                              <Sparkles className="h-6 w-6" />
                              {t('practitionerGuideTitle')}
                          </CardTitle>
                          <CardDescription className="font-bold text-accent/80">
                              {t('practitionerGuideSubtitle')}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="space-y-3">
                              <div className="flex gap-3 items-start p-3 bg-white/50 rounded-lg border border-accent/20 transition-all hover:shadow-md">
                                  <HomeIcon className="h-5 w-5 text-accent shrink-0 mt-1" />
                                  <p className="text-sm font-bold text-foreground leading-relaxed">
                                      {t('practitionerStep1')}
                                  </p>
                              </div>
                              <div className="flex gap-3 items-start p-3 bg-white/50 rounded-lg border border-accent/20 transition-all hover:shadow-md">
                                  <Users className="h-5 w-5 text-accent shrink-0 mt-1" />
                                  <p className="text-sm font-bold text-foreground leading-relaxed">
                                      {t('practitionerStep2')}
                                  </p>
                              </div>
                              <div className="flex gap-3 items-start p-3 bg-white/50 rounded-lg border border-accent/20 transition-all hover:shadow-md">
                                  <Video className="h-5 w-5 text-accent shrink-0 mt-1" />
                                  <p className="text-sm font-bold text-foreground leading-relaxed">
                                      {t('practitionerStep3')}
                                  </p>
                              </div>
                          </div>
                      </CardContent>
                      <CardFooter className="bg-accent/10 py-3 text-center justify-center">
                          <p className="text-[10px] uppercase font-black tracking-widest text-accent italic">Divine Healer's Mission</p>
                      </CardFooter>
                  </Card>
                )}

                <div className="text-center text-muted-foreground text-sm space-y-3 pt-4">
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
