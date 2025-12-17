import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SpecialProductsPage() {

  const products = [
    {
      name: "ಹೇರ್ ಆಯಿಲ್",
      description: "ಮಂತ್ರಗಳಿಂದ ತುಂಬಿದ ಗಿಡಮೂಲಿಕೆಗಳಿಂದ ತಯಾರಿಸಲ್ಪಟ್ಟಿದೆ.",
      image: "/Hair oil.png",
      aiHint: "hair oil natural",
    },
    {
      name: "ನೋವು ನಿವಾರಕ ತೈಲ",
      description: "ನೋವು ನಿವಾರಣೆಗಾಗಿ ವಿಶೇಷ ಸಸ್ಯಗಳಿಂದ ತಯಾರಿಸಲಾಗುತ್ತದೆ.",
      image: "/pain oil.png",
      aiHint: "pain relief oil",
    },
    {
      name: "ಚರ್ಮದ ಸಮಸ್ಯೆಗೆ ಕನಕ ತೈಲ",
      description: "ಚರ್ಮದ ಸಮಸ್ಯೆಗಳಿಗೆ ಮಂತ್ರಗಳಿಂದ ತುಂಬಿದ ಎಣ್ಣೆ.",
      image: "/skin oil.png",
      aiHint: "skin oil natural",
    },
    {
      name: "ಲೈಂಗಿಕ ದೌರ್ಬಲ್ಯ ನಿವಾರಣೆಗೆ ಕನಕಧಾರಾ ತೈಲ",
      description: "ಲೈಂಗಿಕ ದೌರ್ಬಲ್ಯವನ್ನು ನಿವಾರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      image: "/sexual power.png",
      aiHint: "wellness oil natural",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              ವಿಶೇಷ ಆಧ್ಯಾತ್ಮಿಕ ಉತ್ಪನ್ನಗಳು
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              ನಿಮ್ಮ ಆಧ್ಯಾತ್ಮಿಕ ಪಯಣವನ್ನು ಹೆಚ್ಚಿಸಲು ಅನನ್ಯ ವಸ್ತುಗಳು.
            </p>
          </header>

          <Card className="mb-8 overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">ಅಕ್ಷಯ Cash Box</CardTitle>
              <CardDescription>
                ನಿಮ್ಮ ವ್ಯಾಪಾರ ಮತ್ತು ಮನೆಗೆ ಹಣದ ಒಳಹರಿವಿನ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸುತ್ತದೆ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/akshaya-cash-box-1.png"
                    alt="Akshaya Cash Box"
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="ornate box"
                  />
                </div>
                <div className="relative aspect-square w-full">
                  <Image
                    src="/akshaya-cash-box-2.png"
                    alt="Akshaya Cash Box alternate view"
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="ornate box"
                  />
                </div>
              </div>
               <div className="text-center text-muted-foreground">
                <p>ಈ ಶಕ್ತಿಯುತ ನಗದು ಪೆಟ್ಟಿಗೆಯು ಆರ್ಥಿಕ ಸಮೃದ್ಧಿಯನ್ನು ಆಕರ್ಷಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮ ವ್ಯಾಪಾರ ಮತ್ತು ಮನೆಗೆ ಹಣದ ಹರಿವನ್ನು ಸುಗಮಗೊಳಿಸುತ್ತದೆ.</p>
                <p className="mt-2 font-semibold text-foreground">ಬೆಲೆ ಮತ್ತು ಆರ್ಡರ್ ಮಾಡಲು, ದಯವಿಟ್ಟು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-2 bg-muted/50 p-4">
               <p>ಆರ್ಡರ್ ಮಾಡಲು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ:</p>
              <p className="font-bold text-lg text-primary">7022070287, ಹೊಸದುರ್ಗ</p>
            </CardFooter>
          </Card>

          <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-3xl text-center">ಮಂತ್ರ ಚಿಕಿತ್ಸಿತ ತೈಲಗಳು</CardTitle>
                  <CardDescription className="text-center">
                  ವಿಶೇಷ ಸಸ್ಯಗಳಿಂದ ತಯಾರಿಸಿ ಮಂತ್ರಗಳಿಂದ ತುಂಬಿದ ಶಕ್ತಿಶಾಲಿ ತೈಲಗಳು.
                  </CardDescription>
                </CardHeader>
              </Card>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {products.map((product) => (
                <Card key={product.name} className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video w-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={product.aiHint}
                      />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardFooter className="flex flex-col items-center justify-center gap-2 bg-muted/50 p-4">
                 <p>ಯಾವುದೇ ಉತ್ಪನ್ನವನ್ನು ಆರ್ಡರ್ ಮಾಡಲು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ:</p>
                <p className="font-bold text-lg text-primary">7022070287, ಹೊಸದುರ್ಗ</p>
              </CardFooter>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
