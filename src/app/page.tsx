import Image from "next/image";
import { MantraPlayer } from "@/app/components/mantra-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent } from "@/components/ui/card";

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

          <div className="mt-12">
            <h2 className="text-center font-headline text-3xl font-bold text-primary">
              ಕಾಳಿ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ
            </h2>
            <Card className="mt-4 overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="relative aspect-[1200/815] w-full">
                  <Image
                    src="/images/kali-mantra-pain.png"
                    alt="ಕಾಳಿ ಮಂತ್ರ ಪ್ರಯೋಗ ವಿಧಾನ"
                    fill
                    className="object-cover"
                    data-ai-hint="religious diagram"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BannerAd />
    </div>
  );
}
