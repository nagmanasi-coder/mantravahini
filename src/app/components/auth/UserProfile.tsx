
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { LogIn, User as UserIcon, LogOut, Code, Shield, Copy, CheckCircle2, FileJson, Share2, Heart, MessageSquareQuote, Mic2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type UserProfileType = {
  subscriptionTier?: 'free' | 'premium';
  isPranaPractitioner?: boolean;
  premiumCycleStartDate?: string | null;
  referralCode?: string;
  createdAt?: string;
};

export function UserProfile() {
  const { user, isUserLoading: loading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDevMode, setIsDevMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfileType>(userDocRef);

  useEffect(() => {
    if (user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53') {
      const devModeEnabled = typeof window !== 'undefined' ? localStorage.getItem('developerMode') === 'true' : false;
      setIsDevMode(devModeEnabled);
    }
  }, [user]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const toggleDeveloperMode = () => {
    const newDevMode = !isDevMode;
    localStorage.setItem('developerMode', String(newDevMode));
    setIsDevMode(newDevMode);
    window.location.reload(); 
  };

  const copyUid = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      toast({
        title: "UID Copied",
        description: "Your User ID has been copied to the clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMounted || loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }
  
  if (!user) {
    return (
      <Button asChild variant="outline" className="h-9 px-3 border-primary/20 hover:bg-primary/5">
        <Link href="/login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-tight text-primary">{t('loginRegister')}</span>
        </Link>
      </Button>
    );
  }

  const isPractitioner = !!userProfile?.isPranaPractitioner;
  const isActualDeveloper = user.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
            
            {isPractitioner && (
              <div className="mt-2 p-2 rounded bg-primary/10 border border-primary/20 flex items-center gap-2">
                 <Heart size={12} className="text-primary fill-primary" />
                 <p className="text-[10px] font-black text-primary uppercase tracking-tighter">
                   {t('practitionerRole')}
                 </p>
              </div>
            )}

            {!isActualDeveloper && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <p className="text-[10px] text-muted-foreground font-mono truncate flex-1">
                  UID: {user.uid}
                </p>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={copyUid}>
                  {copied ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
                </Button>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/referral">
            <Share2 className="mr-2 h-4 w-4" />
            <span>{t('referAndEarn')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isActualDeveloper && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin/users">
                <Shield className="mr-2 h-4 w-4" />
                <span>{t('manageUsers')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/testimonials">
                <MessageSquareQuote className="mr-2 h-4 w-4" />
                <span>{t('manageTestimonials')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/assets">
                <FileJson className="mr-2 h-4 w-4" />
                <span>Manage Assets</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/tts">
                <Mic2 className="mr-2 h-4 w-4" />
                <span>AI Voice Studio</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleDeveloperMode}>
              <Code className="mr-2 h-4 w-4" />
              <span>{isDevMode ? "Disable Dev Mode" : "Enable Dev Mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
