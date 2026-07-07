
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
import { Smartphone, Globe, Clock, RefreshCw, ExternalLink, CheckCircle2, X } from "lucide-react";
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
  onOpenChange: (open: boolean) => void;
  onAdComplete?: () => void;
  type?: 'interstitial' | 'rewarded';
}

export function InterstitialAd({ open, onOpenChange, onAdComplete, type = 'interstitial' }: InterstitialAdProps) {
  const { language } = useLanguage();
  const [isNative, setIsNative] = useState(false);
  const [countdown, setCountdown] = useState(5); 
  const [isProcessing, setIsProcessing] = useState(false);
  const adImage = PlaceHolderImages.find((img) => img.id === "interstitial-ad");

  useEffect(() => {
    setIsNative(isNativePlatform());
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      setCountdown(5); 
      setIsProcessing(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [open]);

  const handleRewardCollection = () => {
    if (countdown > 0 || isProcessing) return;
    
    setIsProcessing(true);
    
    // 1. Close the dialog
    onOpenChange(false);
    
    // 2. Trigger completion callback (this unlocks the audio)
    if (onAdComplete) {
      onAdComplete();
    }
    
    // Reset state after a delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  const readyText = language === 'kn' ? "ಮಂತ್ರವು ಸಿದ್ಧವಾಗುತ್ತಿದೆ..." : "Mantra is getting ready...";

  return (
    <Dialog open={open} onOpenChange={(val) => {
      // Prevent closing manually if ad is not complete
      // If complete and user tries to close, trigger the reward logic automatically
      if (countdown === 0 && !val) {
         handleRewardCollection();
      } else if (countdown === 0) {
         onOpenChange(val);
      }
    }}>
      <DialogContent 
        className="max-w-sm p-0 overflow-hidden max-h-[95vh] rounded-2xl border-none" 
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Explicit Close Button on Top Right - ENABLED ONLY WHEN COMPLETED */}
        {/* UPDATED: Clicking X now correctly triggers handleRewardCollection */}
        {countdown === 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-[60] h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md border border-white/20 animate-in fade-in zoom-in duration-300"
            onClick={handleRewardCollection}
          >
            <X size={18} strokeWidth={3} />
          </Button>
        )}

        <DialogHeader className="p-6 pb-4 bg-background border-b relative z-10">
          <div className="flex justify-between items-start pr-8">
            <div className="space-y-1">
              <DialogTitle className="font-headline text-xl text-primary leading-tight">
                {type === 'rewarded' ? readyText : (language === 'kn' ? 'ಪ್ರಚಾರದ ಅವಧಿ' : 'Promotional Break')}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-2 py-0.5 rounded">
                   Sponsor Slot
                </p>
                {countdown > 0 && (
                  <DialogDescription className="font-bold text-xs flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={12} className="text-amber-500 animate-spin" />
                    {language === 'kn' ? `${countdown} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪೂರ್ಣ` : `Ready in ${countdown}s`}
                  </DialogDescription>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="relative h-64 sm:h-80 w-full bg-black flex flex-col items-center justify-center overflow-hidden">
          {adImage && (
             <Image
                src={adImage.imageUrl}
                alt={adImage.description}
                fill
                className="opacity-50 object-cover"
                data-ai-hint={adImage.imageHint}
              />
          )}
          
          <div className="relative z-10 text-center p-6 space-y-4">
             {countdown > 0 ? (
               <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary/40 animate-pulse">
                 <span className="text-white text-3xl font-black">{countdown}</span>
               </div>
             ) : (
               <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/40 animate-in zoom-in-50 duration-300">
                 <CheckCircle2 size={40} className="text-green-500" />
               </div>
             )}
             <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-80">
                {isNative ? `Native Reward Unit` : `Digital Ad Support`}
             </p>
          </div>
        </div>

        <div className="p-6 bg-muted/30 border-t relative z-10">
          <Button 
            size="lg" 
            onClick={handleRewardCollection} 
            className={cn(
              "h-14 w-full font-black text-lg shadow-xl transition-all active:scale-95",
              countdown === 0 && !isProcessing ? "bg-green-600 hover:bg-green-700 animate-pulse" : "bg-primary"
            )}
            disabled={countdown > 0 || isProcessing}
          >
            {isProcessing ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : countdown > 0 ? (
              <span className="flex items-center gap-2">
                {language === 'kn' ? `ನಿರೀಕ್ಷಿಸಿ (${countdown})` : `Wait (${countdown}s)`}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                {language === 'kn' ? "ಬಹುಮಾನ ಪಡೆಯಿರಿ ಮತ್ತು ಪ್ಲೇ ಮಾಡಿ" : "Unlock & Play Now"}
              </span>
            )}
          </Button>
          
          {countdown > 0 && (
            <p className="text-[10px] text-center text-muted-foreground mt-3 font-bold uppercase tracking-tight">
              Watch full ad to support our mission
            </p>
          )}
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
