
'use server';
/**
 * @fileOverview AI Master Spiritual Guide Flow for Mantravaahini.
 *
 * - chatWithGuide - Handles communication with the spiritual guide using Gemini 1.5 Flash.
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
      - Specialized Therapies: Hanuman Therapy (chronic diseases), Hanuman Prana Therapy (protection from untimely death).
      - Products: Akshaya Cash Box (financial flow), Medicated Oils (Hair, Pain, Skin, Sexual Wellness).
      - Premium Benefits: Access to spiritual books library (Premium Library), practical demonstration videos, workshops, and the Divine Entity WhatsApp group.
      - Referral Program: Premium members can earn rewards and commissions by sharing their unique referral link.
      - Center Contact: 7022070287 (for personalized activation of mantras and enrollment in specialized therapies).
      
      Instructions:
      1. Language: Always respond in ${input.language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
      2. Precision: Keep your response concise (maximum 3-4 sentences).
      3. Relevance: Recommend specific app modules or products only if directly relevant to the user's question.
      4. Activation: For deep healing, always guide users to contact the center at 7022070287 for personalized mantra activation.
      5. Integrity: Stick to the provided app context. Do not invent rituals or offer clinical medical advice outside of these spiritual healing frameworks.`;

    const chatHistory = input.history?.map(h => ({
      role: h.role,
      content: [{ text: h.content }]
    })) || [];

    try {
      const { text } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: systemPrompt,
        messages: chatHistory,
        prompt: input.message,
      });

      return { response: text || "No response" };
    } catch (error: any) {
      console.error("Gemini Spiritual Guide Error:", error);
      const errorMsg = input.language === 'kn' 
        ? "ಕ್ಷಮಿಸಿ, ದೈವಿಕ ಸಂಪರ್ಕದಲ್ಲಿ ಸ್ವಲ್ಪ ವ್ಯತ್ಯಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ: 7022070287." 
        : "Apologies, there is a temporary interruption in the divine connection. Please try again in a few moments or contact the center: 7022070287.";
      
      return { response: errorMsg };
    }
  }
);
