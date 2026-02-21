'use server';
/**
 * @fileOverview AI Master Spiritual Guide Flow for Mantravaahini.
 *
 * - chatWithGuide - Handles communication with the spiritual guide.
 * - ChatInput - Input schema for the chat.
 * - ChatOutput - Output schema for the chat response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the spiritual guide.'),
  language: z.enum(['kn', 'en']).describe('The language to respond in.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('Previous chat history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The clear and precise spiritual response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithGuide(input: ChatInput): Promise<ChatOutput> {
  return spiritualGuideFlow(input);
}

const spiritualGuideFlow = ai.defineFlow(
  {
    name: 'spiritualGuideFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { response } = await ai.generate({
      system: `You are the AI Master Spiritual Guide for the Mantravaahini app. 
      Your goal is to provide precise, clear, and compassionate spiritual guidance based on the app's specific offerings.
      
      App Context:
      - App Name: Mantravaahini (ಮಂತ್ರವಾಹಿನಿ)
      - Focus: Pain-free life, spiritual upliftment, health through mantras.
      - Mantras: Kali Mantra (for body/joint pain relief), Chakshu Mantra (for eye health), and various others (Kubera, Mahalakshmi, etc.).
      - Therapies: Hanuman Therapy (chronic diseases), Hanuman Prana Therapy (protection/longevity).
      - Products: Akshaya Cash Box, Medicated Oils (Hair, Pain, Skin, Sexual Wellness).
      - Philosophy: Service to humanity is service to God. Rooted in Natha Sampradaya.
      
      Instructions:
      1. Always respond in the language specified: ${input.language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
      2. Keep answers precise, clear, and spiritually uplifting.
      3. Recommend app-specific mantras or products when relevant.
      4. If asked about healing, mention that for personalized activation, they should contact the center at 7022070287.
      5. Do not hallucinate rituals or information outside the provided context.`,
      prompt: input.message,
      history: input.history?.map(h => ({
        role: h.role,
        content: [{ text: h.content }]
      })),
    });

    return { response: response.text };
  }
);
