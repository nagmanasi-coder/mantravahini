
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Sparkles, Footprints } from "lucide-react";

export default function GuruDikshaPage() {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('guruDikshaTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('guruDikshaSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center items-center h-48">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping"></div>
                        <div className="relative flex items-center justify-center rounded-full bg-primary h-24 w-24 shadow-lg">
                            <Sparkles className="h-12 w-12 text-primary-foreground" />
                        </div>
                    </div>
                </div>
                <p className="mt-8 font-semibold text-foreground">
                  {t('guruDikshaComingSoon')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                  <Footprints className="h-6 w-6 text-primary" />
                  {t('guruDikshaNathaTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-foreground">
                <p>{t('guruDikshaNathaContent')}</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
