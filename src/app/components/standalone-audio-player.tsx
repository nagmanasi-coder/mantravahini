"use client";

import { useRef, useState, useEffect, type MouseEvent, useMemo } from "react";
import Image from "next/image";
import { Play, Pause, AlertCircle, Music2, Loader2, PlayCircle, RefreshCw, VolumeX, Image as ImageIcon, Lock, ShieldCheck } from "lucide-react";
import { type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Badge } from "@/components/ui/badge";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNotifications } from "@/hooks/use-notifications";
import { InterstitialAd } from "./ads";
import { ADMOB_CONFIG, isNativePlatform } from "@/lib/admob-config";

interface StandaloneAudioPlayerProps {
  mantra: Mantra;
  onUpgradeRequest: (title: string, description: string) => void;
  imageId?: string;
}

export function StandaloneAudioPlayer({ mantra, onUpgradeRequest, imageId }: StandaloneAudioPlayerProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { requestPermission, sendLocalNotification } = useNotifications();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: 'free' | 'premium', isPranaPractitioner?: boolean }>(userDocRef);
  
  const isPaidUser = userProfile?.subscriptionTier === 'premium';
  const isPractitioner = !!userProfile?.isPranaPractitioner;
  const isAdFree = isPaidUser || isPractitioner;

  const [isAdFreePassActive, setIsAdFreePassActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const [showStartAd, setShowStartAd] = useState(false);
  const [showEndAd, setShowEndAd] = useState(false);
  const [isUnlockedByAd, setIsUnlockedByAd] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mantraImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;
  const audioSrc = mantra.url || null;

  useEffect(() => {
    const checkPass = () => {
      const expiry = localStorage.getItem('ad_free_until');
      setIsAdFreePassActive(expiry ? new Date(expiry) > new Date() : false);
    };
    checkPass();
    const interval = setInterval(checkPass, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
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
      
      if (!isAdFree && !isAdFreePassActive) {
         setShowEndAd(true);
         logImpression("post_playback_interstitial", ADMOB_CONFIG.units.interstitial.android);
      }
    };
    const handleError = () => {
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
  }, [isAdFree, isAdFreePassActive]);

  const logImpression = (type: string, unitId: string) => {
    if (firestore && user) {
      addDoc(collection(firestore, "ad_impressions"), {
        userId: user.uid,
        mantraId: mantra.id,
        timestamp: serverTimestamp(),
        type: type,
        unitId: unitId,
        platform: isNativePlatform() ? "native_apk" : "web_pwa"
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasMediaError || !audioSrc) return;
    if (isPlaying) {
      audio.play().catch(e => {
        if (e.name !== 'AbortError') setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, hasMediaError, audioSrc]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (!audioSrc) return;

    if (hasMediaError) {
      toast({ variant: "destructive", title: "Audio Unavailable" });
      return;
    }

    await requestPermission();

    if (isAdFree || isUnlockedByAd || isAdFreePassActive) {
      setIsPlaying(true);
      return;
    }

    // ENFORCE REWARDED AD UNLOCK FOR FREE USERS
    setShowStartAd(true);
  };

  const handleStartAdComplete = () => {
    setShowStartAd(false);
    setIsUnlockedByAd(true);
    logImpression("rewarded_unlock_start", ADMOB_CONFIG.units.rewarded.android);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("overflow-hidden shadow-xl relative")}>
        <InterstitialAd 
          open={showStartAd} 
          onOpenChange={(open) => !open && handleStartAdComplete()} 
          type="rewarded"
        />
        <InterstitialAd 
          open={showEndAd} 
          onOpenChange={(open) => !open && setShowEndAd(false)} 
          type="interstitial"
        />

        {!isAdFree && !isUnlockedByAd && !isAdFreePassActive && (
           <Badge variant="default" className="absolute top-4 right-4 z-10 bg-amber-500 animate-pulse">
            <Lock className="h-3 w-3 mr-1" />
            Rewarded Unlock Required
          </Badge>
        )}

        {isAdFree && (
          <Badge variant="secondary" className="absolute top-4 right-4 z-10 bg-green-500 text-white">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Ad-Free Active
          </Badge>
        )}
        
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">
            {language === 'kn' ? mantra?.name : mantra?.name_en}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            {mantraImage ? (
              <Image
                src={mantraImage.imageUrl}
                alt={mantraImage.description}
                fill
                className="object-cover"
                data-ai-hint={mantraImage.imageHint}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Music2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Progress value={progress} aria-label="Mantra progress" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-2 bg-muted/50 p-4">
          {isBuffering ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full" disabled={hasMediaError}>
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          )}
        </CardFooter>
      <audio ref={audioRef} src={audioSrc || null} preload="metadata" />
    </Card>
  );
}
