
"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";

export default function OurAppsPage() {
  const { t } = useLanguage();

  const apps = [
    {
      name: t('tantraVigyanAppName'),
      description: t('tantraVigyanAppDescription'),
      iconId: "trishul-icon",
      href: "https://tantra-vigyan.vercel.app/",
    },
    {
      name: t('mantravaahiniAppName'),
      description: t('mantravaahiniAppDescription'),
      iconId: "mantravaahini-icon",
      href: "/",
    },
    {
      name: t('comingSoonAppName'),
      description: t('comingSoonAppDescription'),
      iconId: "coming-soon-app-icon",
      href: "#",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('ourAppsTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('ourAppsSubtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {apps.map((app) => {
              const appIcon = PlaceHolderImages.find(img => img.id === app.iconId);
              return (
              <Card key={app.name} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    {appIcon && <Image
                      src={appIcon.imageUrl}
                      alt={`${app.name} icon`}
                      fill
                      className="rounded-lg object-cover"
                      data-ai-hint={appIcon.imageHint}
                    />}
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto bg-muted/50 p-4">
                  <Button asChild className="w-full" disabled={app.href === "#"}>
                    <Link href={app.href} target={app.href.startsWith('http') ? '_blank' : '_self'} rel={app.href.startsWith('http') ? 'noopener noreferrer' : ''}>
                      {app.name === t('comingSoonAppName') ? t('stayTunedButton') : t('openAppButton')}
                      {app.name !== t('comingSoonAppName') && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </main>
    </div>
  );
}
