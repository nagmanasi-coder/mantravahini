
"use client"

import Link from "next/link";
import { Home, ShoppingBag, Star, Download } from "lucide-react";
import { ShareButton } from "./share-button";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./auth/UserProfile";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function AppHeader() {
    const { t, toggleLanguage } = useLanguage();
    const [canInstall, setCanInstall] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Platform detection: Check if running as PWA or native APK (Capacitor)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isCapacitor = (window as any).Capacitor !== undefined;
        
        // Only show install prompt if not already in standalone/native mode
        if (!isStandalone && !isCapacitor) {
          setCanInstall(true);
        }
    }, []);

    // Focused experience: Hide header on mantra collection pages
    if (pathname?.startsWith('/mantras')) {
      return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-auto min-h-14 max-w-2xl flex-wrap items-center justify-between gap-4 p-2">
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:gap-x-6">
              <Link href="/" className="flex items-center space-x-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                <Home className="h-4 w-4" />
                <span>{t('home')}</span>
              </Link>
              <Link href="/special-products" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <ShoppingBag className="h-4 w-4" />
                <span>{t('specialProducts')}</span>
              </Link>
              <Link href="/upgrade" className="flex items-center space-x-2 text-sm font-medium text-amber-500 transition-colors hover:text-amber-400">
                <Star className="h-4 w-4" />
                <span>{t('headerUpgrade')}</span>
              </Link>
            </nav>
            <div className="flex items-center gap-2">
                {canInstall && (
                    <Button asChild variant="ghost" size="sm" title={t('installApp')}>
                        <Link href="/install">
                            <Download />
                            <span>{t('installApp')}</span>
                        </Link>
                    </Button>
                )}
                <Button variant="ghost" size="sm" onClick={toggleLanguage}>{t('language')}</Button>
                <UserProfile />
                <ShareButton />
            </div>
          </div>
        </header>
    )
}
