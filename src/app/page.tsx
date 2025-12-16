"use client";

import Image from "next/image";
import { useState } from "react";
import { MantraPlayer } from "@/app/components/mantra-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

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

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              ಮಂತ್ರವಾಹಿನಿ
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            ಮಂತ್ರ ಶಕ್ತಿ: ನಿಮ್ಮಜೀವನದ ಉನ್ನತಿಗಾಗಿ
            </p>
          </header>

          <Card className="mb-8 text-center">
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">
                ಮಂತ್ರದ ಶಕ್ತಿಯನ್ನು ತಿಳಿದ ನಂತರ, ಶಿವನ ಮೇಲೆ ಸಂಪೂರ್ಣ ನಂಬಿಕೆ ಮತ್ತು ವಿಶ್ವಾಸದಿಂದ ನಿಮ್ಮ ಎಲ್ಲಾ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಲು ಸರಿಯಾದ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸಿದ ಮಂತ್ರಗಳನ್ನು ಬಳಸಿ!!!
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 text-center bg-accent text-accent-foreground">
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

          <MantraPlayer mantras={mantras} currentTrackIndex={currentTrackIndex} onTrackChange={setCurrentTrackIndex} />

          <Tabs defaultValue="pain-relief" className="mt-8" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pain-relief">ನೋವು ನಿವಾರಣೆ</TabsTrigger>
              <TabsTrigger value="eye-problems">ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳು</TabsTrigger>
            </TabsList>
            <TabsContent value="pain-relief">
              <Card className="mt-4 overflow-hidden shadow-xl">
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
                    <p>2. ಚಿತ್ರದಲ್ಲಿ ತೋರಿಸಿರುವಂತೆ ಮೊಬೈಲ್ ಹಿಡಿದುಕೊಳ್ಳಿ. ಸ್ಪೀಕರ್ ನೀರಿನ ಕಡೆಗೆ ಇರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.</p>
                    <p>3. ಮ್ಯೂಸಿಕ್ ಪ್ಲೇಯರ್ ಅನ್ನು ರನ್ ಮಾಡಿ, ಮಂತ್ರದ ಅಂತ್ಯದವರೆಗೆ ಕಾಯಿರಿ.</p>
                    <p>4. ಈ ಮಂತ್ರ ತುಂಬಿದ ನೀರನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕುಡಿಯಿರಿ.</p>
                    <p>5. ಇದು ದೇಹ ಅಥವಾ ಕೀಲುಗಳಲ್ಲಿನ ನೋವನ್ನು ತಕ್ಷಣವೇ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.</p>
                    <p className="font-semibold text-foreground">Observe the pain subsides instantly.. continue with full faith and trust till heal.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="eye-problems">
                <Card className="mt-4 overflow-hidden shadow-xl">
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
          </Tabs>

          <Card className="mt-8 text-center">
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
