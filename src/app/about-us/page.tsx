"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";

export default function AboutUsPage() {
  const { t } = useLanguage();
  const cardAnimation = "animate-fade-in-up";
  const founderImage = PlaceHolderImages.find(img => img.id === 'founder-portrait');

  const sections = [
    {
      title: t('aboutSection1Title'),
      content: t('aboutSection1Content')
    },
    {
      title: t('aboutSection2Title'),
      content: t('aboutSection2Content')
    },
    {
      title: t('aboutSection3Title'),
      content: t('aboutSection3Content')
    },
    {
      title: t('aboutSection4Title'),
      content: t('aboutSection4Content')
    },
    {
      title: t('aboutSection5Title'),
      content: t('aboutSection5Content')
    },
    {
      title: t('aboutSection6Title'),
      content: t('aboutSection6Content')
    },
    {
      title: t('aboutSection7Title'),
      content: t('aboutSection7Content')
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('aboutUsTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('aboutUsSubtitle')}
            </p>
          </header>

          <Card className={cn("overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className={cn("md:col-span-1 flex flex-col items-center text-center space-y-4", cardAnimation)} style={{ animationDelay: "0.3s" }}>
                   <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/50 shadow-lg">
                    {founderImage && <Image
                      src={founderImage.imageUrl}
                      alt={founderImage.description}
                      fill
                      sizes="192px"
                      className="object-cover"
                      data-ai-hint={founderImage.imageHint}
                    />}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-headline text-primary">Nagaraja D</h2>
                    <p className="text-muted-foreground">Mystic Explorer</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                   <Accordion type="single" collapsible className="w-full">
                    {sections.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={index} className={cn(cardAnimation)} style={{ animationDelay: `${0.4 + index * 0.1}s`}}>
                        <AccordionTrigger className="font-headline text-xl font-bold text-primary">{index + 1}. {section.title}</AccordionTrigger>
                        <AccordionContent className="text-left text-foreground">
                          <p>{section.content}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
              
              <Separator className="my-8" />

              <div className={cn("text-center space-y-2", cardAnimation)} style={{ animationDelay: "1.2s" }}>
                  <p className="font-bold text-accent text-xl">{t('tagline1')}</p>
                  <p className="font-semibold text-muted-foreground">{t('tagline2')}</p>
                  <p className="font-semibold text-muted-foreground">{t('tagline3')}</p>
              </div>

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
