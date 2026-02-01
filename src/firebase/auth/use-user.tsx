'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        const userRef = doc(firestore, 'users', userAuth.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const batch = writeBatch(firestore);

            // 1. New user's data
            const referralCode = userAuth.uid.slice(0, 8);
            const userData: any = {
              uid: userAuth.uid,
              email: userAuth.email,
              displayName: userAuth.displayName,
              photoURL: userAuth.photoURL,
              createdAt: new Date().toISOString(),
              isPremium: false,
              referralCode: referralCode,
            };

            // 2. Check for referrer
            const storedRefCode = localStorage.getItem('referralCode');
            if (storedRefCode) {
              const referrerRef = doc(firestore, 'referralCodes', storedRefCode);
              try {
                const referrerSnap = await getDoc(referrerRef);
                if (referrerSnap.exists()) {
                  userData.referredBy = referrerSnap.data().userId;
                }
              } catch (e) {
                console.error("Could not fetch referrer", e);
              }
              localStorage.removeItem('referralCode');
            }

            // 3. Set up batch write for new user and their referral code
            batch.set(userRef, userData);
            const newReferralCodeRef = doc(firestore, 'referralCodes', referralCode);
            batch.set(newReferralCodeRef, { userId: userAuth.uid });

            // 4. Commit batch
            await batch.commit().catch((serverError) => {
              const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'create',
                requestResourceData: userData,
              });
              errorEmitter.emit('permission-error', permissionError);
            });
          }
        } catch (e) {
           const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
}
