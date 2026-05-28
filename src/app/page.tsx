
"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { StandaloneAudioPlayer } from "@/app/components/standalone-audio-player";
import { mantras } from "@/lib/mantras";
import { InterstitialAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, Heart, Share2, Users, ArrowRight, Zap, PlayCircle, Flame, Compass, Lock, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UpgradeDialog } from "@/app/components/upgrade-dialog";
import { useLanguage } from "@/context/language-context";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, addDoc, collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function Home() {
  // Destructure with safe default to prevent ReferenceError
  const { t, language = 'kn' } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { checkAndNotifyPainMantraReminder } = useNotifications();
  
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeDialogContent, setUpgradeDialogContent] = useState({ title: "", description: "" });
  const [showJoinGroupDialog, setShowJoinGroupDialog] = useState(false);

  // Energy Boost State
  const [showBoostAd, setShowBoostAd] = useState(false);
  const [boostExpiry, setBoostExpiry] = useState<string | null>(null);
  const [boostProgress, setBoostProgress] = useState(0);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const devMode = typeof window !== 'undefined' ? localStorage.getItem('developerMode') === 'true' : false;
    setIsDevMode(devMode);
  }, []);

  const isDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
  const isAuthorized = isDeveloper && isDevMode;

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ 
    referralCode?: string, 
    subscriptionTier?: 'free' | 'premium',
    streakCount?: number,
    lastStreakUpdate?: string
  }>(userDocRef);

  const isPaidUser = userProfile?.subscriptionTier === 'premium';
  
  // Testimonials Logic
  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'testimonials'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);
  const { data: testimonials } = useCollection(testimonialsQuery);

  useEffect(() => {
    const expiry = localStorage.getItem('ad_free_until');
    if (expiry && new Date(expiry) > new Date()) setBoostExpiry(expiry);
    const timer = setTimeout(() => { if (!isPaidUser) checkAndNotifyPainMantraReminder(); }, 2000);
    return () => clearTimeout(timer);
  }, [checkAndNotifyPainMantraReminder, isPaidUser]);

  const handleBoostAdComplete = () => {
    setShowBoostAd(false);
    const newProgress = boostProgress + 1;
    if (newProgress >= 5) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        localStorage.setItem('ad_free_until', expiryDate.toISOString());
        setBoostExpiry(expiryDate.toISOString());
        setBoostProgress(0);
        toast({ title: "Boost Active!", description: "You are now Ad-Free for 1 hour." });
    } else {
        setBoostProgress(newProgress);
        toast({ title: t('boostProgressStatus').replace('{current}', String(newProgress)) });
    }
    if (firestore && user) {
        addDoc(collection(firestore, "ad_impressions"), { userId: user.uid, timestamp: serverTimestamp(), type: "daily_boost_step", step: newProgress }).catch(() => {});
    }
  };

  const getTimeRemaining = () => {
    if (!boostExpiry) return 0;
    const diff = new Date(boostExpiry).getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / 60000));
  };

  const whatsAppUrl = `https://wa.me/917022070287`;
  const whatsAppGroupUrl = `https://chat.whatsapp.com/YOUR_GROUP_INVITE_CODE`;

  const painMantra = mantras.find(m => m.id === 1);
  
  const handleUpgradeRequest = (title: string, description: string) => {
    setUpgradeDialogContent({ title, description });
    setShowUpgradeDialog(true);
  };

  const cardAnimation = "animate-fade-in-up";

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('appTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('appSubtitle')}</p>
          </header>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <Link href="/kalajnana" className={cn("block", cardAnimation)}>
                <Card className="border-2 border-primary bg-primary/5 hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Compass size={120} />
                    </div>
                    {!isAuthorized && (
                    <Badge variant="outline" className="absolute top-4 left-4 z-20 border-primary/40 text-primary bg-white/80 backdrop-blur-sm flex items-center gap-1 font-bold">
                        <Lock size={10} /> Maintenance
                    </Badge>
                    )}
                    <CardContent className="p-6 flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Compass className="h-8 w-8 animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-headline font-bold text-primary">{t('kalajnanaTitle')}</h3>
                            <p className="text-sm font-bold text-muted-foreground">{t('dinaBhavishya')}</p>
                        </div>
                    </div>
                    <div className="bg-primary text-white p-2 rounded-full group-hover:translate-x-1 transition-transform">
                        <ArrowRight size={20} />
                    </div>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/mantra-deeksha" className={cn("block", cardAnimation)} style={{ animationDelay: "0.1s" }}>
                <Card className="border-2 border-amber-500 bg-amber-50/50 hover:shadow-xl transition-all group overflow-hidden relative">
                    {/* Glowing Free Sticker */}
                    <div className="absolute top-4 left-4 z-20 animate-pulse">
                        <div className="bg-accent text-accent-foreground text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)] border border-white/20 uppercase tracking-tighter">
                          Free
                        </div>
                    </div>
                    
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Flower2 size={120} />
                    </div>
                    <CardContent className="p-6 flex items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                <Sparkles className="h-8 w-8 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-headline font-bold text-amber-700">{t('mantraDeeksha')}</h3>
                                <p className="text-xs font-black uppercase text-amber-600/70 tracking-widest">Free Initiation for All</p>
                            </div>
                        </div>
                        <div className="bg-amber-500 text-white p-2 rounded-full group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={20} />
                        </div>
                    </CardContent>
                </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             {user && (
                <Card className="bg-primary border-primary shadow-xl overflow-hidden text-primary-foreground relative group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Flame size={80} />
                   </div>
                   <CardContent className="p-6 space-y-2 relative z-10">
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-80">{t('healingStreakTitle')}</p>
                      <div className="flex items-center gap-3">
                         <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Flame className={cn("h-6 w-6", userProfile?.streakCount ? "fill-white animate-pulse" : "opacity-50")} />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black">{t('daysStreak').replace('{count}', String(userProfile?.streakCount || 0))}</h3>
                            <p className="text-xs font-bold opacity-80">{userProfile?.streakCount ? t('streakMaintained') : t('streakReset')}</p>
                         </div>
                      </div>
                   </CardContent>
                </Card>
             )}

             {!isPaidUser && (
                <Card className="border-2 border-amber-500 bg-amber-50 shadow-lg relative overflow-hidden h-full">
                  <InterstitialAd open={showBoostAd} onOpenChange={(open) => !open && handleBoostAdComplete()} />
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-500 p-3 rounded-full text-white shrink-0"><Zap className="h-6 w-6" /></div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-amber-900 text-sm leading-tight">{t('dailyBoostTitle')}</h3>
                        <p className="text-[10px] text-amber-700 font-medium">{language === 'kn' ? '೧ ગಂಟೆ જાહેરાત મુક્ત અનુભવ માટે' : 'for 1 hour ad-free experience'}</p>
                        {!boostExpiry || getTimeRemaining() <= 0 ? (
                          <div className="space-y-1 mt-1">
                            <Progress value={(boostProgress / 5) * 100} className="h-1.5 bg-amber-200" />
                            <div className="flex justify-between text-[8px] uppercase font-black text-amber-700">
                               <span>Progress</span><span>{boostProgress} / 5</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {boostExpiry && getTimeRemaining() > 0 ? (
                        <div className="text-right shrink-0">
                           <p className="text-2xl font-black text-amber-600 flex items-center gap-1 justify-end">{getTimeRemaining()}m</p>
                        </div>
                      ) : (
                        <Button onClick={() => setShowBoostAd(true)} size="sm" className="bg-amber-600 hover:bg-amber-700 font-bold shrink-0 h-10 px-4">
                          <PlayCircle size={14} className="mr-1" />{boostProgress > 0 ? `${boostProgress}/5` : 'Boost'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
             )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="max-w-md mx-auto w-full">
                {painMantra && (
                  <div className={cn(cardAnimation)}>
                     <StandaloneAudioPlayer mantra={painMantra} onUpgradeRequest={handleUpgradeRequest} imageId="kali-mantra-infographic" />
                      <Card className="mt-4"><CardContent className="p-4 space-y-2 text-center text-muted-foreground text-xs">
                        <p>{t('painReliefStep1')}</p><p>{t('painReliefStep2')}</p><p>{t('painReliefStep3')}</p><p>{t('painReliefStep4')}</p>
                        <p className="font-semibold text-foreground">{t('painReliefNote')}</p>
                      </CardContent></Card>
                  </div>
                )}
            </div>

            <div className={cn("text-center", cardAnimation)}>
              <Button asChild size="lg" className="text-lg font-bold p-8 animate-pulse">
                <Link href="/prana-vidya">{t('pranaVidyaLink')}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>

            {user && testimonials && testimonials.length > 0 && (
              <section className={cn("space-y-6 pt-8", cardAnimation)}>
                <div className="text-center">
                  <h2 className="text-2xl font-headline font-bold text-primary">{t('divineResultsTitle')}</h2>
                  <p className="text-muted-foreground text-sm">{t('divineResultsSubtitle')}</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {testimonials.map((test) => (
                    <Card key={test.id} className="overflow-hidden border-primary/10 bg-primary/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {test.userName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {test.videoUrl && (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm">
                            <video src={test.videoUrl} controls className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-sm font-medium italic leading-relaxed">"{test.content}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <Card className={cn("mt-4", cardAnimation)}>
                <CardContent className="p-6 text-center space-y-4">
                  <p className="font-semibold text-foreground text-lg">{t('serviceToHumanity')}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button><Heart className="mr-2 h-4 w-4" />{t('donateButton')}</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>{t('donateTitle')}</AlertDialogTitle><AlertDialogDescription>{t('donateDescription')}</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {isPaidUser ? (
                       <Button asChild variant="outline"><Link href={whatsAppGroupUrl} target="_blank"><Users className="mr-2 h-4 w-4" />{t('joinGroupButton')}</Link></Button>
                     ) : (
                       <AlertDialog open={showJoinGroupDialog} onOpenChange={setShowJoinGroupDialog}>
                         <AlertDialogTrigger asChild><Button variant="outline"><Users className="mr-2 h-4 w-4" />{t('joinGroupButton')}</Button></AlertDialogTrigger>
                         <AlertDialogContent>
                           <AlertDialogHeader><AlertDialogTitle>{t('joinGroupTitle')}</AlertDialogTitle><AlertDialogDescription>{t('joinGroupDescription')}</AlertDialogDescription></AlertDialogHeader>
                           <AlertDialogFooter><Button onClick={() => router.push('/upgrade')}>{t('upgradeButton')}</Button><AlertDialogAction>{t('closeButton')}</AlertDialogAction></AlertDialogFooter>
                         </AlertDialogContent>
                       </AlertDialog>
                     )}
                    <Button onClick={() => navigator.clipboard.writeText("https://mantravahini.vercel.app").then(() => toast({ title: "Link Copied" }))}><Share2 className="mr-2 h-4 w-4" />{t('shareAppButton')}</Button>
                  </div>
                </CardContent>
              </Card>
          </div>

          <Card className={cn("mt-8", cardAnimation)}>
            <CardFooter className="flex flex-col items-center justify-center gap-4 p-4">
               <div className="text-center">
                <p className="text-sm">{t('contactForServices')}</p>
                <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
               </div>
              <Button asChild><Link href={whatsAppUrl} target="_blank"><WhatsAppIcon />{t('contactOnWhatsApp')}</Link></Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <UpgradeDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog} title={upgradeDialogContent.title} description={upgradeDialogContent.description} />
    </div>
  );
}
