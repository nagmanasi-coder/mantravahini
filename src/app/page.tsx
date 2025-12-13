
import Image from "next/image";
import { MantraPlayer } from "@/app/components/mantra-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
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
                ಮಂತ್ರದ ಶಕ್ತಿಯನ್ನು ನೀವು ತಿಳಿದ ನಂತರ, ಶಿವನ ಮೇಲೆ ಸಂಪೂರ್ಣ ನಂಬಿಕೆ ಮತ್ತು ವಿಶ್ವಾಸದಿಂದ ನಿಮ್ಮ ಎಲ್ಲಾ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಲು ಸರಿಯಾದ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸಿದ ಮಂತ್ರಗಳನ್ನು ಬಳಸಿ!!!
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 text-center bg-accent text-accent-foreground">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Activated Mantra</CardTitle>
            </CardHeader>
          </Card>

          <MantraPlayer mantras={mantras} />

          <Card className="mt-8 overflow-hidden shadow-xl">
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
                <p>ಇದು ದೇಹ ಅಥವಾ ಕೀಲುಗಳಲ್ಲಿನ ನೋವನ್ನು ತಕ್ಷಣವೇ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.</p>
                <p className="font-semibold text-foreground">Observe the pain subsides instantly.. continue with full faith and trust till heal.</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      <BannerAd />
    </div>
  );
}
