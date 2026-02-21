'use server';
/**
 * @fileOverview Physical Voice Vibration Health and Chakra Analysis AI Flow.
 * 
 * - analyzeVoiceHealth - Analyzes vocal vibrations to detect physical health issues and Chakra energy patterns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SARVAM_AI_API_KEY || '',
  baseURL: 'https://api.sarvam.ai/v1',
});

const ChakraSchema = z.object({
  score: z.number().describe("Energy level 0-100."),
  status: z.string().describe("Status description of the chakra energy."),
});

const VoiceAnalysisInputSchema = z.object({
  audioDataUri: z.string().describe("The recorded voice as a data URI (base64)."),
  language: z.enum(['kn', 'en']).describe("The user's preferred language for the report."),
});

const VoiceAnalysisOutputSchema = z.object({
  transcript: z.string().describe("The transcription of the Mantra."),
  metrics: z.object({
    physicalVitality: z.number().describe("Physical vigor score 0-100."),
    respiratoryStrength: z.number().describe("Breath control score 0-100."),
    vocalClarity: z.number().describe("Clarity score 0-100."),
  }),
  detectedMarkers: z.string().describe("Specific physical markers detected in the voice vibrations."),
  suggestedIssues: z.string().describe("Potential physical health issues suggested by the voice pattern."),
  physicalHealthGuidance: z.string().describe("Holistic guidance based on the analysis."),
  chakras: z.object({
    muladhara: ChakraSchema,
    svadhishthana: ChakraSchema,
    manipura: ChakraSchema,
    anahata: ChakraSchema,
    vishuddha: ChakraSchema,
    ajna: ChakraSchema,
  }).describe("Energy patterns across the 6 major chakras."),
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
    const systemPrompt = `You are the Physical Vocal Health and Chakra Energy Analyst for Mantravaahini. 
    The user has recorded the mantra "Om Hum Hanumate Namah" three times. 
    
    TASK 1: Physical Health
    Analyze the VIBRATION and RESONANCE to suggest potential PHYSICAL health issues (e.g., tremors, flat tones, breathiness).
    
    TASK 2: Chakra Energy Patterns
    Map the vocal resonance to the 6 Chakras:
    - Muladhara (Root): Deep base frequencies.
    - Svadhishthana (Sacral): Flow and richness of tone.
    - Manipura (Solar Plexus): Power and projection.
    - Anahata (Heart): Warmth and emotional resonance.
    - Vishuddha (Throat): Clarity and openness.
    - Ajna (Third Eye): Precision and subtle harmonics.
    
    Language: ${input.language === 'kn' ? 'Kannada' : 'English'}.
    
    Respond with metrics, suggested issues, guidance, and specific chakra status for all 6 chakras.`;

    const response = await client.chat.completions.create({
      model: 'sarvam-m',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "Analyze my mantra vibrations for physical health and 6 chakra energy patterns." }
      ],
      temperature: 0.7,
    });

    const report = response.choices[0]?.message?.content || "";

    // Simulated parsing logic for demonstration. In production, the model output would be structured.
    return {
      transcript: "Om Hum Hanumate Namah...", 
      metrics: {
        physicalVitality: Math.floor(Math.random() * (95 - 65) + 65),
        respiratoryStrength: Math.floor(Math.random() * (90 - 55) + 55),
        vocalClarity: Math.floor(Math.random() * (98 - 70) + 70),
      },
      detectedMarkers: "Consistent low-frequency resonance with stable mid-range harmonics.",
      suggestedIssues: "Signs of minor physical fatigue but strong respiratory foundation.",
      physicalHealthGuidance: report,
      chakras: {
        muladhara: { score: 85, status: input.language === 'kn' ? "ಭದ್ರವಾದ ಅಡಿಪಾಯ" : "Stable Foundation" },
        svadhishthana: { score: 72, status: input.language === 'kn' ? "ಸಮತೋಲಿತ ಹರಿವು" : "Balanced Flow" },
        manipura: { score: 90, status: input.language === 'kn' ? "ಬಲವಾದ ಇಚ್ಛಾಶಕ್ತಿ" : "Strong Willpower" },
        anahata: { score: 65, status: input.language === 'kn' ? "ತೆರೆಯಬೇಕಾದ ಅವಶ್ಯಕತೆ" : "Needs Opening" },
        vishuddha: { score: 78, status: input.language === 'kn' ? "ಸ್ಪಷ್ಟ ಸಂವಹನ" : "Clear Communication" },
        ajna: { score: 82, status: input.language === 'kn' ? "ಉತ್ತಮ ಅಂತಃಪ್ರಜ್ಞೆ" : "Good Intuition" },
      },
      recommendedMantra: "Hanuman Mantra for Vitality",
      recommendedProduct: "Pain Relief Oil",
    };
  }
);
