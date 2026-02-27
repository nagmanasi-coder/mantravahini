'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Check, Users, Gift, TrendingUp, Sparkles, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ReferralPage() {
  const { t } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ 
    subscriptionTier?: 'free' | 'basic' | 'premium',
    referralCode?: string,
    referralCommissionRate?: number,
    totalReferrals?: number,
    totalEarnings?: number
  }>(userDocRef);

  const isPremium = userProfile?.subscriptionTier === 'premium';
  const isUserLoading = isAuthLoading || (user && isProfileLoading);

  const isDeveloper = useMemo(() => {
    if (!user) return false;
    const isActualDeveloper = user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
    if (typeof window !== 'undefined') {
      const devModeEnabled = localStorage.getItem('developerMode') === 'true';
      return isActualDeveloper && devModeEnabled;
    }
    return false;
  }, [user]);

  // Generate a referral code if missing for premium users or developers
  useEffect(() => {
    if ((isPremium || isDeveloper) && !userProfile?.referralCode && firestore && user) {
      const generatedCode = user.uid.substring(0, 6).toUpperCase();
      updateDocumentNonBlocking(doc(firestore, 'users', user.uid), {
        referralCode: generatedCode
      });
    }
  }, [isPremium, isDeveloper, userProfile?.referralCode, firestore, user]);

  useEffect(() => {
    if (!isUserLoading && !isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
    }
  }, [isPremium, isDeveloper, isUserLoading]);

  const referralLink = useMemo(() => {
    if (typeof window === 'undefined' || !userProfile?.referralCode) return '';
    return `${window.location.origin}?ref=${userProfile.referralCode}`;
  }, [userProfile?.referralCode]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Share this link with your friends to earn rewards!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralLink) return;
    try {
      await navigator.share({
        title: t('appTitle'),
        text: t('shareText'),
        url: referralLink,
      });
    } catch (err) {
      handleCopy();
    }
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={(isOpen) => {
          if (!isOpen) router.push('/');
          setShowUpgradeDialog(isOpen);
        }}
        title={t('toastUpgradeRequiredTitle')}
        description={t('referralTitle') + " is available for Premium members only."}
      />

      <header className="mb-12 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {t('referralTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('referralSubtitle')}
        </p>
      </header>

      <div className="space-y-8">
        {/* Referral Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <p className="text-sm font-bold text-muted-foreground uppercase">{t('totalReferrals')}</p>
              <p className="text-3xl font-black text-primary">{userProfile?.totalReferrals || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <p className="text-sm font-bold text-muted-foreground uppercase">{t('commissionEarned')}</p>
              <p className="text-3xl font-black text-primary">₹{userProfile?.totalEarnings || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <p className="text-sm font-bold text-muted-foreground uppercase">Current Rate</p>
              <p className="text-3xl font-black text-primary">{userProfile?.referralCommissionRate || 10}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Link Card */}
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              {t('yourReferralLink')}
            </CardTitle>
            <CardDescription>
              Share this link to grow the Mantravaahini community.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="bg-muted/50 font-mono text-xs sm:text-sm"
              />
              <Button onClick={handleCopy} variant={copied ? "secondary" : "default"} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleShare} className="w-full h-12 font-bold text-lg" variant="outline">
              <Share2 className="mr-2 h-5 w-5" />
              Share App Now
            </Button>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-headline">{t('howItWorks')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-bold shrink-0">1</div>
                <p className="text-sm font-medium">{t('referralStep1')}</p>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-bold shrink-0">2</div>
                <p className="text-sm font-medium">{t('referralStep2')}</p>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-bold shrink-0">3</div>
                <p className="text-sm font-medium">{t('referralStep3')}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 text-center justify-center p-4">
            <p className="text-xs text-muted-foreground italic">
              * Commission is credited after manual verification of upgrades.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backButton')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
