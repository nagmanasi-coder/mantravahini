"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PracticalVideosPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Practical Videos
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Watch practical demonstrations of mantra techniques.
            </p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="font-semibold text-foreground">
                  Videos will be updated.. stay tuned.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
