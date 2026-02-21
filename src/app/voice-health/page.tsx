
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, RotateCcw, Activity, ShieldAlert, Sparkles, TrendingUp, HeartPulse, Zap, Sun, Brain, Flame, History, ChevronRight } from 'lucide-react';
import { analyzeVoiceHealth, type VoiceAnalysisOutput } from '@/ai/flows/voice-health-analysis-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
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
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysisOutput | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [history, setHistory] = useState<StoredVoiceReport[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  const isPremium = userProfile?.subscriptionTier === 'premium';

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

        // Save to history
        const newReport: StoredVoiceReport = {
          ...analysis,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [newReport, ...history].slice(0, 20); // Keep last 20
        setHistory(updatedHistory);
        localStorage.setItem('voiceHealthHistory', JSON.stringify(updatedHistory));

        toast({
          title: 'Analysis Complete',
          description: 'Your Health and Prana Report is ready.',
        });
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
      label: language === 'kn' ? 'ಚೈತನ್ಯ' : 'Vitality',
      color: "hsl(var(--primary))",
    },
    prana: {
      label: language === 'kn' ? 'ಪ್ರಾಣ' : 'Prana',
      color: "hsl(var(--accent))",
    },
    mental: {
      label: language === 'kn' ? 'ಮಾನಸಿಕ' : 'Mental',
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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-32">
      <header className="mb-8 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {language === 'kn' ? 'ಧ್ವನಿ ಪ್ರಾಣ ತಪಾಸಣೆ' : 'Vocal Prana Checkup'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {language === 'kn' ? 'ಧ್ವನಿ ಕಂಪನದ ಮೂಲಕ ಆರೋಗ್ಯ, ಮಾನಸಿಕ ಶಕ್ತಿ ಮತ್ತು ಪ್ರಾಣವನ್ನು ಅರಿಯಿರಿ' : 'Analyze physical health, mental energy, and life force (Prana) through voice vibrations'}
        </p>
      </header>

      {!isPremium && (
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

      <div className="space-y-6">
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {language === 'kn' ? 'ಆರೋಗ್ಯ ಮಂತ್ರ' : 'Health Mantra'}
            </CardTitle>
            <CardDescription>
              {language === 'kn' ? 'ಈ ಮಂತ್ರವನ್ನು ಮೂರು ಬಾರಿ ಕಂಪನದಿಂದ ಸ್ಪಷ್ಟವಾಗಿ ಪಠಿಸಿ' : 'Recite this mantra three times clearly with deep resonance into your microphone'}
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
                  <Button onClick={startRecording} disabled={!isPremium && user?.uid !== 'LPBTRz3AMafKtZVgzJWm5Aisxc53'} className="h-16 w-16 rounded-full">
                    <Mic className="h-8 w-8" />
                  </Button>
                )}
              </div>
              <p className="text-sm font-mono font-bold">
                {isRecording ? `${recordingTime}s Recording...` : audioBlob ? 'Vibration captured!' : 'Tap mic to start'}
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
                {language === 'kn' ? 'ಕಂಪನ ವಿಶ್ಲೇಷಿಸಿ' : 'Analyze Vibrations'}
              </Button>
              <Button onClick={resetSession} variant="outline" size="icon" className="h-12 w-12">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </CardFooter>
          )}
        </Card>

        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <Card className="border-2 border-accent/50 shadow-2xl">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
                  <HeartPulse className="h-6 w-6" />
                  {language === 'kn' ? 'ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ವರದಿ' : 'Complete Health Report'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-b pb-8">
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{language === 'kn' ? 'ಶಾರೀರಿಕ ಚೈತನ್ಯ' : 'Physical Vitality'}</p>
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-primary/5">
                       <span className="text-2xl font-black text-primary">{result.metrics.physicalVitality}%</span>
                    </div>
                    <Progress value={result.metrics.physicalVitality} className="h-1.5" />
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{language === 'kn' ? 'ಮಾನಸಿಕ ಶಕ್ತಿ' : 'Mental Energy'}</p>
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-blue-50">
                       <span className="text-2xl font-black text-blue-600">{result.metrics.mentalEnergy}%</span>
                    </div>
                    <Progress value={result.metrics.mentalEnergy} className="h-1.5" />
                  </div>

                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{language === 'kn' ? 'ಪ್ರಾಣ ಶಕ್ತಿ' : 'Prana Level'}</p>
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-amber-50">
                       <span className="text-2xl font-black text-accent">{result.metrics.pranaLevel}%</span>
                    </div>
                    <Progress value={result.metrics.pranaLevel} className="h-1.5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-headline text-primary flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    {language === 'kn' ? 'ಷಟ್ ಚಕ್ರಗಳ ಶಕ್ತಿ ವಿಶ್ಲೇಷಣೆ' : '6 Chakra Energy Analysis'}
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
                      <span>{language === 'kn' ? 'ಪತ್ತೆಯಾದ ಸೂಚಕಗಳು' : 'Detected Vibration Markers'}</span>
                    </div>
                    <p className="text-sm italic text-foreground/70">
                      {result.detectedMarkers}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center gap-2 text-destructive font-bold mb-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>{language === 'kn' ? 'ಸಂಭವನೀಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು' : 'Suggested Health Issues'}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground/80">
                      {result.suggestedIssues}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
                      <Sparkles className="h-4 w-4" />
                      <span>{language === 'kn' ? 'ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ' : 'Health Guidance'}</span>
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
                  {language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Try Again'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2 font-headline">
                    <TrendingUp className="h-5 w-5 text-primary" />
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
                <CardTitle className="text-lg font-headline">{language === 'kn' ? 'ವರದಿಗಳ ಇತಿಹಾಸ' : 'Report History'}</CardTitle>
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
                      <Button variant="ghost" size="icon" onClick={() => setResult(h)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
