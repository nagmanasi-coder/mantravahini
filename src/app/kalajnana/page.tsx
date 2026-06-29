
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Moon, Sun, ArrowRight, Loader2, Sparkles, Lock, ArrowLeft, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { generateDailyKalajnana } from '@/ai/flows/kalajnana-flow';
import { useToast } from '@/hooks/use-toast';

interface HoroscopeData {
  date: string;
  rashiData: Record<string, string>;
  lagnaData: Record<string, string>;
}

export default function KalajnanaPage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const [selectedType, setSelectedType] = useState<'rashi' | 'lagna' | null>(null);
  const [selectedSignIndex, setSelectedSignIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const devMode = typeof window !== 'undefined' ? localStorage.getItem('developerMode') === 'true' : false;
    setIsDevMode(devMode);
  }, []);

  const isDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
  const isAuthorized = isDeveloper && isDevMode;

  const horoscopeRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'daily_horoscope', todayStr);
  }, [firestore, todayStr]);

  const { data: horoscope, isLoading: horoscopeLoading } = useDoc<HoroscopeData>(horoscopeRef);

  const signs = [
    t('mesha'), t('vrishabha'), t('mithuna'), t('kataka'), 
    t('simha'), t('kanya'), t('tula'), t('vrishchika'), 
    t('dhanu'), t('makara'), t('kumbha'), t('meena')
  ];

  const handleSignClick = (index: number) => {
    setSelectedSignIndex(index);
    setIsRevealed(true);
    setTimeout(() => {
      document.getElementById('prediction-display')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateManual = async () => {
    if (!isAuthorized || !firestore) return;
    setIsGenerating(true);
    try {
      const result = await generateDailyKalajnana(todayStr);
      await setDoc(doc(firestore, 'daily_horoscope', todayStr), {
        date: todayStr,
        rashiData: result.rashiPredictions,
        lagnaData: result.lagnaPredictions,
        generatedAt: new Date().toISOString()
      });
      toast({ title: "Astrology Manifested", description: "Today's predictions have been generated successfully." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Manifestation Failed", description: e.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPrediction = useMemo(() => {
    if (!horoscope || selectedSignIndex === null || !selectedType) return null;
    const data = selectedType === 'rashi' ? horoscope.rashiData : horoscope.lagnaData;
    return data[String(selectedSignIndex)];
  }, [horoscope, selectedSignIndex, selectedType]);

  if (!hasMounted || userLoading || (horoscopeLoading && isAuthorized)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-lg">{t('bhavishyaLoading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-32 animate-fade-in">
      <header className="mb-12 text-center">
        <Button asChild variant="ghost" size="sm" className="mb-4 self-start">
           <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> {t('backButton')}</Link>
        </Button>
        <div className="flex justify-center mb-4">
           <Compass className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {t('kalajnanaTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('dinaBhavishya')} - {new Date().toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      {!horoscope ? (
        <div className="text-center p-12 bg-muted/20 rounded-xl border-2 border-dashed border-primary/20">
          <Compass className="mx-auto h-12 w-12 text-primary/30 mb-4 animate-spin-slow" />
          <p className="text-muted-foreground italic mb-6">Predictions for today are being manifested. Please check back in a moment.</p>
          {isAuthorized && (
            <Button onClick={handleGenerateManual} disabled={isGenerating} size="lg" className="font-bold shadow-lg">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Manifest Predictions Now
            </Button>
          )}
        </div>
      ) : !selectedType ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="hover:border-primary cursor-pointer transition-all hover:shadow-xl group" onClick={() => setSelectedType('rashi')}>
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                <Moon className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-headline font-bold">{t('basedOnRashi')}</h2>
              <p className="text-sm text-muted-foreground">Detailed daily predictions based on your Moon Sign.</p>
            </CardContent>
          </Card>
          <Card className="hover:border-accent cursor-pointer transition-all hover:shadow-xl group" onClick={() => setSelectedType('lagna')}>
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-white transition-colors">
                <Sun className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-headline font-bold">{t('basedOnLagna')}</h2>
              <p className="text-sm text-muted-foreground">Deep spiritual insights based on your Ascendant.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {selectedType === 'rashi' ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-accent" />}
              {selectedType === 'rashi' ? t('basedOnRashi') : t('basedOnLagna')}
            </h2>
            <Button variant="outline" size="sm" onClick={() => setSelectedType(null)}>Change Mode</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {signs.map((sign, index) => (
              <Card 
                key={index} 
                className={cn(
                  "cursor-pointer transition-all hover:scale-105 active:scale-95 border-2",
                  selectedSignIndex === index ? "border-primary bg-primary/5" : "border-muted-foreground/10"
                )}
                onClick={() => handleSignClick(index)}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <span className="text-[10px] uppercase font-black text-muted-foreground/60">{index + 1}</span>
                  <p className="font-bold text-lg">{sign}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div id="prediction-display" className="pt-8">
             {isRevealed && currentPrediction ? (
               <Card className="border-primary border-4 shadow-2xl animate-fade-in-up">
                 <CardHeader className="bg-primary/10 text-center pb-2">
                   <div className="flex justify-center gap-2 mb-2">
                      <Sparkles className="text-primary h-6 w-6" />
                   </div>
                   <CardTitle className="text-2xl font-headline text-primary">
                     {signs[selectedSignIndex!]} {selectedType === 'rashi' ? 'ರಾಶಿ' : 'ಲಗ್ನ'} ಭವಿಷ್ಯ
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 text-center">
                    <p className="text-xl font-bold leading-relaxed whitespace-pre-line text-foreground">
                      {currentPrediction}
                    </p>
                 </CardContent>
                 <CardFooter className="bg-muted/30 p-4 justify-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                      Divine Timing: {new Date().toLocaleTimeString()}
                    </p>
                 </CardFooter>
               </Card>
             ) : isRevealed && !currentPrediction ? (
                <div className="text-center p-12 bg-destructive/5 rounded-xl border-2 border-dashed border-destructive/20">
                  <p className="text-destructive font-bold">Prediction data missing for this sign. Please try refreshing.</p>
                </div>
             ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
