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

  const { data: userProfile } = useDoc<{ referralCode?: string; isPremium?: boolean }>(userDocRef);

  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const referralCode = userProfile?.referralCode;
    const shareUrl = userProfile?.isPremium && referralCode ? `${baseUrl}?ref=${referralCode}` : window.location.href;
    
    const shareData = {
      title: t('appTitle'),
      text: t('shareText'),
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        // Silently fail if the user cancels the share dialog.
        if (error.name === 'AbortError') {
          return;
        }
        console.error("Error sharing:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not share the app at this moment.",
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Copied to clipboard",
          description: "App link has been copied to your clipboard.",
        });
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Error",
          description: "Could not copy link to clipboard.",
        });
      }
    }
  };

  return (
    <Button onClick={handleShare} variant="ghost" size="icon" aria-label="Share App">
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
