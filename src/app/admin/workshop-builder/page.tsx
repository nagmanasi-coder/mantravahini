
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Sparkles, BookOpen, Trash2, ArrowLeft, GraduationCap, FileUp, FileText, CheckCircle2, Coins, Volume2 } from 'lucide-react';
import { generateWorkshopLessons } from '@/ai/flows/workshop-generator-flow';
import { generateLessonAudio } from '@/ai/flows/tts-flow';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/language-context';

// Configure PDF.js worker
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function AdminWorkshopBuilderPage() {
  const { user, isUserLoading } = useUser();
  const { t, language: appLang } = useLanguage();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [content, setContent] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [language, setLanguage] = useState('kn');
  const [price, setPrice] = useState('0');
  const [level, setLevel] = useState('Beginner');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDeveloper = useMemo(() => {
    if (!user) return false;
    return user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !isDeveloper) {
      router.push('/');
    }
  }, [user, isUserLoading, isDeveloper, router]);

  // Cost Estimation Logic
  const estimation = useMemo(() => {
    if (!content.trim()) return { tokens: 0, costUsd: 0, costInr: 0 };
    
    const charCount = content.length;
    const estimatedTokens = Math.ceil(charCount / 4);
    
    // Pricing for Gemini 1.5 Flash (approx $0.15 per 1M input tokens)
    const costUsd = (estimatedTokens / 1000000) * 0.15;
    const costInr = costUsd * 83;

    return {
      tokens: estimatedTokens,
      costUsd: costUsd.toFixed(4),
      costInr: costInr.toFixed(2),
    };
  }, [content]);

  const extractTextFromPdf = async (file: File) => {
    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      setContent(fullText);
      
      if (!courseTitle) {
        const cleanName = file.name.replace('.pdf', '').replace(/[-_]/g, ' ');
        setCourseTitle(cleanName);
      }
      
      toast({ title: "PDF Extracted", description: `Successfully extracted ${pdf.numPages} pages of text.` });
    } catch (error: any) {
      console.error("PDF extraction error:", error);
      toast({ variant: "destructive", title: "Extraction Failed", description: "Could not read the PDF content. Please paste text manually." });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPdf(file);
    } else if (file) {
      toast({ variant: "destructive", title: "Invalid File", description: "Please upload a valid PDF document." });
    }
  };

  const handleGenerate = async () => {
    if (!content.trim() || !courseTitle.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a course title and textbook content." });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Generate Course Structure
      const generated = await generateWorkshopLessons({
        content,
        title: courseTitle,
        language: language
      });

      if (!firestore || !storage) return;

      const courseId = `course-${Date.now()}`;
      const courseRef = doc(firestore, 'courses', courseId);
      await setDoc(courseRef, {
        id: courseId,
        title: courseTitle,
        description: courseDescription,
        language,
        price: parseFloat(price) || 0,
        level,
        published: true,
        createdAt: serverTimestamp(),
      });

      for (const mod of generated.modules) {
        const moduleId = `mod-${mod.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
        const moduleRef = doc(firestore, 'modules', moduleId);
        await setDoc(moduleRef, {
          id: moduleId,
          courseId,
          title: mod.title,
          order: mod.order
        });

        for (const les of mod.lessons) {
          const lessonId = `les-${les.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
          
          // 2. Generate TTS Audio for Lesson
          let audioUrl = '';
          try {
            const ttsResult = await generateLessonAudio({
              text: `${les.title}. ${les.concept}. Activity: ${les.activity}`,
              language: language === 'en' ? 'en' : 'kn'
            });
            
            const audioRef = ref(storage, `course-audio/${lessonId}.wav`);
            await uploadString(audioRef, ttsResult.audioDataUri, 'data_url');
            audioUrl = await getDownloadURL(audioRef);
          } catch (ttsErr) {
            console.warn("TTS Generation failed for lesson:", lessonId, ttsErr);
          }

          const lessonRef = doc(firestore, 'lessons', lessonId);
          await setDoc(lessonRef, {
            ...les,
            id: lessonId,
            moduleId,
            courseId,
            audioUrl
          });
        }
      }

      toast({ title: "Workshop Published!", description: "AI has successfully converted your PDF into a course with audio." });
      setContent('');
      setCourseTitle('');
      setCourseDescription('');
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Generation Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || !isDeveloper) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
      <header className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin</Link>
        </Button>
        <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
          <GraduationCap className="h-10 w-10" />
          AI Workshop Builder
        </h1>
        <p className="text-muted-foreground mt-2">Convert textbooks into interactive modules with AI audio.</p>
      </header>

      <div className="grid gap-8">
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle>Course Metadata</CardTitle>
            <CardDescription>Enter the details for your new workshop.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Course Title</Label>
              <Input 
                placeholder="e.g. Science Class 10: Human Eye" 
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kn">Kannada (Primary)</SelectItem>
                  <SelectItem value="en">English (Primary)</SelectItem>
                  <SelectItem value="bilingual">Bilingual (Mixed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input 
                type="number" 
                placeholder="0 for free" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Brief summary of the course..." 
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className={cn(
              "md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed p-8 text-center cursor-pointer transition-colors hover:bg-primary/5",
              isExtracting ? "bg-primary/5 border-primary" : "border-muted-foreground/20"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            {isExtracting ? (
              <div className="space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-sm font-bold">Extracting PDF...</p>
              </div>
            ) : content ? (
              <div className="space-y-2">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                <p className="text-sm font-bold">Content Ready</p>
                <p className="text-[10px] text-muted-foreground">Click to replace PDF</p>
              </div>
            ) : (
              <>
                <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-bold">Upload Textbook PDF</p>
                <p className="text-xs text-muted-foreground mt-2">AI will automatically extract text.</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange} 
            />
          </Card>

          <Card className="md:col-span-2 shadow-xl border-2 border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Source Content
              </CardTitle>
              <CardDescription>Extracted text for AI processing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste content here or upload a PDF..." 
                className="min-h-[200px] bg-background" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {content && (
                <div className="bg-white/50 p-3 rounded-lg border flex flex-wrap gap-4 items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{t('estimatedTokens')}</span>
                      <span className="text-sm font-mono">{estimation.tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col border-l pl-4">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{t('estimatedCost')}</span>
                      <div className="flex items-center gap-1 text-primary">
                        <Coins className="h-3 w-3" />
                        <span className="text-sm font-bold">${estimation.costUsd} (~₹{estimation.costInr})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                    <Volume2 className="h-3 w-3" />
                    INCLUDES AI AUDIO
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 flex justify-between items-center">
              <div className="text-[10px] text-muted-foreground">
                <p className="font-bold uppercase mb-1">AI Strategy:</p>
                <p>Interactive lessons + Quizzes + TTS Audio.</p>
              </div>
              <Button size="sm" onClick={handleGenerate} disabled={isLoading || !content.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate & Publish
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
