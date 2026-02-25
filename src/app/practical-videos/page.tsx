'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Video, Play, ArrowLeft, Sparkles, Clock, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface PracticalVideo {
  id: string;
  title: string;
  titleEn: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const staticVideos: PracticalVideo[] = [
  {
    id: 'vid-1',
    title: 'ನೋವು ನಿವಾರಕ ಮಂತ್ರದ ಸರಿಯಾದ ಬಳಕೆ',
    titleEn: 'Correct Usage of Pain Relief Mantra',
    duration: '5:24',
    thumbnail: 'https://picsum.photos/seed/vid1/600/400',
    videoUrl: '#',
  },
  {
    id: 'vid-2',
    title: 'ಚಾಕ್ಷುಷ ಮಂತ್ರ ಮತ್ತು ಕಣ್ಣಿನ ವ್ಯಾಯಾಮ',
    titleEn: 'Chakshu Mantra and Eye Exercises',
    duration: '8:12',
    thumbnail: 'https://picsum.photos/seed/vid2/600/400',
    videoUrl: '#',
  },
  {
    id: 'vid-3',
    title: 'ಹನುಮಾನ್ ಮಂತ್ರ ಚಿಕಿತ್ಸೆ - ಪ್ರಾತ್ಯಕ್ಷಿಕೆ',
    titleEn: 'Hanuman Mantra Therapy - Demo',
    duration: '12:45',
    thumbnail: 'https://picsum.photos/seed/vid3/600/400',
    videoUrl: '#',
  }
];

export default function PracticalVideosPage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  const isPremium = userProfile?.subscriptionTier === 'premium';

  // Fetch uploaded Video assets
  const videoAssetsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'assets'), where('fileType', '==', 'video'));
  }, [firestore]);

  const { data: uploadedVideos, isLoading: assetsLoading } = useCollection(videoAssetsQuery);

  const isDeveloper = useMemo(() => {
    if (!user) return false;
    const isActualDeveloper = user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
    if (typeof window !== 'undefined') {
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      return isActualDeveloper && devModeEnabled;
    }
    return false;
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && !isProfileLoading && !isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
    }
  }, [isPremium, isAuthLoading, isProfileLoading, isDeveloper]);

  const handleWatchVideo = (url: string) => {
    if (!url || url === '#') {
      toast({
        title: language === 'kn' ? 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ' : 'Coming Soon',
        description: t('videosComingSoon'),
      });
      return;
    }
    window.open(url, '_blank');
  };

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground mt-4">{t('loading')}</p>
      </div>
    );
  }

  const hasContent = (uploadedVideos && uploadedVideos.length > 0) || staticVideos.length > 0;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 pb-32">
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
          {t('practicalVideosTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('practicalVideosSubtitle')}
        </p>
      </header>

      {!hasContent && !assetsLoading && (
        <Card className="p-12 text-center border-dashed border-2 border-primary/20 bg-primary/5">
          <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="h-10 w-10 text-primary/40" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-primary mb-2">{t('contentComingSoon')}</h2>
          <p className="text-muted-foreground">{t('videosComingSoon')}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Uploaded Videos */}
        {uploadedVideos && uploadedVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden shadow-lg border-2 border-primary/30 hover:border-primary/50 transition-all flex flex-col group bg-card">
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <Video className="h-12 w-12 text-primary/40" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 rounded-full p-4 text-white shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 fill-white" />
                </div>
              </div>
            </div>
            <CardHeader className="p-4 bg-card">
              <CardTitle className="text-lg font-headline line-clamp-2">
                {video.fileName}
              </CardTitle>
              <CardDescription>{new Date(video.uploadDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 mt-auto">
              <Button onClick={() => handleWatchVideo(video.url)} className="w-full gap-2 font-bold" variant="secondary">
                <Play className="h-4 w-4" />
                {t('watchVideo')}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Static Starter Videos */}
        {staticVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all flex flex-col group">
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <Image 
                src={video.thumbnail} 
                alt={video.titleEn} 
                fill 
                className="object-cover opacity-80 group-hover:scale-105 transition-transform"
                data-ai-hint="spiritual video thumbnail"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 rounded-full p-4 text-white shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
            </div>
            <CardHeader className="p-4 bg-card">
              <CardTitle className="text-lg font-headline line-clamp-2">
                {language === 'kn' ? video.title : video.titleEn}
              </CardTitle>
            </CardHeader>
            <CardFooter className="p-4 pt-0 mt-auto">
              <Button onClick={() => handleWatchVideo(video.videoUrl)} className="w-full gap-2 font-bold" variant="secondary">
                <Play className="h-4 w-4" />
                {t('watchVideo')}
              </Button>
            </CardFooter>
          </Card>
        ))}
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
