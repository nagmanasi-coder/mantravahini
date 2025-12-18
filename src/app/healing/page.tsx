
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HealingPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              ಮಂತ್ರ ಚಿಕಿತ್ಸೆ
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              ಹನುಮಾನ್ ಚಾಲೀಸಾದ ತಾಂತ್ರಿಕ ವಿಧಾನದಿಂದ ದೀರ್ಘಕಾಲದ ರೋಗಗಳ ನಿವಾರಣೆ
            </p>
          </header>

          <Card className="overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">ಹನುಮಾನ್ ಚಾಲೀಸಾ ಚಿಕಿತ್ಸೆ</CardTitle>
              <CardDescription>
                ದೀರ್ಘಕಾಲದ ಕಾಯಿಲೆಗಳಿಗೆ ಮತ್ತು ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳಿಗೆ ಪರಿಹಾರ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-auto w-full">
                <Image
                  src="/hanuman-healing.png"
                  alt="Hanuman Chalisa Healing Method"
                  width={1080}
                  height={1350}
                  className="rounded-md object-cover"
                  data-ai-hint="ancient manuscript ritual"
                />
              </div>
              <div className="text-center text-muted-foreground space-y-2">
                <p>ಈ ವಿಧಾನವು ಹನುಮಾನ್ ಚಾಲೀಸಾದ ಶಕ್ತಿಯನ್ನು ಬಳಸಿ, ದೀರ್ಘಕಾಲದ ದೈಹಿಕ ಮತ್ತು ಮಾನಸಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ಗುಣಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.</p>
                <p>ಇದು ಸಂಧಿವಾತ, ಮಧುಮೇಹ, ಮತ್ತು ಇತರ ದೀರ್ಘಕಾಲದ ರೋಗಗಳಿಗೆ ಪರಿಣಾಮಕಾರಿ ಎಂದು ಸಾಬೀತಾಗಿದೆ.</p>
              </div>
              <div className="my-6 rounded-md border border-primary/20 bg-primary/5 p-4 text-center">
                 <p className="font-headline text-xl font-bold text-primary">ನಾಸೈ ರೋಗ್ ಹರೇ ಸಬ್ ಪೀರಾ, ಜಬತ್ ನಿರಂತರ್ ಹನುಮತ್ ಬೀರಾ</p>
                 <p className="mt-2 text-sm text-foreground">
                   "ಹನುಮಂತನ ವೀರ ನಾಮವನ್ನು ನಿರಂತರವಾಗಿ ಜಪಿಸುವುದರಿಂದ ಎಲ್ಲಾ ರೋಗಗಳು ಮತ್ತು ನೋವುಗಳು ದೂರವಾಗುತ್ತವೆ." ಈ ದೋಹವು ತನ್ನ ಚಿಕಿತ್ಸಕ ಶಕ್ತಿಗಳಿಗೆ ಹೆಸರುವಾಸಿಯಾಗಿದೆ, ಮತ್ತು ಇದನ್ನು ನಂಬಿಕೆಯಿಂದ ಪಠಿಸಿದಾಗ ಎಲ್ಲಾ ರೀತಿಯ ದೈಹಿಕ ಮತ್ತು ಮಾನಸಿಕ ಸಂಕಟಗಳಿಂದ ಮುಕ್ತಿ ನೀಡುತ್ತದೆ.
                 </p>
              </div>
              <div className="text-center">
                 <p className="mt-2 font-semibold text-foreground">ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಮತ್ತು ಚಿಕಿತ್ಸೆ ಪಡೆಯಲು, ದಯವಿಟ್ಟು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-2 bg-muted/50 p-4">
               <p>ಸಂಪರ್ಕಿಸಿ:</p>
              <p className="font-bold text-lg text-primary">7022070287, ಹೊಸದುರ್ಗ</p>
            </CardFooter>
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
