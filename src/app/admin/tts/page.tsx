
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic2, Save, Play, Trash2, ArrowLeft, Volume2, CheckCircle2, Download, User, UserCircle } from 'lucide-react';
import { generateSpiritualAudio } from '@/ai/flows/tts-generator-flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function AdminTTSPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<'kn' | 'en'>('kn');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const isDeveloper = useMemo(() => {
    return user?.uid === "LPBTRz3AMafKtZVgzJWm5Aisxc53";
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !isDeveloper) {
      router.push('/');
    }
  }, [user, isUserLoading, isDeveloper, router]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({ variant: "destructive", title: "Missing Text", description: "Please enter some text to convert." });
      return;
    }

    setIsGenerating(true);
    setPreviewUri(null);

    try {
      const result = await generateSpiritualAudio({ text, language, gender });
      setPreviewUri(result.audioDataUri);
      toast({ title: "Preview Ready", description: "Voice generated successfully. Please review before saving." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Generation Failed", description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!previewUri) return;
    const link = document.createElement('a');
    link.href = previewUri;
    link.download = `${title || 'generated-voice'}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    if (!previewUri || !title.trim() || !firestore || !storage) return;

    setIsSaving(true);
    const assetId = `tts-${Date.now()}`;

    try {
      const fileRef = ref(storage, `assets/${assetId}.wav`);
      await uploadString(fileRef, previewUri, 'data_url');
      const url = await getDownloadURL(fileRef);

      const assetDocRef = doc(firestore, 'assets', assetId);
      const newAsset = {
        id: assetId,
        title: `${title} (AI Voice)`,
        fileName: `${assetId}.wav`,
        fileType: 'audio',
        mimeType: 'audio/wav',
        url: url,
        sizeBytes: (previewUri.length * 0.75),
        uploadDate: new Date().toISOString(),
      };

      await setDoc(assetDocRef, newAsset);

      toast({ title: "Asset Saved", description: "Audio has been stored in your registry." });
      
      setText('');
      setTitle('');
      setPreviewUri(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading || !isDeveloper) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-32">
      <header className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/assets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Assets</Link>
        </Button>
        <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
          <Mic2 className="h-10 w-10" />
          AI Voice Studio
        </h1>
        <p className="text-muted-foreground mt-2">Generate sacred speech with Male/Female Indian accents.</p>
      </header>

      <div className="grid gap-8">
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select language, gender, and enter your text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Internal Asset Title</Label>
              <Input 
                placeholder="e.g. Intro for Kali Mantra" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kn">Kannada</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Voice Gender</Label>
                <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" /> Male
                      </div>
                    </SelectItem>
                    <SelectItem value="female">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-3 w-3" /> Female
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text to Convert</Label>
              <Textarea 
                placeholder="Type the sacred words here..." 
                className="min-h-[150px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/30 p-6">
            <Button 
              size="lg" 
              onClick={handleGenerate} 
              disabled={isGenerating || !text.trim()}
              className="px-8 w-full sm:w-auto"
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Volume2 className="mr-2 h-4 w-4" /> Preview Voice</>
              )}
            </Button>
          </CardFooter>
        </Card>

        {previewUri && (
          <Card className="border-2 border-green-500 bg-green-50 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Review & Approve
                </CardTitle>
                <CardDescription className="text-green-700">Download locally or save to the Asset Registry.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-green-600 text-green-600 hover:bg-green-100">
                <Download className="mr-2 h-4 w-4" /> Download WAV
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                <audio ref={audioRef} src={previewUri} controls className="w-full h-12" />
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-white/80 rounded-lg text-sm italic border border-green-100">
                  "{text}"
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !title.trim()} 
                className="flex-1 bg-green-600 hover:bg-green-700 h-12 font-bold"
              >
                {isSaving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Storing...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Approve & Save Asset</>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPreviewUri(null)}
                disabled={isSaving}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
