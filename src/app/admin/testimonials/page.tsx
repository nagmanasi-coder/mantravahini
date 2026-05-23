
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Video, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  content: string;
  videoUrl?: string;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
  
  const testimonialsCollection = useMemoFirebase(() => {
    if (!firestore || !isDeveloper) return null;
    return query(collection(firestore, 'testimonials'), orderBy('createdAt', 'desc'));
  }, [firestore, isDeveloper]);

  const { data: testimonials, isLoading: testimonialsLoading } = useCollection<Testimonial>(testimonialsCollection);

  useEffect(() => {
    if (!isUserLoading && !isDeveloper) router.push('/');
  }, [user, isUserLoading, isDeveloper, router]);

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      await deleteDoc(doc(firestore, 'testimonials', id));
      toast({ title: "Deleted Successfully" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: e.message });
    }
  };

  if (isUserLoading || !isDeveloper) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <Button asChild variant="ghost" className="mb-2"><Link href="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
          <h1 className="text-3xl font-headline font-bold text-primary">{t('manageTestimonials')}</h1>
          <p className="text-muted-foreground">Manage practitioner results. Submissions are live by default.</p>
        </div>
      </header>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practitioner</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonialsLoading ? (
                 <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
              ) : testimonials?.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-bold">{test.userName}</TableCell>
                  <TableCell className="max-w-md truncate">{test.content}</TableCell>
                  <TableCell>
                    {test.videoUrl ? (
                      <a href={test.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline"><Video className="h-4 w-4 mr-2" /> View</Button>
                      </a>
                    ) : 'None'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(test.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!testimonialsLoading && testimonials?.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No submissions found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
