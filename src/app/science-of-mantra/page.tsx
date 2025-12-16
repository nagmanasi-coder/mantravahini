import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ScienceOfMantraPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              The Science of Mantra
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Understanding the Power of Sound and Vibration
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>How Mantras Work</CardTitle>
              <CardDescription>
                Explore the scientific principles behind the power of mantras.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Mantras are not just religious chants; they are powerful sound vibrations that can have a profound effect on our mind, body, and consciousness. The science of Cymatics demonstrates how sound vibrations can create intricate geometric patterns in matter. Similarly, the vibrations from chanting mantras can create a positive and healing resonance within us.
              </p>
              
              <div className="rounded-lg border overflow-hidden p-6 text-center">
                <p className="font-semibold text-lg text-primary">Classes will be conducted soon.</p>
                <p className="text-muted-foreground mt-2">Contact us to learn more about the science of mantras and our upcoming classes.</p>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
