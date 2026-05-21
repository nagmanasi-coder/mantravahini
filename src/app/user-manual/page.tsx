
"use client";

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Check, Star, Sparkles, Share2, Zap, Shield, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function UserManualPage() {
  const { t } = useLanguage();
  const manualContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const input = manualContentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / pdfWidth;
    const scaledImgHeight = imgHeight / ratio;
    
    let heightLeft = scaledImgHeight;
    let position = 0;
    const totalPages = Math.ceil(scaledImgHeight / pageHeight);
    let currentPage = 1;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
    pdf.setFontSize(10);
    pdf.text(`Page ${currentPage} of ${totalPages}`, pdfWidth / 2, pageHeight - 10, { align: 'center' });
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      currentPage++;
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
      pdf.setFontSize(10);
      pdf.text(`Page ${currentPage} of ${totalPages}`, pdfWidth / 2, pageHeight - 10, { align: 'center' });
      heightLeft -= pageHeight;
    }
    
    pdf.save('mantravaahini-user-manual.pdf');
  };

  const freeFeatures = [
    t('featureAdSupportedAccess'),
    t('featurePainMantra'),
    "Unlimited Ad-Supported Plays",
    "Public Spiritual Guidance"
  ];

  const premiumFeatures = [
    "No Advertisements (Ad-Free Experience)",
    t('featureDivineGroup'),
    t('featureGuruDiksha'),
    t('featurePranaVidya'),
    "Priority Spiritual Support",
    "Referral Program Access",
    "Offline Mode Support"
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-headline text-2xl text-primary mt-12 mb-6 pt-6 border-t flex items-center gap-2">
      {children}
    </h2>
  );
  
  const FirstSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-headline text-3xl text-primary mb-4">{children}</h2>
  );

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('userManualTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('userManualSubtitle')}
            </p>
          </header>

          <div className="flex justify-center mb-8">
            <Button onClick={handleDownloadPdf} className="h-12 px-6">
              <Download className="mr-2 h-5 w-5" />
              {t('downloadAsPdf')}
            </Button>
          </div>

          <div ref={manualContentRef} className="bg-background p-4 md:p-8 rounded-xl border shadow-sm space-y-12">
            
            <section>
              <FirstSectionTitle>{t('manualIntroTitle')}</FirstSectionTitle>
              <Card className="bg-muted/5">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed italic">{t('manualIntroContent')}</p>
                </CardContent>
              </Card>
            </section>

            <section>
              <SectionTitle>
                <Sparkles className="h-6 w-6" />
                {t('manualFreeMantrasTitle')}
              </SectionTitle>
               <div className="space-y-6">
                  <Card>
                      <CardHeader><CardTitle className="text-lg text-primary">{t('manualKaliMantraTitle')}</CardTitle></CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{t('manualKaliMantraDescription')}</p>
                          <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/10 text-xs font-bold text-primary">
                            Method: Use clean water, play near speaker, drink twice daily.
                          </div>
                      </CardContent>
                  </Card>
                  <Card>
                       <CardHeader><CardTitle className="text-lg text-primary">{t('manualChakshuMantraTitle')}</CardTitle></CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{t('manualChakshuMantraDescription')}</p>
                          <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/10 text-xs font-bold text-primary">
                            Method: Use headphones, listen twice daily.
                          </div>
                      </CardContent>
                  </Card>
              </div>
            </section>

            <section>
              <SectionTitle>
                <Zap className="h-6 w-6" />
                {t('pranaVidyaTitle')}
              </SectionTitle>
              <div className="space-y-6">
                  <Card className="border-2 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          Spiritual Progression (3 Levels)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <h4 className="font-bold text-primary">{t('pranaLevel1Title')}</h4>
                            <p className="text-sm text-muted-foreground">{t('pranaLevel1Desc')}. Requires activation fee.</p>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="font-bold text-primary">{t('pranaLevel2Title')}</h4>
                            <p className="text-sm text-muted-foreground">{t('pranaLevel2Desc')}. Automated promotion after 10 recruits.</p>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="font-bold text-primary">{t('pranaLevel3Title')}</h4>
                            <p className="text-sm text-muted-foreground">{t('pranaLevel3Desc')}. Master level for emergency healing.</p>
                          </div>
                      </CardContent>
                  </Card>
              </div>
            </section>

            <section>
              <SectionTitle>
                <Shield className="h-6 w-6" />
                {t('manualFeaturesTitle')}
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-lg">{t('freePlanTitle')}</CardTitle>
                          <CardDescription>{t('freePlanDescription')}</CardDescription>
                      </CardHeader>
                       <CardContent>
                          <ul className="space-y-2">
                              {freeFeatures.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                      <Check className="h-4 w-4 text-muted-foreground/50 mt-1 flex-shrink-0" />
                                      <span className="text-muted-foreground text-xs">{feature}</span>
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                  </Card>
                   <Card className="border-primary border-2 shadow-md bg-primary/5">
                      <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-lg">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span>{t('premiumPlanTitle')}</span>
                           </CardTitle>
                           <CardDescription>{t('premiumPlanDescription')}</CardDescription>
                      </CardHeader>
                       <CardContent>
                          <ul className="space-y-2">
                              {premiumFeatures.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                      <span className="font-bold text-foreground text-xs">{feature}</span>
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                  </Card>
              </div>
            </section>

            <section>
              <SectionTitle>
                <Share2 className="h-6 w-6" />
                {t('manualReferralTitle')}
              </SectionTitle>
              <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('manualReferralDescription')}</p>
                      <ul className="mt-4 space-y-2 text-xs font-bold text-foreground">
                        <li>1. Share unique link from profile.</li>
                        <li>2. New members join your spiritual group.</li>
                        <li>3. Earn commissions on Premium upgrades.</li>
                      </ul>
                  </CardContent>
              </Card>
            </section>
            
            <footer className="text-center pt-12 border-t">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Mantravaahini Official Manual</p>
              <p className="text-[10px] text-muted-foreground mt-1">© 2024 Hosadurga Spiritual Center</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
