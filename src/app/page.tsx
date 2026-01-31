
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { MantraPlayer } from "@/app/components/mantra-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, Heart, Share2, Users, ArrowRight } from "lucide-react";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UpgradeDialog } from "@/app/components/upgrade-dialog";
import { differenceInDays, isToday } from "date-fns";
import { useLanguage } from "@/context/language-context";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function Home() {
  const { t, language } = useLanguage();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeDialogContent, setUpgradeDialogContent] = useState({ title: "", description: "" });
  const [isTrialActive, setIsTrialActive] = useState(true);
  const [painMantraPlayedToday, setPainMantraPlayedToday] = useState(false);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const whatsAppUrl = "https://wa.me/917022070287";
  const kaliMantraImage = PlaceHolderImages.find(img => img.id === 'kali-mantra-infographic');
  const chakshuMantraImage = PlaceHolderImages.find(img => img.id === 'chakshu-mantra-infographic');

  useEffect(() => {
    // Trial period logic
    const trialStartDateStr = localStorage.getItem("trialStartDate");
    if (!trialStartDateStr) {
      localStorage.setItem("trialStartDate", new Date().toISOString());
      setIsTrialActive(true);
    } else {
      const trialStartDate = new Date(trialStartDateStr);
      const daysSinceStart = differenceInDays(new Date(), trialStartDate);
      if (daysSinceStart > 7) {
        setIsTrialActive(false);
      }
    }

    // Daily play limit for pain mantra
    const lastPlayDateStr = localStorage.getItem("painMantraLastPlayed");
    if (lastPlayDateStr) {
      const lastPlayDate = new Date(lastPlayDateStr);
      if (isToday(lastPlayDate)) {
        setPainMantraPlayedToday(true);
      }
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(e => console.error("Playback failed", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
     const audio = audioRef.current;
     const currentMantra = mantras[currentTrackIndex];
     if (audio && currentMantra) {
        const newSrc = currentMantra.url.startsWith('http') ? currentMantra.url : `${window.location.origin}${currentMantra.url}`;
         if(audio.src !== newSrc) {
            audio.src = newSrc;
            audio.load();
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);
         }
     }
  }, [currentTrackIndex]);

   useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => {
      const newTime = audio.currentTime;
      setCurrentTime(newTime);
      setProgress((newTime / audio.duration) * 100);
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const handlePlayPause = () => {
    const currentMantra = mantras[currentTrackIndex];
    if (!currentMantra) return;

    if (isPlaying) {
        setIsPlaying(false);
        return;
    }

    switch(currentMantra.tier) {
        case 'free':
            if (painMantraPlayedToday) {
                toast({
                    variant: "destructive",
                    title: t('toastDailyLimitTitle'),
                    description: t('toastDailyLimitDescription'),
                });
            } else {
                setIsPlaying(true);
                localStorage.setItem("painMantraLastPlayed", new Date().toISOString());
                setPainMantraPlayedToday(true);
            }
            break;
        
        case 'trial':
            if (isTrialActive) {
                setIsPlaying(true);
            } else {
                setUpgradeDialogContent({
                    title: t('toastTrialEndedTitle'),
                    description: t('toastTrialEndedDescription'),
                });
                setShowUpgradeDialog(true);
            }
            break;

        case 'paid':
            setUpgradeDialogContent({
                title: t('toastUpgradeRequiredTitle'),
                description: t('toastUpgradeRequiredDescription'),
            });
            setShowUpgradeDialog(true);
            break;
    }
  }

  const handlePainReliefSelect = () => {
    const kaliMantraIndex = mantras.findIndex(m => m.id === 1);
    if (kaliMantraIndex !== -1) {
      setCurrentTrackIndex(kaliMantraIndex);
      toast({
        title: t('toastPainMantraSelectedTitle'),
        description: t('toastPainMantraSelectedDescription'),
      });
    }
  };

  const handleEyeProblemsSelect = () => {
    if (!isTrialActive) {
        setUpgradeDialogContent({
            title: t('toastTrialEndedTitle'),
            description: t('toastTrialEndedDescription'),
        });
        setShowUpgradeDialog(true);
        return;
    }
    const chakshuMantraIndex = mantras.findIndex(m => m.id === 2);
    if (chakshuMantraIndex !== -1) {
      setCurrentTrackIndex(chakshuMantraIndex);
       toast({
        title: t('toastEyeMantraSelectedTitle'),
        description: t('toastEyeMantraSelectedDescription'),
      });
    }
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    if (isFinite(newTime)) {
      audio.currentTime = newTime;
    }
  };


  const handleShare = async () => {
    const shareData = {
      title: t('appTitle'),
      text: t('shareText'),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not share the app at this moment.",
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Copied to clipboard",
          description: "App link has been copied to your clipboard.",
        });
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Error",
          description: "Could not copy link to clipboard.",
        });
      }
    }
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
            <p className="mt-4 text-lg text-muted-foreground">
             {t('appSubtitle')}
            </p>
          </header>

          <Card className={cn("mb-8 text-center bg-accent text-accent-foreground transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6" />
                {t('activatedMantra')}
                <Sparkles className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{t('explorePower')}</p>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animationDelay: "0.6s" }}>
                <Card onClick={handlePainReliefSelect} className={cn("cursor-pointer overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)}>
                    <CardHeader>
                      <CardTitle className="font-headline text-center text-2xl">{t('painReliefTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-auto w-full">
                        {kaliMantraImage && <Image
                          src={kaliMantraImage.imageUrl}
                          alt={kaliMantraImage.description}
                          width={1080}
                          height={1350}
                          className="object-contain rounded-md"
                          data-ai-hint={kaliMantraImage.imageHint}
                        />}
                      </div>
                      <div className="mt-4 space-y-2 text-center text-muted-foreground text-sm">
                        <p>{t('painReliefStep1')}</p>
                        <p>{t('painReliefStep2')}</p>
                        <p>{t('painReliefStep3')}</p>
                        <p>{t('painReliefStep4')}</p>
                        <p className="font-semibold text-foreground">{t('painReliefNote')}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card onClick={handleEyeProblemsSelect} className={cn("cursor-pointer overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)}>
                      <CardHeader>
                        <CardTitle className="font-headline text-center text-2xl">{t('eyeProblemsTitle')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="relative mx-auto aspect-auto w-full max-w-md">
                          {chakshuMantraImage && <Image
                            src={chakshuMantraImage.imageUrl}
                            alt={chakshuMantraImage.description}
                            width={1080}
                            height={1350}
                            className="object-contain rounded-md"
                            data-ai-hint={chakshuMantraImage.imageHint}
                          />}
                        </div>
                        <div className="mt-4 space-y-4 text-center text-sm">
                           <p className="text-muted-foreground">
                            {t('eyeProblemsInstruction')}
                          </p>
                          <p className="font-semibold text-primary">
                            {t('eyeProblemsNote')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
            </div>
            
            <div className={cn(cardAnimation)} style={{ animationDelay: "0.5s" }}>
              <MantraPlayer 
                mantras={mantras} 
                currentTrackIndex={currentTrackIndex} 
                onTrackChange={setCurrentTrackIndex}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                progress={progress}
                duration={duration}
                currentTime={currentTime}
                onProgressClick={handleProgressClick}
              />

              <div className={cn("mt-6 text-center", cardAnimation)} style={{ animationDelay: "0.55s" }}>
                <Button asChild size="lg" className="text-lg font-bold p-8 animate-pulse">
                  <Link href="/healing">
                    {t('mantraTherapyLink')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className={cn("mt-4", cardAnimation)} style={{ animationDelay: "0.7s" }}>
                <CardContent className="p-6 text-center space-y-4">
                  <p className="font-semibold text-foreground text-lg">
                    {t('serviceToHumanity')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          <Heart className="mr-2 h-4 w-4" />
                          {t('donateButton')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('donateTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                           {t('donateDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          {t('joinGroupButton')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('joinGroupTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                           {t('joinGroupDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      {t('shareAppButton')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          </div>


          <Card className={cn("mt-8 text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">
                {t('finalMessage')}
              </p>
            </CardContent>
          </Card>

          <Card className={cn("mt-8", cardAnimation)} style={{ animationDelay: "0.7s" }}>
            <CardFooter className="flex flex-col items-center justify-center gap-4 p-4">
               <div className="text-center">
                <p>{t('contactForServices')}</p>
                <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
              </div>
              <Button asChild>
                <Link href={whatsAppUrl} target="_blank">
                  <WhatsAppIcon />
                  {t('contactOnWhatsApp')}
                </Link>
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>
      <audio ref={audioRef} />
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
        title={upgradeDialogContent.title}
        description={upgradeDialogContent.description}
      />
      <BannerAd />
    </div>
  );
