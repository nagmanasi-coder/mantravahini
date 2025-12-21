
"use client";

import { useState } from "react";
import { mantras, type Mantra } from "@/lib/mantras";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

          <ScrollArea className="h-[65vh] pr-4">
            <div className="space-y-4">
              {mantras.map((mantra) => (
                <Card 
                  key={mantra.id}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => setSelectedMantra(mantra)}
                >
                  <CardHeader>
                    <CardTitle>{mantra.name}</CardTitle>
                    {mantra.description && (
                       <CardDescription className="text-xs text-muted-foreground whitespace-pre-wrap text-left pt-2">
                        {mantra.description.split('\n')[0]}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      <Dialog open={!!selectedMantra} onOpenChange={(open) => !open && setSelectedMantra(null)}>
        <DialogContent className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{selectedMantra?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="pr-4 -mx-2">
              <div className="px-2">
                {selectedMantra?.description ? (
                  <p className="whitespace-pre-wrap font-bold">{selectedMantra.description}</p>
                ) : (
                  <p>Details about this mantra will be available soon.</p>
                )}
              </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
