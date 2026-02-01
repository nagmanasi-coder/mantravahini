'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function ReferralHandlerInternal() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Store it to be used during signup
      localStorage.setItem('referralCode', refCode);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}


export function HandleReferral() {
    return (
        <Suspense fallback={null}>
            <ReferralHandlerInternal />
        </Suspense>
    )
}
