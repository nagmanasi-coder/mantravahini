"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function PracticalVideosPage() {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('practicalVideosTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('practicalVideosSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="font-semibold text-foreground">
                  {t('videosComingSoon')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
