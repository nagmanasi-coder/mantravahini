"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-start">
          <Button onClick={handleUpgrade} className="w-full sm:w-auto">{t('upgradeButton')}</Button>
          <AlertDialogAction onClick={() => onOpenChange(false)} variant="outline" className="w-full mt-2 sm:mt-0 sm:w-auto">{t('closeButton')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
