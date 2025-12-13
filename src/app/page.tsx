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
              ನಿಮ್ಮಜೀವನದ ಉನ್ನತಿಗಾಗಿ
            </p>
          </header>
          <MantraPlayer mantras={mantras} />

          <Card className="mt-8 overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-center text-2xl">ಕಾಳಿ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-auto w-full">
                <Image
                  src="/kali-matra-pain.png"
                  alt="ಕಾಳಿ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ"
                  width={1080}
                  height={1350}
                  className="object-contain rounded-md"
                  data-ai-hint="infographic ritual"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BannerAd />
    </div>
  );
}
