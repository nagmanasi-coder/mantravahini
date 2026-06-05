
'use client';

import { use, useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import { mantras } from '@/lib/mantras';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Lock, ChevronRight, Sparkles, CheckCircle2, Clock, Shield, Zap, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MantraListPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { t, language } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();

  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dev = localStorage.getItem('developerMode') === 'true' && user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
      setIsDevMode(dev);
    }
  }, [user]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: string, createdAt?: string }>(userDocRef);
  const isPaidUser = userProfile?.subscriptionTier === 'premium';

  // 7-Day Trial Logic
  const isWithinTrial = useMemo(() => {
    if (!userProfile?.createdAt) return false;
    const createdDate = new Date(userProfile.createdAt);
    const daysSinceCreation = differenceInDays(new Date(), createdDate);
    return daysSinceCreation >= 0 && daysSinceCreation < 7;
  }, [userProfile?.createdAt]);

  const filteredMantras = mantras.filter(m => m.category === category);
  const categoryTitle = category === 'protective' ? t('protectiveTitle') : t('solvingTitle');

  // List of IDs that have verified audio assets attached or hardcoded URLs ready
  const readyMantraIds = [1, 2, 3, 16, 17];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8 animate-fade-in">
        <header className="text-center space-y-4 pt-12 pb-8 border-b-2 border-primary/10">
          <div className="flex justify-center mb-4">
             {category === 'protective' ? <Shield className="h-12 w-12 text-amber-500 animate-pulse" /> : <Zap className="h-12 w-12 text-primary animate-pulse" />}
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground">
            {filteredMantras.length} {language === 'kn' ? 'ಮಂತ್ರಗಳು ಪಟ್ಟಿಯಲ್ಲಿವೆ' : 'Mantras in collection'}
          </p>
          {isWithinTrial && !isPaidUser && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('trialAccess')}
            </Badge>
          )}
          {isDevMode && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-2">
              <Wrench className="h-3 w-3 mr-1" />
              Dev Mode: All Access Enabled
            </Badge>
          )}
        </header>

        <div className="grid gap-4">
          {filteredMantras.map((mantra) => {
            const isActuallyReady = readyMantraIds.includes(mantra.id);
            const canAccess = isActuallyReady || isDevMode;
            
            // In Dev Mode, always go to player to test. In Public Mode, specialized ones go to prana-vidya.
            const targetHref = (canAccess && !isDevMode && (mantra.id === 9 || mantra.id === 10)) 
              ? '/prana-vidya' 
              : `/mantras/play/${mantra.id}`;
              
            const isPremium = mantra.tier === 'paid';
            const isUnlocked = isPaidUser || isWithinTrial || !isPremium;
            
            return (
              <Link key={mantra.id} href={canAccess ? targetHref : '#'} className={cn(!canAccess && "pointer-events-none")}>
                <Card className={cn(
                  "hover:border-primary/50 transition-all hover:shadow-md group",
                  !canAccess && "opacity-60 grayscale-[0.5]"
                )}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full transition-colors",
                        canAccess ? (isActuallyReady ? "bg-primary/10 group-hover:bg-primary group-hover:text-white" : "bg-blue-100 text-blue-700 group-hover:bg-blue-500 group-hover:text-white") : "bg-muted"
                      )}>
                        <Music className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg leading-tight">
                          {language === 'kn' ? mantra.name : mantra.name_en}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {isActuallyReady ? (
                            <>
                              {!isUnlocked ? (
                                <Badge variant="outline" className="text-[10px] uppercase text-amber-600 border-amber-200">
                                  <Lock className="h-2 w-2 mr-1" />
                                  Premium
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] uppercase text-green-600 border-green-200">
                                  <CheckCircle2 className="h-2 w-2 mr-1" />
                                  {isWithinTrial && isPremium && !isPaidUser ? 'Trial Access' : 'Ready'}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="secondary" className={cn(
                              "text-[10px] uppercase border-none",
                              isDevMode ? "bg-blue-100 text-blue-700" : "text-muted-foreground bg-muted"
                            )}>
                              {isDevMode ? <Wrench className="h-2 w-2 mr-1 inline" /> : <Clock className="h-2 w-2 mr-1 inline" />}
                              {isDevMode ? 'Dev Access (Test Link)' : (language === 'kn' ? 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ' : 'Coming Soon')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {canAccess && <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/mantras">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToMantras')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/">
              {t('backToMain')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
