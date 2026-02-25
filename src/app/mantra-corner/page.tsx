'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { BookOpen, Sparkles, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  mantra?: string;
}

export default function MantraCornerPage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
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

  const lessons: Lesson[] = [
    {
      id: 'lesson-1',
      title: 'ಮಂತ್ರ ಚೈತನ್ಯ ಮತ್ತು ಶುದ್ಧಿ',
      titleEn: 'Mantra Energy and Purifying',
      content: 'ಮಂತ್ರವನ್ನು ಪಠಿಸುವ ಮೊದಲು ಸ್ಥಳ ಮತ್ತು ಮನಸ್ಸಿನ ಶುದ್ಧಿ ಅತ್ಯಗತ್ಯ. ಇದು ಮಂತ್ರದ ಕಂಪನಗಳನ್ನು ದೇಹದಲ್ಲಿ ಸರಿಯಾಗಿ ಹೀರಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
      contentEn: 'Purity of space and mind is essential before chanting. This helps the body correctly absorb mantra vibrations.',
      mantra: 'ಓಂ ಶುದ್ಧಾಯ ನಮಃ'
    },
    {
      id: 'lesson-2',
      title: 'ಧ್ವನಿ ಕಂಪನದ ರಹಸ್ಯ',
      titleEn: 'Secret of Sound Vibrations',
      content: 'ಪ್ರತಿ ಅಕ್ಷರಕ್ಕೂ ಅದರದೇ ಆದ ಶಕ್ತಿ ಕೇಂದ್ರವಿದೆ. ಮಂತ್ರಗಳನ್ನು ಕೇವಲ ಓದುವುದಲ್ಲ, ಅವುಗಳನ್ನು ಅನುಭವಿಸುವುದು ಬಹಳ ಮುಖ್ಯ.',
      contentEn: 'Every syllable has its own power center. It is important not just to read mantras, but to experience them.',
    },
    {
      id: 'lesson-3',
      title: 'ಹನುಮಾನ್ ಶಕ್ತಿಯ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ',
      titleEn: 'Activating Hanuman Energy',
      content: 'ಪ್ರಾಣ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಲು ಹನುಮಾನ್ ಮಂತ್ರಗಳನ್ನು ಹೇಗೆ ಉಸಿರಾಟದೊಂದಿಗೆ ಸೇರಿಸಬೇಕು ಎಂಬ ವಿವರವಾದ ಮಾಹಿತಿ.',
      contentEn: 'Detailed info on how to sync Hanuman mantras with breathing to increase Prana energy.',
    }
  ];

  useEffect(() => {
    if (!isUserLoading && !isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
    }
  }, [isPremium, isUserLoading, isDeveloper]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={(isOpen) => {
          if (!isOpen) router.push('/');
          setShowUpgradeDialog(isOpen);
        }}
        title={t('toastUpgradeRequiredTitle')}
        description={t('premiumOnlyContent')}
      />

      <header className="mb-12 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {t('practicalLessons')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('practicalLessonsSubtitle')}
        </p>
      </header>

      <div className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          {lessons.map((lesson, index) => (
            <AccordionItem key={lesson.id} value={lesson.id} className="border-2 border-primary/10 rounded-xl px-4 mb-4 bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-primary/10 p-3 rounded-full text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-foreground">
                      {language === 'kn' ? lesson.title : lesson.titleEn}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <div className="space-y-4 text-muted-foreground leading-relaxed pl-14">
                  <p>{language === 'kn' ? lesson.content : lesson.contentEn}</p>
                  {lesson.mantra && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center font-headline text-2xl text-primary mt-4">
                      {lesson.mantra}
                    </div>
                  )}
                  <div className="flex justify-end pt-4">
                    <Button variant="ghost" size="sm" className="text-primary font-bold">
                      {t('lessonDetails')}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 text-center">
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