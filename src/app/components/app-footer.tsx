
"use client"

import Link from "next/link";
import { Info, BookText, MessageSquareQuote, GraduationCap, Video, Music } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { usePathname } from "next/navigation";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AppFooter() {
    const { t, language } = useLanguage();
    const pathname = usePathname();
    const { user } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, "users", user.uid);
    }, [firestore, user]);

    const { data: userProfile } = useDoc<{ subscriptionTier?: string }>(userDocRef);
    
    const [isAdFreePassActive, setIsAdFreePassActive] = useState(false);

    useEffect(() => {
        const checkPass = () => {
            const expiry = localStorage.getItem('ad_free_until');
            setIsAdFreePassActive(!!(expiry && new Date(expiry) > new Date()));
        };
        checkPass();
        const interval = setInterval(checkPass, 10000);
        return () => clearInterval(interval);
    }, []);

    // Focused experience: Hide footer on mantra collection pages or focused learning sessions
    if (pathname?.startsWith('/mantras')) {
      return null;
    }

    const showAd = !(userProfile?.subscriptionTier === 'premium' || userProfile?.subscriptionTier === 'basic' || isAdFreePassActive);

    return (
         <footer className={cn(
            "fixed z-40 w-full border-t bg-background transition-all duration-300",
            showAd ? "bottom-16" : "bottom-0"
         )}>
            <div className="container mx-auto flex flex-col items-center justify-center p-2">
                 <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-6 mb-2">
                    <Link href="/mantras" className="flex items-center space-x-2 text-sm font-bold text-primary transition-colors hover:text-primary/80">
                        <Music className="h-4 w-4" />
                        <span>{t('mantraHubTitle')}</span>
                    </Link>
                    <Link href="/practical-videos" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Video className="h-4 w-4" />
                        <span>{t('practicalVideos')}</span>
                    </Link>
                    <Link href="/about-us" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Info className="h-4 w-4" />
                        <span>{t('aboutUs')}</span>
                    </Link>
                </nav>

                {/* Legal Links for Compliance */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter opacity-60">
                    <Link href="/privacy-policy" className="hover:text-primary transition-colors">{t('privacyPolicy')}</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">{t('termsOfService')}</Link>
                    <Link href="/refund" className="hover:text-primary transition-colors">{t('refundPolicy')}</Link>
                </div>
            </div>
        </footer>
    )
}
