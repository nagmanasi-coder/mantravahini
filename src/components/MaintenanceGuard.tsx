
'use client';

import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

/**
 * MaintenanceGuard component that locks the app for all users
 * except the authorized developer in dev mode.
 */
export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const [isDevMode, setIsDevMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const devMode = typeof window !== 'undefined' ? localStorage.getItem('developerMode') === 'true' : false;
    setIsDevMode(devMode);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
  const isAuthorized = isDeveloper && isDevMode;

  // Always allow access to the login page so the developer can sign in
  // Also allow access to the privacy and delete-account pages for Play Store review
  const publicPages = ['/login', '/privacy-policy', '/delete-account', '/terms', '/refund'];
  if (publicPages.includes(pathname || '')) {
    return <>{children}</>;
  }

  if (!isAuthorized && !isUserLoading) {
    return (
      <div className="fixed inset-0 z-[5000] bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6 animate-fade-in">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
            <Lock size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold text-primary">Divine Maintenance</h1>
            <p className="text-muted-foreground font-medium">
              The Mantravaahini portal is currently undergoing spiritual alignment. We are performing critical updates to ensure the purity of the divine connection.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg border border-primary/10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <ShieldAlert size={14} />
              Portal Locked
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 italic">Expected resolution: Soon</p>
          </div>
          
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Developer Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
