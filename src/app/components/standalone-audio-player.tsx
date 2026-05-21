
"use client";

import { useRef, useState, useEffect, type MouseEvent, useMemo } from "react";
import Image from "next/image";
import { Play, Pause, AlertCircle, Music2, Loader2, PlayCircle, RefreshCw, VolumeX, Image as ImageIcon } from "lucide-react";
import { type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { ADMOB_CONFIG } from "@/lib/admob-config";

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

  const { data: userProfile } = useDoc<{ subscriptionTier?: 'free' | 'premium', isPranaPractitioner?: boolean, createdAt?: string }>(userDocRef);
  
  const isPaidUser = userProfile?.subscriptionTier === 'premium';
  const isPractitioner = !!userProfile?.isPranaPractitioner;
  const isAdFree = isPaidUser || isPractitioner;

  const [isAdFreePassActive, setIsAdFreePassActive] = useState(false);
  useEffect(() => {
    const checkPass = () => {
      const expiry = localStorage.getItem('ad_free_until');
      setIsAdFreePassActive(expiry ? new Date(expiry) > new Date() : false);
    };
    checkPass();
    const interval = setInterval(checkPass, 10000);
    return () => clearInterval(interval);
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const [showStartAd, setShowStartAd] = useState(false);
  const [showEndAd, setShowEndAd] = useState(false);
  const [isUnlockedByAd, setIsUnlockedByAd] = useState(false);

  const [playerAdKey, setPlayerAdKey] = useState(0);
  const [isPlayerAdRefreshing, setIsPlayerAdRefreshing] = useState(false);
  const [adSlotType, setAdSlotType] = useState<'video' | 'banner'>('video');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mantraImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;
  const audioSrc = mantra.url || null;

  useEffect(() => {
    if (isPlaying && !isAdFree && !isAdFreePassActive) {
      const interval = setInterval(() => {
        setIsPlayerAdRefreshing(true);
        setTimeout(() => {
          setPlayerAdKey(prev => prev + 1);
          setAdSlotType(Math.random() > 0.3 ? 'video' : 'banner');
          setIsPlayerAdRefreshing(false);
          
          if (firestore && user) {
            addDoc(collection(firestore, "ad_impressions"), {
              userId: user.uid,
              mantraId: mantra.id,
              timestamp: serverTimestamp(),
              type: "in_player_passive_refresh",
              slot_type: adSlotType,
              unitId: ADMOB_CONFIG.units.banner.android
            }).catch(() => {});
          }
        }, 500);
      }, 45000); 
      return () => clearInterval(interval);
    }
  }, [isPlaying, isAdFree, isAdFreePassActive, firestore, user, mantra.id, adSlotType]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audioSrc && audioSrc.startsWith('http')) {
      setHasMediaError(false);
      setIsBuffering(true);
      audio.load();
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
      
      if (!isAdFree && !isAdFreePassActive) {
         setShowEndAd(true);
         if (firestore && user) {
            addDoc(collection(firestore, "ad_impressions"), {
                userId: user.uid,
                mantraId: mantra.id,
                timestamp: serverTimestamp(),
                type: "post_playback_interstitial",
                unitId: ADMOB_CONFIG.units.interstitial.android
            }).catch(() => {});
         }
      }
    };
    const handleError = () => {
      const currentSrc = audio.src;
      if (!currentSrc || currentSrc === window.location.href || !currentSrc.startsWith('http')) return;
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
  }, [audioSrc, mantra.id, sendLocalNotification, isAdFree, isAdFreePassActive, firestore, user]);

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

    setShowStartAd(true);
  };

  const handleStartAdComplete = () => {
    setShowStartAd(false);
    setIsUnlockedByAd(true);
    if (firestore && user) {
        addDoc(collection(firestore, "ad_impressions"), {
            userId: user.uid,
            mantraId: mantra.id,
            timestamp: serverTimestamp(),
            type: "rewarded_unlock_start",
            unitId: ADMOB_CONFIG.units.rewarded.android
        }).catch(() => {});
    }
    setIsPlaying(true);
  };
  
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(duration) || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (isFinite(newTime)) audio.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const showPlayerAd = isPlaying && !isAdFree && !isAdFreePassActive;

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
           <Badge variant="default" className="absolute top-4 right-4 z-10 bg-amber-500">
            <PlayCircle className="h-3 w-3 mr-1" />
            Watch Ad to Play
          </Badge>
        )}
        
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">{language === 'kn' ? mantra?.name : mantra?.name_en}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            {showPlayerAd ? (
               <div 
                key={playerAdKey}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center bg-black transition-all duration-700",
                  isPlayerAdRefreshing ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in"
                )}
               >
                 {adSlotType === 'video' ? (
                   <div className="flex flex-col items-center gap-4 text-white">
                      <div className="bg-primary/20 p-6 rounded-full animate-pulse border border-primary/40">
                        <RefreshCw className="h-10 w-10 text-primary" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-primary/80">Active Media Unit</p>
                        <p className="text-sm font-bold opacity-80">Passive Revenue Stream</p>
                        <div className="flex items-center justify-center gap-1 text-[8px] opacity-40">
                          <VolumeX size={8} />
                          <span>MUTED DURING SHLOKA</span>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center gap-4 text-white p-6 w-full h-full border-4 border-dashed border-white/20">
                      <div className="bg-white/10 p-4 rounded-xl">
                        <ImageIcon className="h-12 w-12 text-white/50" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-amber-400">Loading Unit: {ADMOB_CONFIG.units.banner.android.slice(-6)}</p>
                        <div className="bg-white/20 h-12 w-full rounded flex items-center justify-center">
                           <span className="text-[10px] font-bold">SPONSORED MEDIA SLOT</span>
                        </div>
                        <p className="text-[8px] opacity-40 uppercase">Refreshing Next Content...</p>
                      </div>
                   </div>
                 )}
               </div>
            ) : mantraImage ? (
              <Image
                src={mantraImage.imageUrl}
                alt={mantraImage.description}
                fill
                className="object-cover"
                data-ai-hint={mantraImage.imageHint}
              />
            ) : null}
          </div>

          {hasMediaError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 border border-destructive/20">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">
                {language === 'kn' ? "ಧ್ವನಿ ಕಡತ ಲಭ್ಯವಿಲ್ಲ." : "Mantra audio source is missing."}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div onClick={handleProgressClick} className="cursor-pointer">
              <Progress value={progress} aria-label="Mantra progress" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {!isAdFree && !isAdFreePassActive && (
            <div className="pt-4 mt-4 border-t border-dashed">
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest mb-2">Service Support Unit</p>
              <div className="bg-muted h-12 flex items-center justify-center rounded border border-dashed border-primary/20">
                <span className="text-xs text-muted-foreground italic font-mono">AD_UNIT: {ADMOB_CONFIG.units.banner.android.slice(0, 10)}...</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 bg-muted/50 p-4">
          {isBuffering ? (
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t('loading')}</span>
            </div>
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
