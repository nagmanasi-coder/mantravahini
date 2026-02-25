"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/language-context";
import { useRouter } from "next/navigation";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export function UpgradeDialog({ open, onOpenChange, title, description }: UpgradeDialogProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push('/upgrade');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl font-headline text-primary">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-3 mt-6 sm:mt-4">
          <AlertDialogAction 
            onClick={handleUpgrade} 
            className="w-full h-12 text-base font-bold order-1 sm:order-2"
          >
            {t('upgradeButton')}
          </AlertDialogAction>
          <AlertDialogCancel 
            className="w-full h-12 text-base font-semibold mt-0 order-2 sm:order-1"
          >
            {t('closeButton')}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
