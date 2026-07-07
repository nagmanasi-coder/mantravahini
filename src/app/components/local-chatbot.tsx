"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import { LOCAL_KNOWLEDGE, DEFAULT_RESPONSE } from "@/lib/local-knowledge-base";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

export function LocalChatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: language === 'kn' ? "ನಮಸ್ತೆ! ಮಂತ್ರವಾಹಿನಿ ಸಹಾಯಕನಿಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" : "Namaste! Welcome to Mantravaahini Assistant. How can I help you today?"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    
    const query = input.toLowerCase();
    setInput("");

    // Simulate "thinking" delay
    setTimeout(() => {
      const match = LOCAL_KNOWLEDGE.find(entry => 
        entry.keywords.some(keyword => query.includes(keyword))
      );

      const botText = match 
        ? (language === 'kn' ? match.kn : entryToText(match, language))
        : (language === 'kn' ? DEFAULT_RESPONSE.kn : DEFAULT_RESPONSE.en);

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", text: botText };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const entryToText = (entry: any, lang: string) => {
    return lang === 'kn' ? entry.kn : entry.en;
  }

  return (
    <div className="fixed bottom-32 right-4 z-[4500] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <Card className="mb-4 w-[90vw] max-w-[350px] shadow-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto overflow-hidden">
          <CardHeader className="bg-primary p-4 text-white flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                 <ShieldCheck size={18} />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">{language === 'kn' ? 'ದೈವಿಕ ಸಹಾಯಕ' : 'Divine Assistant'}</CardTitle>
                <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Local Mode (No Cloud)</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] p-4">
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none border"
                    )}>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t bg-muted/30">
            <div className="flex w-full gap-2">
              <Input 
                placeholder={language === 'kn' ? "ಪ್ರಶ್ನೆ ಕೇಳಿ..." : "Ask a question..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="h-10 text-sm bg-background"
              />
              <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleSend}>
                <Send size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Button 
        size="lg" 
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-500 pointer-events-auto",
          isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90 hover:scale-110"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="animate-pulse" />}
      </Button>
    </div>
  );
}
