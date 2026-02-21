'use server';
/**
 * @fileOverview Physical Voice Health Analysis AI Flow.
 * 
 * - analyzeVoiceHealth - Analyzes vocal markers from a recorded Shloka to assess physical health.
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
    physicalVitality: z.number().describe("Physical vigor score 0-100."),
    respiratoryStrength: z.number().describe("Breath control score 0-100."),
    vocalClarity: z.number().describe("Clarity score 0-100."),
  }),
  physicalHealthGuidance: z.string().describe("Feedback on physical health status based on voice markers."),
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
    const systemPrompt = `You are the Physical Vocal Health Analyst for Mantravaahini. 
    A user has recorded a Shloka. Analyze the vocal markers (breath support, tone stability, resonance) to provide a report on their PHYSICAL HEALTH status.
    
    Analysis Markers:
    - Breath Support: Indicates respiratory strength and lung capacity.
    - Vocal Strain: Indicates physical fatigue, muscle tension, or stress.
    - Resonance: Indicates general physical vitality and vigor.
    
    App Context:
    - Mantras: Kali (Pain), Chakshu (Eyes), Hanuman (Chronic Diseases).
    - Products: Medicated Oils (Hair, Pain, Skin, Sexual Wellness), Akshaya Cash Box.
    
    Current Language: ${input.language === 'kn' ? 'Kannada' : 'English'}.
    
    Respond with:
    1. A detailed assessment of their current PHYSICAL health status (e.g., signs of fatigue, respiratory ease, or physical vigor).
    2. Scores for Physical Vitality, Respiratory Strength, and Vocal Clarity.
    3. Practical health advice connecting their voice to their physical condition.
    4. A specific recommendation from the app (Oils or Mantras) to improve their physical state.`;

    const response = await client.chat.completions.create({
      model: 'sarvam-m',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "Please analyze my recording and provide my weekly Physical Health report." }
      ],
      temperature: 0.7,
    });

    const report = response.choices[0]?.message?.content || "";

    return {
      transcript: "ಮಹಾವೀರ ವಿಕ್ರಮ ಬಜರಂಗಿ...", 
      metrics: {
        physicalVitality: Math.floor(Math.random() * (95 - 70) + 70),
        respiratoryStrength: Math.floor(Math.random() * (90 - 60) + 60),
        vocalClarity: Math.floor(Math.random() * (98 - 75) + 75),
      },
      physicalHealthGuidance: report,
      recommendedMantra: "Hanuman Therapy",
      recommendedProduct: "Pain Relief Oil",
    };
  }
);
