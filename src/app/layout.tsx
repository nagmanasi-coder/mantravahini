import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Home, Sparkles, ShoppingBag, BookHeart } from 'lucide-react';
import { ShareButton } from './components/share-button';

export const metadata: Metadata = {
  title: 'ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)',
  description: 'A serene mantra playback experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400;1,7..72,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
              <Link href="/mantra-corner" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Mantra Corner</span>
              </Link>
              <Link href="/vijnana-bhairava-tantra" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <BookHeart className="h-4 w-4" />
                <span>ವಿಜ್ಞಾನ ಭೈರವ ತಂತ್ರ</span>
              </Link>
            </nav>
            <ShareButton />
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
