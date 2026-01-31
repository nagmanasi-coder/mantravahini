
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutUsPage() {
  const cardAnimation = "animate-fade-in-up";
  const founderImage = PlaceHolderImages.find(img => img.id === 'founder-portrait');

  const sections = [
    {
      title: "ಪರಿಚಯ (Introduction)",
      content: "ನಾನು ಮಂತ್ರ ಮತ್ತು ತಂತ್ರ ಕ್ಷೇತ್ರದಲ್ಲಿ ದೀರ್ಘ ಅನುಭವ ಹೊಂದಿರುವ ಸಾಧಕ, ಪ್ರಯೋಗಕಾರ ಮತ್ತು ಅನ್ವೇಷಕ. ಕಲಿಯುಗದ ಇಂದಿನ ಜೀವನಶೈಲಿ, ಮಾನಸಿಕ ಒತ್ತಡ, ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಗೊಂದಲಗಳನ್ನು ಅರಿತು, ಅವುಗಳಿಗೆ ಪ್ರಾಯೋಗಿಕ ಹಾಗೂ ಫಲಪ್ರದ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕುವ ಉದ್ದೇಶದಿಂದ ನಾನು ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ನಿರಂತರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದ್ದೇನೆ."
    },
    {
      title: "ಅನುಭವ ಮತ್ತು ಸಾಧನೆ (Experience & Practice)",
      content: "ಬಹು ವರ್ಷಗಳ ಕಾಲ ಮಂತ್ರ–ತಂತ್ರ ಸಾಧನೆಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಂಡು, ವಿವಿಧ ಮಂತ್ರಗಳ ಶಕ್ತಿ, ಅವುಗಳ ಪ್ರಾಯೋಗಿಕ ಪರಿಣಾಮ, ಮತ್ತು ಇಂದಿನ ಕಾಲಕ್ಕೆ ಹೊಂದುವ ವಿಧಾನಗಳನ್ನು ಸ್ವಯಂ ಅನುಭವ ಮತ್ತು ಪರೀಕ್ಷೆಯ ಮೂಲಕ ಅಧ್ಯಯನ ಮಾಡಲಾಗಿದೆ."
    },
    {
      title: "ಕಲಿಯುಗಕ್ಕೆ ಹೊಂದುವ ಮಂತ್ರ–ತಂತ್ರ (Relevance in Kaliyuga)",
      content: "ಇದು ಕಲಿಯುಗ. ಇಲ್ಲಿ ಸಮಯ ಕಡಿಮೆ, ಮನಸ್ಸು ಚಂಚಲ, ಶಿಸ್ತಿನ ಕೊರತೆ, ಭಯ ಮತ್ತು ಅನುಮಾನ ಹೆಚ್ಚಾಗಿದೆ. ಅದಕ್ಕಾಗಿ ಪುರಾತನವಾದರೂ ಸರಳ, ಸುರಕ್ಷಿತ ಮತ್ತು ಕಾರ್ಯಕಾರಿ ಮಂತ್ರ–ತಂತ್ರಗಳನ್ನು ಮಾತ್ರ ಆರಿಸಿ, ಇಂದಿನ ಮನುಷ್ಯರಿಗೆ ಅನುಸರಿಸಲು ಸಾಧ್ಯವಾಗುವಂತೆ ರೂಪಿಸಲಾಗಿದೆ."
    },
    {
      title: "ಪರೀಕ್ಷಿತ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ವಿಧಾನ (Tested & Practical Approach)",
      content: "ನಾವು ಪ್ರಕಟಿಸುವ ಯಾವುದೇ ಮಂತ್ರ ಅಥವಾ ತಂತ್ರ ಮೊದಲು ಸ್ವಯಂ ಪರೀಕ್ಷಿತ, ಪ್ರಾಯೋಗಿಕವಾಗಿ ಫಲ ಕಂಡ ನಂತರ ಮಾತ್ರ, ಅಂಧವಿಶ್ವಾಸಕ್ಕೆ ಉತ್ತೇಜನ ನೀಡದೇ, ನೈತಿಕತೆ ಮತ್ತು ಮಾನವ ಕಲ್ಯಾಣವನ್ನು ಕೇಂದ್ರವಾಗಿಟ್ಟುಕೊಂಡು ಜನರಿಗೆ ನೀಡಲಾಗುತ್ತದೆ."
    },
    {
      title: "ಉದ್ದೇಶ ಮತ್ತು ಧ್ಯೇಯ (Vision & Mission)",
      content: "ನಮ್ಮ ಮುಖ್ಯ ಉದ್ದೇಶ ಮಂತ್ರ–ತಂತ್ರವನ್ನು ಭಯದ ವಿಷಯವಾಗಿಸದೇ, ಅದನ್ನು ಜ್ಞಾನ, ಶಕ್ತಿ ಮತ್ತು ಶಾಂತಿಯ ಸಾಧನವಾಗಿಸುವುದು. ಆರೋಗ್ಯ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ಜೀವನದ ಸ್ಥಿರತೆಗೆ ಸಹಾಯಕವಾಗಿಸುವುದು.\n\n👉 ಮಾನವ ಕಲ್ಯಾಣವೇ ನಮ್ಮ ಪರಮ ಧ್ಯೇಯ."
    },
    {
      title: "ಪ್ರಕಟಣೆ ಮತ್ತು ಹಂಚಿಕೆ (Publishing & Sharing)",
      content: "ಪರೀಕ್ಷಿತ ಮತ್ತು ಪ್ರಯೋಜನಕಾರಿ ಮಂತ್ರ–ತಂತ್ರಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ, ಸರಳ ಭಾಷೆಯಲ್ಲಿ, ಎಲ್ಲರಿಗೂ ಅರ್ಥವಾಗುವ ರೀತಿಯಲ್ಲಿ ಲೇಖನಗಳು, ವೀಡಿಯೊಗಳು, ಆಡಿಯೋ ಮತ್ತು ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮಗಳ ಮೂಲಕ ಹಂಚಲಾಗುತ್ತದೆ."
    },
    {
      title: "ಅಂತಿಮ ಸಂದೇಶ (Closing Note)",
      content: "ಮಂತ್ರ ಮತ್ತು ತಂತ್ರವು ಅಂಧವಿಶ್ವಾಸವಲ್ಲ; ಅವು ಸರಿಯಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡರೆ ಜೀವನವನ್ನು ಸುಧಾರಿಸುವ ವಿಜ್ಞಾನಸಮಾನ ಸಾಧನೆಗಳು. ಸರಿಯಾದ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಶುದ್ಧ ಉದ್ದೇಶ ಇದ್ದರೆ, ಇವು ಕಲಿಯುಗದಲ್ಲೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ."
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              ನಮ್ಮ ಬಗ್ಗೆ
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              ಮಂತ್ರವಾಹಿನಿಯ ಹಿಂದಿನ ಮೆದುಳು
            </p>
          </header>

          <Card className={cn("overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className={cn("md:col-span-1 flex flex-col items-center text-center space-y-4", cardAnimation)} style={{ animationDelay: "0.3s" }}>
                   <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/50 shadow-lg">
                    {founderImage && <Image
                      src={founderImage.imageUrl}
                      alt={founderImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={founderImage.imageHint}
                    />}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-headline text-primary">Nagaraja D</h2>
                    <p className="text-muted-foreground">Mystic Explorer</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                   <Accordion type="single" collapsible className="w-full">
                    {sections.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={index} className={cn(cardAnimation)} style={{ animationDelay: `${0.4 + index * 0.1}s`}}>
                        <AccordionTrigger className="font-headline text-xl font-bold text-primary">{index + 1}. {section.title}</AccordionTrigger>
                        <AccordionContent className="text-left text-foreground">
                          <p>{section.content}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
              
              <Separator className="my-8" />

              <div className={cn("text-center space-y-2", cardAnimation)} style={{ animationDelay: "1.2s" }}>
                  <p className="font-bold text-accent text-xl">"ಪರೀಕ್ಷಿತ ಮಂತ್ರ – ಪ್ರಾಯೋಗಿಕ ಫಲ"</p>
                  <p className="font-semibold text-muted-foreground">“ಕಲಿಯುಗಕ್ಕೆ ಹೊಂದುವ ಶಕ್ತಿ ಸಾಧನೆ”</p>
                  <p className="font-semibold text-muted-foreground">“ಅನುಭವದಿಂದ ಜನೋಪಯೋಗಕ್ಕೆ”</p>
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
