
'use client';

import { use, useMemo, useState, useEffect } from 'react';
import { useCollection, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, CheckCircle2, Lock, Download, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';

interface Module {
  id: string;
  title: string;
  order: number;
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
}

export default function CourseModulesPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { t, language } = useLanguage();
  const firestore = useFirestore();

  const courseRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'courses', courseId);
  }, [firestore, courseId]);

  const { data: course } = useDoc<{ title: string, description: string }>(courseRef);

  const modulesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'modules'), where('courseId', '==', courseId), orderBy('order', 'asc'));
  }, [firestore, courseId]);

  const lessonsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'lessons'), where('courseId', '==', courseId));
  }, [firestore, courseId]);

  const { data: modules, isLoading: modulesLoading } = useCollection<Module>(modulesQuery);
  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);

  const [completedLessons, setCompletedCount] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('student_completed_lesson_ids') || '[]');
      setCompletedCount(completed);
    }
  }, []);

  const progress = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    const completed = lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / lessons.length) * 100);
  }, [lessons, completedLessons]);

  const generateCertificate = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Border
    doc.setDrawColor(249, 115, 22); // primary color hex roughly
    doc.setLineWidth(5);
    doc.rect(10, 10, width - 20, height - 20);

    // Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(249, 115, 22);
    doc.text('CERTIFICATE', width / 2, 50, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('OF COMPLETION', width / 2, 65, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('This is to certify that', width / 2, 90, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Student Name', width / 2, 110, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text(`has successfully completed the workshop:`, width / 2, 130, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(course?.title || 'Workshop Name', width / 2, 145, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, width / 2, 170, { align: 'center' });

    doc.save(`Certificate-${course?.title || 'Course'}.pdf`);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <header className="mb-8 flex flex-col items-center text-center">
        <Button asChild variant="ghost" size="sm" className="self-start mb-4">
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backButton')}
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">{course?.title}</h1>
        <p className="text-muted-foreground mt-2">{course?.description}</p>
        
        {progress === 100 && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex flex-col items-center gap-3 animate-bounce">
            <Award className="h-10 w-10 text-green-600" />
            <p className="font-bold text-green-800">{t('courseCompleted')}</p>
            <Button onClick={generateCertificate} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-100">
              <Download className="mr-2 h-4 w-4" /> {t('downloadCertificate')}
            </Button>
          </div>
        )}
      </header>

      <div className="space-y-8">
        {modulesLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {modules && modules.map((mod) => (
          <Card key={mod.id} className="overflow-hidden border-2">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-xl font-headline">Module {mod.order}: {mod.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {lessons && lessons.filter(l => l.moduleId === mod.id).map((lesson) => {
                  const isDone = completedLessons.includes(lesson.id);
                  return (
                    <Link 
                      key={lesson.id} 
                      href={`/courses/lesson/${lesson.id}`}
                      className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center border-2",
                          isDone ? "bg-green-500 border-green-500 text-white" : "border-muted group-hover:border-primary group-hover:text-primary"
                        )}>
                          {isDone ? <ShieldCheck size={20} /> : <Play size={16} fill="currentColor" />}
                        </div>
                        <span className={cn("font-medium", isDone && "text-muted-foreground line-through")}>
                          {lesson.title}
                        </span>
                      </div>
                      {isDone && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
