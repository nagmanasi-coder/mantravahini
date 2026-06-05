
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserX, ShieldAlert, Trash2, Mail, Info } from "lucide-react";
import Link from "next/link";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function DeleteAccountPage() {
  const { t } = useLanguage();
  const whatsAppUrl = `https://wa.me/917022070287?text=Namaste! I would like to request my Mantravaahini account and data deletion. My User ID is: `;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <header className="mb-8 text-center">
        <Button asChild variant="ghost" size="sm" className="mb-4 self-start">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backButton')}
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center justify-center gap-3">
          <UserX className="h-8 w-8" />
          {t('deleteAccountTitle')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('deleteAccountSubtitle')}</p>
      </header>

      <div className="space-y-8 animate-fade-in">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              {t('deletionStepsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-medium">
            <p>1. {t('deletionStep1')}</p>
            <p>2. {t('deletionStep2')}</p>
            <p>3. {t('deletionStep3')}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Trash2 className="h-5 w-5" />
                {t('dataDeletedTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t('dataDeletedContent')}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                {t('dataRetentionTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t('dataRetentionContent')}
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/5 text-center">
            <CardTitle className="text-primary">{t('deleteRequestContact')}</CardTitle>
            <CardDescription>Contact us to process your request within 48 hours.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
             <Button asChild className="flex-1 h-14" variant="outline">
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                   <WhatsAppIcon />
                   WhatsApp Request
                </a>
             </Button>
             <Button asChild className="flex-1 h-14" variant="outline">
                <a href="mailto:nagmanasi@gmail.com?subject=Account Deletion Request">
                   <Mail className="mr-2 h-5 w-5" />
                   Email Request
                </a>
             </Button>
          </CardContent>
          <footer className="bg-muted/30 p-4 text-center">
             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Mantravaahini Data Privacy Team</p>
          </footer>
        </Card>
      </div>
    </div>
  );
}
