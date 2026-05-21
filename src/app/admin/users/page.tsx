'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Search, ShieldCheck, ShieldAlert, Trash2, AlertCircle } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  subscriptionTier?: 'free' | 'premium';
  premiumCycleStartDate?: string | null;
  referredBy?: string;
  referralCommissionRate?: number;
}

interface AdminUser {
  id: string; // userId
  uid?: string; // some docs might use uid field
  grantedAt: string;
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

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  // Use a listener for the admin status of the current user
  const adminMarkerRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'admin_users', user.uid);
  }, [firestore, user]);
  const { data: adminMarker, isLoading: adminCheckLoading } = useDoc<AdminUser>(adminMarkerRef);

  const isDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
  const hasAdminAccess = isDeveloper || !!adminMarker;

  useEffect(() => {
    if (!userLoading && !adminCheckLoading && !hasAdminAccess) {
      router.push('/');
    }
  }, [user, userLoading, adminCheckLoading, hasAdminAccess, router]);

  const usersCollection = useMemoFirebase(() => {
    if (!firestore || !hasAdminAccess) return null;
    return collection(firestore, 'users');
  }, [firestore, hasAdminAccess]);

  const adminsCollection = useMemoFirebase(() => {
    if (!firestore || !hasAdminAccess) return null;
    return collection(firestore, 'admin_users');
  }, [firestore, hasAdminAccess]);

  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersCollection);
  const { data: adminMarkers } = useCollection<AdminUser>(adminsCollection);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(u => 
      u.displayName.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) ||
      u.uid.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const getUserDisplayName = (uid: string) => {
    if (!users) return uid;
    const foundUser = users.find(user => user.uid === uid);
    return foundUser ? foundUser.displayName : 'Unknown';
  };

  const handleSubscriptionChange = (userToUpdate: UserProfile, tier: 'free' | 'premium') => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    
    const updateData: { subscriptionTier: string; premiumCycleStartDate?: string | null } = {
      subscriptionTier: tier,
    };

    if (tier === 'premium') {
      if (userToUpdate.subscriptionTier !== tier) {
        updateData.premiumCycleStartDate = new Date().toISOString();
      }
    } else {
      updateData.premiumCycleStartDate = null;
    }
    
    updateDocumentNonBlocking(userDocRef, updateData);
    toast({ title: "Tier Updated", description: `${userToUpdate.displayName} is now on the ${tier} plan.` });
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
        title: "Commission Updated",
        description: `${userToUpdate.displayName}'s rate is now ${commissionRate}%.`,
    });
  };

  const toggleAdminStatus = (targetUid: string, isCurrentlyAdmin: boolean) => {
    if (!firestore) return;
    const adminDocRef = doc(firestore, 'admin_users', targetUid);
    
    if (isCurrentlyAdmin) {
      deleteDocumentNonBlocking(adminDocRef);
      toast({ title: "Access Revoked", description: `Removed admin privileges for ${getUserDisplayName(targetUid)}.` });
    } else {
      const data = { uid: targetUid, grantedAt: new Date().toISOString() };
      setDoc(adminDocRef, data)
        .catch(async (err) => {
           errorEmitter.emit('permission-error', new FirestorePermissionError({
             path: adminDocRef.path,
             operation: 'create',
             requestResourceData: data
           }));
        });
      toast({ title: "Access Granted", description: `${getUserDisplayName(targetUid)} is now an Admin.` });
    }
  };

  const handleDeleteUser = (u: UserProfile) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', u.uid);
    deleteDocumentNonBlocking(userDocRef);
    toast({ title: "User Deleted", description: `${u.displayName}'s profile has been removed.` });
  };

  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: { uid: '', displayName: '', email: '' },
  });

  const handleAddUserManual = (values: z.infer<typeof addUserFormSchema>) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', values.uid);
    const newUserProfile = {
      ...values,
      photoURL: '',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
    };

    setDoc(userDocRef, newUserProfile)
      .catch((serverError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: newUserProfile,
        }));
      });
    
    form.reset();
    setIsAddUserDialogOpen(false);
    toast({ title: "User Created", description: "Manual profile creation successful." });
  };
  
  const calculateRemainingDays = (startDateString?: string | null): number | null => {
    if (!startDateString) return null;
    const startDate = new Date(startDateString);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    if (timeDiff < 0) return 0;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (userLoading || adminCheckLoading || !hasAdminAccess) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardHeader><CardTitle>Loading User Management...</CardTitle></CardHeader>
          <CardContent><div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User Override</DialogTitle>
            <DialogDescription>Manual creation for special cases.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUserManual)} className="grid gap-4 py-4">
              <FormField control={form.control} name="uid" render={({ field }) => (
                <FormItem><FormLabel>User ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="displayName" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="submit">Create</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-headline text-primary">User Management</CardTitle>
            <CardDescription>Select actions below to upgrade or manage your spiritual community.</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name or email..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddUserDialogOpen(true)} variant="outline">Manual Add</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Comm %</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading && (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
              )}
              {filteredUsers.map((u) => {
                const isAdmin = adminMarkers?.some(a => (a.id === u.uid || a.uid === u.uid)) || u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
                const isPaidUser = u.subscriptionTier === 'premium';
                const daysLeft = isPaidUser ? calculateRemainingDays(u.premiumCycleStartDate) : null;
                
                return (
                  <TableRow key={u.uid}>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={u.photoURL} alt={u.displayName} />
                          <AvatarFallback><UserIcon size={16} /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                          <span className="font-bold truncate text-sm">{u.displayName}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{u.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={isAdmin} 
                          onCheckedChange={() => toggleAdminStatus(u.uid, isAdmin)}
                          disabled={u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53'} 
                        />
                        {isAdmin ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-muted-foreground/30" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs truncate max-w-[100px]">
                      {u.referredBy ? getUserDisplayName(u.referredBy) : '-'}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={u.referralCommissionRate ?? 10}
                        onBlur={(e) => handleCommissionChange(u, parseFloat(e.target.value))}
                        className="w-16 h-8 text-xs px-1"
                      />
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1">
                         <Select
                            value={u.subscriptionTier || 'free'}
                            onValueChange={(value) => handleSubscriptionChange(u, value as any)}
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              <SelectValue placeholder="Tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free (Ads)</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                          {daysLeft !== null && <span className="text-[9px] text-primary font-bold">{daysLeft} days left</span>}
                       </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53'}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove <strong>{u.displayName}</strong>'s profile and data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(u)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!usersLoading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found matching your search.
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