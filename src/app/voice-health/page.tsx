'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, RotateCcw, Activity, ShieldAlert, Sparkles, TrendingUp, HeartPulse, Zap } from 'lucide-react';
import { analyzeVoiceHealth, type VoiceAnalysisOutput } from '@/ai/flows/voice-health-analysis-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  const isPremium = userProfile?.subscriptionTier === 'premium';

  useEffect(() => {
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
        toast({
          title: 'Analysis Complete',
          description: 'Your Physical Health Report is ready.',
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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {language === 'kn' ? 'ಶಾರೀರಿಕ ಆರೋಗ್ಯ ತಪಾಸಣೆ' : 'Physical Health Checkup'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {language === 'kn' ? 'ನಿಮ್ಮ ಧ್ವನಿಯ ಕಂಪನದ ಮೂಲಕ ನಿಮ್ಮ ಶಾರೀರಿಕ ಆರೋಗ್ಯವನ್ನು ಅರಿಯಿರಿ' : 'Analyze your physical health status through the vibration resonance of your voice'}
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
              "Om Hum Hanumate Namah" <br />
              <span className="text-sm text-muted-foreground mt-2 block">(Repeat 3 Times)</span>
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
                  {language === 'kn' ? 'ಶಾರೀರಿಕ ಆರೋಗ್ಯ ವರದಿ' : 'Physical Health Report'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{language === 'kn' ? 'ಶಾರೀರಿಕ ಚೈತನ್ಯ' : 'Physical Vitality'}</p>
                    <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                       <span className="text-3xl font-black text-primary">{result.metrics.physicalVitality}%</span>
                    </div>
                    <Progress value={result.metrics.physicalVitality} className="h-2" />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{language === 'kn' ? 'ಶ್ವಾಸಕೋಶದ ಶಕ್ತಿ' : 'Respiratory Strength'}</p>
                    <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                       <span className="text-3xl font-black text-accent">{result.metrics.respiratoryStrength}%</span>
                    </div>
                    <Progress value={result.metrics.respiratoryStrength} className="h-2" />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{language === 'kn' ? 'ಧ್ವನಿ ಸ್ಪಷ್ಟತೆ' : 'Vocal Clarity'}</p>
                    <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                       <span className="text-3xl font-black text-green-600">{result.metrics.vocalClarity}%</span>
                    </div>
                    <Progress value={result.metrics.vocalClarity} className="h-2" />
                  </div>
                </div>

                <div className="grid gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.recommendedMantra && (
                    <div className="p-4 border rounded-lg bg-primary/5 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Recommended Mantra</p>
                        <p className="font-bold text-sm">{result.recommendedMantra}</p>
                      </div>
                    </div>
                  )}
                   {result.recommendedProduct && (
                    <div className="p-4 border rounded-lg bg-accent/5 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Recommended Product</p>
                        <p className="font-bold text-sm">{result.recommendedProduct}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t bg-muted/20">
                <Button variant="ghost" onClick={resetSession}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Try Again'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {language === 'kn' ? 'ಆರೋಗ್ಯ ಇತಿಹಾಸ' : 'Health History'}
                 </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 w-full bg-muted/30 rounded flex items-center justify-center text-muted-foreground text-sm italic">
                  {language === 'kn' ? 'ವಾರದ ಪ್ರಗತಿಯನ್ನು ಇಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ' : 'Your weekly physical health progress will be graphed here.'}
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
