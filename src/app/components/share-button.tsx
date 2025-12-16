"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ShareButton() {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: "ಮಂತ್ರವಾಹಿನಿ",
      text: "Share power of mantras to reach everyone",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
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
