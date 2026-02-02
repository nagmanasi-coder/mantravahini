
"use client";

import Link from "next/link";
import { useState } from "react";
import { StandaloneAudioPlayer } from "@/app/components/standalone-audio-player";
import { mantras } from "@/lib/mantras";
import { BannerAd } from "@/app/components/ads";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, Heart, Share2, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UpgradeDialog } from "@/app/components/upgrade-dialog";
import { useLanguage } from "@/context/language-context";
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function Home() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeDialogContent, setUpgradeDialogContent] = useState({ title: "", description: "" });
  const [showJoinGroupDialog, setShowJoinGroupDialog] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ referralCode?: string, subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
  const isPremiumUser = userProfile?.subscriptionTier === 'premium';

  const whatsAppMessage = "Hello! I'm interested in Mantravaahini. Please reply with the number of your query:\n\n1. Upgrade to Premium\n2. Other Services";
  const whatsAppUrl = `https://wa.me/917022070287?text=${encodeURIComponent(whatsAppMessage)}`;
  const whatsAppGroupUrl = `https://chat.whatsapp.com/YOUR_GROUP_INVITE_CODE`; // Placeholder for your group invite

  const painMantra = mantras.find(m => m.id === 1);
  const eyeMantra = mantras.find(m => m.id === 2);
  
  const handleUpgradeRequest = (title: string, description: string) => {
    setUpgradeDialogContent({ title, description });
    setShowUpgradeDialog(true);
  };

  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const referralCode = userProfile?.referralCode;
    const shareUrl = isPremiumUser && referralCode ? `${baseUrl}?ref=${referralCode}` : window.location.href;

    const shareData = {
      title: t('appTitle'),
      text: t('shareText'),
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not share the app at this moment.",
          });
        }
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

  const cardAnimation = "animate-fade-in-up";
  
  const handleUpgradeFromDialog = () => {
    setShowJoinGroupDialog(false);
    router.push('/upgrade');
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('appTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
             {t('appSubtitle')}
            </p>
          </header>

          <Card className={cn("mb-8 text-center bg-accent text-accent-foreground transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6" />
                {t('activatedMantra')}
                <Sparkles className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{t('explorePower')}</p>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animationDelay: "0.6s" }}>
                {painMantra && (
                  <div className={cn(cardAnimation)}>
                     <StandaloneAudioPlayer 
                        mantra={painMantra} 
                        onUpgradeRequest={handleUpgradeRequest}
                        imageId="kali-mantra-infographic"
                      />
                      <Card className="mt-4">
                          <CardContent className="p-4 space-y-2 text-center text-muted-foreground text-sm">
                            <p>{t('painReliefStep1')}</p>
                            <p>{t('painReliefStep2')}</p>
                            <p>{t('painReliefStep3')}</p>
                            <p>{t('painReliefStep4')}</p>
                            <p className="font-semibold text-foreground">{t('painReliefNote')}</p>
                          </CardContent>
                      </Card>
                  </div>
                )}
                {eyeMantra && (
                  <div className={cn(cardAnimation)}>
                    <StandaloneAudioPlayer 
                      mantra={eyeMantra} 
                      onUpgradeRequest={handleUpgradeRequest}
                      imageId="chakshu-mantra-infographic"
                    />
                      <Card className="mt-4">
                          <CardContent className="p-4 space-y-4 text-center text-sm">
                              <p className="text-muted-foreground">
                                {t('eyeProblemsInstruction')}
                              </p>
                              <p className="font-semibold text-primary">
                                {t('eyeProblemsNote')}
                              </p>
                          </CardContent>
                      </Card>
                  </div>
                )}
            </div>
            
            <div className={cn(cardAnimation)} style={{ animationDelay: "0.5s" }}>
              <div className={cn("mt-6 text-center", cardAnimation)} style={{ animationDelay: "0.55s" }}>
                <Button asChild size="lg" className="text-lg font-bold p-8 animate-pulse">
                  <Link href="/healing">
                    {t('mantraTherapyLink')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className={cn("mt-4", cardAnimation)} style={{ animationDelay: "0.7s" }}>
                <CardContent className="p-6 text-center space-y-4">
                  <p className="font-semibold text-foreground text-lg">
                    {t('serviceToHumanity')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          <Heart className="mr-2 h-4 w-4" />
                          {t('donateButton')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('donateTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                           {t('donateDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    {isPremiumUser ? (
                       <Button asChild variant="outline">
                         <Link href={whatsAppGroupUrl} target="_blank">
                           <Users className="mr-2 h-4 w-4" />
                           {t('joinGroupButton')}
                         </Link>
                       </Button>
                     ) : (
                       <AlertDialog open={showJoinGroupDialog} onOpenChange={setShowJoinGroupDialog}>
                         <AlertDialogTrigger asChild>
                           <Button variant="outline">
                             <Users className="mr-2 h-4 w-4" />
                             {t('joinGroupButton')}
                           </Button>
                         </AlertDialogTrigger>
                         <AlertDialogContent>
                           <AlertDialogHeader>
                             <AlertDialogTitle>{t('joinGroupTitle')}</AlertDialogTitle>
                             <AlertDialogDescription>
                               {t('joinGroupDescription')}
                             </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <Button onClick={handleUpgradeFromDialog}>{t('upgradeButton')}</Button>
                              <AlertDialogAction>{t('closeButton')}</AlertDialogAction>
                           </AlertDialogFooter>
                         </AlertDialogContent>
                       </AlertDialog>
                     )}

                    <Button onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      {t('shareAppButton')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          </div>


          <Card className={cn("mt-8 text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl", cardAnimation)} style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">
                {t('finalMessage')}
              </p>
            </CardContent>
          </Card>

          <Card className={cn("mt-8", cardAnimation)} style={{ animationDelay: "0.7s" }}>
            <CardFooter className="flex flex-col items-center justify-center gap-4 p-4">
               <div className="text-center">
                <p>{t('contactForServices')}</p>
                <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
              </div>
              <Button asChild>
                <Link href={whatsAppUrl} target="_blank">
                  <WhatsAppIcon />
                  {t('contactOnWhatsApp')}
                </Link>
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>
      
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
        title={upgradeDialogContent.title}
        description={upgradeDialogContent.description}
      />
      <BannerAd />
    </div>
  );
}
