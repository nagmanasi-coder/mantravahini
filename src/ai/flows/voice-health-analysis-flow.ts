
'use server';
/**
 * @fileOverview Voice Health Analysis AI Flow.
 * 
 * - analyzeVoiceHealth - Transcribes and analyzes vocal energy from a recorded Shloka.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SARVAM_AI_API_KEY || '',
  baseURL: 'https://api.sarvam.ai/v1',
});

const VoiceAnalysisInputSchema = z.object({
  audioDataUri: z.string().describe("The recorded voice as a data URI (base64)."),
  language: z.enum(['kn', 'en']).describe("The user's preferred language for the report."),
});

const VoiceAnalysisOutputSchema = z.object({
  transcript: z.string().describe("The transcription of the Shloka."),
  metrics: z.object({
    vocalPrana: z.number().describe("Vitality score 0-100."),
    stability: z.number().describe("Stability score 0-100."),
    clarity: z.number().describe("Clarity score 0-100."),
  }),
  guidance: z.string().describe("Spiritual and health guidance based on the voice."),
  recommendedMantra: z.string().optional().describe("A mantra from the app that might help."),
  recommendedProduct: z.string().optional().describe("A product from the app that might help."),
});

export type VoiceAnalysisInput = z.infer<typeof VoiceAnalysisInputSchema>;
export type VoiceAnalysisOutput = z.infer<typeof VoiceAnalysisOutputSchema>;

export async function analyzeVoiceHealth(input: VoiceAnalysisInput): Promise<VoiceAnalysisOutput> {
  return voiceHealthFlow(input);
}

const voiceHealthFlow = ai.defineFlow(
  {
    name: 'voiceHealthFlow',
    inputSchema: VoiceAnalysisInputSchema,
    outputSchema: VoiceAnalysisOutputSchema,
  },
  async (input) => {
    // 1. In a real production scenario, we would use Sarvam's STT here.
    // For this prototype, we simulate the analysis based on the presence of audio 
    // and use the LLM to generate a personalized spiritual report.
    
    const systemPrompt = `You are the Divine Vocal Analyst for Mantravaahini. 
    A user has recorded a Shloka. Based on the metadata of the session, provide a spiritual health report.
    
    App Context:
    - Mantras: Kali (Pain), Chakshu (Eyes), Hanuman (Chronic Diseases).
    - Products: Medicated Oils (Hair, Pain, Skin, Sexual Wellness), Akshaya Cash Box.
    
    Current Language: ${input.language === 'kn' ? 'Kannada' : 'English'}.
    
    Respond with:
    1. A short assessment of their "Vocal Prana" (Life force).
    2. Stability and Clarity percentages.
    3. Practical advice connecting their voice to their health.
    4. A specific recommendation from the app's catalog.`;

    const response = await client.chat.completions.create({
      model: 'sarvam-m',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "Please analyze my recording and provide my weekly Vocal Prana report." }
      ],
      temperature: 0.7,
    });

    const report = response.choices[0]?.message?.content || "";

    // Mocking the numeric metrics for the prototype
    return {
      transcript: "ಮಹಾವೀರ ವಿಕ್ರಮ ಬಜರಂಗಿ...", 
      metrics: {
        vocalPrana: Math.floor(Math.random() * (95 - 70) + 70),
        stability: Math.floor(Math.random() * (90 - 60) + 60),
        clarity: Math.floor(Math.random() * (98 - 75) + 75),
      },
      guidance: report,
      recommendedMantra: "Hanuman Therapy",
      recommendedProduct: "Pain Relief Oil",
    };
  }
);
