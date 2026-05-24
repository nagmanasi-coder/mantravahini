
"use client";

import { useRef, useState, useEffect, type MouseEvent, useMemo } from "react";
import Image from "next/image";
import { Play, Pause, AlertCircle, Music2, Loader2, PlayCircle, RefreshCw, VolumeX, Image as ImageIcon, Lock, ShieldCheck, Film, ExternalLink, Heart, ThumbsUp } from "lucide-react";
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
import { doc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNotifications } from "@/hooks/use-notifications";
import { InterstitialAd } from "./ads";
import { ADMOB_CONFIG, isNativePlatform } from "@/lib/admob-config";
import { isToday, isYesterday } from "date-fns";

interface StandaloneAudioPlayerProps {
  mantra: Mantra;
  onUpgradeRequest: (title: string, description: string) => void;
  imageId?: string;
  videoUrl?: string; // Support for "in-run" healing videos
}

export function StandaloneAudioPlayer({ mantra, onUpgradeRequest, imageId, videoUrl }: StandaloneAudioPlayerProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { requestPermission, sendLocalNotification } = useNotifications();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ 
    subscriptionTier?: 'free' | 'premium', 
    isPranaPractitioner?: boolean,
    streakCount?: number,
    lastStreakUpdate?: string
  }>(userDocRef);
  
  const isPaidUser = userProfile?.subscriptionTier === 'premium';
  const isPractitioner = !!userProfile?.isPranaPractitioner;
  const isAdFree = isPaidUser || isPractitioner;

  const [isAdFreePassActive, setIsAdFreePassActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaybackFinished, setIsPlaybackFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const [showStartAd, setShowStartAd] = useState(false);
  const [showEndAd, setShowEndAd] = useState(false);
  const [isUnlockedByAd, setIsUnlockedByAd] = useState(false);
  const [adRefreshKey, setAdRefreshKey] = useState(0);
  const [hasShownAppreciation, setHasShownAppreciation] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mantraImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;
  const audioSrc = mantra.url || null;

  // Revenue Strategy: Show banner ad in slot during playback for free users
  const showVisualBannerAd = isPlaying && !isAdFree && !isAdFreePassActive;

  useEffect(() => {
    const checkPass = () => {
      const expiry = localStorage.getItem('ad_free_until');
      setIsAdFreePassActive(expiry ? new Date(expiry) > new Date() : false);
    };
    checkPass();
    const interval = setInterval(checkPass, 10000);
    return () => clearInterval(interval);
  }, []);

  // Ad Refresh Logic for internal slot
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVisualBannerAd) {
      interval = setInterval(() => {
        setAdRefreshKey(prev => prev + 1);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [showVisualBannerAd]);

  // STREAK LOGIC
  const updateStreak = () => {
    if (!firestore || !user || !userProfile) return;

    const lastUpdate = userProfile.lastStreakUpdate ? new Date(userProfile.lastStreakUpdate) : null;
    const today = new Date();
    let newStreak = userProfile.streakCount || 0;

    if (!lastUpdate || isYesterday(lastUpdate)) {
        newStreak += 1;
    } else if (!isToday(lastUpdate)) {
        newStreak = 1;
    } else {
        return;
    }

    const ref = doc(firestore, 'users', user.uid);
    updateDoc(ref, {
        streakCount: newStreak,
        lastStreakUpdate: today.toISOString()
    }).catch(() => {});
  };

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
      setIsPlaybackFinished(true);
      updateStreak();
      sendLocalNotification('notificationMantraCompleteTitle', 'notificationMantraCompleteBody');
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
  }, [isAdFree, isAdFreePassActive, sendLocalNotification, userProfile]);

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
    const video = videoRef.current;

    if (!audio || hasMediaError || !audioSrc) return;
    
    if (isPlaying) {
      audio.play().catch(e => {
        if (e.name !== 'AbortError') setIsPlaying(false);
      });
      if (video) video.play().catch(() => {});
    } else {
      audio.pause();
      if (video) video.pause();
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
      setIsPlaybackFinished(false);
      return;
    }

    setShowStartAd(true);
  };

  const handleStartAdComplete = () => {
    setShowStartAd(false);
    setIsUnlockedByAd(true);
    logImpression("rewarded_unlock_start", ADMOB_CONFIG.units.rewarded.android);
    setIsPlaying(true);
    setIsPlaybackFinished(false);
  };

  const handleSupportUs = () => {
    setShowEndAd(true);
    logImpression("optional_support_interstitial", ADMOB_CONFIG.units.interstitial.android);
  };

  const handleEndAdComplete = () => {
    setShowEndAd(false);
    setHasShownAppreciation(true);
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
          onOpenChange={(open) => !open && handleEndAdComplete()} 
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
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
            {showVisualBannerAd ? (
              <div key={adRefreshKey} className="relative h-full w-full bg-muted flex flex-col items-center justify-center p-6 animate-fade-in">
                 <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center space-y-4 bg-card shadow-inner w-full max-w-[320px]">
                    <Badge variant="outline" className="border-primary/40 text-primary uppercase text-[9px] font-black tracking-widest bg-primary/5">
                       Sponsored Ad Slot
                    </Badge>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                       {language === 'kn' ? 'ಜಾಹೀರಾತು' : 'ADVERTISEMENT'}
                    </p>
                    <div className="h-16 flex flex-col items-center justify-center border bg-muted/20 rounded font-mono text-[9px] text-muted-foreground/60 space-y-1">
                       <p>UNIT: {ADMOB_CONFIG.units.banner.android.slice(-8)}</p>
                       <div className="flex items-center gap-1">
                          <RefreshCw size={8} className="animate-spin-slow" />
                          <span>Refreshing...</span>
                       </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold border-primary/20 hover:bg-primary/5" onClick={() => onUpgradeRequest("Remove In-Player Ads", "Upgrade to Premium to remove these banners and see sacred loops instead.")}>
                       <VolumeX size={10} className="mr-1" /> {t('headerUpgrade')}
                    </Button>
                 </div>
              </div>
            ) : videoUrl ? (
              <video 
                ref={videoRef}
                src={videoUrl} 
                className="w-full h-full object-cover" 
                loop 
                muted 
                playsInline
                poster={mantraImage?.imageUrl}
              />
            ) : mantraImage ? (
              <Image
                src={mantraImage.imageUrl}
                alt={mantraImage.description}
                fill
                className="object-cover"
                data-ai-hint={mantraImage.imageHint}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Music2 className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            
            {(videoUrl || showVisualBannerAd) && (
               <div className="absolute bottom-2 right-2 bg-black/40 p-1 rounded backdrop-blur-sm">
                  <Film className="h-3 w-3 text-white/50" />
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

        <CardFooter className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-4">
          <div className="flex items-center justify-center gap-4">
            {isBuffering ? (
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            ) : (
              <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full" disabled={hasMediaError}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            )}
          </div>

          {isPlaybackFinished && !isAdFree && !isAdFreePassActive && (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
              {hasShownAppreciation ? (
                <div className="flex flex-col items-center gap-2 text-primary animate-pulse">
                  <ThumbsUp size={20} />
                  <p className="text-xs font-bold uppercase tracking-tight">{t('thanksForSupport')}</p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase text-center">{t('supportUsDescription')}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-primary/40 text-primary hover:bg-primary/5 font-black uppercase tracking-tighter h-10 px-6"
                    onClick={handleSupportUs}
                  >
                    <Heart size={14} className="mr-2 fill-primary" />
                    {t('supportUsButton')}
                  </Button>
                </>
              )}
            </div>
          )}
        </CardFooter>
      <audio ref={audioRef} src={audioSrc || null} preload="metadata" />
    </Card>
  );
}
