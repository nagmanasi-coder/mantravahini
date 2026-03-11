
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Sparkles, BookOpen, Trash2, ArrowLeft } from 'lucide-react';
import { generateWorkshopLessons } from '@/ai/flows/workshop-generator-flow';
import { cn } from '@/lib/utils';

export default function AdminWorkshopBuilderPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  const isDeveloper = useMemo(() => {
    if (!user) return false;
    return user.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !isDeveloper) {
      router.push('/');
    }
  }, [user, isUserLoading, isDeveloper, router]);

  const handleGenerate = async () => {
    if (!content.trim() || !courseTitle.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a course title and textbook content." });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Call AI to generate structured content
      const generated = await generateWorkshopLessons({
        content,
        title: courseTitle,
        language: 'kn' // Defaulting to include Kannada
      });

      if (!firestore) return;

      // 2. Save Course
      const courseId = `course-${Date.now()}`;
      const courseRef = doc(firestore, 'courses', courseId);
      await setDoc(courseRef, {
        id: courseId,
        title: courseTitle,
        description: courseDescription,
        published: true,
        createdAt: serverTimestamp(),
      });

      // 3. Save Modules and Lessons
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
          const lessonRef = doc(firestore, 'lessons', lessonId);
          await setDoc(lessonRef, {
            ...les,
            id: lessonId,
            moduleId,
            courseId
          });
        }
      }

      toast({ title: "Workshop Published!", description: "AI has successfully converted your content into a course." });
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
        <p className="text-muted-foreground mt-2">Convert textbooks into interactive modules automatically.</p>
      </header>

      <div className="grid gap-8">
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle>Course Metadata</CardTitle>
            <CardDescription>Enter the basics for your new workshop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input 
                placeholder="e.g. Science Class 10: Human Eye" 
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Brief summary of the course..." 
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-2 border-primary/10 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Source Material
            </CardTitle>
            <CardDescription>Paste the textbook text or PDF content here. AI will detect chapters and create lessons.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Paste content here..." 
              className="min-h-[300px] bg-background" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 flex justify-between items-center">
            <div className="text-xs text-muted-foreground max-w-[60%]">
              <p className="font-bold uppercase tracking-wider mb-1">AI Logic:</p>
              <p>Gemini will divide this into logical modules, generate bilingual explanations, and create interactive quizzes for each lesson.</p>
            </div>
            <Button size="lg" onClick={handleGenerate} disabled={isLoading || !content.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build Modules
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

import Link from 'next/link';
