'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, Bot, User, Trash2, ShieldAlert } from 'lucide-react';
import { chatWithGuide } from '@/ai/flows/spiritual-guide-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { UpgradeDialog } from '@/app/components/upgrade-dialog';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AiGuidePage() {
  const { t, language } = useLanguage();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ subscriptionTier?: 'free' | 'basic' | 'premium' }>(userDocRef);
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

  useEffect(() => {
    if (!isUserLoading && !isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
    }
  }, [isPremium, isUserLoading, isDeveloper]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isPremium && !isDeveloper) {
      setShowUpgradeDialog(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await chatWithGuide({
        message: userMessage,
        language: language as 'kn' | 'en',
        history: messages,
      });

      setMessages([...newMessages, { role: 'model', content: result.response }]);
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: error.message || 'The Divine Guide is currently unavailable. Please check your connection or API key.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center mt-20">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={(isOpen) => {
          if (!isOpen) router.push('/');
          setShowUpgradeDialog(isOpen);
        }}
        title={t('toastUpgradeRequiredTitle')}
        description={t('aiChatLimitReached')}
      />

      <header className="mb-8 text-center animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
          {t('aiGuideTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('aiGuideSubtitle')}
        </p>
      </header>

      {!isPremium && !isDeveloper && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-medium">
                {t('premiumPlanTitle')} feature
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="border-amber-400 text-amber-800 hover:bg-amber-100">
              <Link href="/upgrade">{t('headerUpgrade')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="flex flex-col h-[600px] shadow-xl overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-headline">{t('aiGuideTitle')}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4 text-muted-foreground">
                  <div className="bg-primary/5 p-6 rounded-full animate-pulse">
                    <Sparkles className="h-12 w-12 text-primary/40" />
                  </div>
                  <p className="max-w-xs">{t('aiChatWelcome')}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex w-full gap-2 animate-fade-in",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'model' && (
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none border"
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-2 animate-pulse">
                  <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-2 text-sm border">
                    {language === 'kn' ? 'ಯೋಚಿಸುತ್ತಿದೆ...' : 'Thinking...'}
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 bg-muted/30 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiChatPlaceholder')}
              disabled={isLoading}
              className="flex-1 bg-background"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>{language === 'kn' ? '* ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆಗಾಗಿ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ: 7022070287' : '* For personalized activation, contact the center: 7022070287'}</p>
      </div>
    </div>
  );
}