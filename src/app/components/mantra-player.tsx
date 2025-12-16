"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InterstitialAd } from "@/app/components/ads";
import { cn } from "@/lib/utils";

interface MantraPlayerProps {
  mantras: Mantra[];
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
}

export function MantraPlayer({ mantras, currentTrackIndex, onTrackChange }: MantraPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackChangeCount, setTrackChangeCount] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentMantra = mantras[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlayPromise = (promise: Promise<void> | undefined) => {
      if (promise !== undefined) {
        promise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Playback failed:", error);
          }
        });
      }
    };

    if (currentMantra && audio.src !== currentMantra.url) {
      audio.src = currentMantra.url;
      audio.load();
      if (isPlaying) {
        handlePlayPromise(audio.play());
      }
    } else {
      if (isPlaying && audio.paused) {
        handlePlayPromise(audio.play());
      } else if (!isPlaying && !audio.paused) {
        audio.pause();
      }
    }
  }, [currentTrackIndex, isPlaying, currentMantra]);
  
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

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleNext);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trackChangeCount > 0 && trackChangeCount % 3 === 0) {
      setIsPlaying(false);
      setShowInterstitial(true);
    }
  }, [trackChangeCount]);

  const handleTrackChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < mantras.length) {
      onTrackChange(newIndex);
      setTrackChangeCount(prev => prev + 1);
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % mantras.length;
    handleTrackChange(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentTrackIndex - 1 + mantras.length) % mantras.length;
    handleTrackChange(newIndex);
  };
  
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio || isNaN(duration) || duration === 0) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      <Card className={cn("overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl")}>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{currentMantra?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div ref={progressBarRef} onClick={handleProgressClick} className="cursor-pointer">
              <Progress value={progress} aria-label="Mantra progress" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 bg-muted/50 p-4">
          <Button onClick={handlePrev} variant="ghost" size="icon" aria-label="ಹಿಂದಿನದು">
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button onClick={handlePlayPause} size="lg" className="h-16 w-16 rounded-full" aria-label={isPlaying ? 'ವಿರಾಮ' : 'ಪ್ಲೇ'}>
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
          <Button onClick={handleNext} variant="ghost" size="icon" aria-label="ಮುಂದೆ">
            <SkipForward className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>

      <audio ref={audioRef} />
      <InterstitialAd open={showInterstitial} onOpenChange={setShowInterstitial} />
    </div>
  );
}
