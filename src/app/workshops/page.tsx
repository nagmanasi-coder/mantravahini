"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function WorkshopsPage() {
  const { t, language } = useLanguage();
  const whatsAppMessage = "Namaste! I am interested in enrolling for a Mantravaahini Workshop. Please provide details.";
  const whatsAppUrl = `https://wa.me/917022070287?text=${encodeURIComponent(whatsAppMessage)}`;

  const workshops = [
    {
      id: 1,
      title: t('workshop1Title'),
      description: t('workshop1Desc'),
      duration: language === 'kn' ? '೨ ದಿನಗಳು' : '2 Days',
      type: language === 'kn' ? 'ಆನ್‌ಲೈನ್ / ಆಫ್‌ಲೈನ್' : 'Online / Offline',
    },
    {
      id: 2,
      title: t('workshop2Title'),
      description: t('workshop2Desc'),
      duration: language === 'kn' ? '೫ ದಿನಗಳು' : '5 Days',
      type: language === 'kn' ? 'ಆಫ್‌ಲೈನ್ (ಹೊಸದುರ್ಗ)' : 'Offline (Hosadurga)',
    },
    {
      id: 3,
      title: t('workshop3Title'),
      description: t('workshop3Desc'),
      duration: language === 'kn' ? '೩ ದಿನಗಳು' : '3 Days',
      type: language === 'kn' ? 'ಆನ್‌ಲೈನ್ ಲೈವ್' : 'Online Live',
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('workshopsTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('workshopsSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            {workshops.map((workshop, index) => (
              <Card key={workshop.id} className="overflow-hidden shadow-lg border-2 border-primary/10 animate-fade-in-up" style={{ animationDelay: `${0.2 * index}s` }}>
                <CardHeader className="bg-primary/5">
                  <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {workshop.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {workshop.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{language === 'kn' ? 'ಅವಧಿ:' : 'Duration:'}</span> {workshop.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{language === 'kn' ? 'ಸ್ಥಳ:' : 'Venue:'}</span> {workshop.type}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                    <Users className="h-4 w-4" />
                    {language === 'kn' ? 'ಸೀಮಿತ ಸೀಟುಗಳು' : 'Limited Seats Available'}
                  </div>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={whatsAppUrl} target="_blank">
                      <WhatsAppIcon />
                      {t('workshopEnrollment')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-accent text-accent-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{language === 'kn' ? 'ಕಸ್ಟಮ್ ತರಬೇತಿ ಬೇಕೇ?' : 'Need Custom Training?'}</h3>
              <p className="text-sm opacity-90 mb-4">
                {language === 'kn' 
                  ? 'ನಿಮ್ಮ ಗುಂಪು ಅಥವಾ ಸಂಸ್ಥೆಗಾಗಿ ನಾವು ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಕಾರ್ಯಾಗಾರಗಳನ್ನು ಸಹ ನಡೆಸುತ್ತೇವೆ.' 
                  : 'We also conduct personalized workshops for your groups or organizations.'}
              </p>
              <Button variant="secondary" asChild>
                <Link href={whatsAppUrl} target="_blank">
                  {language === 'kn' ? 'ವಿವರಗಳಿಗಾಗಿ ವಿಚಾರಿಸಿ' : 'Inquire for Details'}
                </Link>
              </Button>
            </CardContent>
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
