'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useCollection, useFirestore, useStorage, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
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
import { Trash2, Plus, FileAudio, Video, FileText, ImageIcon, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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
  url: z.string().optional(),
  sizeBytes: z.coerce.number().min(0),
});

export default function AdminAssetsPage() {
  const { user, isUserLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [isUploading, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!userLoading && !isDeveloper && user?.uid !== 'LPBTRz3AMafKtZVgzJWm5Aisxc53') {
      router.push('/');
    }
  }, [user, userLoading, isDeveloper, router]);

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

    setSelectedFile(file);
    
    // Auto-populate fields
    form.setValue('fileName', file.name);
    form.setValue('mimeType', file.type);
    form.setValue('sizeBytes', file.size);
    
    // Attempt to guess type
    if (file.type.startsWith('audio/')) form.setValue('fileType', 'audio');
    else if (file.type.startsWith('video/')) form.setValue('fileType', 'video');
    else if (file.type.startsWith('image/')) form.setValue('fileType', 'image');
    else if (file.type === 'application/pdf') form.setValue('fileType', 'document');

    // Auto-generate ID if empty
    if (!form.getValues('id')) {
      form.setValue('id', file.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }

    toast({ title: "File Selected", description: `${file.name} is ready for upload.` });
  };

  const handleAddAsset = async (values: z.infer<typeof assetFormSchema>) => {
    if (!firestore || !storage) return;

    if (!selectedFile && !values.url) {
      toast({ variant: "destructive", title: "No File", description: "Please select a file to upload or provide a URL." });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      let finalUrl = values.url || '';

      if (selectedFile) {
        // 1. Upload to Firebase Storage
        const storageRef = ref(storage, `assets/${values.id}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              finalUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // 2. Save Metadata to Firestore
      const assetDocRef = doc(firestore, 'assets', values.id);
      const newAsset: Asset = {
        ...values,
        url: finalUrl,
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
      setSelectedFile(null);
      setIsAddAssetDialogOpen(false);
      toast({ title: "Asset Saved", description: "Asset has been uploaded and registered." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setIsAnalyzing(false);
    }
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
          <p className="text-muted-foreground">Upload spiritual assets to Firebase Storage and manage metadata.</p>
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
              Select a file to upload to Firebase Storage or provide an external URL.
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className={cn(
              "group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer",
              selectedFile ? "border-green-500 bg-green-50/50" : "hover:bg-muted/50 border-muted-foreground/20"
            )}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="w-full space-y-4 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-sm font-semibold">Uploading: {Math.round(uploadProgress)}%</p>
                <Progress value={uploadProgress} />
              </div>
            ) : selectedFile ? (
              <div className="text-center">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-bold truncate max-w-[300px]">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">Click to change file</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="mt-2 text-sm font-semibold text-center">
                  Click to select File (Audio, Video, PDF, Image)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Uploads directly to Firebase Storage
                </p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept="audio/*,video/*,image/*,application/pdf"
              disabled={isUploading}
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
                      <FormLabel>Asset ID (Slug)</FormLabel>
                      <FormControl>
                        <Input placeholder="mantra-track-1" {...field} />
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
                    <FormLabel>File Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Powerful Kali Mantra.mp3" {...field} />
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
                    <FormLabel>External URL (Optional if uploading file)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} />
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
                        <Input placeholder="audio/mpeg" {...field} readOnly />
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
                        <Input type="number" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isUploading || (!selectedFile && !form.watch('url'))}>
                  {isUploading ? "Uploading..." : "Save Asset"}
                </Button>
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
                <TableHead>Size</TableHead>
                <TableHead>URL</TableHead>
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
                  <TableCell className="text-xs">{(asset.sizeBytes / (1024 * 1024)).toFixed(2)} MB</TableCell>
                  <TableCell>
                    <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs truncate max-w-[150px] block">
                      View Link
                    </a>
                  </TableCell>
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
