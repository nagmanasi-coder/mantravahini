
"use client";

import { useRef, useState, useEffect, type MouseEvent } from "react";
import Image from "next/image";
import { Play, Pause, Save, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Badge } from "@/components/ui/badge";
import { doc } from "firebase/firestore";

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

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  const isPaidUser = userProfile?.subscriptionTier === 'basic' || userProfile?.subscriptionTier === 'premium';

  const [isDeveloper, setIsDeveloper] = useState(false);
  
  const [step, setStep] = useState<'initial' | 'pre_play' | 'playing' | 'post_play' | 'result'>(showTracker ? 'pre_play' : 'initial');
  const [beforeScore, setBeforeScore] = useState(0);
  const [afterScore, setAfterScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const mantraImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;

  useEffect(() => {
    const isActualDeveloper = user?.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
    const devModeEnabled = localStorage.getItem('developerMode') === 'true';
    setIsDeveloper(isActualDeveloper && devModeEnabled);
  }, [user]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newSrc = mantra.url.startsWith('http') ? mantra.url : `${window.location.origin}${mantra.url}`;
    if (audio.src !== newSrc) {
        audio.src = newSrc;
    }

    const setAudioData = () => {
      if(isFinite(audio.duration)) setDuration(audio.duration);
    }
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      if(isFinite(audio.duration) && audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (showTracker) {
        setStep('post_play');
      }
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [mantra.url, showTracker]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(e => console.error("Playback failed", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (showTracker && beforeScore === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: t('pleaseRateToStart'),
      });
      return;
    }

    if (isDeveloper) {
      setIsPlaying(true);
      setStep('playing');
      return;
    }

    switch(mantra.tier) {
        case 'free':
            const lastPlayDateStr = localStorage.getItem("painMantraLastPlayed");
            if (lastPlayDateStr && isToday(new Date(lastPlayDateStr))) {
                 toast({
                    variant: "destructive",
                    title: t('toastDailyLimitTitle'),
                    description: t('toastDailyLimitDescription'),
                });
                return;
            }
            
            setIsPlaying(true);
            setStep('playing');
            localStorage.setItem("painMantraLastPlayed", new Date().toISOString());
            break;
        
        case 'paid':
            if (isPaidUser) {
              setIsPlaying(true);
              setStep('playing');
            } else {
              onUpgradeRequest(t('toastUpgradeRequiredTitle'), t('toastUpgradeRequiredDescription'));
            }
            break;
    }
  };
  
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !e.currentTarget || !isFinite(duration) || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    if (isFinite(newTime)) {
      audio.currentTime = newTime;
    }
  };

  const handleSaveResult = () => {
    const historyItem = {
      date: new Date().toISOString(),
      before: beforeScore,
      after: afterScore,
    };
    
    const currentHistory = JSON.parse(localStorage.getItem('painReliefHistory') || '[]');
    const updatedHistory = [...currentHistory, historyItem];
    localStorage.setItem('painReliefHistory', JSON.stringify(updatedHistory));
    
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
        {mantra.tier === 'paid' && !isPaidUser && (
           <Badge variant="default" className="absolute top-4 right-4 z-10">
            {t('headerUpgrade')}
          </Badge>
        )}
        {mantra.tier === 'free' && (
          <Badge variant="secondary" className="absolute top-4 right-4 z-10">
            {t('free')}
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

          {showTracker && step === 'pre_play' && (
            <div className="space-y-4 pt-4 border-t animate-fade-in">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-primary">{t('rateYourPain')}</p>
                <span className="text-2xl font-bold text-primary">{beforeScore}</span>
              </div>
              <Slider
                value={[beforeScore]}
                onValueChange={(v) => setBeforeScore(v[0])}
                max={10}
                step={1}
              />
              {beforeScore === 0 && (
                <p className="text-xs text-center text-destructive font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {t('pleaseRateToStart')}
                </p>
              )}
              <Button onClick={handlePlayPause} disabled={beforeScore === 0} className="w-full h-12 text-lg font-bold">
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
                 <Button onClick={handlePlayPause} variant="outline" size="icon" className="h-12 w-12 rounded-full">
                   {isPlaying ? <Pause /> : <Play />}
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
              <Slider
                value={[afterScore]}
                onValueChange={(v) => setAfterScore(v[0])}
                max={10}
                step={1}
              />
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
              <p className="text-muted-foreground">
                {beforeScore - afterScore} {t('pointsReduced')}
              </p>
              
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20 w-full text-left space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>{t('upsellPainReliefTitle')}</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground font-medium">
                  <li>{t('upsellPainReliefItem1')}</li>
                  <li>{t('upsellPainReliefItem2')}</li>
                </ul>
              </div>

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
            <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full" aria-label={isPlaying ? t('pauseButton') : t('playButton')}>
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </CardFooter>
        )}
      <audio ref={audioRef} preload="metadata" />
    </Card>
  );
}
