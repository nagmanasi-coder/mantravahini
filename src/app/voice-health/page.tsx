
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, RotateCcw, Activity, ShieldAlert, Sparkles, TrendingUp, TrendingDown, HeartPulse, Zap, Sun, Brain, Flame, History, ChevronRight, AlertCircle, ArrowUpRight, ArrowDownRight, Minus, Clock } from 'lucide-react';
import { analyzeVoiceHealth, type VoiceAnalysisOutput } from '@/ai/flows/voice-health-analysis-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface StoredVoiceReport extends VoiceAnalysisOutput {
  id: string;
  timestamp: string;
}

export default function VoiceHealthPage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysisOutput | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [history, setHistory] = useState<StoredVoiceReport[]>([]);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ 
    subscriptionTier?: 'free' | 'basic' | 'premium',
    lastVocalPranaDate?: string 
  }>(userDocRef);

  const isPremium = userProfile?.subscriptionTier === 'premium';
  const isUserLoading = isAuthLoading || (user && isProfileLoading);

  const isDeveloper = useMemo(() => {
    if (!user) return false;
    const isActualDeveloper = user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
    if (typeof window !== 'undefined') {
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      return isActualDeveloper && devModeEnabled;
    }
    return false;
  }, [user]);

  // Weekly Limit Logic
  const canPerformCheckup = useMemo(() => {
    if (isDeveloper) return true;
    if (!userProfile?.lastVocalPranaDate) return true;
    
    const lastDate = new Date(userProfile.lastVocalPranaDate);
    const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return new Date() >= nextDate;
  }, [userProfile, isDeveloper]);

  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (!canPerformCheckup && userProfile?.lastVocalPranaDate) {
      const updateCountdown = () => {
        const lastDate = new Date(userProfile.lastVocalPranaDate!);
        const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const diff = nextDate.getTime() - new Date().getTime();

        if (diff <= 0) {
          setCountdown('');
          if (countdownRef.current) clearInterval(countdownRef.current);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };

      updateCountdown();
      countdownRef.current = setInterval(updateCountdown, 1000);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [canPerformCheckup, userProfile]);

  useEffect(() => {
    if (!isUserLoading && !isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
    }
  }, [isPremium, isUserLoading, isDeveloper]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('voiceHealthHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse voice history", e);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (!isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
      return;
    }

    if (!canPerformCheckup) {
      toast({
        variant: 'destructive',
        title: t('vocalPranaWaitTitle'),
        description: t('vocalPranaWaitDesc') + ' ' + countdown,
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Mic Access Denied',
        description: 'Please enable microphone permissions to use the health checkup.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const analysis = await analyzeVoiceHealth({
          audioDataUri: base64Audio,
          language: language as 'kn' | 'en',
        });
        
        setResult(analysis);
        setIsAnalyzing(false);

        if (analysis.isMantraMatch && analysis.metrics.physicalVitality > 0) {
          const timestamp = new Date().toISOString();
          const newReport: StoredVoiceReport = {
            ...analysis,
            id: crypto.randomUUID(),
            timestamp: timestamp,
          };
          const updatedHistory = [newReport, ...history].slice(0, 20);
          setHistory(updatedHistory);
          localStorage.setItem('voiceHealthHistory', JSON.stringify(updatedHistory));
          
          // Update last checkup date in Firestore
          if (!isDeveloper && firestore && user) {
            updateDocumentNonBlocking(doc(firestore, 'users', user.uid), {
              lastVocalPranaDate: timestamp
            });
          }

          toast({
            title: 'Analysis Complete',
            description: 'Your Health and Prana Report is ready.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: language === 'kn' ? 'ತಪ್ಪು ಅಥವಾ ಖಾಲಿ ಧ್ವನಿ' : 'Incorrect or Empty Audio',
            description: language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಂತ್ರವನ್ನು ಮತ್ತೊಮ್ಮೆ ಸರಿಯಾಗಿ ಪಠಿಸಿ.' : 'Please recite the mantra correctly for analysis.',
          });
        }
      };
    } catch (error: any) {
      setIsAnalyzing(false);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'The Divine Analyst is busy. Please try again later.',
      });
    }
  };

  const resetSession = () => {
    setAudioBlob(null);
    setResult(null);
    setRecordingTime(0);
  };

  const chartConfig = {
    vitality: {
      label: t('physicalVitality'),
      color: "hsl(var(--primary))",
    },
    prana: {
      label: t('pranaLevel'),
      color: "hsl(var(--accent))",
    },
    mental: {
      label: t('mentalEnergy'),
      color: "hsl(var(--secondary-foreground))",
    },
  } satisfies ChartConfig;

  const chartData = useMemo(() => {
    return [...history].reverse().map((h, i) => ({
      index: i + 1,
      vitality: h.metrics.physicalVitality,
      prana: h.metrics.pranaLevel,
      mental: h.metrics.mentalEnergy,
      date: new Date(h.timestamp).toLocaleDateString(),
    }));
  }, [history]);

  const chakraOrder = [
    { key: 'muladhara', color: 'bg-red-500', icon: '🔴' },
    { key: 'svadhishthana', color: 'bg-orange-500', icon: '🟠' },
    { key: 'manipura', color: 'bg-yellow-500', icon: '🟡' },
    { key: 'anahata', color: 'bg-green-500', icon: '🟢' },
    { key: 'vishuddha', color: 'bg-blue-500', icon: '🔵' },
    { key: 'ajna', color: 'bg-indigo-500', icon: '🟣' },
  ] as const;

  const wellnessTrend = useMemo(() => {
    if (history.length < 2) return null;
    const latest = history[0].metrics.physicalVitality;
    const previous = history[1].metrics.physicalVitality;
    const diff = latest - previous;
    return {
      diff,
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat',
      label: language === 'kn' ? (diff > 0 ? 'ಸುಧಾರಿಸಿದೆ' : diff < 0 ? 'ಕಡಿಮೆಯಾಗಿದೆ' : 'ಸ್ಥಿರವಾಗಿದೆ') : (diff > 0 ? 'Improved' : diff < 0 ? 'Declined' : 'Stable')
    };
  }, [history, language]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-32">
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={(isOpen) => {
          if (!isOpen) router.push('/');
          setShowUpgradeDialog(isOpen);
        }}
        title={t('toastUpgradeRequiredTitle')}
        description={t('vocalPranaCheckupTitle') + " is a Premium Feature."}
      />

      <header className="mb-8 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {t('vocalPranaCheckupTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('vocalPranaCheckupSubtitle')}
        </p>
      </header>

      {!isPremium && !isDeveloper && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-medium">
                {language === 'kn' ? 'ಇದು ಪ್ರೀಮಿಯಂ ವೈಶಿಷ್ಟ್ಯವಾಗಿದೆ' : 'This is a Premium Feature'}
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="border-amber-400 text-amber-800">
              <Link href="/upgrade">{t('headerUpgrade')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isPremium && !canPerformCheckup && !isDeveloper && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="h-5 w-5" />
              <p className="font-bold">{t('vocalPranaWaitTitle')}</p>
            </div>
            <p className="text-sm text-blue-700">{t('vocalPranaWaitDesc')}</p>
            <div className="bg-white/50 px-6 py-2 rounded-full font-mono text-xl font-bold text-blue-900 border border-blue-200">
              {countdown}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-12">
        {/* Recording Section */}
        <section className="space-y-6">
          <Card className={cn(
            "border-2 border-primary/20 shadow-xl overflow-hidden transition-opacity",
            (!canPerformCheckup && !isDeveloper && !isRecording) ? "opacity-50" : "opacity-100"
          )}>
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t('healthMantraTitle')}
              </CardTitle>
              <CardDescription>
                {t('healthMantraInstruction')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-6">
              <div className="p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 italic font-headline text-2xl text-primary leading-relaxed">
                {language === 'kn' ? '"ಓಂ ಹುಂ ಹನುಮತೇ ನಮಃ"' : '"Om Hum Hanumate Namah"'} <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  {language === 'kn' ? '(೩ ಬಾರಿ ಪಠಿಸಿ)' : '(Repeat 3 Times)'}
                </span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500",
                  isRecording ? "bg-red-100 animate-pulse scale-110 shadow-lg shadow-red-200" : "bg-primary/10"
                )}>
                  {isRecording ? (
                    <Button onClick={stopRecording} variant="destructive" size="icon" className="h-16 w-16 rounded-full">
                      <Square className="h-8 w-8" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={startRecording} 
                      className="h-16 w-16 rounded-full"
                      disabled={!canPerformCheckup && !isDeveloper}
                    >
                      <Mic className="h-8 w-8" />
                    </Button>
                  )}
                </div>
                <p className="text-sm font-mono font-bold">
                  {isRecording ? `${recordingTime}s Recording...` : audioBlob ? t('vibrationAnalyzed') : (!canPerformCheckup && !isDeveloper) ? t('vocalPranaWaitTitle') : t('tapMicToStart')}
                </p>
              </div>
            </CardContent>
            {audioBlob && !result && (
              <CardFooter className="bg-muted/30 p-4 flex gap-2">
                <Button onClick={handleAnalyze} className="flex-1 font-bold h-12 text-lg" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <Activity className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  {t('analyzeVibrations')}
                </Button>
                <Button onClick={resetSession} variant="outline" size="icon" className="h-12 w-12" disabled={isAnalyzing}>
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </section>

        {/* Status Section (Latest Result) */}
        {result && (
          <section id="status-section" className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-headline text-primary">{t('vocalPranaStatusTitle')}</h2>
            </div>
            
            <Card className="border-2 border-accent/50 shadow-2xl">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
                  <HeartPulse className="h-6 w-6" />
                  {t('healthReportTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {(!result.isMantraMatch || result.metrics.physicalVitality === 0) && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 border border-destructive/20">
                    <AlertCircle className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">
                        {language === 'kn' ? 'ಪಠ್ಯವು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ' : 'Mantra Verification Failed'}
                      </p>
                      <p className="text-xs opacity-80">
                        {language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಂತ್ರವನ್ನು ಮತ್ತೊಮ್ಮೆ ಸರಿಯಾಗಿ ಪಠಿಸಿ.' : 'Please recite the mantra correctly so the AI can analyze your vibrations.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-b pb-8">
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('physicalVitality')}</p>
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-primary/5">
                       <span className="text-2xl font-black text-primary">{result.metrics.physicalVitality}%</span>
                    </div>
                    <Progress value={result.metrics.physicalVitality} className="h-1.5" />
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('mentalEnergy')}</p>
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-blue-50">
                       <span className="text-2xl font-black text-blue-600">{result.metrics.mentalEnergy}%</span>
                    </div>
                    <Progress value={result.metrics.mentalEnergy} className="h-1.5" />
                  </div>

                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('pranaLevel')}</p>
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-amber-50">
                       <span className="text-2xl font-black text-accent">{result.metrics.pranaLevel}%</span>
                    </div>
                    <Progress value={result.metrics.pranaLevel} className="h-1.5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-headline text-primary flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    {t('chakraAnalysisTitle')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chakraOrder.map((chakra) => {
                      const data = result.chakras[chakra.key as keyof typeof result.chakras];
                      return (
                        <div key={chakra.key} className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{chakra.icon}</span>
                              <span className="font-bold capitalize text-sm">{t(`chakra_${chakra.key}` as any)}</span>
                            </div>
                            <span className="font-bold text-xs">{data.score}%</span>
                          </div>
                          <Progress value={data.score} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground italic">{data.status}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 text-primary font-bold mb-2">
                      <Zap className="h-4 w-4" />
                      <span>{t('detectedMarkers')}</span>
                    </div>
                    <p className="text-sm italic text-foreground/70">
                      {result.detectedMarkers}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center gap-2 text-destructive font-bold mb-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>{t('suggestedIssues')}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground/80">
                      {result.suggestedIssues}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
                      <Sparkles className="h-4 w-4" />
                      <span>{t('healthGuidance')}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                      {result.physicalHealthGuidance}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t bg-muted/20">
                <Button variant="ghost" onClick={resetSession}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('tryAgain')}
                </Button>
              </CardFooter>
            </Card>
          </section>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <section id="history-section" className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-headline text-primary">{t('vocalPranaHistoryTitle')}</h2>
            </div>

            {wellnessTrend && (
              <Card className="bg-primary/5 border-primary/10 mb-6">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      wellnessTrend.direction === 'up' ? "bg-green-100 text-green-600" : wellnessTrend.direction === 'down' ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                    )}>
                      {wellnessTrend.direction === 'up' ? <ArrowUpRight /> : wellnessTrend.direction === 'down' ? <ArrowDownRight /> : <Minus />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{language === 'kn' ? 'ಒಟ್ಟಾರೆ ಆರೋಗ್ಯ ಪ್ರವೃತ್ತಿ' : 'Overall Health Trend'}</p>
                      <p className="text-xs text-muted-foreground">{wellnessTrend.label} ({wellnessTrend.diff > 0 ? '+' : ''}{wellnessTrend.diff}%)</p>
                    </div>
                  </div>
                  <TrendingUp className="text-primary/20 h-8 w-8" />
                </CardContent>
              </Card>
            )}

            <Card className="border-2 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2 font-headline">
                    <TrendingDown className="h-5 w-5 text-primary" />
                    {language === 'kn' ? 'ಆರೋಗ್ಯ ಪ್ರಗತಿ ಸ್ಥಿತಿ' : 'Health Progress Status'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'kn' ? 'ಕಳೆದ 10 ತಪಾಸಣೆಗಳ ವರದಿ' : 'Trends from your last 10 sessions'}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <LineChart data={chartData.slice(-10)} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} hide />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="vitality" stroke="var(--color-vitality)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="prana" stroke="var(--color-prana)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="mental" stroke="var(--color-mental)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-headline">{t('reportHistory')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {history.map((h) => (
                    <div key={h.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{new Date(h.timestamp).toLocaleDateString()}</span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-primary/10 px-1.5 rounded text-primary font-bold">V:{h.metrics.physicalVitality}%</span>
                          <span className="text-[10px] bg-accent/10 px-1.5 rounded text-accent font-bold">P:{h.metrics.pranaLevel}%</span>
                          <span className="text-[10px] bg-blue-100 px-1.5 rounded text-blue-700 font-bold">M:{h.metrics.mentalEnergy}%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setResult(h);
                        const statusSection = document.getElementById('status-section');
                        if (statusSection) statusSection.scrollIntoView({ behavior: 'smooth' });
                      }}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="ghost">
          <Link href="/">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('backButton')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
