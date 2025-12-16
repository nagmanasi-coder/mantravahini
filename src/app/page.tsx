"use client";

import Image from "next/image";
import { useState } from "react";
import { MantraPlayer } from "@/app/components/mantra-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Heart, Share2, Users } from "lucide-react";
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

export default function Home() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    if (value === 'pain-relief') {
      const kaliMantraIndex = mantras.findIndex(m => m.id === 1);
      if (kaliMantraIndex !== -1) {
        setCurrentTrackIndex(kaliMantraIndex);
      }
    } else if (value === 'eye-problems') {
      const chakshuMantraIndex = mantras.findIndex(m => m.id === 2);
      if (chakshuMantraIndex !== -1) {
        setCurrentTrackIndex(chakshuMantraIndex);
      }
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
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              ಮಂತ್ರವಾಹಿನಿ
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            ಮಂತ್ರ ಶಕ್ತಿ: ನಿಮ್ಮಜೀವನದ ಉನ್ನತಿಗಾಗಿ
            </p>
          </header>

          <Card className={cn("mb-8 text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">
                ಮಂತ್ರದ ಶಕ್ತಿಯನ್ನು ತಿಳಿದ ನಂತರ, ಶಿವನ ಮೇಲೆ ಸಂಪೂರ್ಣ ನಂಬಿಕೆ ಮತ್ತು ವಿಶ್ವಾಸದಿಂದ ನಿಮ್ಮ ಎಲ್ಲಾ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಲು ಸರಿಯಾದ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸಿದ ಮಂತ್ರಗಳನ್ನು ಬಳಸಿ!!!
              </p>
            </CardContent>
          </Card>

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

          <div className={cardAnimation} style={{ animationDelay: "0.5s" }}>
            <MantraPlayer mantras={mantras} currentTrackIndex={currentTrackIndex} onTrackChange={setCurrentTrackIndex} />
          </div>

          <div className={cardAnimation} style={{ animationDelay: "0.6s" }}>
            <Tabs defaultValue="pain-relief" className="mt-8" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pain-relief">ನೋವು ನಿವಾರಣೆ</TabsTrigger>
                <TabsTrigger value="eye-problems">ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳು</TabsTrigger>
                <TabsTrigger value="service">ಸೇವೆ</TabsTrigger>
              </TabsList>
              <TabsContent value="pain-relief">
                <Card className="mt-4 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline text-center text-2xl">ಕಾಳಿ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-auto w-full">
                      <Image
                        src="/kali-mantra-pain.png"
                        alt="ಕಾಳಿ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ"
                        width={1080}
                        height={1350}
                        className="object-contain rounded-md"
                        data-ai-hint="infographic ritual"
                      />
                    </div>
                    <div className="mt-4 space-y-2 text-center text-muted-foreground">
                      <p>1. ಒಂದು ಲೋಟ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.</p>
                      <p>2. ಚಿತ್ರದಲ್ಲಿ ತೋರಿಸಿರುವಂತೆ ಮೊಬೈಲ್ ಹಿಡಿದುಕೊಳ್ಳಿ. ಲೌಡ್ ಸ್ಪೀಕರ್ ಆನ್ ಮಾಡಿ, ಸ್ಪೀಕರ್ ನೀರಿನ ಕಡೆಗೆ ಇರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.</p>
                      <p>3. ಮ್ಯೂಸಿಕ್ ಪ್ಲೇಯರ್ ಅನ್ನು ರನ್ ಮಾಡಿ, ಮಂತ್ರದ ಅಂತ್ಯದವರೆಗೆ ಕಾಯಿರಿ.</p>
                      <p>4. ಈ ಮಂತ್ರ ತುಂಬಿದ ನೀರನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕುಡಿಯಿರಿ.</p>
                      <p>5. ಇದು ದೇಹ ಅಥವಾ ಕೀಲುಗಳಲ್ಲಿನ ನೋವನ್ನು ತಕ್ಷಣವೇ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.</p>
                      <p className="font-semibold text-foreground">Observe the pain subsides instantly.. continue with full faith and trust till heal.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="eye-problems">
                  <Card className="mt-4 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <CardHeader>
                      <CardTitle className="font-headline text-center text-2xl">ಚಾಕ್ಷುಸ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="relative mx-auto aspect-auto w-full max-w-md">
                        <Image
                          src="/chaksu-mantra.png"
                          alt="ಚಾಕ್ಷುಸ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ"
                          width={1080}
                          height={1350}
                          className="object-contain rounded-md"
                          data-ai-hint="infographic ritual"
                        />
                      </div>
                      <div className="mt-4 space-y-4 text-center">
                         <p className="text-muted-foreground">
                          ಈ ಮಂತ್ರವು ಸೂರ್ಯ ದೇವರಿಗೆ ಮತ್ತು ಮಾನವಕುಲದ ಸೇವೆಗೆ ಸಂಬಂಧಿಸಿದೆ.
                        </p>
                        <p className="text-muted-foreground">
                          ಈ ಮಂತ್ರವನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಹೆಡ್‌ಫೋನ್ ಅಥವಾ ಇಯರ್‌ಫೋನ್ ಬಳಸಿ ಕೇಳಿ.
                        </p>
                         <p className="text-muted-foreground">
                          ಕೆಲವೇ ದಿನಗಳಲ್ಲಿ ಯಾವುದೇ ಕಣ್ಣಿನ ಸಮಸ್ಯೆಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ, ಎಲ್ಲಾ ರೋಗಲಕ್ಷಣಗಳು ಗುಣವಾಗುವವರೆಗೆ ಮುಂದುವರಿಸಿ.
                        </p>
                        <p className="font-semibold text-primary">
                          ಪ್ರಮುಖ ಸೂಚನೆ: ಈ ಮಂತ್ರವು ನೀವು ಏಳು ಜನರಿಗೆ ಹಂಚಿಕೊಂಡಾಗ ಮಾತ್ರ ಪೂರ್ಣ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ. ಆದ್ದರಿಂದ, 7 ಜನರಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುವ ಉದ್ದೇಶ ನಿಮಗಿದ್ದರೆ, ಈ ಮಂತ್ರವು ಸಂಪೂರ್ಣವಾಗಿ ಫಲ ನೀಡುವುದು ಖಚಿತ.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>
              <TabsContent value="service">
                <Card className="mt-4">
                  <CardContent className="p-6 text-center space-y-4">
                    <p className="font-semibold text-foreground text-lg">
                      ಮಾನವ ಸೇವೆಯೇ ದೇವರ ಸೇವೆ
                    </p>
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
                            PhonePe - 7022070287 and screenshot to this whatsapp
                            number
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                     <p className="text-sm text-muted-foreground">
                      Contact us to contribute to our cause.
                    </p>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          Join Our group
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Join our Divine Entity Group</AlertDialogTitle>
                          <AlertDialogDescription>
                            To spread the power of mantras to everyone, join our group of divine entities.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <div className="border-t border-border pt-4">
                      <Button onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share app to serve mankind
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className={cn("mt-8 text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.7s" }}>
            <CardContent className="p-6 space-y-2">
              <p>ಯಾವುದೇ ಸೇವೆಗಳಿಗೆ ನಮ್ಮ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ</p>
              <p className="font-bold text-lg">7022070287</p>
            </CardContent>
          </Card>

        </div>
      </main>
      <BannerAd />
    </div>
  );
}

    