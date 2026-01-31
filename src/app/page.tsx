
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MantraPlayer } from "@/app/components/mantra-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, Heart, Share2, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function Home() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { toast } = useToast();
  const whatsAppUrl = "https://wa.me/917022070287";
  const kaliMantraImage = PlaceHolderImages.find(img => img.id === 'kali-mantra-infographic');
  const chakshuMantraImage = PlaceHolderImages.find(img => img.id === 'chakshu-mantra-infographic');

  const handlePainReliefSelect = () => {
    const kaliMantraIndex = mantras.findIndex(m => m.id === 1);
    if (kaliMantraIndex !== -1) {
      setCurrentTrackIndex(kaliMantraIndex);
      toast({
        title: "ನೋವು ನಿವಾರಣೆ ಮಂತ್ರ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
        description: "ಈಗ ನೀವು ಪ್ಲೇಯರ್‌ನಲ್ಲಿ ಮಂತ್ರವನ್ನು ಪ್ಲೇ ಮಾಡಬಹುದು.",
      });
    }
  };

  const handleEyeProblemsSelect = () => {
    const chakshuMantraIndex = mantras.findIndex(m => m.id === 2);
    if (chakshuMantraIndex !== -1) {
      setCurrentTrackIndex(chakshuMantraIndex);
       toast({
        title: "ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳ ಮಂತ್ರ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
        description: "ಈಗ ನೀವು ಪ್ಲೇಯರ್‌ನಲ್ಲಿ ಮಂತ್ರವನ್ನು ಪ್ಲೇ ಮಾಡಬಹುದು.",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "ಮಂತ್ರವಾಹಿನಿ",
      text: "Share power of mantras to reach everyone",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not share the app at this moment.",
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Copied to clipboard",
          description: "App link has been copied to your clipboard.",
        });
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Error",
          description: "Could not copy link to clipboard.",
        });
      }
    }
  };

  const cardAnimation = "animate-fade-in-up";

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              ಮಂತ್ರವಾಹಿನಿ
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            ನೋವು ರಹಿತ ಜೀವನಕ್ಕಾಗಿ,ಜೀವನದ ಉನ್ನತಿಗಾಗಿ
            </p>
          </header>

          <Card className={cn("mb-8 text-center bg-accent text-accent-foreground transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6" />
                Activated Mantra
                <Sparkles className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Try it and explore the power</p>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animationDelay: "0.6s" }}>
                <Card onClick={handlePainReliefSelect} className={cn("cursor-pointer overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)}>
                    <CardHeader>
                      <CardTitle className="font-headline text-center text-2xl">ನೋವು ನಿವಾರಣೆ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-auto w-full">
                        {kaliMantraImage && <Image
                          src={kaliMantraImage.imageUrl}
                          alt={kaliMantraImage.description}
                          width={1080}
                          height={1350}
                          className="object-contain rounded-md"
                          data-ai-hint={kaliMantraImage.imageHint}
                        />}
                      </div>
                      <div className="mt-4 space-y-2 text-center text-muted-foreground text-sm">
                        <p>1. ಒಂದು ಲೋಟ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.</p>
                        <p>2. ಚಿತ್ರದಲ್ಲಿ ತೋರಿಸಿರುವಂತೆ ಮೊಬೈಲ್ ಹಿಡಿದುಕೊಳ್ಳಿ. ಲೌಡ್ ಸ್ಪೀಕರ್ ಆನ್ ಮಾಡಿ, ಸ್ಪೀಕರ್ ನೀರಿನ ಕಡೆಗೆ ಇರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.</p>
                        <p>3. ಮ್ಯೂಸಿಕ್ ಪ್ಲೇಯರ್ ಅನ್ನು ರನ್ ಮಾಡಿ, ಮಂತ್ರದ ಅಂತ್ಯದವರೆಗೆ ಕಾಯಿರಿ.</p>
                        <p>4. ಈ ಮಂತ್ರ ತುಂಬಿದ ನೀರನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕುಡಿಯಿರಿ.</p>
                        <p className="font-semibold text-foreground">ನೋವು ತಕ್ಷಣವೇ ಕಡಿಮೆಯಾಗುವುದನ್ನು ಗಮನಿಸಿ. ಗುಣವಾಗುವವರೆಗೆ ಸಂಪೂರ್ಣ ನಂಬಿಕೆಯಿಂದ ಮುಂದುವರಿಸಿ.</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card onClick={handleEyeProblemsSelect} className={cn("cursor-pointer overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)}>
                      <CardHeader>
                        <CardTitle className="font-headline text-center text-2xl">ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳು</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="relative mx-auto aspect-auto w-full max-w-md">
                          {chakshuMantraImage && <Image
                            src={chakshuMantraImage.imageUrl}
                            alt={chakshuMantraImage.description}
                            width={1080}
                            height={1350}
                            className="object-contain rounded-md"
                            data-ai-hint={chakshuMantraImage.imageHint}
                          />}
                        </div>
                        <div className="mt-4 space-y-4 text-center text-sm">
                           <p className="text-muted-foreground">
                            ಈ ಮಂತ್ರವನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಹೆಡ್‌ಫೋನ್ ಅಥವಾ ಇಯರ್‌ಫೋನ್ ಬಳಸಿ ಕೇಳಿ. ಕೆಲವೇ ದಿನಗಳಲ್ಲಿ ಯಾವುದೇ ಕಣ್ಣಿನ ಸಮಸ್ಯೆಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ, ಎಲ್ಲಾ ರೋಗಲಕ್ಷಣಗಳು ಗುಣವಾಗುವವರೆಗೆ ಮುಂದುವರಿಸಿ.
                          </p>
                          <p className="font-semibold text-primary">
                            ಪ್ರಮುಖ ಸೂಚನೆ: ಈ ಮಂತ್ರವು ನೀವು ಏಳು ಜನರಿಗೆ ಹಂಚಿಕೊಂಡಾಗ ಮಾತ್ರ ಪೂರ್ಣ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
            </div>
            
            <div className={cn(cardAnimation)} style={{ animationDelay: "0.5s" }}>
              <MantraPlayer mantras={mantras} currentTrackIndex={currentTrackIndex} onTrackChange={setCurrentTrackIndex} />

              <div className={cn("mt-6 text-center", cardAnimation)} style={{ animationDelay: "0.55s" }}>
                <Button asChild size="lg" className="text-lg font-bold p-8 animate-pulse">
                  <Link href="/healing">
                    ಮಂತ್ರ ಚಿಕಿತ್ಸೆ -ರೋಗ ಮುಕ್ತಿಗಾಗಿ
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className={cn("mt-4", cardAnimation)} style={{ animationDelay: "0.7s" }}>
                <CardContent className="p-6 text-center space-y-4">
                  <p className="font-semibold text-foreground text-lg">
                    ಮಾನವ ಸೇವೆಯೇ ದೇವರ ಸೇವೆ
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          <Heart className="mr-2 h-4 w-4" />
                          Donate
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Donate for the Cause</AlertDialogTitle>
                          <AlertDialogDescription>
                            PhonePe/WhatsApp: 7022070287. Please send a screenshot to this number after payment.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          Join divine Group
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Join our Divine Entity Group / ನಮ್ಮ ದೈವಿಕ ಘಟಕದ ಗುಂಪಿಗೆ ಸೇರಿ</AlertDialogTitle>
                          <AlertDialogDescription>
                            To spread the power of mantras to everyone, join our group of divine entities.
                            <br />
                            ಮಂತ್ರಗಳ ಶಕ್ತಿಯನ್ನು ಎಲ್ಲರಿಗೂ ತಲುಪಿಸಲು, ನಮ್ಮ ದೈವಿಕ ಘಟಕಗಳ ಗುಂಪಿಗೆ ಸೇರಿಕೊಳ್ಳಿ.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share app to serve
                    </Button>
                  </div>
                </CardContent>
              </Card>
          </div>


          <Card className={cn("mt-8 text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">
                ಮಂತ್ರದ ಶಕ್ತಿಯನ್ನು ತಿಳಿದ ನಂತರ, ಶಿವನ ಮೇಲೆ ಸಂಪೂರ್ಣ ನಂಬಿಕೆ ಮತ್ತು ವಿಶ್ವಾಸದಿಂದ ನಿಮ್ಮ ಎಲ್ಲಾ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಲು ಸರಿಯಾದ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸಿದ ಮಂತ್ರಗಳನ್ನು ಬಳಸಿ!!!
              </p>
            </CardContent>
          </Card>

          <Card className={cn("mt-8", cardAnimation)} style={{ animationDelay: "0.7s" }}>
            <CardFooter className="flex flex-col items-center justify-center gap-4 p-4">
               <div className="text-center">
                <p>ಯಾವುದೇ ಸೇವೆಗಳಿಗೆ ನಮ್ಮ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ</p>
                <p className="font-bold text-lg text-primary">7022070287, ಹೊಸದುರ್ಗ</p>
              </div>
              <Button asChild>
                <Link href={whatsAppUrl} target="_blank">
                  <WhatsAppIcon />
                  WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ
                </Link>
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>
      <BannerAd />
    </div>
  );

    