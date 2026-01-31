"use client"

import Link from "next/link";
import { Home, ShoppingBag, AppWindow, Star } from "lucide-react";
import { ShareButton } from "./share-button";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./auth/UserProfile";

export function AppHeader() {
    const { t, toggleLanguage, language } = useLanguage();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-2xl items-center justify-between">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                <Home className="h-4 w-4" />
                <span>{t('home')}</span>
              </Link>
              <Link href="/special-products" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <ShoppingBag className="h-4 w-4" />
                <span>{t('specialProducts')}</span>
              </Link>
              <Link href="/our-apps" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <AppWindow className="h-4 w-4" />
                <span>{t('ourApps')}</span>
              </Link>
              <Link href="/upgrade" className="flex items-center space-x-2 text-sm font-medium text-amber-500 transition-colors hover:text-amber-400">
                <Star className="h-4 w-4" />
                <span>{t('headerUpgrade')}</span>
              </Link>
            </nav>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={toggleLanguage}>{t('language')}</Button>
                <UserProfile />
                <ShareButton />
            </div>
          </div>
        </header>
    )
}
