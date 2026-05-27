'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
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
import { User as UserIcon, Search, Trash2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/context/language-context';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  subscriptionTier?: 'free' | 'premium';
  isPranaPractitioner?: boolean;
  practitionerLevel?: number;
  premiumCycleStartDate?: string | null;
  referredBy?: string;
  referralCode?: string;
  deleted?: boolean;
}

interface AdminUser {
  id: string;
  uid?: string;
  grantedAt: string;
}

export default function AdminUsersPage() {
  const { user, isUserLoading: userLoading } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

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
    if (!searchQuery.trim()) return users.filter(u => !u.deleted);
    const query = searchQuery.toLowerCase();
    return users.filter(u => 
      !u.deleted && (
      u.displayName.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) ||
      u.uid.toLowerCase().includes(query)
      )
    );
  }, [users, searchQuery]);

  const handleSubscriptionChange = (userToUpdate: UserProfile, tier: 'free' | 'premium') => {
    if (!firestore) return;
    const updateData: any = { subscriptionTier: tier };
    if (tier === 'premium') updateData.premiumCycleStartDate = new Date().toISOString();
    else updateData.premiumCycleStartDate = null;
    updateDocumentNonBlocking(doc(firestore, 'users', userToUpdate.uid), updateData);
    toast({ title: "Tier Updated" });
  };
  
  const handlePractitionerChange = (userToUpdate: UserProfile, isPractitioner: boolean) => {
    if (!firestore) return;
    const updateData: any = { isPranaPractitioner: isPractitioner };
    if (isPractitioner && !userToUpdate.practitionerLevel) updateData.practitionerLevel = 1;
    updateDocumentNonBlocking(doc(firestore, 'users', userToUpdate.uid), updateData);
    toast({ title: isPractitioner ? "Practitioner Assigned" : "Role Removed" });
  };

  const handleLevelChange = (userId: string, level: string) => {
    if (!firestore) return;
    updateDocumentNonBlocking(doc(firestore, 'users', userId), { practitionerLevel: parseInt(level) });
    toast({ title: "Level Updated" });
  };

  const toggleAdminStatus = (targetUid: string, isCurrentlyAdmin: boolean) => {
    if (!firestore) return;
    const adminDocRef = doc(firestore, 'admin_users', targetUid);
    if (isCurrentlyAdmin) {
      deleteDocumentNonBlocking(adminDocRef);
    } else {
      setDoc(adminDocRef, { uid: targetUid, grantedAt: new Date().toISOString() });
    }
  };

  const calculateRemainingDays = (startDateString?: string | null): number | null => {
    if (!startDateString) return null;
    const diff = new Date(startDateString).getTime() + (30 * 24 * 60 * 60 * 1000) - new Date().getTime();
    return diff < 0 ? 0 : Math.ceil(diff / (1000 * 3600 * 24));
  };

  if (userLoading || adminCheckLoading || !hasAdminAccess) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
        <p className="text-sm font-medium">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 pb-32">
      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-headline text-primary">User Management</CardTitle>
            <CardDescription>Manage your spiritual community.</CardDescription>
          </div>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Practitioner</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                 <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="animate-spin mx-auto h-6 w-6 text-primary" /></TableCell></TableRow>
              ) : filteredUsers.map((u) => {
                const isAdmin = adminMarkers?.some(a => (a.id === u.uid || a.uid === u.uid)) || u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53';
                const daysLeft = u.subscriptionTier === 'premium' ? calculateRemainingDays(u.premiumCycleStartDate) : null;
                return (
                  <TableRow key={u.uid}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarImage src={u.photoURL} /><AvatarFallback><UserIcon size={16} /></AvatarFallback></Avatar>
                        <div className="flex flex-col truncate max-w-[120px]">
                          <span className="font-bold text-sm truncate">{u.displayName}</span>
                          <span className="text-[9px] text-muted-foreground truncate">{u.referralCode || u.uid.slice(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Switch checked={isAdmin} onCheckedChange={() => toggleAdminStatus(u.uid, isAdmin)} disabled={u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53'} /></TableCell>
                    <TableCell><Switch checked={!!u.isPranaPractitioner} onCheckedChange={(val) => handlePractitionerChange(u, val)} /></TableCell>
                    <TableCell>
                       {u.isPranaPractitioner && (
                         <Select value={String(u.practitionerLevel || 1)} onValueChange={(val) => handleLevelChange(u.uid, val)}>
                           <SelectTrigger className="w-16 h-8 text-[10px]"><SelectValue /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="1">L1</SelectItem>
                             <SelectItem value="2">L2</SelectItem>
                             <SelectItem value="3">L3</SelectItem>
                           </SelectContent>
                         </Select>
                       )}
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                         <Select value={u.subscriptionTier || 'free'} onValueChange={(val) => handleSubscriptionChange(u, val as any)}>
                            <SelectTrigger className="w-24 h-8 text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent>
                         </Select>
                         {daysLeft !== null && <span className="text-[9px] font-bold text-primary">{daysLeft}d left</span>}
                       </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => { if(confirm('Delete user profile?')) updateDocumentNonBlocking(doc(firestore, 'users', u.uid), { deleted: true }) }} disabled={u.uid === 'LPBTRz3AMafKtZVgzJWm5Aisxc53'}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
