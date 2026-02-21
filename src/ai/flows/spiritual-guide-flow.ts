
'use server';
/**
 * @fileOverview AI Master Spiritual Guide Flow for Mantravaahini.
 *
 * - chatWithGuide - Handles communication with the spiritual guide using Sarvam AI.
 * - ChatInput - Input schema for the chat.
 * - ChatOutput - Output schema for the chat response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import OpenAI from 'openai';

// Initialize the OpenAI client for Sarvam AI
const client = new OpenAI({
  apiKey: process.env.SARVAM_AI_API_KEY || '',
  baseURL: 'https://api.sarvam.ai/v1',
});

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
  response: z.string().describe('The precise and clear spiritual response.'),
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
    const systemPrompt = `You are the AI Master Spiritual Guide for the Mantravaahini (ಮಂತ್ರವಾಹಿನಿ) app.
      Your answers must be PRECISE, CLEAR, and spiritually uplifting. 
      Avoid long-winded introductions or conclusions. Get straight to the wisdom.
      
      App Context:
      - App Focus: Pain-free life, spiritual growth, and health through mantras.
      - Core Mantras: Kali Mantra (body/joint pain), Chakshu Mantra (eye health).
      - Therapies: Hanuman Therapy (chronic diseases), Hanuman Prana Therapy (protection).
      - Products: Akshaya Cash Box (finances), Medicated Oils (Hair, Pain, Skin, Sexual Wellness).
      - Center Contact: 7022070287 (for personalized activation of mantras).
      
      Instructions:
      1. Language: Always respond in ${input.language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
      2. Precision: Keep your response concise (maximum 3-4 sentences).
      3. Relevance: Only recommend app-specific mantras or products if they directly relate to the user's question.
      4. Activation: If healing is discussed, mention contacting the center at 7022070287 for personalized activation.
      5. Integrity: Do not invent rituals. Stick to the provided app context.`;

    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt,
      }
    ];

    if (input.history && input.history.length > 0) {
      input.history.forEach(h => {
        messages.push({
          role: h.role === 'model' ? 'assistant' : 'user',
          content: h.content,
        });
      });
    }

    messages.push({
      role: 'user',
      content: input.message,
    });

    try {
      const response = await client.chat.completions.create({
        model: 'sarvam-1',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseText = response.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error('The AI guide was unable to generate a response. Please check your Sarvam AI API key or dashboard.');
      }

      return { response: responseText };
    } catch (error: any) {
      console.error('Sarvam AI Error:', error);
      throw new Error(`Failed to contact the Divine Guide: ${error.message}`);
    }
  }
);
