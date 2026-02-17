
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
import { ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    if (!container || !dot) return;

    let x = container.clientWidth / 2;
    let y = container.clientHeight / 2;
    let vx = (Math.random() - 0.5) * 2;
    let vy = (Math.random() - 0.5) * 2;
    let speed = 1;
    const maxSpeed = 10;
    const speedIncrement = (maxSpeed - speed) / (60 * 60); // Increase speed over 60 seconds

    const animate = () => {
      speed += speedIncrement;
      if (speed > maxSpeed) speed = maxSpeed;

      x += vx * speed;
      y += vy * speed;

      if (x <= 0 || x >= container.clientWidth) {
          vx *= -1;
          x = Math.max(0, Math.min(x, container.clientWidth)); // clamp
      }
      if (y <= 0 || y >= container.clientHeight) {
          vy *= -1;
          y = Math.max(0, Math.min(y, container.clientHeight)); // clamp
      }
      
      // Add some randomness to direction
      if (Math.random() < 0.02) {
          vx = (Math.random() - 0.5) * 2;
          vy = (Math.random() - 0.5) * 2;
      }

      dot.style.transform = `translate(${x}px, ${y}px)`;
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    const timerInterval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    const sessionTimer = setTimeout(() => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      clearInterval(timerInterval);
      onSessionEnd();
    }, 60000);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      clearTimeout(sessionTimer);
      clearInterval(timerInterval);
    };
  }, [onSessionEnd]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-[2000] flex items-center justify-center overflow-hidden">
      <div
        ref={dotRef}
        className="absolute w-6 h-6 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ top: '50%', left: '50%' }}
      />
      <div className="absolute top-5 right-5 text-black text-2xl font-bold">{timeLeft}</div>
       <p className="absolute bottom-5 text-black text-center">{t('painfulMemoriesFollowDot')}</p>
    </div>
  );
};


export default function PainfulMemoriesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isUserLoading } = useDoc<UserProfileType>(userDocRef);
  const isPremiumUser = userProfile?.subscriptionTier === 'premium';

  const [step, setStep] = useState<'instructions' | 'session' | 'post_session' | 'results'>('instructions');
  const [beforeScore, setBeforeScore] = useState(5);
  const [afterScore, setAfterScore] = useState(5);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && !isPremiumUser) {
        setShowUpgradeDialog(true);
    }
  }, [isPremiumUser, isUserLoading]);

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
     const pastResults = JSON.parse(localStorage.getItem('painfulMemoriesResults') || '[]');
     localStorage.setItem('painfulMemoriesResults', JSON.stringify([...pastResults, sessionResult]));
     setStep('results');
  };
  
  const handleStartNewSession = () => {
    setBeforeScore(5);
    setAfterScore(5);
    setStep('instructions');
  };

  if (isUserLoading) {
    return (
       <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <p>{t('loading') || 'Loading...'}</p>
       </div>
    )
  }
  
  if (!isPremiumUser) {
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
  
  // The main component render
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('painfulMemoriesTitle')}
            </h1>
        </header>

        {step === 'instructions' && (
            <Card>
                <CardHeader>
                    <CardTitle>{t('painfulMemoriesInstructionsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p>1. {t('painfulMemoriesInstructionsStep1')}</p>
                    <p>2. {t('painfulMemoriesInstructionsStep2')}</p>
                    <p>3. {t('painfulMemoriesInstructionsStep3')}</p>
                    <p>4. {t('painfulMemoriesInstructionsStep4')}</p>
                    <p>5. {t('painfulMemoriesInstructionsStep5')}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 items-start pt-6">
                    <h3 className="font-bold text-lg text-primary">{t('painfulMemoriesPreSessionTitle')}</h3>
                    <div className="w-full space-y-2">
                        <label>{t('painfulMemoriesRatePain')} {beforeScore}</label>
                        <Slider
                            value={[beforeScore]}
                            onValueChange={(value) => setBeforeScore(value[0])}
                            max={10}
                            step={1}
                        />
                         <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>10</span>
                        </div>
                    </div>
                   <Button onClick={handleStartSession} className="w-full">{t('painfulMemoriesStartSession')}</Button>
                </CardFooter>
            </Card>
        )}

        {step === 'session' && <MovingDot onSessionEnd={handleSessionEnd} />}

        {step === 'post_session' && (
            <Card>
                <CardHeader>
                    <CardTitle>{t('painfulMemoriesPostSessionTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-start">
                     <div className="w-full space-y-2">
                         <label>{t('painfulMemoriesRatePainAgain')} {afterScore}</label>
                         <Slider
                             value={[afterScore]}
                             onValueChange={(value) => setAfterScore(value[0])}
                             max={10}
                             step={1}
                         />
                          <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0</span>
                              <span>10</span>
                          </div>
                     </div>
                     <Button onClick={handleViewResults} className="w-full">{t('painfulMemoriesViewResults')}</Button>
                 </CardContent>
             </Card>
        )}

        {step === 'results' && (
            <Card>
               <CardHeader>
                    <CardTitle>{t('painfulMemoriesResultsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center">
                    <div className="flex justify-around w-full text-center">
                        <div>
                            <p className="text-muted-foreground">{t('painfulMemoriesBeforeScore')}</p>
                            <p className="text-4xl font-bold">{beforeScore}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">{t('painfulMemoriesAfterScore')}</p>
                            <p className="text-4xl font-bold text-primary">{afterScore}</p>
                        </div>
                    </div>
                    <Button onClick={handleStartNewSession} className="w-full" variant="outline">{t('painfulMemoriesStartNewSession')}</Button>
                </CardContent>
            </Card>
        )}

        <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('backButton')}
                </Link>
            </Button>
        </div>
    </div>
  );
}
