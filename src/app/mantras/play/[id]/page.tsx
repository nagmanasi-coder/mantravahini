'use client';

import { use, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { mantras, type Mantra } from '@/lib/mantras';
import { StandaloneAudioPlayer } from '@/app/components/standalone-audio-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Info, Sparkles, HeartPulse, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

interface AssetData {
  id: string;
  url: string;
  fileType: string;
}

export default function MantraPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeContent, setUpgradeContent] = useState({ title: '', description: '' });

  const mantraId = parseInt(id);
  const baseMantra = mantras.find(m => m.id === mantraId);

  // Fetch cloud asset if linked
  const assetRef = useMemoFirebase(() => {
    if (!firestore || !baseMantra?.assetId) return null;
    return doc(firestore, 'assets', baseMantra.assetId);
  }, [firestore, baseMantra?.assetId]);

  const { data: assetData } = useDoc<AssetData>(assetRef);

  // Merge storage URL into mantra if available
  const mantra = useMemo(() => {
    if (!baseMantra) return null;
    if (assetData?.url) {
      return { ...baseMantra, url: assetData.url };
    }
    return baseMantra;
  }, [baseMantra, assetData]);

  if (!mantra) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold">Mantra not found</h1>
        <Button asChild className="mt-4"><Link href="/mantras">Return</Link></Button>
      </div>
    );
  }

  const handleUpgradeRequest = (title: string, description: string) => {
    setUpgradeContent({ title, description });
    setShowUpgradeDialog(true);
  };

  // Determine the best image based on the mantra ID or category
  const getMantraImageId = (id: number) => {
    if (id === 1) return 'kali-mantra-infographic'; // Water method
    if (id === 2) return 'chakshu-mantra-infographic'; // Headphone method
    if (id === 3) return 'roga-mukti-stotra-image'; // Roga Mukti
    if (id === 17) return 'bhairava-image'; // Kaala Bhairava
    return 'hanuman-healing'; // Default spiritual image
  };

  const currentMethod = language === 'kn' ? mantra.method : mantra.method_en;
  const currentBenefits = language === 'kn' ? mantra.benefits : mantra.benefits_en;
  const currentAbout = language === 'kn' ? mantra.description : mantra.description_en;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 animate-fade-in">
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
        title={upgradeContent.title}
        description={upgradeContent.description}
      />

      <div className="w-full max-w-2xl space-y-8 pt-12">
        <StandaloneAudioPlayer 
          mantra={mantra} 
          onUpgradeRequest={handleUpgradeRequest}
          showTracker={mantra.category === 'disease' && mantra.id === 1}
          imageId={getMantraImageId(mantra.id)}
        />

        <div className="grid gap-6">
          {currentMethod && (
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-primary font-headline text-xl">
                  <Zap className="h-5 w-5" />
                  {t('methodTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {currentMethod}
                </p>
              </CardContent>
            </Card>
          )}

          {currentBenefits && (
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-primary font-headline text-xl">
                  <HeartPulse className="h-5 w-5" />
                  {t('benefitsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {currentBenefits}
                </p>
              </CardContent>
            </Card>
          )}

          {currentAbout && (
            <Card className="border-primary/10 bg-muted/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-primary font-headline text-lg">
                  <Info className="h-5 w-5" />
                  {t('aboutMantraTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed italic">
                  {currentAbout}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center py-12 border-t border-primary/10">
          <Button asChild variant="outline" size="lg">
            <Link href={`/mantras/list/${mantra.category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToMantras')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t('backToMain')}
            </Link>
          </Button>
        </div>

        <div className="flex justify-center pb-12 opacity-20 text-primary">
           <Sparkles className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}
