"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Youtube } from "lucide-react";

export default function PracticalVideosPage() {
  const videos = [
    {
      id: "v3RDEsT5vA4",
      title: "How to use Kali Mantra for Pain Relief",
      description: "A practical demonstration of using the Kali mantra to get relief from physical pain.",
    },
    {
        id: "L1kL2bE1E-Q",
        title: "Chakshushmati Mantra for Eye Problems",
        description: "Learn how to use the Chakshushmati mantra to improve eyesight and heal eye-related issues.",
    }
  ];

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
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full rounded-lg"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            ))}
             <Card>
                <CardContent className="p-6 text-center">
                    <p className="font-semibold text-foreground">
                        More videos will be updated soon.
                    </p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
