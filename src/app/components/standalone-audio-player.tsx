
"use client";

import { useRef, useState, useEffect, type MouseEvent, useMemo } from "react";
import Image from "next/image";
import { Play, Pause, Save, CheckCircle2, AlertCircle, Sparkles, Music2, Loader2, PlayCircle } from "lucide-react";
import { type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { isToday, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Badge } from "@/components/ui/badge";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNotifications } from "@/hooks/use-notifications";
import { InterstitialAd } from "./ads";

interface StandaloneAudioPlayerProps {
  mantra: Mantra;
  onUpgradeRequest: (title: string, description: string) => void;
  imageId?: string;
  showTracker?: boolean;
}

export function StandaloneAudioPlayer({ mantra, onUpgradeRequest, imageId, showTracker }: StandaloneAudioPlayerProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { requestPermission, sendLocalNotification } = useNotifications();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium', createdAt?: string }>(userDocRef);
  const isPaidUser = userProfile?.subscriptionTier === 'basic' || userProfile?.subscriptionTier === 'premium';

  // 7-Day Trial Logic
  const isWithinTrial = useMemo(() => {
    if (!userProfile?.createdAt) return false;
    const createdDate = new Date(userProfile.createdAt);
    const daysSinceCreation = differenceInDays(new Date(), createdDate);
    return daysSinceCreation >= 0 && daysSinceCreation < 7;
  }, [userProfile?.createdAt]);

  const [isDeveloper, setIsDeveloper] = useState(false);
  
  const [step, setStep] = useState<'initial' | 'pre_play' | 'playing' | 'post_play' | 'result'>(showTracker ? 'pre_play' : 'initial');
  const [beforeScore, setBeforeScore] = useState(0);
  const [afterScore, setAfterScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Ad-Supported Model State
  const [showAd, setShowAd] = useState(false);
  const [isUnlockedByAd, setIsUnlockedByAd] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const mantraImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;

  // Use the mantra URL if provided, otherwise null
  const audioSrc = mantra.url || null;

  useEffect(() => {
    const isActualDeveloper = user?.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
    if (typeof window !== 'undefined') {
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      setIsDeveloper(isActualDeveloper && devModeEnabled);
    }
  }, [user]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setHasMediaError(false);
    
    if (audioSrc && (audioSrc.startsWith('http') || audioSrc.startsWith('/'))) {
      setIsBuffering(true);
      audio.load();
    } else {
      setIsBuffering(false);
    }

    const setAudioData = () => {
      if(isFinite(audio.duration)) setDuration(audio.duration);
      setIsBuffering(false);
    }
    const setAudioTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      if(isFinite(audio.duration) && audio.duration > 0) {
        setProgress((time / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      sendLocalNotification('notificationMantraCompleteTitle', 'notificationMantraCompleteBody');
      if (showTracker) {
        setStep('post_play');
      }
    };
    const handleError = () => {
      const currentSrc = audio.src;
      if (!currentSrc || currentSrc === window.location.href) return;
      
      setHasMediaError(true);
      setIsPlaying(false);
      setIsBuffering(false);
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioSrc, mantra.id, showTracker, sendLocalNotification]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasMediaError) return;
    if (isPlaying) {
      audio.play().catch(e => {
        if (e.name !== 'AbortError') {
          setIsPlaying(false);
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, hasMediaError, audioSrc]);

  const startPlayback = () => {
    setIsPlaying(true);
    setStep('playing');
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (!audioSrc) {
      toast({ title: t('loading') });
      return;
    }

    if (hasMediaError) {
      toast({ variant: "destructive", title: "Audio Unavailable" });
      return;
    }

    await requestPermission();

    if (showTracker && beforeScore === 0) {
      toast({ variant: "destructive", title: t('pleaseRateToStart') });
      return;
    }

    if (isDeveloper || isWithinTrial || isPaidUser || isUnlockedByAd) {
      startPlayback();
      return;
    }

    if (mantra.tier === 'free') {
        const lastPlayDateStr = localStorage.getItem("painMantraLastPlayed");
        if (lastPlayDateStr && isToday(new Date(lastPlayDateStr))) {
             toast({ variant: "destructive", title: t('toastDailyLimitTitle'), description: t('toastDailyLimitDescription') });
             return;
        }
        startPlayback();
        localStorage.setItem("painMantraLastPlayed", new Date().toISOString());
    } else {
        // Pivot: Show Ad to unlock for free users
        setShowAd(true);
    }
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setIsUnlockedByAd(true);
    
    // Log Ad Impression for revenue analysis
    if (firestore && user) {
        addDoc(collection(firestore, "ad_impressions"), {
            userId: user.uid,
            mantraId: mantra.id,
            timestamp: serverTimestamp(),
            type: "rewarded_unlock"
        }).catch(err => console.warn("Failed to log ad impression", err));
    }
    
    toast({ title: "Unlocked!", description: "Mantra is unlocked for this session. Enjoy!" });
    startPlayback();
  };
  
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !e.currentTarget || !isFinite(duration) || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (isFinite(newTime)) audio.currentTime = newTime;
  };

  const handleSaveResult = () => {
    const historyItem = { date: new Date().toISOString(), before: beforeScore, after: afterScore };
    const currentHistory = JSON.parse(localStorage.getItem('painReliefHistory') || '[]');
    localStorage.setItem('painReliefHistory', JSON.stringify([...currentHistory, historyItem]));
    sendLocalNotification('notificationHealingSavedTitle', 'notificationHealingSavedBody');
    setStep('result');
    window.dispatchEvent(new Event('painHistoryUpdated'));
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("overflow-hidden shadow-xl relative")}>
        <InterstitialAd open={showAd} onOpenChange={(open) => !open && handleAdComplete()} />

        {mantra.tier === 'paid' && !isPaidUser && !isWithinTrial && !isUnlockedByAd && (
           <Badge variant="default" className="absolute top-4 right-4 z-10 bg-amber-500">
            <PlayCircle className="h-3 w-3 mr-1" />
            Watch Ad to Play
          </Badge>
        )}
        {mantra.tier === 'paid' && (isWithinTrial || isUnlockedByAd) && !isPaidUser && (
           <Badge variant="secondary" className="absolute top-4 right-4 z-10 bg-green-500 text-white">
            {t('trialAccess')}
          </Badge>
        )}
        
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">{language === 'kn' ? mantra?.name : mantra?.name_en}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mantraImage && step !== 'result' && (
            <div className="relative aspect-video w-full">
              <Image
                src={mantraImage.imageUrl}
                alt={mantraImage.description}
                fill
                className="rounded-md object-cover"
                data-ai-hint={mantraImage.imageHint}
              />
            </div>
          )}

          {hasMediaError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 border border-destructive/20 animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">
                {language === 'kn' ? "ಧ್ವನಿ ಕಡತ ಲಭ್ಯವಿಲ್ಲ." : "Mantra audio source is missing."}
              </p>
            </div>
          )}

          {showTracker && step === 'pre_play' && (
            <div className="space-y-4 pt-4 border-t animate-fade-in">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-primary">{t('rateYourPain')}</p>
                <span className="text-2xl font-bold text-primary">{beforeScore}</span>
              </div>
              <Slider value={[beforeScore]} onValueChange={(v) => setBeforeScore(v[0])} max={10} step={1} />
              <Button onClick={handlePlayPause} disabled={beforeScore === 0 || hasMediaError} className="w-full h-12 text-lg font-bold">
                <Play className="mr-2 h-5 w-5" />
                {t('startHealing')}
              </Button>
            </div>
          )}

          {step === 'playing' && (
            <div className="space-y-2 pt-4 border-t animate-fade-in">
              <div onClick={handleProgressClick} className="cursor-pointer">
                <Progress value={progress} aria-label="Mantra progress" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="flex justify-center">
                 <Button onClick={handlePlayPause} variant="outline" size="icon" className="h-12 w-12 rounded-full" disabled={isBuffering}>
                   {isBuffering ? <Loader2 className="animate-spin" /> : isPlaying ? <Pause /> : <Play />}
                 </Button>
              </div>
            </div>
          )}

          {showTracker && step === 'post_play' && (
            <div className="space-y-4 pt-4 border-t animate-fade-in">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-primary">{t('ratePainAfterMantra')}</p>
                <span className="text-2xl font-bold text-primary">{afterScore}</span>
              </div>
              <Slider value={[afterScore]} onValueChange={(v) => setAfterScore(v[0])} max={10} step={1} />
              <Button onClick={handleSaveResult} className="w-full h-12 text-lg font-bold">
                <Save className="mr-2 h-5 w-5" />
                {t('saveHealingResult')}
              </Button>
            </div>
          )}

          {showTracker && step === 'result' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center animate-fade-in">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">{t('healingGreatSuccess')}</h3>
              <p className="text-muted-foreground">{beforeScore - afterScore} {t('pointsReduced')}</p>
              <Button variant="outline" onClick={() => setStep('pre_play')} className="mt-4 w-full">
                {t('closeButton')}
              </Button>
            </div>
          )}

          {!showTracker && (
            <div className="space-y-2">
              <div onClick={handleProgressClick} className="cursor-pointer">
                <Progress value={progress} aria-label="Mantra progress" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
        </CardContent>
        {!showTracker && (
           <CardFooter className="flex items-center justify-center gap-2 bg-muted/50 p-4">
            {isBuffering ? (
              <div className="flex flex-col items-center gap-2 animate-pulse">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t('loading')}</span>
              </div>
            ) : (
              <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full" aria-label={isPlaying ? t('pauseButton') : t('playButton')} disabled={hasMediaError}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            )}
          </CardFooter>
        )}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
    </Card>
  );
}
