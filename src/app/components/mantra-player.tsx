"use client";

import { useRef, type MouseEvent } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

interface MantraPlayerProps {
  mantras: Mantra[];
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  duration: number;
  currentTime: number;
  onProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export function MantraPlayer({ 
  mantras, 
  currentTrackIndex, 
  onTrackChange,
  isPlaying,
  onPlayPause,
  progress,
  duration,
  currentTime,
  onProgressClick
}: MantraPlayerProps) {

  const { language, t } = useLanguage();
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentMantra = mantras[currentTrackIndex];

  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % mantras.length;
    onTrackChange(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentTrackIndex - 1 + mantras.length) % mantras.length;
    onTrackChange(newIndex);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      <Card className={cn("overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl")}>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{language === 'kn' ? currentMantra?.name : currentMantra?.name_en}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div ref={progressBarRef} onClick={onProgressClick} className="cursor-pointer">
              <Progress value={progress} aria-label="Mantra progress" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 bg-muted/50 p-4">
          <Button onClick={handlePrev} variant="ghost" size="icon" aria-label={t('previousButton')}>
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button onClick={onPlayPause} size="lg" className="h-16 w-16 rounded-full" aria-label={isPlaying ? t('pauseButton') : t('playButton')}>
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
          <Button onClick={handleNext} variant="ghost" size="icon" aria-label={t('nextButton')}>
            <SkipForward className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
