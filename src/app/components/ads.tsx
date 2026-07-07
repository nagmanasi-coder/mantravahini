
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
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Smartphone, Globe, Clock, RefreshCw, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { ADMOB_CONFIG, isNativePlatform } from "@/lib/admob-config";
import { cn } from "@/lib/utils";

/**
 * UTILITY: Shared Logic to hide ads for Premium users
 */
export function useShouldShowAds() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ subscriptionTier?: string, isPranaPractitioner?: boolean }>(userDocRef);
  
  const isPremium = userProfile?.subscriptionTier === 'premium';
  const isPractitioner = !!userProfile?.isPranaPractitioner;

  return !isPremium && !isPractitioner;
}

/**
 * 1. BANNER AD (Docked at the very bottom)
 */
export function BannerAd() {
  const { t } = useLanguage();
  const showAds = useShouldShowAds();
  const [isNative, setIsNative] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsNative(isNativePlatform());
    const interval = setInterval(() => setRefreshKey((prev) => prev + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showAds) return null;

  return (
    <div className="relative flex h-16 w-full flex-col items-center justify-center bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)] border-t border-primary/10 select-none">
      <div className="flex items-center gap-1 mb-1">
        <p className="text-[9px] uppercase tracking-tighter text-muted-foreground font-black flex items-center gap-1">
          {isNative ? "Mobile Ad Unit" : "Web Promo Slot"}
          <RefreshCw size={8} className="animate-spin-slow" />
        </p>
      </div>
      <div 
        key={refreshKey}
        className={cn(
          "flex h-10 w-[320px] items-center justify-center bg-muted rounded border border-dashed border-primary/20 animate-fade-in",
          refreshKey > 0 && "animate-in fade-in zoom-in-95 duration-500"
        )}
      >
         <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
           {t('bannerAd') || "Spiritual Wellness Ad"}
           <span className="text-[8px] bg-primary/10 text-primary px-1 rounded font-mono">
             ID: {ADMOB_CONFIG.units.banner.android.slice(-4)}
           </span>
         </p>
      </div>
    </div>
  );
}

/**
 * 2. REWARDED AD (Fullscreen Dialog to unlock content)
 */
interface InterstitialAdProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onAdComplete?: () => void;
  type?: 'interstitial' | 'rewarded';
}

export function InterstitialAd({ open, onOpenChange, onAdComplete, type = 'interstitial' }: InterstitialAdProps) {
  const { language } = useLanguage();
  const [isNative, setIsNative] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const adImage = PlaceHolderImages.find((img) => img.id === "interstitial-ad");

  useEffect(() => {
    setIsNative(isNativePlatform());
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      setCountdown(5);
      timer = setInterval(() => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [open]);

  const handleRewardCollection = () => {
    onOpenChange(false);
    if (onAdComplete) {
      // Ensure standard state reset before playing
      setTimeout(() => onAdComplete(), 100);
    }
  };

  const readyText = language === 'kn' ? "ಮಂತ್ರವು ಸಿದ್ಧವಾಗುತ್ತಿದೆ, ನಿರೀಕ್ಷಿಸಿ..." : "Mantra is getting ready, wait...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="font-headline text-2xl text-primary">
                {type === 'rewarded' ? readyText : (language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರೋತ್ಸಾಹಕ್ಕೆ ಧನ್ಯವಾದಗಳು' : 'Express Appreciation')}
              </DialogTitle>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">
                   Promotional Slot
                </p>
                <DialogDescription className="font-bold flex items-center gap-2">
                  <Clock size={14} className="text-amber-500 animate-spin" />
                  {language === 'kn' ? `${countdown} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸಿದ್ಧ` : `Ready in ${countdown}s...`}
                </DialogDescription>
              </div>
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
             <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary/40 animate-pulse">
               <span className="text-white text-4xl font-black">{countdown}</span>
             </div>
             <p className="text-white font-black text-sm uppercase tracking-[0.2em]">
                {isNative ? `Native Rewarded Unit` : `Reward Simulation`}
             </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-6 bg-muted/30">
          <Button 
            size="lg" 
            onClick={handleRewardCollection} 
            className="h-14 font-black text-lg shadow-xl"
            disabled={countdown > 0}
          >
            {countdown > 0 
              ? (language === 'kn' ? `ನಿರೀಕ್ಷಿಸಿ (${countdown})` : `Wait (${countdown}s)`) 
              : "Collect Reward & Play"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 3. NATIVE ADVANCED AD (Blends into content feeds)
 */
export function NativeAdSlot({ className }: { className?: string }) {
  const showAds = useShouldShowAds();
  const [isNative, setIsNative] = useState(false);
  const adImage = PlaceHolderImages.find((img) => img.id === "coming-soon-app-icon");

  useEffect(() => {
    setIsNative(isNativePlatform());
  }, []);

  if (!showAds) return null;

  return (
    <Card className={cn("overflow-hidden border-2 border-primary/10 shadow-sm animate-fade-in", className)}>
      <div className="bg-primary/5 px-3 py-1 flex justify-between items-center border-b">
        <span className="text-[8px] font-black uppercase text-primary tracking-widest">Sponsored</span>
        <span className="text-[8px] font-mono text-muted-foreground">ID: {ADMOB_CONFIG.units.native.android.slice(-4)}</span>
      </div>
      <CardContent className="p-4 flex gap-4 items-center">
        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border shadow-inner">
          {adImage && <Image src={adImage.imageUrl} alt="ad" fill className="object-cover" data-ai-hint={adImage.imageHint} />}
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-sm text-foreground">Explore Spiritual Wisdom</h4>
          <p className="text-[10px] text-muted-foreground leading-tight">Unlock ancient secrets with our meditation partners. High-vibration content available.</p>
          <Button size="sm" className="h-7 text-[10px] font-black uppercase w-full mt-2" variant="outline">
            Visit Partner <ExternalLink size={10} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
