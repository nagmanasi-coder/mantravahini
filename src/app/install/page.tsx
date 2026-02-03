
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function InstallPage() {
  const { t } = useLanguage();

  const installStep1Image = PlaceHolderImages.find(img => img.id === 'pwa-install-step-1');
  const installStep2Image = PlaceHolderImages.find(img => img.id === 'pwa-install-step-2');
  const installStep3Image = PlaceHolderImages.find(img => img.id === 'pwa-install-step-3');

  const steps = [
    {
      title: t('pwaInstallStep1Title'),
      description: t('pwaInstallStep1Description'),
      image: installStep1Image,
    },
    {
      title: t('pwaInstallStep2Title'),
      description: t('pwaInstallStep2Description'),
      image: installStep2Image,
    },
    {
      title: t('pwaInstallStep3Title'),
      description: t('pwaInstallStep3Description'),
      image: installStep3Image,
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('pwaInstallTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('pwaInstallSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{`${t('pwaStep')} ${index + 1}: ${step.title}`}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{step.description}</p>
                  {step.image && (
                    <div className="relative aspect-[9/16] w-full max-w-sm mx-auto border rounded-md overflow-hidden">
                       <Image
                        src={step.image.imageUrl}
                        alt={step.image.description}
                        fill
                        className="object-contain"
                        data-ai-hint={step.image.imageHint}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backButton')}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
