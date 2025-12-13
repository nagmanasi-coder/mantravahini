import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MantraCornerPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Mantra Corner
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover more mantras and their benefits.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This section is under construction. Check back later for more powerful mantras!</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
