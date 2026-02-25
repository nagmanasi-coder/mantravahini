'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { BookText, ShieldAlert, ArrowLeft, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PremiumBook {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  description: string;
  descriptionEn: string;
  pdfUrl: string; // Internal static path or external secure link
}

export default function PremiumLibraryPage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [selectedBook, setSelectedBook] = useState<PremiumBook | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  const isPremium = userProfile?.subscriptionTier === 'premium';
  const isUserLoading = isAuthLoading || (user && isProfileLoading);

  const books: PremiumBook[] = [
    {
      id: 'book-1',
      title: 'ಹನುಮಾನ್ ಚಾಲೀಸಾ ಚಿಕಿತ್ಸೆ',
      titleEn: 'Hanuman Chalisa Therapy',
      author: 'Nagaraja D',
      description: 'ಹನುಮಾನ್ ಚಾಲೀಸಾದ ಮೂಲಕ ರೋಗಗಳನ್ನು ಗುಣಪಡಿಸುವ ಪ್ರಾಯೋಗಿಕ ವಿಧಾನ.',
      descriptionEn: 'Practical methods to heal diseases through Hanuman Chalisa.',
      pdfUrl: '/manuals/hanuman-therapy.pdf',
    },
    {
      id: 'book-2',
      title: 'ಮಂತ್ರ ವಿಜ್ಞಾನ ರಹಸ್ಯಗಳು',
      titleEn: 'Secrets of Mantra Science',
      author: 'Nagaraja D',
      description: 'ಮಂತ್ರಗಳ ಧ್ವನಿ ಕಂಪನ ಮತ್ತು ಅವುಗಳ ವೈಜ್ಞಾನಿಕ ಪರಿಣಾಮಗಳ ಬಗ್ಗೆ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',
      descriptionEn: 'Complete information about sound vibrations of mantras and their scientific effects.',
      pdfUrl: '/manuals/mantra-secrets.pdf',
    }
  ];

  useEffect(() => {
    if (user) {
      const isActualDeveloper = user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      setIsDeveloper(isActualDeveloper && devModeEnabled);
    }
  }, [user]);

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
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
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
          {t('premiumLibrary')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('premiumLibrarySubtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col overflow-hidden shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader className="bg-primary/5">
              <CardTitle className="font-headline text-2xl text-primary">{language === 'kn' ? book.title : book.titleEn}</CardTitle>
              <CardDescription>{language === 'kn' ? `ಲೇಖಕರು: ${book.author}` : `By: ${book.author}`}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <p className="text-muted-foreground italic leading-relaxed">
                {language === 'kn' ? book.description : book.descriptionEn}
              </p>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4">
              <Button onClick={() => setSelectedBook(book)} className="w-full font-bold">
                <Eye className="mr-2 h-4 w-4" />
                {t('readNow')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 bg-muted/50 border-b flex flex-row items-center justify-between">
            <DialogTitle className="font-headline text-xl text-primary">
              {selectedBook && (language === 'kn' ? selectedBook.title : selectedBook.titleEn)}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-white relative">
            {/* 
              In a real app, you would use a library like react-pdf or a secure PDF viewer component.
              For this prototype, we use an iframe pointing to the URL.
              To prevent 'download', we use styles and parameters, though truly blocking download requires complex backend logic.
            */}
            {selectedBook && (
              <iframe
                src={`${selectedBook.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                title={selectedBook.titleEn}
              />
            )}
            <div className="absolute top-0 right-0 p-4 pointer-events-none">
               <div className="bg-primary/80 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">In-App Reader Only</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
