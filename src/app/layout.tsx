
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SplashScreen } from './components/splash-screen';
import { LanguageProvider } from '@/context/language-context';
import { AppHeader } from './components/app-header';
import { AppFooter } from './components/app-footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { HandleReferral } from './components/handle-referral';

export const metadata: Metadata = {
  title: 'ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)',
  description: 'A serene mantra playback experience',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Critical for Capacitor/APK safe areas
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400;1,7..72,700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f97316" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <FirebaseClientProvider>
            <HandleReferral />
            <SplashScreen />
            <AppHeader />
            <div className="pb-28 min-h-screen">{children}</div>
            <AppFooter />
            <Toaster />
            <FirebaseErrorListener />
          </FirebaseClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
