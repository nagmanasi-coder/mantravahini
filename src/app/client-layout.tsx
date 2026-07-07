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
          <div className="bg-background min-h-screen">
            <div className="pb-40 min-h-screen">
              {children}
            </div>
          </div>
        ) : (
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
            
            {/* Increase padding-bottom to account for stacked Footer + Banner */}
            <div className="pb-48 min-h-screen">
              {children}
            </div>

            {/* STACKED DOCK: Footer above Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-[5000] flex flex-col pointer-events-none">
                <div className="pointer-events-auto bg-background">
                    <AppFooter />
                </div>
                <div className="pointer-events-auto">
                    <BannerAd />
                </div>
            </div>

            <Toaster />
            <FirebaseErrorListener />
          </>
        )}
      </FirebaseClientProvider>
    </LanguageProvider>
  );
}
