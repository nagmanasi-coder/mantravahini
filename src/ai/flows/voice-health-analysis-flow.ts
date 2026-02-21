
'use server';
/**
 * @fileOverview Multi-modal Voice Vibration Health, Chakra, and Prana Analysis.
 * 
 * This flow uses a two-stage analysis:
 * 1. Sarvam STT: Transcribes the audio using Sarvam's saarthi:v1 model for high-accuracy mantra verification.
 * 2. Gemini 1.5 Flash: Performs vibration analysis on the audio file to evaluate health markers.
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

/**
 * Uses Sarvam AI REST API to transcribe audio.
 */
async function transcribeWithSarvam(audioDataUri: string): Promise<string> {
  try {
    const base64 = audioDataUri.split(',')[1];
    if (!base64) return '';
    
    const buffer = Buffer.from(base64, 'base64');
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'audio/webm' });
    formData.append('file', blob, 'recording.webm');
    formData.append('model', 'saarthi:v1');

    const response = await fetch('https://api.sarvam.ai/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_AI_API_KEY || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Sarvam STT API Error:', err);
      return '';
    }

    const result = await response.json();
    return result.transcript || '';
  } catch (error) {
    console.error('Sarvam STT Network Error:', error);
    return '';
  }
}

/**
 * Checks if the transcript contains key parts of the required mantra.
 */
function verifyMantra(transcript: string): boolean {
  if (!transcript) return false;
  const t = transcript.toLowerCase();
  const patterns = [
    'om hum hanumate namah',
    'om hum hanumate namaha',
    'ಓಂ ಹುಂ ಹನುಮತೇ ನಮಃ',
    'hanumate',
    'ಹನುಮತೇ',
    'namah',
    'ನಮಃ'
  ];
  return patterns.some(p => t.includes(p.toLowerCase()));
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

    // STEP 1: TRANSCRIPTION VERIFICATION WITH SARVAM
    const sarvamTranscript = await transcribeWithSarvam(input.audioDataUri);
    const isMantraMatch = verifyMantra(sarvamTranscript);

    if (!isMantraMatch) {
      return getInvalidReport(input.language, sarvamTranscript || "Invalid Mantra");
    }

    // STEP 2: VIBRATION ANALYSIS WITH GEMINI
    const systemPrompt = `You are the Physical Vocal Health, Chakra, and Prana Energy Analyst for Mantravaahini.
    
    The user has successfully recited the mantra "Om Hum Hanumate Namah". 
    I have verified this via Sarvam STT. 
    
    YOUR TASK:
    Analyze the "Vibration Quality" of the provided audio file. 
    Evaluate Physical Vitality, Respiratory Strength, Vocal Clarity, Mental Energy, and Prana.
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

      // Final metadata assembly
      output.transcript = sarvamTranscript;
      output.isMantraMatch = true;

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
