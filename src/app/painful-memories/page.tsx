
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
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';

type UserProfileType = {
  subscriptionTier?: 'free' | 'basic' | 'premium';
};

const MovingDot = ({ onSessionEnd }: { onSessionEnd: () => void }) => {
  const { t } = useLanguage();
  const dotRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timeLeftRef = useRef(timeLeft);

  // Sync ref with state for the animation loop
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Timer Interval
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [hasStarted, isFinished]);

  // Session Completion Effect
  useEffect(() => {
    if (hasStarted && timeLeft === 0) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      setIsFinished(true);
    }
  }, [timeLeft, hasStarted]);

  // Animation Loop
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const container = containerRef.current;
    const dot = dotRef.current;
    if (!container || !dot) return;

    let x = container.clientWidth / 2;
    let y = container.clientHeight / 2;
    let vx = (Math.random() - 0.5) * 2;
    let vy = (Math.random() - 0.5) * 2;
    const mag = Math.sqrt(vx * vx + vy * vy);
    vx /= mag;
    vy /= mag;

    const animate = () => {
      const currentRemaining = timeLeftRef.current;
      let speed = 3;
      if (currentRemaining <= 50) speed = 6;
      if (currentRemaining <= 40) speed = 10;
      if (currentRemaining <= 30) speed = 15;
      if (currentRemaining <= 15) speed = 20;

      x += vx * speed;
      y += vy * speed;

      if (x <= 12 || x >= container.clientWidth - 12) {
          vx *= -1;
          x = Math.max(12, Math.min(x, container.clientWidth - 12));
      }
      if (y <= 12 || y >= container.clientHeight - 12) {
          vy *= -1;
          y = Math.max(12, Math.min(y, container.clientHeight - 12));
      }
      
      if (Math.random() < 0.02) {
          const nudgeX = (Math.random() - 0.5) * 0.5;
          const nudgeY = (Math.random() - 0.5) * 0.5;
          vx += nudgeX;
          vy += nudgeY;
          const newMag = Math.sqrt(vx * vx + vy * vy);
          vx /= newMag;
          vy /= newMag;
      }

      if (dot) {
        dot.style.transform = `translate(${x}px, ${y}px)`;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [hasStarted, isFinished]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-[2000] flex items-center justify-center overflow-hidden">
      {!hasStarted ? (
        <div className="flex flex-col items-center gap-8 animate-fade-in">
          <p className="text-black text-2xl font-bold text-center px-4 mb-4">
            {t('painfulMemoriesFollowDot')}
          </p>
          <Button 
            size="lg" 
            className="rounded-full h-32 w-32 bg-primary hover:bg-primary/90 shadow-2xl transition-transform hover:scale-105" 
            onClick={() => setHasStarted(true)}
          >
            <Play className="h-14 w-14 fill-white text-white ml-1" />
          </Button>
          <div className="flex flex-col gap-3 text-black/70 font-bold text-xl mt-8 px-6 text-center max-w-lg">
            <p>{t('painfulMemoriesSessionStep1')}</p>
            <p>{t('painfulMemoriesSessionStep2')}</p>
            <p>{t('painfulMemoriesSessionStep3')}</p>
            <p>{t('painfulMemoriesSessionStep4')}</p>
            <p>{t('painfulMemoriesSessionStep5')}</p>
          </div>
        </div>
      ) : isFinished ? (
        <div className="flex flex-col items-center gap-8 animate-fade-in text-center px-6">
          <p className="text-black text-3xl font-bold">
            {t('painfulMemoriesSessionEnded')}
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-8 py-4 bg-primary hover:bg-primary/90 shadow-2xl transition-transform hover:scale-105 h-auto text-xl font-bold" 
            onClick={() => onSessionEnd()}
          >
            {t('painfulMemoriesClickToRate')}
          </Button>
        </div>
      ) : (
        <>
          <div
            ref={dotRef}
            className="absolute w-8 h-8 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"
            style={{ top: '0px', left: '0px' }}
          />
          <div className="absolute top-8 right-8 text-black text-4xl font-bold font-mono bg-white/80 px-4 py-2 rounded-lg border-2 border-black">
            {timeLeft}s
          </div>
          <div className="absolute bottom-8 left-0 w-full text-center">
             <p className="text-black/60 font-medium px-4">
               {timeLeft > 50 ? 'Level: Slow' : 
                timeLeft > 40 ? 'Level: Average' : 
                timeLeft > 30 ? 'Level: Speed' : 
                'Level: Very Speed'}
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
  const [step, setStep] = useState<'instructions' | 'session' | 'post_session' | 'results'>('instructions');
  const [beforeScore, setBeforeScore] = useState(5);
  const [afterScore, setAfterScore] = useState(5);
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
    setStep('post_session');
  };

  const handleViewResults = () => {
     const sessionResult = {
        date: new Date().toISOString(),
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
    setStep('instructions');
  };

  if (isUserLoading) {
    return (
       <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 text-center mt-20">
          <p className="text-muted-foreground">{t('loading') || 'Loading...'}</p>
       </div>
    )
  }
  
  if (!isPremiumUser && !isDeveloper && step !== 'results') {
     return (
        <UpgradeDialog 
            open={showUpgradeDialog} 
            onOpenChange={(isOpen) => {
                if(!isOpen) router.push('/');
                setShowUpgradeDialog(isOpen);
            }}
            title={t('toastUpgradeRequiredTitle')}
            description={t('painfulMemoriesPremiumFeature')}
        />
     )
  }
  
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
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
                <CardContent className="space-y-4 text-muted-foreground">
                    <div className="grid gap-3">
                      <p>1. {t('painfulMemoriesInstructionsStep1')}</p>
                      <p>2. {t('painfulMemoriesInstructionsStep2')}</p>
                      <p>3. {t('painfulMemoriesInstructionsStep3')}</p>
                      <p>4. {t('painfulMemoriesInstructionsStep4')}</p>
                      <p>5. {t('painfulMemoriesInstructionsStep5')}</p>
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
                   <Button onClick={handleStartSession} size="lg" className="w-full text-lg font-bold h-14">{t('painfulMemoriesStartSession')}</Button>
                </CardFooter>
            </Card>
        )}

        {step === 'session' && <MovingDot onSessionEnd={handleSessionEnd} />}

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
  );
}
