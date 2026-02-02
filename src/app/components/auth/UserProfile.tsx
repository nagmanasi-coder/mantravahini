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
import { useUser, useAuth } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { LogIn, User as UserIcon, LogOut, Code, Shield } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useState, useEffect } from 'react';

export function UserProfile() {
  const { user, isUserLoading: loading } = useUser();
  const auth = useAuth();
  const { t } = useLanguage();
  const [isDevMode, setIsDevMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // This effect handles logic that depends on the user object, which is client-side.
    if (user?.uid === 'FaGAe1gQAdayrSd09khGJbVMeZI3') {
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      setIsDevMode(devModeEnabled);
    }
  }, [user]); // It runs when the user object changes.


  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const toggleDeveloperMode = () => {
    const newDevMode = !isDevMode;
    localStorage.setItem('developerMode', String(newDevMode));
    setIsDevMode(newDevMode);
    window.location.reload(); // Reload to apply changes app-wide
  };

  // On the server, and on the initial client render, `isMounted` will be false.
  // This ensures the server and client render the same thing initially.
  if (!isMounted) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }
  
  // After mounting, we can check the loading state from Firebase Auth.
  if (loading) {
     return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  // After loading, we can check if there is a user.
  if (!user) {
    return (
      <Button asChild variant="ghost" size="icon">
        <Link href="/login">
          <LogIn />
        </Link>
      </Button>
    );
  }

  // If we have a user, we can render the full component.
  const isActualDeveloper = user.uid === 'FaGAe1gQAdayrSd09khGJbVMeZI3';

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
            <p className="pt-2 font-mono text-xs leading-none text-muted-foreground">
              UID: {user.uid}
            </p>
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
