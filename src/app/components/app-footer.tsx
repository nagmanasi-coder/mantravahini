
"use client"

import Link from "next/link";
import { Info, Sparkles, Music, UserX } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppFooter() {
    const { t } = useLanguage();
    const pathname = usePathname();

    if (pathname?.startsWith('/mantras')) {
      return null;
    }

    return (
         <footer className="fixed bottom-0 z-40 w-full border-t bg-background transition-all duration-300">
            <div className="container mx-auto flex flex-col items-center justify-center p-2">
                 <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-6 mb-2">
                    <Link href="/mantras" className="flex items-center space-x-2 text-sm font-bold text-primary transition-colors hover:text-primary/80">
                        <Music className="h-4 w-4" />
                        <span>{t('mantraHubTitle')}</span>
                    </Link>
                    <Link href="/mantra-deeksha" className="flex items-center space-x-2 text-sm font-bold text-amber-600 transition-colors hover:text-amber-500">
                        <Sparkles className="h-4 w-4" />
                        <span>{t('mantraDeeksha')}</span>
                    </Link>
                    <Link href="/about-us" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Info className="h-4 w-4" />
                        <span>{t('aboutUs')}</span>
                    </Link>
                </nav>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter opacity-60">
                    <Link href="/privacy-policy" className="hover:text-primary transition-colors">{t('privacyPolicy')}</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">{t('termsOfService')}</Link>
                    <Link href="/refund" className="hover:text-primary transition-colors">{t('refundPolicy')}</Link>
                    <Link href="/delete-account" className="hover:text-destructive transition-colors flex items-center gap-1">
                       <UserX size={10} />
                       {t('deleteAccountTitle')}
                    </Link>
                </div>
            </div>
        </footer>
    )
}
