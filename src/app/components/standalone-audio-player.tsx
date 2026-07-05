
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Music2, Loader2, ThumbsUp, AlertCircle, WifiOff, Lock, CloudDownload } from "lucide-react";
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
import { doc, updateDoc } from "firebase/firestore";
import { useNotifications } from "@/hooks/use-notifications";
import { isToday, isYesterday } from "date-fns";

interface StandaloneAudioPlayerProps {
  mantra: Mantra;
  onUpgradeRequest: (title: string, description: string) => void;
  imageId?: string;
  videoUrl?: string;
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
  const isPremium = isPaidUser || isPractitioner;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaybackFinished, setIsPlaybackFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isCached, setIsCached] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mantraImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;
  const audioSrc = mantra.url || null;

  // Check for network and cache status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check if audio is already in PWA cache
      if ('caches' in window && audioSrc) {
        caches.match(audioSrc).then(response => {
          setIsCached(!!response);
        });
      }
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [audioSrc]);

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
    
    setHasMediaError(false);
    setIsPlaybackFinished(false);
    setProgress(0);
    setCurrentTime(0);

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
  }, [sendLocalNotification, userProfile, mantra.id]);

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

    if (!audioSrc) {
      toast({ variant: "destructive", title: "Audio Not Found", description: "This mantra audio is being prepared." });
      return;
    }

    if (isOffline && !isCached) {
      toast({ 
        variant: "destructive", 
        title: "Offline Mode", 
        description: "This mantra hasn't been cached yet. Please play once while online to save it for offline use." 
      });
      return;
    }

    await requestPermission();

    if (mantra.tier === 'paid' && !isPremium) {
      onUpgradeRequest(t('toastUpgradeRequiredTitle'), t('toastUpgradeRequiredDescription'));
      return;
    }

    setIsPlaying(true);
    setIsPlaybackFinished(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("overflow-hidden shadow-xl relative")}>
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {isOffline && (
            <Badge variant="outline" className="border-destructive/40 text-destructive bg-white/80 backdrop-blur-sm flex items-center gap-1 font-bold">
              <WifiOff size={10} /> Offline
            </Badge>
          )}
          {isCached && (
            <Badge variant="outline" className="border-green-500/40 text-green-600 bg-white/80 backdrop-blur-sm flex items-center gap-1 font-bold">
              <CloudDownload size={10} /> Offline Ready
            </Badge>
          )}
        </div>

        {mantra.tier === 'paid' && !isPremium && (
           <Badge variant="default" className="absolute top-4 right-4 z-10 bg-amber-500">
            <Lock className="h-3 w-3 mr-1" />
            Premium Feature
          </Badge>
        )}
        
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">
            {language === 'kn' ? mantra?.name : mantra?.name_en}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
            {videoUrl && !isOffline ? (
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
            ) : !audioSrc ? (
               <div className="flex flex-col items-center gap-2 text-muted-foreground animate-in fade-in">
                 <AlertCircle className="h-8 w-8 opacity-20" />
                 <p className="text-[10px] uppercase font-black tracking-widest">Audio source not available</p>
               </div>
            ) : hasMediaError ? (
               <div className="flex flex-col items-center gap-2 text-destructive animate-in slide-in-from-bottom-2">
                 <AlertCircle className="h-8 w-8" />
                 <p className="text-[10px] uppercase font-black tracking-widest">Media Load Error</p>
               </div>
            ) : (
              <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full shadow-lg" disabled={hasMediaError || !audioSrc}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            )}
          </div>

          {isPlaybackFinished && (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
              <ThumbsUp size={20} className="text-primary" />
              <p className="text-xs font-bold uppercase tracking-tight text-primary">{t('thanksForSupport')}</p>
            </div>
          )}
        </CardFooter>
      <audio 
        key={mantra.id} 
        ref={audioRef} 
        src={audioSrc || ''} 
        preload="auto" 
      />
    </Card>
  );
}
