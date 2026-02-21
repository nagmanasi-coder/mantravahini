
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type UserProfileType = {
  subscriptionTier?: 'free' | 'basic' | 'premium';
};

const MovingDot = ({ onSessionEnd }: { onSessionEnd: () => void }) => {
  const { t } = useLanguage();
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const pos = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  // Timer logic
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timeLeft]);

  // Effect to handle session end when timer hits zero
  useEffect(() => {
    if (hasStarted && timeLeft <= 0) {
      onSessionEnd();
    }
  }, [timeLeft, hasStarted, onSessionEnd]);

  // Animation logic
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Initial position at center
    pos.current.x = container.clientWidth / 2;
    pos.current.y = container.clientHeight / 2;
    
    // Initial random velocity
    const angle = Math.random() * Math.PI * 2;
    pos.current.vx = Math.cos(angle);
    pos.current.vy = Math.sin(angle);

    const animate = () => {
      // Check if finished
      if (timeLeft <= 0) return;

      // Speed levels every 10 seconds
      let speed = 4; // Slow (60-51)
      if (timeLeft <= 50) speed = 8; // Average (50-41)
      if (timeLeft <= 40) speed = 14; // Speed (40-31)
      if (timeLeft <= 30) speed = 22; // Very Speed (30-0)

      pos.current.x += pos.current.vx * speed;
      pos.current.y += pos.current.vy * speed;

      // Bounce logic
      if (pos.current.x <= 20 || pos.current.x >= container.clientWidth - 20) {
        pos.current.vx *= -1;
      }
      if (pos.current.y <= 20 || pos.current.y >= container.clientHeight - 20) {
        pos.current.vy *= -1;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hasStarted, timeLeft]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[2000] bg-white w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {!hasStarted ? (
        <div className="flex flex-col items-center justify-center gap-8 text-center px-6 w-full max-w-lg">
          <p className="text-black text-xl sm:text-2xl font-bold mb-4">
            {t('painfulMemoriesFollowDot')}
          </p>
          <Button 
            size="lg" 
            className="rounded-full h-28 w-28 sm:h-32 sm:w-32 bg-primary hover:bg-primary/90 shadow-2xl transition-transform hover:scale-110 active:scale-95 flex items-center justify-center border-none" 
            onClick={() => setHasStarted(true)}
          >
            <Play className="h-12 w-12 sm:h-16 sm:w-16 fill-white text-white ml-1" />
          </Button>
          <div className="flex flex-col gap-3 text-black/80 font-bold text-base sm:text-lg mt-4">
            <p>{t('painfulMemoriesSessionStep1')}</p>
            <p>{t('painfulMemoriesSessionStep2')}</p>
            <p>{t('painfulMemoriesSessionStep3')}</p>
            <p>{t('painfulMemoriesSessionStep4')}</p>
            <p>{t('painfulMemoriesSessionStep5')}</p>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={dotRef}
            className="absolute w-10 h-10 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 shadow-xl"
            style={{ top: '0px', left: '0px' }}
          />
          <div className="absolute top-8 right-8 text-black text-2xl sm:text-4xl font-bold font-mono bg-white/90 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-4 border-black shadow-lg">
            {timeLeft}s
          </div>
          <div className="absolute bottom-12 w-full text-center">
             <p className="text-black/40 text-lg sm:text-xl font-bold uppercase tracking-widest">
               {timeLeft > 50 ? 'Slow' : 
                timeLeft > 40 ? 'Average' : 
                timeLeft > 30 ? 'Speed' : 
                'Very Speed'}
             </p>
          </div>
        </>
      )}
    </div>
  );
};

export default function PainfulMemoriesPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfileType>(userDocRef);
  
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [step, setStep] = useState<'instructions' | 'session' | 'session_ended' | 'post_session' | 'results'>('instructions');
  const [beforeScore, setBeforeScore] = useState(5);
  const [afterScore, setAfterScore] = useState(5);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  const isUserLoading = isAuthLoading || (user && isProfileLoading);
  const isPremiumUser = userProfile?.subscriptionTier === 'premium';

  useEffect(() => {
    if (user) {
      const isActualDeveloper = user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      setIsDeveloper(isActualDeveloper && devModeEnabled);
    }
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !isPremiumUser && !isDeveloper && step === 'instructions') {
        setShowUpgradeDialog(true);
    }
  }, [isPremiumUser, isUserLoading, isDeveloper, step]);

  const handleStartSession = () => {
    setStep('session');
  };

  const handleSessionEnd = () => {
    setStep('session_ended');
  };

  const handleRatePain = () => {
    setStep('post_session');
  };

  const handleViewResults = () => {
     const sessionResult = {
        date: new Date().toISOString(),
        title: memoryTitle || 'Untitled Memory',
        before: beforeScore,
        after: afterScore
     };
     const pastResults = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('painfulMemoriesResults') || '[]') : [];
     if (typeof window !== 'undefined') {
       localStorage.setItem('painfulMemoriesResults', JSON.stringify([...pastResults, sessionResult]));
     }
     setStep('results');
  };
  
  const handleStartNewSession = () => {
    setBeforeScore(5);
    setAfterScore(5);
    setMemoryTitle('');
    setStep('instructions');
  };

  if (isUserLoading) {
    return (
       <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
          <p className="text-muted-foreground">{t('loading')}</p>
       </div>
    )
  }
  
  return (
    <>
      {!isPremiumUser && !isDeveloper && (step === 'instructions' || step === 'session') && (
        <UpgradeDialog 
            open={showUpgradeDialog} 
            onOpenChange={(isOpen) => {
                if(!isOpen) router.push('/');
                setShowUpgradeDialog(isOpen);
            }}
            title={t('toastUpgradeRequiredTitle')}
            description={t('painfulMemoriesPremiumFeature')}
        />
      )}

      {step === 'session' && (
        <MovingDot onSessionEnd={handleSessionEnd} />
      )}

      {step === 'session_ended' && (
        <div className="fixed inset-0 z-[2000] bg-white flex flex-col items-center p-6 text-center pt-24">
          <div className="max-w-md w-full space-y-12">
            <h2 className="text-black text-3xl sm:text-4xl font-bold leading-tight">
              {t('painfulMemoriesSessionEnded')}
            </h2>
            <Button 
              size="lg" 
              className="rounded-full px-10 py-8 bg-primary hover:bg-primary/90 shadow-2xl h-auto text-xl sm:text-2xl font-bold w-full" 
              onClick={handleRatePain}
            >
              {t('painfulMemoriesClickToRate')}
            </Button>
          </div>
        </div>
      )}
      
      <div className={cn("container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8", (step === 'session' || step === 'session_ended') ? 'hidden' : 'block')}>
          <header className="mb-8 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
                {t('painfulMemoriesTitle')}
              </h1>
          </header>

          {step === 'instructions' && (
              <Card className="animate-fade-in-up">
                  <CardHeader>
                      <CardTitle>{t('painfulMemoriesInstructionsTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <Alert variant="destructive" className="bg-destructive/10 border-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="font-bold">Caution</AlertTitle>
                        <AlertDescription className="text-sm font-medium">
                          {t('painfulMemoriesCaution')}
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4 text-muted-foreground">
                        <div className="grid gap-3">
                          <p>1. {t('painfulMemoriesInstructionsStep1')}</p>
                          <p>2. {t('painfulMemoriesInstructionsStep2')}</p>
                          <p>3. {t('painfulMemoriesInstructionsStep3')}</p>
                          <p>4. {t('painfulMemoriesInstructionsStep4')}</p>
                          <p>5. {t('painfulMemoriesInstructionsStep5')}</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="memory-title" className="font-bold text-foreground">
                          {t('painfulMemoriesTitleInputLabel')}
                        </Label>
                        <Input 
                          id="memory-title"
                          placeholder={t('painfulMemoriesTitleInputPlaceholder')}
                          value={memoryTitle}
                          onChange={(e) => setMemoryTitle(e.target.value)}
                          className="bg-muted/50"
                        />
                      </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-6 items-start pt-6 border-t">
                      <div className="w-full space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-primary">{t('painfulMemoriesPreSessionTitle')}</h3>
                            <span className="text-2xl font-bold text-primary">{beforeScore}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('painfulMemoriesRatePain')}</p>
                          <Slider
                              value={[beforeScore]}
                              onValueChange={(value) => setBeforeScore(value[0])}
                              max={10}
                              step={1}
                              className="py-4"
                          />
                           <div className="flex justify-between text-xs font-medium text-muted-foreground">
                              <span>0 (No Pain)</span>
                              <span>10 (Max Pain)</span>
                          </div>
                      </div>
                     <Button 
                      onClick={handleStartSession} 
                      size="lg" 
                      className="w-full text-lg font-bold h-14"
                      disabled={(!isPremiumUser && !isDeveloper) || !memoryTitle.trim()}
                     >
                       {t('painfulMemoriesStartSession')}
                     </Button>
                     {!memoryTitle.trim() && (
                       <p className="text-xs text-center w-full text-destructive font-medium">Please enter a title for the memory to start.</p>
                     )}
                  </CardFooter>
              </Card>
          )}

          {step === 'post_session' && (
              <Card className="animate-fade-in-up">
                  <CardHeader>
                      <CardTitle>{t('painfulMemoriesPostSessionTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6 items-start">
                       <div className="w-full space-y-4">
                           <div className="flex justify-between items-center">
                              <h3 className="font-bold text-lg text-primary">After-Session Rating</h3>
                              <span className="text-2xl font-bold text-primary">{afterScore}</span>
                           </div>
                           <p className="text-sm font-semibold text-foreground mb-1">{t('painfulMemoriesRatePainInstruction')}</p>
                           <p className="text-sm text-muted-foreground">{t('painfulMemoriesRatePainAgain')}</p>
                           <Slider
                               value={[afterScore]}
                               onValueChange={(value) => setAfterScore(value[0])}
                               max={10}
                               step={1}
                               className="py-4"
                           />
                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                <span>0</span>
                                <span>10</span>
                            </div>
                       </div>
                       <Button onClick={handleViewResults} size="lg" className="w-full text-lg font-bold h-14">{t('painfulMemoriesViewResults')}</Button>
                   </CardContent>
               </Card>
          )}

          {step === 'results' && (
              <Card className="animate-fade-in-up">
                 <CardHeader>
                      <CardTitle className="text-center">{t('painfulMemoriesResultsTitle')}</CardTitle>
                      {memoryTitle && <p className="text-center text-muted-foreground font-bold italic">"{memoryTitle}"</p>}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-8 items-center py-8">
                      <div className="flex justify-around w-full items-center">
                          <div className="text-center">
                              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">{t('painfulMemoriesBeforeScore')}</p>
                              <p className="text-5xl font-bold">{beforeScore}</p>
                          </div>
                          <div className="h-12 w-px bg-border"></div>
                          <div className="text-center">
                              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">{t('painfulMemoriesAfterScore')}</p>
                              <p className="text-5xl font-bold text-primary">{afterScore}</p>
                          </div>
                      </div>
                      
                      {afterScore < beforeScore ? (
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center w-full">
                          <p className="font-bold">Great improvement!</p>
                          <p className="text-sm">You reduced the emotional intensity by {beforeScore - afterScore} points.</p>
                        </div>
                      ) : afterScore === beforeScore ? (
                        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center w-full">
                          <p className="font-bold">Consistency is key.</p>
                          <p className="text-sm">Sometimes it takes multiple sessions to feel a change.</p>
                        </div>
                      ) : (
                        <div className="bg-amber-100 text-amber-800 p-4 rounded-lg text-center w-full">
                          <p className="font-bold">Interesting shift.</p>
                          <p className="text-sm">It's normal for intensities to fluctuate. Try relaxing before the next session.</p>
                        </div>
                      )}

                      <Button onClick={handleStartNewSession} className="w-full h-12" variant="outline">{t('painfulMemoriesStartNewSession')}</Button>
                  </CardContent>
              </Card>
          )}

          <div className="mt-8 text-center">
              <Button asChild variant="ghost">
                  <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('backButton')}
                  </Link>
              </Button>
          </div>
      </div>
    </>
  );
}
