
'use server';
/**
 * @fileOverview AI Image Generation Flow for Educational Diagrams.
 *
 * - generateLessonImage - Uses Imagen 4 to create a relevant visual for a lesson.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ImageInputSchema = z.object({
  prompt: z.string().describe("The descriptive prompt for the image."),
  lessonTitle: z.string().describe("The title of the lesson for context."),
});

export async function generateLessonImage(input: z.infer<typeof ImageInputSchema>) {
  return imageGenFlow(input);
}

const imageGenFlow = ai.defineFlow(
  {
    name: 'imageGenFlow',
    inputSchema: ImageInputSchema,
    outputSchema: z.object({
      imageDataUri: z.string(),
    }),
  },
  async (input) => {
    // Construct a high-quality educational prompt
    const fullPrompt = `A clean, professional educational diagram or high-quality illustration for a school lesson titled "${input.lessonTitle}". Subject: ${input.prompt}. Style: Minimalist, clear colors, educational, digital art, white background, no text labels.`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: fullPrompt,
    });

    if (!media || !media.url) {
      throw new Error('No image generated');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
