
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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
import { User as UserIcon, Search, ShieldCheck, ShieldAlert } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  subscriptionTier?: 'free' | 'basic' | 'premium';
  premiumCycleStartDate?: string | null;
  referredBy?: string;
  referralCommissionRate?: number;
}

interface AdminUser {
  id: string; // userId
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

  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!userLoading) {
      const isActualDeveloper = user?.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
      setIsDeveloper(isActualDeveloper);
      if (!user?.uid || !isActualDeveloper) {
        router.push('/');
      }
    }
  }, [user, userLoading, router]);

  const usersCollection = useMemoFirebase(() => {
    if (!firestore || !isDeveloper) return null;
    return collection(firestore, 'users');
  }, [firestore, isDeveloper]);

  const adminsCollection = useMemoFirebase(() => {
    if (!firestore || !isDeveloper) return null;
    return collection(firestore, 'admin_users');
  }, [firestore, isDeveloper]);

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

  const handleSubscriptionChange = (userToUpdate: UserProfile, tier: 'free' | 'basic' | 'premium') => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    
    const updateData: { subscriptionTier: string; premiumCycleStartDate?: string | null } = {
      subscriptionTier: tier,
    };

    if (tier === 'basic' || tier === 'premium') {
      if (userToUpdate.subscriptionTier !== tier) {
        updateData.premiumCycleStartDate = new Date().toISOString();
      }
    } else {
      updateData.premiumCycleStartDate = null;
    }
    
    updateDocumentNonBlocking(userDocRef, updateData);
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

  const toggleAdminStatus = (targetUid: string, isCurrentlyAdmin: boolean) => {
    if (!firestore) return;
    const adminDocRef = doc(firestore, 'admin_users', targetUid);
    
    if (isCurrentlyAdmin) {
      deleteDoc(adminDocRef).catch(console.error);
      toast({ title: "Admin Access Revoked", description: `Revoked admin privileges for ${getUserDisplayName(targetUid)}.` });
    } else {
      setDoc(adminDocRef, { uid: targetUid, grantedAt: new Date().toISOString() }).catch(console.error);
      toast({ title: "Admin Access Granted", description: `${getUserDisplayName(targetUid)} is now an Administrator.` });
    }
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
      subscriptionTier: 'free',
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User Manually</DialogTitle>
            <DialogDescription>
              This is usually handled automatically during signup. Use this only for special cases.
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

      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-headline text-primary">User Management</CardTitle>
            <CardDescription>View, promote, and manage your spiritual community members.</CardDescription>
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
            <Button onClick={() => setIsAddUserDialogOpen(true)} variant="outline">Add New</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Referred By</TableHead>
                <TableHead>Comm %</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
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
              {filteredUsers.map((u) => {
                const isAdmin = adminMarkers?.some(a => a.id === u.uid) || u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
                const isPaidUser = u.subscriptionTier === 'basic' || u.subscriptionTier === 'premium';
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
                        defaultValue={u.referralCommissionRate ?? 0}
                        onBlur={(e) => handleCommissionChange(u, parseFloat(e.target.value))}
                        className="w-16 h-8 text-xs px-1"
                        min="0"
                        max="100"
                      />
                    </TableCell>
                    <TableCell>
                       <Badge variant={u.subscriptionTier === 'premium' ? 'default' : u.subscriptionTier === 'basic' ? 'secondary' : 'outline'} className="capitalize text-[10px]">
                        {u.subscriptionTier || 'free'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px]">
                      {daysLeft !== null ? `${daysLeft}d` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                       <Select
                          value={u.subscriptionTier || 'free'}
                          onValueChange={(value) => handleSubscriptionChange(u, value as any)}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue placeholder="Tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!usersLoading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
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
