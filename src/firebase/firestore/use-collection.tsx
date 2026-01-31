'use client';
import {
  collection,
  onSnapshot,
  query,
  where,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '..';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T>(collectionName: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionRef = useMemo(
    () => (firestore ? collection(firestore, collectionName) : null),
    [firestore, collectionName]
  );

  useEffect(() => {
    if (!collectionRef) return;

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const data: T[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(data);
        setLoading(false);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionRef]);

  return { data, loading };
}

export function useCollectionQuery<T>(
  collectionName: string,
  field: string,
  value: string
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);

  const collectionRef = useMemo(
    () => (firestore ? collection(firestore, collectionName) : null),
    [firestore, collectionName]
  );

  useEffect(() => {
    if (collectionRef) {
      const q = query(collectionRef, where(field, '==', value));
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const docs: T[] = [];
          querySnapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() } as T);
          });
          setData(docs);
        },
        async (err) => {
          const permissionError = new FirestorePermissionError({
            path: (q as Query).path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
      );
      return () => unsubscribe();
    }
  }, [collectionRef, field, value]);

  return data;
}
