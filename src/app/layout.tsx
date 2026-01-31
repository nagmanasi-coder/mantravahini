import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Home, ShoppingBag, AppWindow, Youtube, Info } from 'lucide-react';
import { ShareButton } from './components/share-button';
import { SplashScreen } from './components/splash-screen';

export const metadata: Metadata = {
  title: 'ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)',
  description: 'A serene mantra playback experience',
  manifest: "/manifest.json",
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
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#FF8C42" />
      </head>
      <body className="font-body antialiased">
        <SplashScreen />
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-2xl items-center justify-between">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link href="/special-products" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <ShoppingBag className="h-4 w-4" />
                <span>Special Products</span>
              </Link>
              <Link href="/our-apps" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <AppWindow className="h-4 w-4" />
                <span>Our Apps</span>
              </Link>
            </nav>
            <ShareButton />
          </div>
        </header>
        <div className="pb-16">{children}</div>
        <footer className="fixed bottom-0 z-40 w-full border-t bg-background">
            <div className="container flex h-14 max-w-2xl items-center justify-center">
                 <nav className="flex items-center space-x-4 lg:space-x-6">
                    <Link href="/practical-videos" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Youtube className="h-4 w-4" />
                        <span>Practical Videos</span>
                    </Link>
                    <Link href="/about-us" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <Info className="h-4 w-4" />
                        <span>About Us</span>
                    </Link>
                </nav>
            </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
