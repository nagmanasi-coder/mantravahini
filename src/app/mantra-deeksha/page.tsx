
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Sparkles, Flower2, Heart, ShieldCheck, ArrowLeft, History, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MantraDeekshaPage() {
  const { t } = useLanguage();
  
  const sections = [
    {
      title: t('heritageTitle'),
      content: t('heritageContent'),
      icon: <History className="h-6 w-6 text-primary" />,
      color: "bg-primary/5 border-primary/20"
    },
    {
      title: t('impactTitle'),
      content: t('impactContent'),
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50 border-amber-200"
    },
    {
      title: t('freeForAllTitle'),
      content: t('freeForAllContent'),
      icon: <Heart className="h-6 w-6 text-red-500" />,
      color: "bg-red-50 border-red-200"
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background animate-fade-in">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pb-32">
          <header className="mb-12 text-center">
            <Button asChild variant="ghost" size="sm" className="mb-4 self-start">
               <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> {t('backButton')}</Link>
            </Button>
            <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
                    <Flower2 size={40} />
                </div>
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('mantraDeeksha')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground italic">
              "The sacred gateway to spiritual manifestation"
            </p>
          </header>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className={cn("overflow-hidden border-2 shadow-lg animate-fade-in-up", section.color)} style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed font-medium">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}

            <Separator className="my-8" />

            <Card className="border-primary border-4 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={100} />
                </div>
                <CardHeader className="bg-primary/10 text-center pb-2">
                    <CardTitle className="text-3xl font-headline text-primary flex items-center justify-center gap-2">
                        <ShieldCheck className="h-8 w-8" />
                        Initiation Protocol
                    </CardTitle>
                    <CardDescription className="font-bold text-primary/80">
                        How to receive your Deeksha today
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6 text-center relative z-10">
                    <div className="grid gap-6 text-left">
                        <div className="flex gap-4 items-start">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">1</div>
                            <p className="font-bold leading-tight">Prepare your space with clean water and a focused mind.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">2</div>
                            <p className="font-bold leading-tight">Play the specific mantra from our collection with full volume.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">3</div>
                            <p className="font-bold leading-tight">Visualize the sound vibrations entering every cell of your body.</p>
                        </div>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mt-4 italic font-medium">
                        "There is no fee for the divine light. It belongs to every heart that seeks it."
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-6 flex flex-col gap-4">
                    <Button asChild className="w-full h-14 text-lg font-black shadow-xl animate-bounce">
                        <Link href="/mantras">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Receive Deeksha Now
                        </Link>
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">
                        Hosted by the Himalayan Siddha Lineage
                    </p>
                </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToMain')}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
