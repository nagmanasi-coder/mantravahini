"use client";

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
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

export function BannerAd() {
  return (
    <div className="sticky bottom-0 z-10 flex h-16 w-full items-center justify-center bg-card shadow-lg">
      <p className="text-sm text-muted-foreground">ಬ್ಯಾನರ್ ಜಾಹೀರಾತು</p>
    </div>
  );
}

interface InterstitialAdProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function InterstitialAd({ open, onOpenChange }: InterstitialAdProps) {
  const adImage = PlaceHolderImages.find((img) => img.id === "interstitial-ad");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl">ಜಾಹೀರಾತು</DialogTitle>
          <DialogDescription>
            ಈ ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಬೆಂಬಲಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!
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
            ಅದ್ಭುತವಾಗಿದೆ!
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            ಜಾಹೀರಾತನ್ನು ಮುಚ್ಚಿ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
