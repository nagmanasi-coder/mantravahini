
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft, Eye, Loader2, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface PremiumBook {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  description: string;
  descriptionEn: string;
  pdfUrl: string;
}

interface Asset {
  id: string;
  title?: string;
  fileName: string;
  fileType: string;
  url: string;
  uploadDate: string;
}

// Fallback books if no assets are uploaded yet
const staticBooks: PremiumBook[] = [
  {
    id: 'book-1',
    title: 'ಹನುಮಾನ್ ಚಾಲೀಸಾ ಚಿಕಿತ್ಸೆ',
    titleEn: 'Hanuman Chalisa Therapy',
    author: 'Nagaraja D',
    description: 'ಹನುಮಾನ್ ಚಾಲೀಸಾದ ಮೂಲಕ ರೋಗಗಳನ್ನು ಗುಣಪಡಿಸುವ ಪ್ರಾಯೋಗಿಕ ವಿಧಾನ.',
    descriptionEn: 'Practical methods to heal diseases through Hanuman Chalisa.',
    pdfUrl: '#', 
  }
];

export default function PremiumLibraryPage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedBookUrl, setSelectedBookUrl] = useState<string | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  
  const isPremium = userProfile?.subscriptionTier === 'premium';

  const isDeveloper = useMemo(() => {
    if (!user) return false;
    const isActualDeveloper = user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
    if (typeof window !== 'undefined') {
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      return isActualDeveloper && devModeEnabled;
    }
    return false;
  }, [user]);

  // Fetch uploaded PDF assets from Firestore metadata
  const libraryAssetsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'assets'), where('fileType', '==', 'document'));
  }, [firestore]);

  const { data: uploadedAssets, isLoading: assetsLoading } = useCollection<Asset>(libraryAssetsQuery);

  useEffect(() => {
    if (!isAuthLoading && !isProfileLoading && !isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
    }
  }, [isPremium, isAuthLoading, isProfileLoading, isDeveloper]);

  const handleOpenBook = (title: string, url: string) => {
    if (!url || url === '#') {
      toast({
        title: language === 'kn' ? 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ' : 'Coming Soon',
        description: t('contentComingSoon'),
      });
      return;
    }
    setSelectedBookTitle(title);
    setSelectedBookUrl(url);
  };

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground mt-4">{t('loading')}</p>
      </div>
    );
  }

  const hasContent = (uploadedAssets && uploadedAssets.length > 0) || staticBooks.length > 0;

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

      {!hasContent && !assetsLoading && (
        <Card className="p-12 text-center border-dashed border-2 border-primary/20 bg-primary/5">
          <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-primary/40" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-primary mb-2">{t('contentComingSoon')}</h2>
          <p className="text-muted-foreground">{language === 'kn' ? 'ನಾವು ನಿಮಗಾಗಿ ಉತ್ತಮ ಆಧ್ಯಾತ್ಮಿಕ ಪುಸ್ತಕಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇವೆ.' : 'We are preparing great spiritual books for you.'}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Uploaded Assets */}
        {uploadedAssets && uploadedAssets.map((asset) => {
          // Specific logic for the Swayam Chikitse book requested by user
          // We use translation key for this specific asset ID
          const displayTitle = asset.id === 'swayam-chikitse-paper-book-pdf' 
            ? t('swayamChikitseBookTitle' as any)
            : (asset.title || asset.fileName);

          return (
            <Card key={asset.id} className="flex flex-col overflow-hidden shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all bg-card">
              <CardHeader className="bg-primary/10">
                <CardTitle className="font-headline text-2xl text-primary">{displayTitle}</CardTitle>
                <CardDescription>{new Date(asset.uploadDate).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">{t('digitalEdition')}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4">
                <Button onClick={() => handleOpenBook(displayTitle, asset.url)} className="w-full font-bold">
                  <Eye className="mr-2 h-4 w-4" />
                  {t('readNow')}
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {/* Static Starter Books */}
        {staticBooks.map((book) => (
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
              <Button onClick={() => handleOpenBook(language === 'kn' ? book.title : book.titleEn, book.pdfUrl)} className="w-full font-bold">
                <Eye className="mr-2 h-4 w-4" />
                {t('readNow')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBookUrl} onOpenChange={(open) => !open && setSelectedBookUrl(null)}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 bg-muted/50 border-b">
            <DialogTitle className="font-headline text-xl text-primary truncate">
              {selectedBookTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-white relative">
            {selectedBookUrl && (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedBookUrl)}&embedded=true`}
                className="w-full h-full border-none"
                title="Book Viewer"
              />
            )}
            <div className="absolute top-0 right-0 p-4 pointer-events-none">
               <div className="bg-primary/80 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">{t('inAppReaderOnly')}</div>
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
