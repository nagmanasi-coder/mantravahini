
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, ArrowRight, Award, Trophy, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  level?: string;
  xpPoints?: number;
}

export default function CoursesPage() {
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const { user } = useUser();

  const coursesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'courses'), where('published', '==', true), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: courses, isLoading } = useCollection<Course>(coursesQuery);

  // Mock stats - in a real app, calculate from user progress collection
  const [totalXp, setTotalXp] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const xp = parseInt(localStorage.getItem('student_xp') || '0');
      const count = parseInt(localStorage.getItem('student_completed_lessons') || '0');
      setTotalXp(xp);
      setCompletedCount(count);
    }
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary border-b-2 border-primary/20 pb-4 inline-block">
          {t('learningHubTitle')}
        </h1>
        <p className="text-muted-foreground mt-4">{t('learningHubSubtitle')}</p>
      </header>

      {/* Student Dashboard Mini-Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold text-muted-foreground uppercase">{t('xpPoints')}</span>
            <span className="text-2xl font-black text-primary">{totalXp}</span>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <CheckCircle2 className="h-6 w-6 text-accent" />
            <span className="text-xs font-bold text-muted-foreground uppercase">{t('completedLessons')}</span>
            <span className="text-2xl font-black text-accent">{completedCount}</span>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-secondary hidden sm:flex">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <Award className="h-6 w-6 text-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Badges</span>
            <span className="text-2xl font-black">
              {Math.floor(completedCount / 5)}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {isLoading && (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        )}

        {courses && courses.map((course) => (
          <Card key={course.id} className="hover:border-primary/50 transition-all group shadow-md overflow-hidden border-2">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-primary/10 p-6 flex items-center justify-center sm:w-32 border-b sm:border-b-0 sm:border-r border-primary/10">
                <BookOpen className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h2 className="text-2xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">
                    {course.title}
                  </h2>
                  <div className="flex gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '0%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">0% {t('completed')}</span>
                  </div>
                  <Button asChild>
                    <Link href={`/courses/${course.id}`}>
                      {t('startLearning')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {!isLoading && courses?.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold">{t('contentComingSoon')}</h3>
            <p className="text-muted-foreground">{t('videosComingSoon')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { CheckCircle2 } from 'lucide-react';
