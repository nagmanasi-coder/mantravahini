'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, FileAudio, Video, FileText, ImageIcon } from 'lucide-react';

interface Asset {
  id: string;
  fileName: string;
  fileType: 'audio' | 'video' | 'document' | 'image';
  mimeType: string;
  url: string;
  sizeBytes: number;
  uploadDate: string;
}

const assetFormSchema = z.object({
  id: z.string().min(1, 'ID is required.'),
  fileName: z.string().min(1, 'File Name is required.'),
  fileType: z.enum(['audio', 'video', 'document', 'image']),
  mimeType: z.string().min(1, 'MIME Type is required.'),
  url: z.string().url('Please enter a valid URL.'),
  sizeBytes: z.coerce.number().min(0),
});

export default function AdminAssetsPage() {
  const { user, isUserLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!userLoading) {
      const isActualDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
      setIsDeveloper(isActualDeveloper);
      if (!user?.uid || !isActualDeveloper) {
        router.push('/');
      }
    }
  }, [user, userLoading, router]);

  const assetsCollection = useMemoFirebase(() => {
    if (!firestore || !isDeveloper) return null;
    return collection(firestore, 'assets');
  }, [firestore, isDeveloper]);

  const { data: assets, isLoading: assetsLoading } = useCollection<Asset>(assetsCollection);

  const form = useForm<z.infer<typeof assetFormSchema>>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      id: '',
      fileName: '',
      fileType: 'audio',
      mimeType: '',
      url: '',
      sizeBytes: 0,
    },
  });

  const handleAddAsset = (values: z.infer<typeof assetFormSchema>) => {
    if (!firestore) return;
    const assetDocRef = doc(firestore, 'assets', values.id);
    const newAsset: Asset = {
      ...values,
      uploadDate: new Date().toISOString(),
    };

    setDoc(assetDocRef, newAsset)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: assetDocRef.path,
          operation: 'create',
          requestResourceData: newAsset,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    form.reset();
    setIsAddAssetDialogOpen(false);
    toast({ title: "Asset Added", description: "Asset metadata has been saved successfully." });
  };

  const handleDeleteAsset = (assetId: string) => {
    if (!firestore) return;
    const assetDocRef = doc(firestore, 'assets', assetId);
    deleteDoc(assetDocRef)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: assetDocRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    toast({ title: "Asset Deleted", description: "Asset metadata removed." });
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'audio': return <FileAudio className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  if (userLoading || !isDeveloper) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Asset Management</h1>
          <p className="text-muted-foreground">Manage metadata for audios, videos, PDFs, and images.</p>
        </div>
        <Button onClick={() => setIsAddAssetDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      <Dialog open={isAddAssetDialogOpen} onOpenChange={setIsAddAssetDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Digital Asset</DialogTitle>
            <DialogDescription>
              Register a new asset URL and metadata in Firestore.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddAsset)} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset ID</FormLabel>
                      <FormControl>
                        <Input placeholder="unique-id" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document (PDF)</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="fileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Name</FormLabel>
                    <FormControl>
                      <Input placeholder="mantra-track.mp3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://storage.googleapis.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mimeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MIME Type</FormLabel>
                      <FormControl>
                        <Input placeholder="audio/mpeg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizeBytes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (Bytes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save Asset</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>MIME</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetsLoading && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {assets && assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{asset.fileName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{asset.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.fileType)}
                      <span className="capitalize">{asset.fileType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{asset.mimeType}</TableCell>
                  <TableCell className="text-xs">{(asset.sizeBytes / (1024 * 1024)).toFixed(2)} MB</TableCell>
                  <TableCell className="text-xs">{new Date(asset.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!assetsLoading && assets?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No assets registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
