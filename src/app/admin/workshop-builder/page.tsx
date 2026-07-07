'use client';

import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminWorkshopBuilderPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-32 text-center">
      <Construction className="h-20 w-20 mx-auto text-muted-foreground mb-6 opacity-20" />
      <h1 className="text-3xl font-headline font-bold text-primary mb-4">Workshop Builder Disabled</h1>
      <p className="text-muted-foreground mb-8">The Gemini-powered workshop generation tool is no longer available.</p>
      <Button asChild variant="outline">
        <Link href="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin</Link>
      </Button>
    </div>
  );
}
