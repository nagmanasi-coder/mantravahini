
"use client";

import Image from "next/image";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ThumbsUp, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export function BannerAd() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: string }>(userDocRef);
  
  // Ad-Free Pass Check
  const [isAdFreePassActive, setIsAdFreePassActive] = useState(false);
  // Ad Refresh Logic: Simulate AdMob/AdSense banner refresh every 60 seconds
  const [adKey, setAdKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkPass = () => {
      const expiry = localStorage.getItem('ad_free_until');
      if (expiry && new Date(expiry) > new Date()) {
        setIsAdFreePassActive(true);
      } else {
        setIsAdFreePassActive(false);
      }
    };
    checkPass();
    const passInterval = setInterval(checkPass, 10000);

    // REVENUE MAXIMIZATION: Auto-refresh banner every 60 seconds
    const adRefreshInterval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setAdKey(prev => prev + 1);
        setIsRefreshing(false);
      }, 500); // Brief visual swap
    }, 60000);

    return () => {
      clearInterval(passInterval);
      clearInterval(adRefreshInterval);
    };
  }, []);

  // Exceptions: Paid users or users with active boost
  if (userProfile?.subscriptionTier === 'premium' || userProfile?.subscriptionTier === 'basic' || isAdFreePassActive) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex h-16 w-full flex-col items-center justify-center bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)] border-t border-primary/10">
      <div className="flex items-center gap-1 mb-1">
        <p className="text-[9px] uppercase tracking-tighter text-muted-foreground font-black">Sponsored Content</p>
        {isRefreshing && <RefreshCw className="h-2 w-2 animate-spin text-primary/50" />}
      </div>
      <div 
        key={adKey}
        className={cn(
          "flex h-10 w-[320px] items-center justify-center bg-muted rounded border border-dashed border-primary/20 transition-all duration-500",
          isRefreshing ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in"
        )}
      >
         <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
           {t('bannerAd')}
           <span className="text-[8px] bg-primary/10 text-primary px-1 rounded font-mono">ID: {adKey + 100}</span>
         </p>
      </div>
    </div>
  );
}

interface InterstitialAdProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function InterstitialAd({ open, onOpenChange }: InterstitialAdProps) {
  const { t } = useLanguage();
  const adImage = PlaceHolderImages.find((img) => img.id === "interstitial-ad");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl">{t('adTitle')}</DialogTitle>
          <DialogDescription>
            {t('adDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4 h-96 w-full">
          {adImage && (
             <Image
                src={adImage.imageUrl}
                alt={adImage.description}
                fill
                className="object-cover"
                data-ai-hint={adImage.imageHint}
              />
          )}
        </div>
        <div className="flex flex-col gap-2 p-6">
          <Button size="lg" onClick={() => onOpenChange(false)}>
            <ThumbsUp className="mr-2 h-4 w-4" />
            {t('adAwesomeButton')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            {t('adCloseButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
