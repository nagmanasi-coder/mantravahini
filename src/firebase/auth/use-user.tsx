'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        // Sync user to firestore
        if (firestore) {
          const userRef = doc(firestore, 'users', userAuth.uid);
          try {
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
              const userData = {
                uid: userAuth.uid,
                email: userAuth.email,
                displayName: userAuth.displayName,
                photoURL: userAuth.photoURL,
                createdAt: new Date().toISOString(),
                isPremium: false,
              };
              setDoc(userRef, userData, { merge: true }).catch(
                (serverError) => {
                  const permissionError = new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'create',
                    requestResourceData: userData,
                  });
                  errorEmitter.emit('permission-error', permissionError);
                }
              );
            }
          } catch (e) {
             const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'get',
              });
              errorEmitter.emit('permission-error', permissionError);
          }
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
