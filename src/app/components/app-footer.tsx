"use client"

import Link from "next/link";
import { AppWindow, Info, BookUser, BookText, MessageSquareQuote } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function AppFooter() {
    const { t } = useLanguage();
    return (
         <footer className="fixed bottom-0 z-40 w-full border-t bg-background">
            <div className="container mx-auto flex h-auto min-h-14 max-w-2xl items-center justify-center p-2">
                 <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-6">
                    <Link href="/ai-guide" className="flex items-center space-x-2 text-sm font-bold text-primary transition-colors hover:text-primary/80">
                        <MessageSquareQuote className="h-4 w-4" />
                        <span>{t('aiGuideTitle')}</span>
                    </Link>
                    <Link href="/our-apps" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <AppWindow className="h-4 w-4" />
                        <span>{t('ourApps')}</span>
                    </Link>
                    <Link href="/guru-diksha" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <BookUser className="h-4 w-4" />
                        <span>{t('guruDiksha')}</span>
                    </Link>
                     <Link href="/user-manual" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <BookText className="h-4 w-4" />
                        <span>{t('userManual')}</span>
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