
'use server';
/**
 * @fileOverview REAL Multi-modal Voice Vibration Health, Chakra, and Prana Analysis.
 * 
 * This flow uses Gemini 1.5 Flash to LISTEN to the actual audio recording.
 * It performs a two-step check:
 * 1. Transcription Verification: Ensures the user said "Om Hum Hanumate Namah".
 * 2. Vibration Analysis: Evaluates physical health markers and 6-chakra energy patterns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChakraSchema = z.object({
  score: z.number().describe("Energy level 0-100."),
  status: z.string().describe("Status description of the chakra energy."),
});

const VoiceAnalysisInputSchema = z.object({
  audioDataUri: z.string().describe("The recorded voice as a data URI (base64)."),
  language: z.enum(['kn', 'en']).describe("The user's preferred language for the report."),
});

const VoiceAnalysisOutputSchema = z.object({
  transcript: z.string().describe("The transcription of the recorded audio."),
  isMantraMatch: z.boolean().describe("Whether the audio contains the required mantra."),
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
    // Basic sanity check for empty strings
    if (input.audioDataUri.length < 1000) {
      return getInvalidReport(input.language, "Empty recording");
    }

    const systemPrompt = `You are the Physical Vocal Health, Chakra, and Prana Energy Analyst for Mantravaahini.
    
    STEP 1: TRANSCRIPTION VERIFICATION
    Listen to the audio. Transcribe the speech. 
    The user MUST say the mantra "Om Hum Hanumate Namah" (ಓಂ ಹುಂ ಹನುಮತೇ ನಮಃ).
    If the audio is silent, contains noise only, or does NOT contain this mantra, set 'isMantraMatch' to false and all scores to 0.
    
    STEP 2: HEALTH ANALYSIS (Only if Mantra Matches)
    Analyze the "Vibration Quality". Evaluate Physical Vitality, Respiratory Strength, Vocal Clarity, Mental Energy, and Prana.
    Detect physical markers like lung capacity, physical fatigue, joint stiffness, or digestive sluggishness reflected in vocal resonance.
    Analyze the 6 Chakras (Muladhara to Ajna) based on the resonance patterns.
    
    CRITICAL: You must return your analysis in STRICT JSON format.
    Language: ${input.language === 'kn' ? 'Kannada' : 'English'}.`;

    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: [
          { text: systemPrompt },
          { media: { url: input.audioDataUri, contentType: 'audio/webm' } }
        ],
        output: { schema: VoiceAnalysisOutputSchema },
      });

      if (!output) throw new Error("AI failed to generate a report.");

      // Final safety check: if the AI transcription failed or it's not a match
      if (!output.isMantraMatch || output.metrics.physicalVitality === 0) {
        return getInvalidReport(input.language, output.transcript || "Invalid Mantra");
      }

      return output;

    } catch (error: any) {
      console.error('GenAI Voice Flow Error:', error);
      return getInvalidReport(input.language, "Analysis Error");
    }
  }
);

function getInvalidReport(lang: 'kn' | 'en', transcript: string): VoiceAnalysisOutput {
  const isKn = lang === 'kn';
  return {
    transcript: transcript,
    isMantraMatch: false,
    metrics: { physicalVitality: 0, respiratoryStrength: 0, vocalClarity: 0, mentalEnergy: 0, pranaLevel: 0 },
    detectedMarkers: isKn ? "ಮಂತ್ರವು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ ಅಥವಾ ಮೌನವಾಗಿದೆ" : "Mantra did not match or audio is silent",
    suggestedIssues: isKn ? "ದಯವಿಟ್ಟು ಮಂತ್ರವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಪಠಿಸಿ" : "Please recite the mantra clearly",
    physicalHealthGuidance: isKn 
      ? "ವಿಶ್ಲೇಷಣೆಗಾಗಿ ದಯವಿಟ್ಟು 'ಓಂ ಹುಂ ಹನುಮತೇ ನಮಃ' ಮಂತ್ರವನ್ನು ೩ ಬಾರಿ ಪಠಿಸಿ." 
      : "Please recite the mantra 'Om Hum Hanumate Namah' 3 times for analysis.",
    chakras: {
      muladhara: { score: 0, status: "-" },
      svadhishthana: { score: 0, status: "-" },
      manipura: { score: 0, status: "-" },
      anahata: { score: 0, status: "-" },
      vishuddha: { score: 0, status: "-" },
      ajna: { score: 0, status: "-" },
    },
  };
}
