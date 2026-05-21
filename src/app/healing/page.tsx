'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HealingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/prana-vidya');
  }, [router]);
  return null;
}