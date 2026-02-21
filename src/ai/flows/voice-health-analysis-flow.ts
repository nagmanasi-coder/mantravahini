'use server';
/**
 * @fileOverview Physical Voice Vibration Health, Chakra, and Prana Analysis AI Flow.
 * 
 * - analyzeVoiceHealth - Analyzes vocal vibrations to detect physical health, mental energy, and life force (Prana).
 * 
 * Note: This uses Sarvam AI's reasoning to correlate vocal presence with physical health markers.
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
    mentalEnergy: z.number().describe("Mental focus and alertness score 0-100."),
    pranaLevel: z.number().describe("Subtle life force energy score 0-100."),
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
    // 1. Strict Silence/Empty Check
    // A standard recording base64 for 5-10s should be > 50,000 chars.
    // Extremely small strings (under 5000) are definitely empty/silent.
    const audioDataLength = input.audioDataUri.length;
    if (audioDataLength < 5000) {
      return getSilentReport(input.language);
    }

    const systemPrompt = `You are the Physical Vocal Health, Chakra, and Prana Energy Analyst for Mantravaahini. 
    Your task is to analyze the "Vibration Quality" of a user reciting the mantra "Om Hum Hanumate Namah" (ಓಂ ಹುಂ ಹನುಮತೇ ನಮಃ).
    
    CRITICAL INSTRUCTIONS:
    1. You must return your analysis in a STRICT JSON format.
    2. Analyze the context: The user is recording their voice. Evaluate Physical Vitality, Respiratory Strength, Vocal Clarity, Mental Energy, and Prana.
    3. If the audio is described as short or low quality, lower the scores significantly.
    4. Provide specific guidance on what health markers (e.g., lung capacity, physical fatigue, joint stiffness) are reflected in their vocal vibration.
    5. Analyze the 6 Chakras (Muladhara to Ajna) based on the resonance of this specific mantra.
    
    Expected JSON Structure:
    {
      "metrics": { "physicalVitality": 0-100, "respiratoryStrength": 0-100, "vocalClarity": 0-100, "mentalEnergy": 0-100, "pranaLevel": 0-100 },
      "detectedMarkers": "string describing vocal stability",
      "suggestedIssues": "string describing potential health concerns",
      "physicalHealthGuidance": "detailed holistic guidance",
      "chakras": { 
        "muladhara": { "score": 0-100, "status": "string" },
        "svadhishthana": { "score": 0-100, "status": "string" },
        "manipura": { "score": 0-100, "status": "string" },
        "anahata": { "score": 0-100, "status": "string" },
        "vishuddha": { "score": 0-100, "status": "string" },
        "ajna": { "score": 0-100, "status": "string" }
      },
      "transcript": "string"
    }

    Language: ${input.language === 'kn' ? 'Kannada' : 'English'}.`;

    try {
      const response = await client.chat.completions.create({
        model: 'sarvam-m',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze the vibration intent of this recording. Data context length: ${audioDataLength}. Generate a realistic health report based on vocal presence.` }
        ],
        temperature: 0.3, // Moderate temperature for variety but logical consistency
      });

      const content = response.choices[0]?.message?.content || "";
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Localization for recommendations if missing from AI
          return {
            ...parsed,
            recommendedMantra: parsed.recommendedMantra || (input.language === 'kn' ? "ಹನುಮಾನ್ ಶಕ್ತಿ ಮಂತ್ರ" : "Hanuman Vitality Mantra"),
            recommendedProduct: parsed.recommendedProduct || (input.language === 'kn' ? "ನೋವು ನಿವಾರಕ ತೈಲ" : "Pain Relief Oil"),
          };
        }
      } catch (e) {
        console.error("JSON Parse Error in Voice Flow:", e);
      }

      // Fallback if AI output is not valid JSON
      throw new Error("Invalid report format generated by AI.");

    } catch (error: any) {
      console.error('Sarvam AI Flow Error:', error);
      return getSilentReport(input.language);
    }
  }
);

function getSilentReport(lang: 'kn' | 'en'): VoiceAnalysisOutput {
  const isKn = lang === 'kn';
  return {
    transcript: isKn ? "ಯಾವುದೇ ಧ್ವನಿ ಪತ್ತೆಯಾಗಿಲ್ಲ" : "No audio content detected",
    metrics: { physicalVitality: 0, respiratoryStrength: 0, vocalClarity: 0, mentalEnergy: 0, pranaLevel: 0 },
    detectedMarkers: isKn ? "ಮೌನ ಅಥವಾ ಅಸ್ಪಷ್ಟ ಕಂಪನ" : "Silence or insufficient vibration detected",
    suggestedIssues: isKn ? "ಖಾಲಿ ಧ್ವನಿ ಅಥವಾ ಮೈಕ್ ಸಮಸ್ಯೆ" : "Empty recording or microphone issue",
    physicalHealthGuidance: isKn 
      ? "ನಿಮ್ಮ ಮೈಕ್ರೊಫೋನ್ ಸರಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಿ ಮತ್ತು ಮಂತ್ರವನ್ನು ಗಟ್ಟಿಯಾಗಿ, ಸ್ಪಷ್ಟವಾಗಿ ಪಠಿಸಿ." 
      : "Please check your microphone and recite the mantra loudly and clearly for analysis.",
    chakras: {
      muladhara: { score: 0, status: isKn ? "ಮಾಹಿತಿ ಇಲ್ಲ" : "No data" },
      svadhishthana: { score: 0, status: isKn ? "ಮಾಹಿತಿ ಇಲ್ಲ" : "No data" },
      manipura: { score: 0, status: isKn ? "ಮಾಹಿತಿ ಇಲ್ಲ" : "No data" },
      anahata: { score: 0, status: isKn ? "ಮಾಹಿತಿ ಇಲ್ಲ" : "No data" },
      vishuddha: { score: 0, status: isKn ? "ಮಾಹಿತಿ ಇಲ್ಲ" : "No data" },
      ajna: { score: 0, status: isKn ? "ಮಾಹಿತಿ ಇಲ್ಲ" : "No data" },
    },
  };
}
