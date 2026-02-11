
"use client";

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Check, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function UserManualPage() {
  const { t } = useLanguage();
  const manualContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const input = manualContentRef.current;
    if (!input) {
      console.error("Manual content not found");
      return;
    }

    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
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

  const freeFeatures = t('manualFreeTierFeatures').split('|');
  const basicFeatures = t('manualBasicTierFeatures').split('|');
  const premiumFeatures = t('manualPremiumTierFeatures').split('|');

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-headline text-2xl text-primary mt-8 mb-4 pt-4 border-t">{children}</h2>
  );
  
  const FirstSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-headline text-2xl text-primary mb-4">{children}</h2>
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
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              {t('downloadAsPdf')}
            </Button>
          </div>

          <div ref={manualContentRef} className="bg-background p-4 md:p-6">
            
            <FirstSectionTitle>{t('manualIntroTitle')}</FirstSectionTitle>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t('manualIntroContent')}</p>
              </CardContent>
            </Card>

            <SectionTitle>{t('manualFreeMantrasTitle')}</SectionTitle>
             <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>{t('manualKaliMantraTitle')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('manualKaliMantraDescription')}</p>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader><CardTitle>{t('manualChakshuMantraTitle')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('manualChakshuMantraDescription')}</p>
                    </CardContent>
                </Card>
            </div>

            <SectionTitle>{t('manualTherapiesTitle')}</SectionTitle>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>{t('hanumanTherapyTitle')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('hanumanTherapyDescription')}</p>
                        <p className="mt-2 text-sm text-foreground">{t('healingInfo1')}</p>
                        <p className="mt-2 text-sm text-foreground">{t('hanumanTherapyFeeDetails')}</p>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader><CardTitle>{t('hanumanPranaTherapyTitle')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('untimelyDeathContent')}</p>
                        <p className="mt-4 font-semibold text-primary">{t('hanumanPranaContact')}</p>
                    </CardContent>
                </Card>
            </div>

            <SectionTitle>{t('manualFeaturesTitle')}</SectionTitle>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('freePlanTitle')}</CardTitle>
                        <CardDescription>{t('freePlanDescription')}</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <ul className="space-y-2">
                            {freeFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-muted-foreground/50 mt-1 flex-shrink-0" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="border-secondary border-2">
                    <CardHeader>
                        <CardTitle>{t('manualBasicTierTitle')}</CardTitle>
                        <CardDescription>{t('basicPlanDescription')}</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <ul className="space-y-2">
                            {basicFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="border-primary border-2">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <Star className="h-6 w-6 text-yellow-500" />
                            <span>{t('manualPremiumTierTitle')}</span>
                            <Star className="h-6 w-6 text-yellow-500" />
                         </CardTitle>
                    </CardHeader>
                     <CardContent>
                        <ul className="space-y-2">
                            {premiumFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <span className="font-medium text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <SectionTitle>{t('manualSpecialProductsTitle')}</SectionTitle>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>{t('akshayaCashBoxName')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('akshayaCashBoxDescription')}</p>
                        <p className="mt-2 text-sm text-foreground">{t('akshayaCashBoxInfo')}</p>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader><CardTitle>{t('medicatedOilsTitle')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('medicatedOilsDescription')}</p>
                        <Separator className="my-4" />
                        <ul className="space-y-4">
                            <li><strong className="font-semibold text-foreground">{t('hairOilName')}:</strong> <span className="text-muted-foreground">{t('hairOilDescription')}</span></li>
                            <li><strong className="font-semibold text-foreground">{t('painOilName')}:</strong> <span className="text-muted-foreground">{t('painOilDescription')}</span></li>
                            <li><strong className="font-semibold text-foreground">{t('skinOilName')}:</strong> <span className="text-muted-foreground">{t('skinOilDescription')}</span></li>
                            <li><strong className="font-semibold text-foreground">{t('sexualWellnessOilName')}:</strong> <span className="text-muted-foreground">{t('sexualWellnessOilDescription')}</span></li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
