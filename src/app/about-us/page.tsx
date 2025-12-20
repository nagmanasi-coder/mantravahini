
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AboutUsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
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
              <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border-4 border-primary/50 shadow-lg">
                <Image
                  src="/mine.jpeg"
                  alt="Founder"
                  fill
                  className="object-cover"
                  data-ai-hint="portrait man"
                />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-headline text-primary">Nagaraja D</h2>
                <p className="text-muted-foreground text-lg">Mystic and Explorer</p>
              </div>

              <Separator />

              <div className="space-y-8 text-left text-foreground">

                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">1️⃣ ಪರಿಚಯ (Introduction)</h3>
                    <p>
                        ನಾನು ಮಂತ್ರ ಮತ್ತು ತಂತ್ರ ಕ್ಷೇತ್ರದಲ್ಲಿ ದೀರ್ಘ ಅನುಭವ ಹೊಂದಿರುವ ಸಾಧಕ, ಪ್ರಯೋಗಕಾರ ಮತ್ತು ಅನ್ವೇಷಕ. ಕಳಿಯುಗದ ಇಂದಿನ ಜೀವನಶೈಲಿ, ಮಾನಸಿಕ ಒತ್ತಡ, ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಗೊಂದಲಗಳನ್ನು ಅರಿತು, ಅವುಗಳಿಗೆ ಪ್ರಾಯೋಗಿಕ ಹಾಗೂ ಫಲಪ್ರದ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕುವ ಉದ್ದೇಶದಿಂದ ನಾನು ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ನಿರಂತರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದ್ದೇನೆ.
                    </p>
                </div>
                
                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">2️⃣ ಅನುಭವ ಮತ್ತು ಸಾಧನೆ (Experience & Practice)</h3>
                    <p>
                        ಬಹು ವರ್ಷಗಳ ಕಾಲ ಮಂತ್ರ–ತಂತ್ರ ಸಾಧನೆಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಂಡು, ವಿವಿಧ ಮಂತ್ರಗಳ ಶಕ್ತಿ, ಅವುಗಳ ಪ್ರಾಯೋಗಿಕ ಪರಿಣಾಮ, ಮತ್ತು ಇಂದಿನ ಕಾಲಕ್ಕೆ ಹೊಂದುವ ವಿಧಾನಗಳನ್ನು ಸ್ವಯಂ ಅನುಭವ ಮತ್ತು ಪರೀಕ್ಷೆಯ ಮೂಲಕ ಅಧ್ಯಯನ ಮಾಡಲಾಗಿದೆ.
                    </p>
                </div>

                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">3️⃣ ಕಳಿಯುಗಕ್ಕೆ ಹೊಂದುವ ಮಂತ್ರ–ತಂತ್ರ (Relevance in Kaliyuga)</h3>
                    <p className="mb-2">ಇದು ಕಳಿಯುಗ. ಇಲ್ಲಿ ಸಮಯ ಕಡಿಮೆ, ಮನಸ್ಸು ಚಂಚಲ, ಶಿಸ್ತಿನ ಕೊರತೆ, ಭಯ ಮತ್ತು ಅನುಮಾನ ಹೆಚ್ಚಾಗಿದೆ. ಅದಕ್ಕಾಗಿ ಪುರಾತನವಾದರೂ ಸರಳ, ಸುರಕ್ಷಿತ ಮತ್ತು ಕಾರ್ಯಕಾರಿ ಮಂತ್ರ–ತಂತ್ರಗಳನ್ನು ಮಾತ್ರ ಆರಿಸಿ, ಇಂದಿನ ಮನುಷ್ಯರಿಗೆ ಅನುಸರಿಸಲು ಸಾಧ್ಯವಾಗುವಂತೆ ರೂಪಿಸಲಾಗಿದೆ.</p>
                </div>

                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">4️⃣ ಪರೀಕ್ಷಿತ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ವಿಧಾನ (Tested & Practical Approach)</h3>
                    <p>ನಾವು ಪ್ರಕಟಿಸುವ ಯಾವುದೇ ಮಂತ್ರ ಅಥವಾ ತಂತ್ರ ಮೊದಲು ಸ್ವಯಂ ಪರೀಕ್ಷಿತ, ಪ್ರಾಯೋಗಿಕವಾಗಿ ಫಲ ಕಂಡ ನಂತರ ಮಾತ್ರ, ಅಂಧವಿಶ್ವಾಸಕ್ಕೆ ಉತ್ತೇಜನ ನೀಡದೇ, ನೈತಿಕತೆ ಮತ್ತು ಮಾನವ ಕಲ್ಯಾಣವನ್ನು ಕೇಂದ್ರವಾಗಿಟ್ಟುಕೊಂಡು ಜನರಿಗೆ ಹಂಚಲಾಗುತ್ತದೆ.</p>
                </div>

                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">5️⃣ ಉದ್ದೇಶ ಮತ್ತು ಧ್ಯೇಯ (Vision & Mission)</h3>
                    <p className="mb-2">
                        ನಮ್ಮ ಮುಖ್ಯ ಉದ್ದೇಶ ಮಂತ್ರ–ತಂತ್ರವನ್ನು ಭಯದ ವಿಷಯವಾಗಿಸದೇ, ಅದನ್ನು ಜ್ಞಾನ, ಶಕ್ತಿ ಮತ್ತು ಶಾಂತಿಯ ಸಾಧನವಾಗಿಸುವುದು. ಆರೋಗ್ಯ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ಜೀವನದ ಸ್ಥಿರತೆಗೆ ಸಹಾಯಕವಾಗಿಸುವುದು.
                    </p>
                    <p className="font-bold text-center text-primary text-xl">👉 ಮಾನವ ಕಲ್ಯಾಣವೇ ನಮ್ಮ ಪರಮ ಧ್ಯೇಯ.</p>
                </div>

                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">6️⃣ ಪ್ರಕಟಣೆ ಮತ್ತು ಹಂಚಿಕೆ (Publishing & Sharing)</h3>
                    <p>
                        ಪರೀಕ್ಷಿತ ಮತ್ತು ಪ್ರಯೋಜನಕಾರಿ ಮಂತ್ರ–ತಂತ್ರಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ, ಸರಳ ಭಾಷೆಯಲ್ಲಿ, ಎಲ್ಲರಿಗೂ ಅರ್ಥವಾಗುವ ರೀತಿಯಲ್ಲಿ ಲೇಖನಗಳು, ವೀಡಿಯೊಗಳು, ಆಡಿಯೋ ಮತ್ತು ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮಗಳ ಮೂಲಕ ಹಂಚಲಾಗುತ್ತದೆ.
                    </p>
                </div>

                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">7️⃣ ಅಂತಿಮ ಸಂದೇಶ (Closing Note)</h3>
                    <p>
                        ಮಂತ್ರ ಮತ್ತು ತಂತ್ರವು ಅಂಧವಿಶ್ವಾಸವಲ್ಲ; ಅವು ಸರಿಯಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡರೆ ಜೀವನವನ್ನು ಸುಧಾರಿಸುವ ವಿಜ್ಞಾನಸಮಾನ ಸಾಧನೆಗಳು. ಸರಿಯಾದ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಶುದ್ಧ ಉದ್ದೇಶ ಇದ್ದರೆ, ಇವು ಕಳಿಯುಗದಲ್ಲೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.
                    </p>
                </div>
                
                <Separator />

                <div className="text-center space-y-2">
                    <p className="font-bold text-accent text-xl">"ಪರೀಕ್ಷಿತ ಮಂತ್ರ – ಪ್ರಾಯೋಗಿಕ ಫಲ"</p>
                    <p className="font-semibold text-muted-foreground">“ಕಳಿಯುಗಕ್ಕೆ ಹೊಂದುವ ಶಕ್ತಿ ಸಾಧನೆ”</p>
                    <p className="font-semibold text-muted-foreground">“ಅನುಭವದಿಂದ ಜನೋಪಯೋಗಕ್ಕೆ”</p>
                </div>

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
