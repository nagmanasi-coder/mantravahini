
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OurAppsPage() {
  const apps = [
    {
      name: "ತಂತ್ರ ವಿಜ್ಞಾನ",
      description: "Explore the science of Tantra.",
      icon: "https://picsum.photos/seed/app1/400/400",
      href: "https://tantra-vigyan.vercel.app/",
      aiHint: "abstract spiritual science",
    },
    {
      name: "ಮಂತ್ರವಾಹಿನಿ",
      description: "A serene mantra playback experience for spiritual well-being.",
      icon: "/mine.jpeg",
      href: "/",
      aiHint: "meditation app icon",
    },
    {
      name: "Coming Soon",
      description: "We are working on a new app to help you on your spiritual journey.",
      icon: "https://picsum.photos/seed/app2/400/400",
      href: "#",
      aiHint: "abstract spiritual concept",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Our Apps
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Explore our collection of apps designed to aid your spiritual practice.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {apps.map((app) => (
              <Card key={app.name} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    <Image
                      src={app.icon}
                      alt={`${app.name} icon`}
                      fill
                      className="rounded-lg object-cover"
                      data-ai-hint={app.aiHint}
                    />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto bg-muted/50 p-4">
                  <Button asChild className="w-full" disabled={app.href === "#"}>
                    <Link href={app.href} target={app.href.startsWith('http') ? '_blank' : '_self'} rel={app.href.startsWith('http') ? 'noopener noreferrer' : ''}>
                      {app.name === "Coming Soon" ? "Stay Tuned" : "Open App"}
                      {app.name !== "Coming Soon" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
