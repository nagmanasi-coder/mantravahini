'use client';

import { use } from 'react';
import { useLanguage } from '@/context/language-context';
import { mantras } from '@/lib/mantras';
import { StandaloneAudioPlayer } from '@/app/components/standalone-audio-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { Card, CardContent } from '@/components/ui/card';

export default function MantraPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeContent, setUpgradeContent] = useState({ title: '', description: '' });

  const mantraId = parseInt(id);
  const mantra = mantras.find(m => m.id === mantraId);

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
    if (id === 2 || id === 17) return 'chakshu-mantra-infographic'; // Headphone method
    return 'hanuman-healing'; // Default spiritual image
  };

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

        {(mantra.description || mantra.description_en) && (
          <Card className="border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-primary font-bold mb-4">
                <Info className="h-5 w-5" />
                <span>{language === 'kn' ? 'ಮಂತ್ರದ ಬಗ್ಗೆ' : 'About this Mantra'}</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {language === 'kn' ? mantra.description : mantra.description_en}
              </p>
            </CardContent>
          </Card>
        )}

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
