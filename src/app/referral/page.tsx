
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, updateDoc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Check, Users, Gift, TrendingUp, Sparkles, ArrowLeft, Share2, Crown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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
    totalEarnings?: number,
    referralRewardClaimed?: boolean
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

  // Fetch referrals to track "Invite 3" mission (Actual Installations)
  const referralsQuery = useMemoFirebase(() => {
    if (!firestore || !userProfile?.referralCode) return null;
    return query(collection(firestore, 'users'), where('referredBy', '==', userProfile.referralCode));
  }, [firestore, userProfile?.referralCode]);

  const { data: referrals } = useCollection(referralsQuery);
  const referralCount = referrals?.length || 0;

  // AUTO-UNLOCK REWARD LOGIC
  useEffect(() => {
    if (!isPremium && referralCount >= 3 && !userProfile?.referralRewardClaimed && firestore && user) {
        const ref = doc(firestore, 'users', user.uid);
        updateDoc(ref, {
            subscriptionTier: 'premium',
            premiumCycleStartDate: new Date().toISOString(),
            referralRewardClaimed: true
        });
        toast({ 
            title: "Karmic Reward Unlocked!", 
            description: "You've earned 1 month of FREE Premium for your referrals!",
            className: "bg-green-600 text-white"
        });
    }
  }, [referralCount, userProfile, firestore, user, isPremium, toast]);

  // Generate a referral code if missing for registered users
  useEffect(() => {
    if (user && !userProfile?.referralCode && firestore) {
      const generatedCode = user.uid.substring(0, 6).toUpperCase();
      updateDocumentNonBlocking(doc(firestore, 'users', user.uid), {
        referralCode: generatedCode
      });
    }
  }, [user, userProfile?.referralCode, firestore]);

  const referralLink = useMemo(() => {
    if (!userProfile?.referralCode) return '';
    const baseUrl = "https://mantravahini.vercel.app";
    return `${baseUrl}?ref=${userProfile.referralCode}`;
  }, [userProfile?.referralCode]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Copied", description: "Share this link with your friends to earn rewards!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralLink) return;
    try {
      await navigator.share({ title: t('appTitle'), text: t('shareText'), url: referralLink });
    } catch (err) {
      handleCopy();
    }
  };

  if (isUserLoading) return <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20"><p className="text-muted-foreground">{t('loading')}</p></div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <header className="mb-12 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {t('referralTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('referralSubtitle')}
        </p>
      </header>

      <div className="space-y-8">
        {/* Karmic Rewards Mission - Tracking Installations */}
        <Card className="border-2 border-amber-500 bg-amber-50 shadow-xl overflow-hidden animate-fade-in-up">
           <CardHeader className="bg-amber-500 text-white flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                   <Crown className="h-6 w-6" />
                   {t('karmicRewardsTitle')}
                </CardTitle>
                <CardDescription className="text-amber-100 font-bold">{t('karmicRewardsDesc')}</CardDescription>
              </div>
              {userProfile?.referralRewardClaimed && <CheckCircle2 className="h-10 w-10 text-white" />}
           </CardHeader>
           <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                 <div className="flex justify-between text-xs font-black uppercase text-amber-700">
                    <span>{t('karmicProgress').replace('{count}', String(referralCount))}</span>
                    <span>3 {t('home')}</span>
                 </div>
                 <Progress value={(referralCount / 3) * 100} className="h-2 bg-amber-200" />
                 <p className="text-center text-[10px] italic text-amber-800/60 mt-2 font-bold">
                    {userProfile?.referralRewardClaimed ? t('karmicRewardUnlocked') : t('inviteMore').replace('{count}', String(Math.max(0, 3 - referralCount)))}
                 </p>
              </div>
           </CardContent>
        </Card>

        {/* Installation Tracking Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <p className="text-sm font-bold text-muted-foreground uppercase">{t('totalReferrals')}</p>
              <p className="text-3xl font-black text-primary">{referralCount}</p>
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
              <p className="text-sm font-bold text-muted-foreground uppercase">Reward Plan</p>
              <p className="text-3xl font-black text-primary">1mo Free</p>
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
            <CardDescription>Share this link to track new installations and earn rewards.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="bg-muted/50 font-mono text-xs sm:text-sm" />
              <Button onClick={handleCopy} variant={copied ? "secondary" : "default"} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleShare} className="w-full h-12 font-bold text-lg" variant="outline">
              <Share2 className="mr-2 h-5 w-5" /> Share Link Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xl font-headline">{t('howItWorks')}</CardTitle></CardHeader>
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
            <p className="text-xs text-muted-foreground italic">* "Installation" is tracked when a new user registers through your link.</p>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />{t('backButton')}</Link>
        </Button>
      </div>
    </div>
  );
}
