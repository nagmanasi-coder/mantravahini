"use client";

import { useState } from "react";
import { mantras, type Mantra } from "@/lib/mantras";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function MantraCornerPage() {
  const [selectedMantra, setSelectedMantra] = useState<Mantra | null>(null);

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              Mantra Corner
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            ಶಕ್ತಿಶಾಲಿ ಮಂತ್ರಗಳನ್ನು ಮತ್ತು ಅವುಗಳ ಪ್ರಯೋಜನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ನಂಬಿಕೆ, ಗೌರವ ಮತ್ತು ಶ್ರದ್ಧೆಯಿಂದ 100% works.
            </p>
          </header>

          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {mantras.map((mantra) => (
                    <Button
                      key={mantra.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto"
                      onClick={() => setSelectedMantra(mantra)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{mantra.name}</span>
                        {mantra.description && (
                           <span className="text-xs text-muted-foreground whitespace-pre-wrap text-left">
                            {mantra.description.split('\n')[0]}
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={!!selectedMantra} onOpenChange={(open) => !open && setSelectedMantra(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{selectedMantra?.name}</DialogTitle>
            <DialogDescription asChild>
                {selectedMantra?.description ? (
                  <p className="whitespace-pre-wrap font-bold">{selectedMantra.description}</p>
                ) : (
                  <p>Details about this mantra will be available soon.</p>
                )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
