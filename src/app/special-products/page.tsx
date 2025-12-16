import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SpecialProductsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Special Spiritual Products
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Unique items to enhance your spiritual journey.
            </p>
          </header>

          <Card className="overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">ಅಕ್ಷಯ Cash Box</CardTitle>
              <CardDescription>
                Solves money inflow problems for your business and home.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/akshaya-cash-box-1.jpg"
                    alt="Akshaya Cash Box"
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="ornate box"
                  />
                </div>
                <div className="relative aspect-square w-full">
                  <Image
                    src="/akshaya-cash-box-2.jpg"
                    alt="Akshaya Cash Box alternate view"
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="ornate box"
                  />
                </div>
              </div>
               <div className="text-center text-muted-foreground">
                <p>This energized cash box helps attract financial abundance and smooths the flow of money into your business and home.</p>
                <p className="mt-2 font-semibold text-foreground">For pricing and to order, please contact us.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-2 bg-muted/50 p-4">
               <p>Contact us to order:</p>
              <p className="font-bold text-lg text-primary">7022070287</p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
