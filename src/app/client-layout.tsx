
'use client';

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from "@/components/ui/toaster";
import { SplashScreen } from './components/splash-screen';
import { AppHeader } from './components/app-header';
import { AppFooter } from './components/app-footer';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { HandleReferral } from './components/handle-referral';
import { MaintenanceGuard } from '@/components/MaintenanceGuard';

/**
 * ClientLayout handles all client-side state and providers.
 * Moving this out of layout.tsx prevents hydration errors by ensuring
 * browser-specific logic only runs after the initial mount.
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
          <MaintenanceGuard>
            <HandleReferral />
            <SplashScreen />
            <AppHeader />
            <div className="pb-32 min-h-screen">
              {children}
            </div>
            <AppFooter />
            <Toaster />
            <FirebaseErrorListener />
          </MaintenanceGuard>
        )}
      </FirebaseClientProvider>
    </LanguageProvider>
  );
}
