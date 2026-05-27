
'use server';
/**
 * @fileOverview AI Lesson Clarification Flow.
 * 
 * Handles on-the-fly student doubts during a lesson.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClarificationInputSchema = z.object({
  lessonTitle: z.string(),
  lessonConcept: z.string(),
  studentQuestion: z.string(),
  language: z.enum(['kn', 'en']),
});

export async function askLessonDoubt(input: z.infer<typeof ClarificationInputSchema>) {
  return clarificationFlow(input);
}

const clarificationFlow = ai.defineFlow(
  {
    name: 'clarificationFlow',
    inputSchema: ClarificationInputSchema,
    outputSchema: z.object({
      answer: z.string(),
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleAI/gemini-1.5-flash',
      prompt: `You are a helpful educational assistant for school students.
        The student is studying a lesson titled "${input.lessonTitle}".
        
        LESSON CONTEXT:
        ${input.lessonConcept}
        
        STUDENT QUESTION:
        "${input.studentQuestion}"
        
        INSTRUCTIONS:
        1. Answer the question precisely and simply.
        2. Keep the answer under 3-4 sentences.
        3. Respond in ${input.language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
        4. If the question is irrelevant to the lesson, politely guide them back to the topic.`,
    });

    return { answer: output?.text || "I'm sorry, I couldn't process that question." };
  }
);
