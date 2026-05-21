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
import { ThumbsUp, RefreshCw, Smartphone, Globe, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ADMOB_CONFIG, isNativePlatform } from "@/lib/admob-config";

export function BannerAd() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: string, isPranaPractitioner?: boolean }>(userDocRef);
  
  const [isAdFreePassActive, setIsAdFreePassActive] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(isNativePlatform());
    const checkPass = () => {
      const expiry = localStorage.getItem('ad_free_until');
      setIsAdFreePassActive(expiry ? new Date(expiry) > new Date() : false);
    };
    checkPass();
  }, []);

  const isPremium = userProfile?.subscriptionTier === 'premium';
  const isPractitioner = !!userProfile?.isPranaPractitioner;

  if (isPremium || isPractitioner || isAdFreePassActive) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex h-16 w-full flex-col items-center justify-center bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)] border-t border-primary/10">
      <div className="flex items-center gap-1 mb-1">
        <p className="text-[9px] uppercase tracking-tighter text-muted-foreground font-black">
          {isNative ? "Mobile Ad Unit" : "Web Promo Slot"}
        </p>
      </div>
      <div className="flex h-10 w-[320px] items-center justify-center bg-muted rounded border border-dashed border-primary/20">
         <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
           {t('bannerAd')}
           <span className="text-[8px] bg-primary/10 text-primary px-1 rounded font-mono">
             ID: {ADMOB_CONFIG.units.banner.android.slice(-4)}
           </span>
         </p>
      </div>
    </div>
  );
}

interface InterstitialAdProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  type?: 'interstitial' | 'rewarded';
}

export function InterstitialAd({ open, onOpenChange, type = 'interstitial' }: InterstitialAdProps) {
  const { t } = useLanguage();
  const [isNative, setIsNative] = useState(false);
  const adImage = PlaceHolderImages.find((img) => img.id === "interstitial-ad");
  const unitId = type === 'rewarded' ? ADMOB_CONFIG.units.rewarded.android : ADMOB_CONFIG.units.interstitial.android;

  useEffect(() => {
    setIsNative(isNativePlatform());
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="font-headline text-2xl">
                {type === 'rewarded' ? "Watch to Unlock" : t('adTitle')}
              </DialogTitle>
              <DialogDescription>
                {type === 'rewarded' ? "Please watch this video to access your mantra." : t('adDescription')}
              </DialogDescription>
            </div>
            {isNative ? <Smartphone size={20} className="text-primary" /> : <Globe size={20} className="text-muted-foreground" />}
          </div>
        </DialogHeader>

        <div className="relative h-96 w-full bg-black flex flex-col items-center justify-center">
          {adImage && (
             <Image
                src={adImage.imageUrl}
                alt={adImage.description}
                fill
                className="opacity-40 object-cover"
                data-ai-hint={adImage.imageHint}
              />
          )}
          
          <div className="relative z-10 text-center p-6 space-y-6">
             <div className="relative">
                <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/40 animate-pulse">
                  <RefreshCw className="h-10 w-10 text-primary" />
                </div>
                {type === 'rewarded' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg animate-bounce">
                    +UNLOCK
                  </div>
                )}
             </div>

             <div className="space-y-2">
                <p className="text-white font-black text-sm uppercase tracking-[0.2em]">
                  {isNative ? "Loading Native AdMob" : "Simulated Ad Stream"}
                </p>
                <div className="flex items-center justify-center gap-2">
                   <ShieldCheck size={12} className="text-green-500" />
                   <p className="text-white/40 text-[10px] font-mono">
                    UNIT: {unitId.slice(0, 18)}...
                   </p>
                </div>
             </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-infinite-scroll w-1/3" />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-6 bg-muted/30">
          <Button size="lg" onClick={() => onOpenChange(false)} className="h-14 font-black text-lg">
            <ThumbsUp className="mr-2 h-5 w-5" />
            {type === 'rewarded' ? "Collect Reward" : t('adAwesomeButton')}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground italic">
            {isNative 
              ? "Real AdMob impressions are being tracked for your APK." 
              : "This simulation demonstrates the user journey for your web traffic."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
