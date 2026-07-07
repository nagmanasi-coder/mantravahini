"use client";

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from "@/components/ui/toaster";
import { SplashScreen } from './components/splash-screen';
import { AppHeader } from './components/app-header';
import { AppFooter } from './components/app-footer';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { HandleReferral } from './components/handle-referral';
import { BannerAd } from './components/ads';
import { WifiOff } from 'lucide-react';

/**
 * ClientLayout handles all client-side state and providers.
 * Moving this out of layout.tsx prevents hydration errors by ensuring
 * browser-specific logic only runs after the initial mount.
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <LanguageProvider>
      <FirebaseClientProvider>
        {!mounted ? (
          /* 
             During SSR and initial hydration, we render the children 
             wrapped in providers but without the interactive components 
             to avoid hydration mismatches.
          */
          <div className="bg-background min-h-screen">
            <div className="pb-32 min-h-screen">
              {children}
            </div>
          </div>
        ) : (
          /* Full application shell once mounted on the client */
          <>
            {isOffline && (
              <div className="fixed top-0 left-0 right-0 z-[6000] bg-destructive text-destructive-foreground py-1 px-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top duration-500">
                <WifiOff size={10} />
                Offline Mode: Using Cached Data
              </div>
            )}
            <HandleReferral />
            <SplashScreen />
            <AppHeader />
            <div className="pb-32 min-h-screen">
              {children}
            </div>
            <BannerAd />
            <AppFooter />
            <Toaster />
            <FirebaseErrorListener />
          </>
        )}
      </FirebaseClientProvider>
    </LanguageProvider>
  );
}
