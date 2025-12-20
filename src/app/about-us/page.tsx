
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              ನಮ್ಮ ಬಗ್ಗೆ
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              ಮಂತ್ರವಾಹಿನಿಯ ಹಿಂದಿನ ತಂಡ
            </p>
          </header>

          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/mine.jpeg"
                  alt="Founder"
                  fill
                  className="object-cover"
                  data-ai-hint="portrait man"
                />
              </div>
              <div className="text-center space-y-4 text-foreground">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary">Nagaraja D</h2>
                  <p className="text-muted-foreground">Mystic and explorer</p>
                </div>
                <p>
                  ಮಂತ್ರವಾಹಿನಿ ನಿಮ್ಮ ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ದೈಹಿಕ ಯೋಗಕ್ಷೇಮಕ್ಕಾಗಿ ಸಮರ್ಪಿತವಾಗಿದೆ. ನಮ್ಮ ಗುರಿ ಪುರಾತನ ಜ್ಞಾನ ಮತ್ತು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನವನ್ನು ಸಂಯೋಜಿಸಿ, ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ಶಾಂತಿ, ಆರೋಗ್ಯ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ತರುವುದು.
                </p>
                <p>
                  ನಮ್ಮ ಪರಿಣಿತರ ತಂಡವು ಮಂತ್ರಗಳು, ತಂತ್ರಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳ ಮೂಲಕ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ, ನೋವು ಮತ್ತು ದುಃಖರಹಿತ ಜೀವನವನ್ನು ನಡೆಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ಹಿಂದಕ್ಕೆ
                </Link>
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
