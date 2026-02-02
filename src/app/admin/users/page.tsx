'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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


interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  isPremium?: boolean;
  referredBy?: string;
  referralCommissionRate?: number;
}

const addUserFormSchema = z.object({
  uid: z.string().min(1, 'UID is required.'),
  displayName: z.string().min(1, 'Display Name is required.'),
  email: z.string().email('Please enter a valid email.'),
});

export default function AdminUsersPage() {
  const { user, isUserLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!userLoading) {
      const isActualDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
      setIsDeveloper(isActualDeveloper);
      if (!isActualDeveloper) {
        router.push('/');
      }
    }
  }, [user, userLoading, router]);

  const usersCollection = useMemoFirebase(() => {
    if (!firestore || !isDeveloper) return null;
    return collection(firestore, 'users');
  }, [firestore, isDeveloper]);

  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersCollection);

  const getUserDisplayName = (uid: string) => {
    if (!users) return uid;
    const referrer = users.find(user => user.uid === uid);
    return referrer ? referrer.displayName : 'Unknown';
  };

  const handleSubscriptionChange = (userToUpdate: UserProfile, isPremium: boolean) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    updateDocumentNonBlocking(userDocRef, { isPremium });
  };
  
  const handleCommissionChange = (userToUpdate: UserProfile, commissionRate: number) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
        toast({
            variant: "destructive",
            title: "Invalid Rate",
            description: "Commission rate must be a number between 0 and 100.",
        });
        return;
    }
    updateDocumentNonBlocking(userDocRef, { referralCommissionRate: commissionRate });
    toast({
        title: "Commission Rate Updated",
        description: `${userToUpdate.displayName}'s commission rate has been set to ${commissionRate}%.`,
    });
  };

  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      uid: '',
      displayName: '',
      email: '',
    },
  });

  const handleAddUser = (values: z.infer<typeof addUserFormSchema>) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', values.uid);
    const newUserProfile = {
      ...values,
      photoURL: '',
      isPremium: false,
      createdAt: new Date().toISOString(),
    };

    setDoc(userDocRef, newUserProfile)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: newUserProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    form.reset();
    setIsAddUserDialogOpen(false);
  };

  if (userLoading || !isDeveloper) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a Firestore profile for a user. The UID must match an existing Firebase Authentication user.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="uid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID (UID)</FormLabel>
                    <FormControl>
                      <Input placeholder="Firebase User ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>Add New User</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Referred By</TableHead>
                <TableHead>Commission Rate (%)</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead className="text-right">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading && (
                <>
                  <TableRow>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  </TableRow>
                </>
              )}
              {users && users.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.photoURL} alt={u.displayName} />
                        <AvatarFallback><UserIcon size={16} /></AvatarFallback>
                      </Avatar>
                      <span>{u.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.referredBy ? getUserDisplayName(u.referredBy) : '-'}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={u.referralCommissionRate ?? 0}
                      onBlur={(e) => handleCommissionChange(u, parseFloat(e.target.value))}
                      className="w-24"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </TableCell>
                  <TableCell>
                    {u.isPremium ? (
                      <Badge>Premium</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={!!u.isPremium}
                      onCheckedChange={(checked) => handleSubscriptionChange(u, checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
