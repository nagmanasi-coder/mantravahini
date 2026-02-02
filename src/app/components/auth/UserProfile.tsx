
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
import { LogIn, User as UserIcon, LogOut, Code, Shield } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';

type UserProfileType = {
  subscriptionTier?: 'free' | 'basic' | 'premium';
  premiumCycleStartDate?: string | null;
};

export function UserProfile() {
  const { user, isUserLoading: loading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const [isDevMode, setIsDevMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
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

  const calculateRemainingDays = (startDateString?: string | null): number | null => {
    if (!startDateString) return null;
    const startDate = new Date(startDateString);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    if (timeDiff < 0) return 0;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const isPaidUser = userProfile?.subscriptionTier === 'basic' || userProfile?.subscriptionTier === 'premium';
  const remainingDays = isPaidUser ? calculateRemainingDays(userProfile.premiumCycleStartDate) : null;

  if (!isMounted || loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }
  
  if (!user) {
    return (
      <Button asChild variant="ghost" size="icon">
        <Link href="/login">
          <LogIn />
        </Link>
      </Button>
    );
  }

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
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {isPaidUser && remainingDays !== null && (
                <p className="text-xs font-semibold leading-none text-primary/80 mt-1">
                {remainingDays} days left
                </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isActualDeveloper && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin/users">
                <Shield className="mr-2 h-4 w-4" />
                <span>{t('manageUsers')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleDeveloperMode}>
              <Code className="mr-2 h-4 w-4" />
              <span>{isDevMode ? "Disable Dev Mode" : "Enable Dev Mode"}</span>
            </DropdownMenuItem>
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
