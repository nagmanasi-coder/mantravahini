'use client';

import { useEffect, useState, useRef } from 'react';
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
import { Trash2, Plus, FileAudio, Video, FileText, ImageIcon, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  url: z.string().min(1, 'URL or File Data is required.'),
  sizeBytes: z.coerce.number().min(0),
});

export default function AdminAssetsPage() {
  const { user, isUserLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Direct Firestore uploads are limited to 1MB. Please use a smaller file or a public URL.",
      });
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      
      // Auto-populate fields
      form.setValue('fileName', file.name);
      form.setValue('mimeType', file.type);
      form.setValue('sizeBytes', file.size);
      form.setValue('url', base64);
      
      // Attempt to guess type
      if (file.type.startsWith('audio/')) form.setValue('fileType', 'audio');
      else if (file.type.startsWith('video/')) form.setValue('fileType', 'video');
      else if (file.type.startsWith('image/')) form.setValue('fileType', 'image');
      else if (file.type === 'application/pdf') form.setValue('fileType', 'document');

      // Auto-generate ID if empty
      if (!form.getValues('id')) {
        form.setValue('id', file.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      }

      setIsProcessingFile(false);
      toast({ title: "File Ready", description: "Metadata populated. You can now save the asset." });
    };
    reader.readAsDataURL(file);
  };

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
    toast({ title: "Asset Saved", description: "Asset has been stored in Firestore." });
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
          <p className="text-muted-foreground">Manage digital files stored directly in Firestore.</p>
        </div>
        <Button onClick={() => setIsAddAssetDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      <Dialog open={isAddAssetDialogOpen} onOpenChange={setIsAddAssetDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Digital Asset</DialogTitle>
            <DialogDescription>
              Upload a file or provide a URL to store in Firestore.
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className="group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isProcessingFile ? (
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <p className="mt-2 text-sm font-semibold">
              {isProcessingFile ? "Reading file..." : "Click here to upload file directly"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max 1MB for direct Firestore storage
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept="audio/*,video/*,image/*,application/pdf"
            />
          </div>

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
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                    <FormLabel>URL or Base64 Data</FormLabel>
                    <FormControl>
                      <Input placeholder="https://... or auto-filled" {...field} />
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

              {form.watch('sizeBytes') > 1024 * 1024 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This file exceeds the 1MB Firestore limit. It may fail to save.
                  </AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isProcessingFile}>Save Asset</Button>
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
                      <span className="font-medium truncate max-w-[200px]">{asset.fileName}</span>
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
