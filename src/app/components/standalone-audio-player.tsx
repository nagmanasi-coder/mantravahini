"use client";

import { useRef, useState, useEffect, type MouseEvent } from "react";
import { Play, Pause } from "lucide-react";
import { type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { isToday, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

interface StandaloneAudioPlayerProps {
  mantra: Mantra;
  onUpgradeRequest: (title: string, description: string) => void;
}

export function StandaloneAudioPlayer({ mantra, onUpgradeRequest }: StandaloneAudioPlayerProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isTrialActive, setIsTrialActive] = useState(true);

  useEffect(() => {
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
  }, []);

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
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [mantra.url]);

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
            localStorage.setItem("painMantraLastPlayed", new Date().toISOString());
            break;
        
        case 'trial':
            if (isTrialActive) {
                setIsPlaying(true);
            } else {
                onUpgradeRequest(t('toastTrialEndedTitle'), t('toastTrialEndedDescription'));
            }
            break;

        case 'paid':
            onUpgradeRequest(t('toastUpgradeRequiredTitle'), t('toastUpgradeRequiredDescription'));
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

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("overflow-hidden shadow-xl")}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">{language === 'kn' ? mantra?.name : mantra?.name_en}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div onClick={handleProgressClick} className="cursor-pointer">
              <Progress value={progress} aria-label="Mantra progress" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 bg-muted/50 p-4">
          <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full" aria-label={isPlaying ? t('pauseButton') : t('playButton')}>
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
        </CardFooter>
      <audio ref={audioRef} preload="metadata" />
    </Card>
  );
}
