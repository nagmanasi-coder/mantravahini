"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ListMusic,
  Music,
} from "lucide-react";
import { mantras, type Mantra } from "@/lib/mantras";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { InterstitialAd } from "@/app/components/ads";

interface MantraPlayerProps {
  mantras: Mantra[];
}

export function MantraPlayer({ mantras }: MantraPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
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

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((e) => console.error("Playback failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = mantras[currentTrackIndex].url;
      if (isPlaying) {
        audio.play().catch((e) => console.error("Playback failed:", e));
      }
    }
  }, [currentTrackIndex, mantras, isPlaying]);
  
  useEffect(() => {
    if (trackChangeCount > 0 && trackChangeCount % 3 === 0) {
      setIsPlaying(false);
      setShowInterstitial(true);
    }
  }, [trackChangeCount]);

  const handleTrackChange = (newIndex: number) => {
    setCurrentTrackIndex(newIndex);
    setTrackChangeCount(prev => prev + 1);
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

  const handleTrackSelect = (index: number) => {
    if (index !== currentTrackIndex) {
      handleTrackChange(index);
    } else {
      handlePlayPause();
    }
  };
  
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio) return;

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
      <Card className="overflow-hidden shadow-xl">
        <CardHeader>
          <CardDescription>ಈಗ ಪ್ಲೇ ಆಗುತ್ತಿದೆ</CardDescription>
          <CardTitle className="font-headline text-3xl">{currentMantra.name}</CardTitle>
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

      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>ಮಂತ್ರಗಳು</CardTitle>
            <CardDescription>ಪಟ್ಟಿಯಿಂದ ಮಂತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ</CardDescription>
          </div>
          <ListMusic className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {mantras.map((mantra, index) => (
                <Button
                  key={mantra.id}
                  variant={index === currentTrackIndex ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto"
                  onClick={() => handleTrackSelect(index)}
                >
                  <Music className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="truncate text-left whitespace-normal">{mantra.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <audio ref={audioRef} onEnded={handleNext} />
      <InterstitialAd open={showInterstitial} onOpenChange={setShowInterstitial} />
    </div>
  );
}
