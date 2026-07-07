'use client';

import { use, useState, useRef } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { ArrowRight, Sparkles, Brain, Lightbulb, CheckCircle2, XCircle, Volume2, Search, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VisualKeypoint {
  label: string;
  description: string;
}

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  concept: string;
  activity: string;
  quiz_question: string;
  quiz_options: string[];
  correct_answer: string;
  image_hint?: string;
  audioUrl?: string;
  imageUrl?: string;
  visual_keypoints?: VisualKeypoint[];
}

export default function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const { t } = useLanguage();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const lessonRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'lessons', lessonId);
  }, [firestore, lessonId]);

  const { data: lesson, isLoading } = useDoc<Lesson>(lessonRef);

  const [step, setStep] = useState<'reading' | 'activity' | 'quiz' | 'finished'>('reading');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [selectedKeypoint, setSelectedKeypoint] = useState<VisualKeypoint | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNextStep = () => {
    if (step === 'reading') setStep('activity');
    else if (step === 'activity') setStep('quiz');
  };

  const handleFinish = () => {
    if (lesson) {
      const current = JSON.parse(localStorage.getItem('student_completed_lesson_ids') || '[]');
      if (!current.includes(lesson.id)) {
        current.push(lesson.id);
        localStorage.setItem('student_completed_lesson_ids', JSON.stringify(current));
        const xp = parseInt(localStorage.getItem('student_xp') || '0');
        localStorage.setItem('student_xp', (xp + 50).toString());
      }
      router.push(`/courses/${lesson.courseId}`);
    }
  };

  const checkQuiz = () => {
    if (!lesson || !selectedOption) return;
    const correct = selectedOption === lesson.correct_answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      toast({ title: t('correctAnswer'), className: "bg-green-500 text-white" });
    } else {
      toast({ variant: "destructive", title: t('wrongAnswer') });
    }
  };

  const progressMap = { reading: 25, activity: 50, quiz: 75, finished: 100 };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-32">
      <div className="mb-8">
        <Progress value={progressMap[step]} className="h-3" />
        <div className="flex justify-between text-[10px] uppercase font-bold mt-2 text-muted-foreground tracking-tighter">
          <span className={step === 'reading' ? 'text-primary' : ''}>Concept</span>
          <span className={step === 'activity' ? 'text-primary' : ''}>Activity</span>
          <span className={step === 'quiz' ? 'text-primary' : ''}>Quiz</span>
        </div>
      </div>

      <div className="space-y-8 animate-fade-in">
        {step === 'reading' && (
          <Card className="border-2 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-2xl font-headline text-primary">{lesson.title}</CardTitle>
              {lesson.audioUrl && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-10 w-10 border-primary text-primary"
                  onClick={() => audioRef.current?.play()}
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="relative space-y-4">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted border-2 border-primary/10">
                  {lesson.imageUrl ? (
                    <Image 
                      src={lesson.imageUrl} 
                      alt="lesson diagram" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                      <Sparkles className="h-12 w-12 text-primary/20 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Search className="h-3 w-3" />
                    Visual Guide
                  </div>
                </div>

                {lesson.visual_keypoints && lesson.visual_keypoints.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {lesson.visual_keypoints.map((kp, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-[10px] h-auto py-2 px-1 font-bold transition-all",
                          selectedKeypoint?.label === kp.label ? "bg-primary text-white border-primary" : "hover:border-primary/50"
                        )}
                        onClick={() => setSelectedKeypoint(kp)}
                      >
                        {kp.label}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedKeypoint && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 animate-fade-in flex gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-primary">{selectedKeypoint.label}</p>
                      <p className="text-xs leading-relaxed italic">{selectedKeypoint.description}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                <p className="text-lg leading-relaxed whitespace-pre-line font-medium">
                  {lesson.concept}
                </p>
              </div>
              <audio ref={audioRef} src={lesson.audioUrl || null} />
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextStep} size="lg" className="w-full font-bold h-14">
                Next: Action Time! <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'activity' && (
          <Card className="border-2 shadow-lg border-accent/20">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-2xl font-headline text-accent flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Workshop Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 bg-accent/5 rounded-2xl border-2 border-dashed border-accent/30 text-center space-y-4">
                <p className="text-xl font-bold leading-relaxed">
                  {lesson.activity}
                </p>
                <div className="bg-white p-4 rounded-full inline-block shadow-sm">
                  <Sparkles className="h-8 w-8 text-accent animate-pulse" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextStep} size="lg" className="w-full font-bold h-14 bg-accent hover:bg-accent/90">
                I've Done It! Go to Quiz <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'quiz' && (
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                Quick Knowledge Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg font-bold mb-4">{lesson.quiz_question}</p>
              <RadioGroup onValueChange={setSelectedOption} className="space-y-3">
                {lesson.quiz_options.map((opt, i) => (
                  <div key={i} className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all",
                    selectedOption === opt ? "border-primary bg-primary/5" : "border-muted hover:border-primary/30",
                    isAnswered && opt === lesson.correct_answer && "border-green-500 bg-green-50",
                    isAnswered && selectedOption === opt && opt !== lesson.correct_answer && "border-red-500 bg-red-50"
                  )}>
                    <RadioGroupItem value={opt} id={`opt-${i}`} disabled={isAnswered} />
                    <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-medium">{opt}</Label>
                    {isAnswered && opt === lesson.correct_answer && <CheckCircle2 className="text-green-500" />}
                    {isAnswered && selectedOption === opt && opt !== lesson.correct_answer && <XCircle className="text-red-500" />}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              {!isAnswered ? (
                <Button onClick={checkQuiz} disabled={!selectedOption} size="lg" className="w-full h-14 font-bold">
                  Verify Answer
                </Button>
              ) : (
                <Button onClick={() => setStep('finished')} size="lg" className="w-full h-14 font-bold bg-green-600 hover:bg-green-700">
                  Finish Lesson <CheckCircle2 className="ml-2" />
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {step === 'finished' && (
          <Card className="border-2 shadow-xl text-center py-12">
            <CardContent className="space-y-6">
              <div className="bg-green-500 text-white p-6 rounded-full inline-block shadow-2xl animate-bounce">
                <Sparkles className="h-16 w-16" />
              </div>
              <h2 className="text-4xl font-headline font-bold text-foreground">Amazing Job!</h2>
              <p className="text-xl text-muted-foreground">You've mastered this lesson and earned <span className="font-black text-primary">+50 KP</span>.</p>
              <div className="flex flex-col gap-4">
                <Button onClick={handleFinish} size="lg" className="h-16 text-xl font-bold">
                  Claim Reward & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
