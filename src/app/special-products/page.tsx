import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This section is under construction. Check back later for special spiritual products!</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
