
'use client';

import { useLanguage } from '@/context/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function MantraHubPage() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const categories = [
    {
      id: 'protective',
      title: t('protectiveTitle'),
      icon: <Shield className="h-12 w-12 text-amber-500" />,
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      description: t('protectiveDesc')
    },
    {
      id: 'solving',
      title: t('solvingTitle'),
      icon: <Zap className="h-12 w-12 text-primary" />,
      color: "bg-primary/5 border-primary/20 hover:bg-primary/10",
      description: t('solvingDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-12">
      <header className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary border-b-4 border-primary/20 pb-4">
          {t('mantraHubTitle')}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('appSubtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {categories.map((cat, i) => (
          <Link key={cat.id} href={`/mantras/list/${cat.id}`} className="block group">
            <Card className={cn(
              "h-full transition-all duration-300 transform group-hover:scale-105 border-2 shadow-lg",
              cat.color
            )}>
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="p-4 rounded-full bg-white shadow-inner animate-pulse">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button asChild variant="ghost" size="lg" className="text-primary font-bold">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('backToMain')}
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium opacity-50 uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          Mantravaahini Focused Mode
          <Sparkles className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
