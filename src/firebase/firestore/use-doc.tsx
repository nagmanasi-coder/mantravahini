'use client';
import { useFirestore } from '..';
import {
  doc,
  onSnapshot,
  type DocumentReference,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T>(collection: string, docId: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);

  const docRef: DocumentReference<T> | null = useMemo(() => {
    if (firestore) {
      return doc(firestore, collection, docId) as DocumentReference<T>;
    }
    return null;
  }, [firestore, collection, docId]);

  useEffect(() => {
    if (docRef) {
      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            setData({ id: doc.id, ...doc.data() } as T);
          }
        },
        async (err) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
      );
      return () => unsubscribe();
    }
  }, [docRef]);

  return data;
}
