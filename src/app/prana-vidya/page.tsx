
"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Shield, Sparkles, Check, Crown, Flame, HeartPulse, AlertCircle, Video, Users, Home as HomeIcon, Upload, Loader2, MessageSquareQuote, CheckCircle2, ChevronRight, TrendingUp, Trophy } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase, useStorage, useCollection } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function PranaVidyaPage() {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ 
    isPranaPractitioner?: boolean, 
    displayName?: string, 
    practitionerLevel?: number,
    referralCode?: string 
  }>(userDocRef);

  const isPractitioner = !!userProfile?.isPranaPractitioner;
  const currentLevel = userProfile?.practitionerLevel || 1;

  // FETCH MY GROUP (Direct sub-practitioners)
  const myGroupQuery = useMemoFirebase(() => {
    if (!firestore || !userProfile?.referralCode) return null;
    return query(collection(firestore, 'users'), where('referredBy', '==', userProfile.referralCode));
  }, [firestore, userProfile?.referralCode]);

  const { data: myGroup, isLoading: groupLoading } = useCollection<{ 
    displayName: string, 
    isPranaPractitioner: boolean, 
    practitionerLevel: number 
  }>(myGroupQuery);

  const subPractitioners = useMemo(() => {
    return myGroup?.filter(m => m.isPranaPractitioner) || [];
  }, [myGroup]);

  // PROGRESSION LOGIC
  useEffect(() => {
    if (!isPractitioner || !user || !firestore || !subPractitioners) return;

    const checkLevelUp = async () => {
      let newLevel = currentLevel;

      // Level 1 -> 2: 10 sub-practitioners
      if (currentLevel === 1 && subPractitioners.length >= 10) {
        newLevel = 2;
      }

      // Level 2 -> 3: 10 sub-practitioners who are Level 2+
      if (currentLevel === 2) {
        const level2Subs = subPractitioners.filter(p => p.practitionerLevel >= 2);
        if (level2Subs.length >= 10) {
          newLevel = 3;
        }
      }

      if (newLevel > currentLevel) {
        const ref = doc(firestore, 'users', user.uid);
        await updateDoc(ref, { practitionerLevel: newLevel });
        toast({ 
          title: t('levelUpSuccess').replace('{level}', String(newLevel)),
          description: "Your divine mission is growing. Blessings!",
          className: "bg-green-600 text-white border-none shadow-2xl"
        });
      }
    };

    checkLevelUp();
  }, [subPractitioners, currentLevel, isPractitioner, user, firestore, t]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [testimonialContent, setTestimonialContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const whatsAppMessage = "Hello! I'm interested in Prana Vidya activation. Please help me.";
  const whatsAppUrl = `https://wa.me/917022070287?text=${encodeURIComponent(whatsAppMessage)}`;
  const pranaImage = PlaceHolderImages.find(img => img.id === 'hanuman-healing');

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please upload a video smaller than 50MB." });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmitTestimonial = async () => {
    if (!firestore || !storage || !user) return;
    if (!testimonialContent.trim()) {
      toast({ variant: "destructive", title: "Empty content", description: "Please write your experience." });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let videoUrl = '';
      if (selectedFile) {
        const fileRef = ref(storage, `testimonials/${user.uid}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(fileRef, selectedFile);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => reject(error),
            async () => {
              videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }
      // Status 'approved' automatically to skip legacy approval process
      await addDoc(collection(firestore, 'testimonials'), {
        userId: user.uid,
        userName: userProfile?.displayName || 'Anonymous Healer',
        content: testimonialContent,
        videoUrl,
        status: 'approved', 
        createdAt: new Date().toISOString(),
      });
      toast({ title: "Submission Live!", description: "Your result is now visible on the home page." });
      setTestimonialContent('');
      setSelectedFile(null);
      setIsUploadDialogOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isMounted) return null;

  const levels = [
    {
        id: 1,
        title: t('pranaLevel1Title'),
        description: t('pranaLevel1Desc'),
        fee: t('pranaLevel1Fee'),
        icon: <Zap className="h-6 w-6 text-primary" />,
        color: "border-primary/50",
    },
    {
        id: 2,
        title: t('pranaLevel2Title'),
        description: t('pranaLevel2Desc'),
        fee: t('pranaLevel2Fee'),
        icon: <HeartPulse className="h-6 w-6 text-green-500" />,
        color: "border-green-500/50",
    },
    {
        id: 3,
        title: t('pranaLevel3Title'),
        description: t('pranaLevel3Desc'),
        fee: t('pranaLevel3Fee'),
        icon: <AlertCircle className="h-6 w-6 text-red-500" />,
        color: "border-red-500/50",
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pb-32">
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('pranaVidyaTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
             {t('pranaVidyaSubtitle')}
            </p>
          </header>

          <div className="space-y-8">
            {/* LINEAGE */}
            <Card className="bg-primary/5 border-primary/20 shadow-md">
              <CardContent className="p-6 text-center space-y-4">
                 <div className="flex justify-center gap-4 mb-2">
                    <Crown className="h-8 w-8 text-amber-500" />
                    <Flame className="h-8 w-8 text-primary" />
                 </div>
                 <p className="font-headline text-xl font-bold text-foreground leading-relaxed">
                   {t('pranaLineage')}
                 </p>
                 <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    <span>Gorakhnath</span>
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span>Babaji</span>
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span>Hanuman</span>
                 </div>
              </CardContent>
            </Card>

            {/* PRACTITIONER EXCLUSIVE DASHBOARD */}
            {isPractitioner && (
              <div className="space-y-6 animate-fade-in-up">
                 {/* My Level Stats */}
                 <Card className="border-2 border-primary bg-primary/5 shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground">
                       <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-xl font-headline flex items-center gap-2">
                               <Trophy className="h-5 w-5" />
                               {t('practitionerLevelPrefix')} {currentLevel}
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/80 font-bold">
                               {currentLevel === 1 ? "Pranasparshi" : currentLevel === 2 ? "Prana Chikitsaka" : "Prana Acharya"}
                            </CardDescription>
                          </div>
                          <div className="bg-white/20 p-2 rounded-lg text-xs font-black uppercase">
                             {subPractitioners.length} {t('membersCount').replace('{count}', '')}
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                       <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold uppercase text-primary">
                             <span>{t('groupGrowthTitle')}</span>
                             <span>{currentLevel === 3 ? "MAX" : `${subPractitioners.length} / 10`}</span>
                          </div>
                          <Progress value={currentLevel === 3 ? 100 : (subPractitioners.length / 10) * 100} className="h-2" />
                          <p className="text-[10px] text-muted-foreground italic text-center mt-2">
                             {currentLevel === 1 ? t('needMoreMembers').replace('{count}', String(10 - subPractitioners.length)) : 
                              currentLevel === 2 ? t('subPractitionersLevel2Required') : 
                              "Highest Spiritual Rank Achieved."}
                          </p>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Group Members List */}
                 <Card className="border-2 border-primary/20">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-lg flex items-center gap-2 font-headline">
                          <Users className="h-5 w-5 text-primary" />
                          {t('myHealingGroup')}
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       {groupLoading ? <Skeleton className="h-20 w-full" /> : 
                        subPractitioners.length === 0 ? <p className="text-sm italic text-muted-foreground text-center py-4">{t('noMembersYet')}</p> : 
                        <div className="divide-y">
                           {subPractitioners.map((member, i) => (
                             <div key={i} className="py-3 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                      {member.displayName.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold">{member.displayName}</p>
                                      <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t('practitionerLevelPrefix')} {member.practitionerLevel}</p>
                                   </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                             </div>
                           ))}
                        </div>
                       }
                    </CardContent>
                 </Card>

                 {/* Guide & Testimonial Form */}
                 <Card className="border-accent border-2 bg-accent/5 shadow-inner">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-accent flex items-center gap-2 font-headline text-2xl">
                              <Sparkles className="h-6 w-6" />
                              {t('practitionerGuideTitle')}
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="space-y-3">
                              <div className="flex gap-3 items-start p-3 bg-white/50 rounded-lg border border-accent/20">
                                  <HomeIcon className="h-5 w-5 text-accent shrink-0 mt-1" />
                                  <p className="text-sm font-bold text-foreground leading-relaxed">{t('practitionerStep1')}</p>
                              </div>
                              <div className="flex gap-3 items-start p-3 bg-white/50 rounded-lg border border-accent/20">
                                  <Users className="h-5 w-5 text-accent shrink-0 mt-1" />
                                  <p className="text-sm font-bold text-foreground leading-relaxed">{t('practitionerStep2')}</p>
                              </div>
                              <div className="flex gap-3 items-start p-3 bg-white/50 rounded-lg border border-accent/20">
                                  <Video className="h-5 w-5 text-accent shrink-0 mt-1" />
                                  <p className="text-sm font-bold text-foreground leading-relaxed">{t('practitionerStep3')}</p>
                              </div>
                          </div>

                          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full bg-accent hover:bg-accent/90 h-12 font-bold mt-4">
                                <Upload className="mr-2 h-4 w-4" />
                                {t('submitTestimonial')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>{t('submitTestimonial')}</DialogTitle>
                                <DialogDescription>Share your healing result with the divine community. It will be live instantly.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <Textarea 
                                  placeholder={t('testimonialContentPlaceholder')}
                                  value={testimonialContent}
                                  onChange={(e) => setTestimonialContent(e.target.value)}
                                  className="min-h-[120px]"
                                />
                                <div 
                                  className={cn(
                                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                                    selectedFile ? "border-green-500 bg-green-50" : "border-muted-foreground/20 hover:bg-muted"
                                  )}
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  {isUploading ? (
                                    <div className="space-y-2">
                                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                      <p className="text-xs font-bold">Uploading {Math.round(uploadProgress)}%</p>
                                    </div>
                                  ) : selectedFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                                      <p className="text-sm font-bold truncate max-w-[200px]">{selectedFile.name}</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <Video className="h-8 w-8 mx-auto text-muted-foreground" />
                                      <p className="text-sm font-bold">{t('uploadVideo')}</p>
                                    </div>
                                  )}
                                  <input type="file" ref={fileInputRef} className="hidden" accept="video/mp4" onChange={handleFileChange} disabled={isUploading} />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSubmitTestimonial} disabled={isUploading || !testimonialContent.trim()} className="w-full h-12">
                                  {isUploading ? t('submitting') : t('submitTestimonial')}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                      </CardContent>
                  </Card>
              </div>
            )}

            {/* PUBLIC THERAPY INFO */}
            <Card className="overflow-hidden shadow-xl border-2 border-primary">
              <CardHeader className="bg-primary/5">
                <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
                   <Zap className="h-8 w-8" />
                   {t('hanumanPranaTherapyTitle')}
                </CardTitle>
                <CardDescription className="text-center font-bold">
                  {t('untimelyDeathTitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-xl border shadow-inner">
                  {pranaImage && <Image
                    src={pranaImage.imageUrl}
                    alt={pranaImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={pranaImage.imageHint}
                  />}
                </div>
                
                <div className="grid gap-4">
                    {levels.map((level) => (
                        <div key={level.id} className={cn("bg-muted/50 p-4 rounded-xl border-2 border-dashed space-y-2", level.color)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {level.icon}
                                    <h3 className="font-headline text-xl font-bold text-primary">{level.title}</h3>
                                </div>
                            </div>
                            <p className="font-bold text-muted-foreground text-sm">{level.description}</p>
                            <p className="text-sm font-black text-accent">{level.fee}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center text-muted-foreground text-sm space-y-3 pt-4">
                    <p className="font-medium text-foreground">{t('pranaInfo1')}</p>
                    <p>{t('pranaInfo2')}</p>
                </div>

                <div className="my-6 rounded-md border border-primary/20 bg-primary/5 p-6 text-center shadow-sm">
                   <p className="font-headline text-xl font-bold text-primary">{t('hanumanDoha')}</p>
                   <p className="mt-2 text-sm italic text-muted-foreground">
                     {t('hanumanDohaMeaning')}
                   </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-secondary/50 border-none shadow-none">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                {t('pranaTherapyFee')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-muted-foreground">{t('pranaTherapyFeeDetails')}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-primary">
                                <Sparkles className="h-4 w-4" />
                                {t('freePranaTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            <p className="flex items-start text-[10px] font-bold">
                                <Check className="mr-1 h-3 w-3 text-green-600 shrink-0" />
                                <span>{t('freePranaCondition1')}</span>
                            </p>
                            <p className="flex items-start text-[10px] font-bold">
                                <Check className="mr-1 h-3 w-3 text-green-600 shrink-0" />
                                <span>{t('freePranaCondition2')}</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-6">
                <div className="text-center">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">{t('contact')}:</p>
                  <p className="font-black text-2xl text-primary tracking-tighter">7022070287, {t('hosadurga')}</p>
                </div>
                <Button asChild size="lg" className="h-14 px-8 font-black text-lg">
                  <Link href={whatsAppUrl} target="_blank">
                    <WhatsAppIcon />
                    {t('contactOnWhatsApp')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="ghost" className="text-muted-foreground">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />{t('backButton')}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
