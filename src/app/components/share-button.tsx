"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export function ShareButton() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ referralCode?: string; subscriptionTier?: string }>(userDocRef);

  const handleShare = async () => {
    // Always use the published production domain for sharing
    const baseUrl = "https://mantravahini.vercel.app";
    const referralCode = userProfile?.referralCode;
    const isPremium = userProfile?.subscriptionTier === 'premium';
    const shareUrl = isPremium && referralCode ? `${baseUrl}?ref=${referralCode}` : baseUrl;
    
    const shareData = {
      title: t('appTitle'),
      text: t('shareText'),
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        // Handle common cases silently to avoid developer overlays
        if (error.name === 'AbortError' || error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
          console.warn("Share operation was cancelled or blocked by browser policy.");
          return;
        }
        
        console.warn("Share failed, falling back to clipboard:", error);
        copyToClipboard(shareData.url);
      }
    } else {
      copyToClipboard(shareData.url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t('shareAppButton'),
        description: "App link has been copied to your clipboard.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not copy link to clipboard.",
      });
    }
  };

  return (
    <Button onClick={handleShare} variant="ghost" size="icon" aria-label="Share App">
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
