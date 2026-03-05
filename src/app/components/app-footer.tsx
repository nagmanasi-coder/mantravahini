"use client"

import Link from "next/link";
import { AppWindow, Info, BookUser, BookText, MessageSquareQuote, HeartPulse, GraduationCap, BookOpen, Video, Music } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { usePathname } from "next/navigation";

export function AppFooter() {
    const { t, language } = useLanguage();
    const pathname = usePathname();

    // Focused experience: Hide footer on mantra collection pages
    if (pathname?.startsWith('/mantras')) {
      return null;
    }

    return (
         <footer className="fixed bottom-0 z-40 w-full border-t bg-background">
            <div className="container mx-auto flex h-auto min-h-14 max-w-4xl items-center justify-center p-2">
                 <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-6">
                    <Link href="/mantras" className="flex items-center space-x-2 text-sm font-bold text-primary transition-colors hover:text-primary/80">
                        <Music className="h-4 w-4" />
                        <span>{t('mantraHubTitle')}</span>
                    </Link>
                    <Link href="/ai-guide" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <MessageSquareQuote className="h-4 w-4" />
                        <span>{t('aiGuideTitle')}</span>
                    </Link>
                    <Link href="/voice-health" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <HeartPulse className="h-4 w-4" />
                        <span>{language === 'kn' ? 'ಧ್ವನಿ ಪ್ರಾಣ' : 'Vocal Prana'}</span>
                    </Link>
                    <Link href="/mantra-corner" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <BookOpen className="h-4 w-4" />
                        <span>{t('practicalLessons')}</span>
                    </Link>
                    <Link href="/premium-library" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <BookText className="h-4 w-4" />
                        <span>{t('premiumLibrary')}</span>
                    </Link>
                    <Link href="/practical-videos" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Video className="h-4 w-4" />
                        <span>{t('practicalVideos')}</span>
                    </Link>
                    <Link href="/workshops" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <GraduationCap className="h-4 w-4" />
                        <span>{t('workshops')}</span>
                    </Link>
                    <Link href="/our-apps" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <AppWindow className="h-4 w-4" />
                        <span>{t('ourApps')}</span>
                    </Link>
                    <Link href="/about-us" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Info className="h-4 w-4" />
                        <span>{t('aboutUs')}</span>
                    </Link>
                </nav>
            </div>
        </footer>
    )
}