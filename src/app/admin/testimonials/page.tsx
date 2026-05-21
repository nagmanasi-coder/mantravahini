
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Trash2, Video, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  content: string;
  videoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
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

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!firestore) return;
    try {
      await updateDoc(doc(firestore, 'testimonials', id), { status });
      toast({ title: `Testimonial ${status}` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Action Failed", description: e.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'testimonials', id));
      toast({ title: "Deleted" });
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
          <p className="text-muted-foreground">Approve practitioner results for home page display.</p>
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
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Badge variant={test.status === 'approved' ? 'default' : test.status === 'pending' ? 'outline' : 'destructive'}>
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleUpdateStatus(test.id, 'approved')} className="text-green-600">
                        <CheckCircle2 size={18} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleUpdateStatus(test.id, 'rejected')} className="text-amber-600">
                        <XCircle size={18} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(test.id)} className="text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </div>
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
