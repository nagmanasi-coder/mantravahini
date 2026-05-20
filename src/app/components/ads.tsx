
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
import { ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  useEffect(() => {
    const expiry = localStorage.getItem('ad_free_until');
    if (expiry && new Date(expiry) > new Date()) {
      setIsAdFreePassActive(true);
    }
  }, []);

  if (userProfile?.subscriptionTier === 'premium' || userProfile?.subscriptionTier === 'basic' || isAdFreePassActive) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-10 flex h-16 w-full flex-col items-center justify-center bg-card shadow-lg border-t animate-fade-in">
      <p className="text-[9px] uppercase tracking-tighter text-muted-foreground mb-1">Sponsored</p>
      <div className="flex h-10 w-[320px] items-center justify-center bg-muted rounded border border-dashed">
         <p className="text-xs text-muted-foreground">{t('bannerAd')}</p>
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
  const { user } = useUser();
  const firestore = useFirestore();
  const adImage = PlaceHolderImages.find((img) => img.id === "interstitial-ad");

  useEffect(() => {
    if (open && firestore && user) {
        // Frequency capping or auto-logging for nav-interstitials
        // We log it here to capture basic analytics
    }
  }, [open, firestore, user]);

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
