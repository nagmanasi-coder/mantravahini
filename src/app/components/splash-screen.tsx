
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";

export function SplashScreen() {
  const { t } = useLanguage();
  const beejaMantrasString = t('beejaMantras');
  const [isVisible, setIsVisible] = useState(true);
  const [mantraStyles, setMantraStyles] = useState<{ transform: string; animationDelay: string }[]>([]);
  const splashImage = PlaceHolderImages.find(img => img.id === 'founder-portrait');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000); // Show splash screen for 4 seconds

    const beejaMantras = beejaMantrasString.split(' ');
    const styles = beejaMantras.map((mantra, index) => {
        const angle = (index / beejaMantras.length) * 2 * Math.PI;
        const radius = 160; // in pixels
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return {
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
          animationDelay: `${0.5 + index * 0.2}s`,
        };
    });
    setMantraStyles(styles);

    return () => clearTimeout(timer);
  }, [beejaMantrasString]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative h-64 w-64">
        <div className="relative h-64 w-64 overflow-hidden rounded-full animate-fade-in">
          {splashImage && <Image
            src={splashImage.imageUrl}
            alt={splashImage.description}
            fill
            sizes="256px"
            className="object-cover"
            priority
            data-ai-hint={splashImage.imageHint}
          />}
        </div>
        {mantraStyles.length > 0 && beejaMantrasString.split(' ').map((mantra, index) => {
          return (
            <span
              key={`${mantra}-${index}`}
              className="absolute left-1/2 top-1/2 text-primary font-headline text-2xl animate-fade-in"
              style={mantraStyles[index]}
            >
              {mantra}
            </span>
          );
        })}
      </div>
    </div>
  );
}
