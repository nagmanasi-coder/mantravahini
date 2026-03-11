
'use server';
/**
 * @fileOverview AI Workshop Generator Flow.
 * 
 * Converts raw textbook content into structured workshop modules and lessons.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LessonSchema = z.object({
  title: z.string().describe("Bilingual title: 'English Title | ಕನ್ನಡ ಶೀರ್ಷಿಕೆ'"),
  concept: z.string().describe("Brief bilingual explanation (3-4 lines total)"),
  activity: z.string().describe("A practical hands-on task for the student"),
  quiz_question: z.string().describe("A multiple-choice question"),
  quiz_options: z.array(z.string()).length(4).describe("4 options for the quiz"),
  correct_answer: z.string().describe("The exact text of the correct option"),
  image_hint: z.string().describe("Two keywords for a placeholder image search"),
});

const ModuleSchema = z.object({
  title: z.string().describe("Chapter or section title"),
  order: z.number(),
  lessons: z.array(LessonSchema),
});

const WorkshopOutputSchema = z.object({
  modules: z.array(ModuleSchema),
});

const WorkshopInputSchema = z.object({
  content: z.string().describe("Raw textbook content"),
  title: z.string().describe("Course title"),
  language: z.string().default('kn'),
});

export type WorkshopInput = z.infer<typeof WorkshopInputSchema>;
export type WorkshopOutput = z.infer<typeof WorkshopOutputSchema>;

export async function generateWorkshopLessons(input: WorkshopInput): Promise<WorkshopOutput> {
  return workshopGeneratorFlow(input);
}

const workshopGeneratorFlow = ai.defineFlow(
  {
    name: 'workshopGeneratorFlow',
    inputSchema: WorkshopInputSchema,
    outputSchema: WorkshopOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are an expert curriculum designer.
        CONVERT the following textbook content into interactive workshop-style modules for school students.
        
        Course Title: ${input.title}
        Source Content: ${input.content}
        
        STRUCTURE:
        1. Divide content into 2-4 logical Modules (Chapters).
        2. Each Module must have 2-3 Lessons.
        3. Each Lesson must be BILINGUAL: Show English followed by Kannada.
        
        LESSON REQUIREMENTS:
        - Explanation (Concept): Exactly 3-4 lines of simple text.
        - Activity: A fun, practical thing for the student to DO right now.
        - Quiz: A testing question with 4 options.
        - Tone: Encouraging, spiritual, and educational.
        
        Return the result as valid JSON matching the requested schema.`,
      output: { schema: WorkshopOutputSchema },
    });

    if (!output) throw new Error("AI failed to generate lessons.");
    return output;
  }
);
