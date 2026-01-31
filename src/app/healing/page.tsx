
"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);


export default function HealingPage() {
  const { t } = useLanguage();
  const whatsAppMessage = "Hello! I'm interested in Mantravaahini. Please reply with the number of your query:\n\n1. Upgrade to Premium\n2. Other Services";
  const whatsAppUrl = `https://wa.me/917022070287?text=${encodeURIComponent(whatsAppMessage)}`;
  const healingImage = PlaceHolderImages.find(img => img.id === 'hanuman-healing');

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('healingTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
             {t('healingSubtitle')}
            </p>
          </header>

          <Card className="overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center">{t('hanumanTherapyTitle')}</CardTitle>
              <CardDescription className="text-center">
                {t('hanumanTherapyDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-auto w-full max-w-md mx-auto">
                {healingImage && <Image
                  src={healingImage.imageUrl}
                  alt={healingImage.description}
                  width={1080}
                  height={1350}
                  className="rounded-md object-cover"
                  data-ai-hint={healingImage.imageHint}
                />}
              </div>
              <div className="text-center text-muted-foreground space-y-2">
                <p>{t('healingInfo1')}</p>
                <p>{t('healingInfo2')}</p>
              </div>
              <div className="my-6 rounded-md border border-primary/20 bg-primary/5 p-4 text-center">
                 <p className="font-headline text-xl font-bold text-primary">{t('hanumanDoha')}</p>
                 <p className="mt-2 text-sm text-foreground">
                   {t('hanumanDohaMeaning')}
                 </p>
              </div>

              {/* Fee Information Card */}
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="text-xl text-center text-primary">{t('hanumanTherapyFee')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">{t('hanumanTherapyFeeDetails')}</p>
                </CardContent>
              </Card>

              {/* Free Healing Conditions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center">{t('freeHealingTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-start text-sm text-muted-foreground">
                    <span className="mr-2 mt-1">1.</span>
                    <span>{t('freeHealingCondition1')}</span>
                  </p>
                  <p className="flex items-start text-sm text-muted-foreground">
                    <span className="mr-2 mt-1">2.</span>
                    <span>{t('freeHealingCondition2')}</span>
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                 <p className="mt-2 font-semibold text-foreground">{t('healingContact')}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-4">
              <div className="text-center">
                <p>{t('contact')}:</p>
                <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
              </div>
              <Button asChild>
                <Link href={whatsAppUrl} target="_blank">
                  <WhatsAppIcon />
                  {t('contactOnWhatsApp')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
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
