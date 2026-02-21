'use server';
/**
 * @fileOverview Multi-modal Voice Vibration Health, Chakra, and Prana Analysis.
 * 
 * This flow uses a prioritized two-stage analysis:
 * 1. Primary: Sarvam STT (transcription) + Sarvam-M (LLM reasoning).
 * 2. Fallback: Gemini 1.5 Flash (Direct audio vibration analysis).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import OpenAI from 'openai';

// Initialize the OpenAI client for Sarvam AI reasoning
const sarvamClient = new OpenAI({
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
 * Uses Sarvam-M to generate health report based on verified transcription.
 */
async function analyzeWithSarvamM(transcript: string, language: 'kn' | 'en'): Promise<VoiceAnalysisOutput> {
  const systemPrompt = `You are the Physical Vocal Health and Chakra Analyst for Mantravaahini.
    The user has successfully recited the mantra "Om Hum Hanumate Namah". 
    Verified Transcript: "${transcript}"
    
    YOUR TASK:
    Generate a health analysis report based on the recitation. 
    Evaluate Physical Vitality, Respiratory Strength, Vocal Clarity, Mental Energy, and Prana.
    Analyze the 6 Chakras (Muladhara to Ajna).
    Provide specific detected markers and suggested issues.
    
    CRITICAL: You must return valid JSON matching the requested schema.
    Language: ${language === 'kn' ? 'Kannada' : 'English'}.`;

  const response = await sarvamClient.chat.completions.create({
    model: 'sarvam-m',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate my Vocal Prana health report based on my successful recitation.' }
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Sarvam-M failed to generate content');
  
  const parsed = JSON.parse(content);
  return {
    ...parsed,
    transcript,
    isMantraMatch: true,
  };
}

/**
 * Uses Gemini 1.5 Flash for true audio-based vibration analysis.
 */
async function analyzeWithGemini(audioDataUri: string, language: 'kn' | 'en'): Promise<VoiceAnalysisOutput> {
  const systemPrompt = `You are the Physical Vocal Health and Chakra Analyst.
    Listen to the audio and verify if the user says "Om Hum Hanumate Namah".
    If verified, analyze the VIBRATIONS for Physical Vitality, Respiratory Strength, and Chakra energy.
    Language: ${language === 'kn' ? 'Kannada' : 'English'}.`;

  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: [
      { text: systemPrompt },
      { media: { url: audioDataUri, contentType: 'audio/webm' } }
    ],
    output: { schema: VoiceAnalysisOutputSchema },
  });

  if (!output) throw new Error("Gemini failed to generate report.");
  return output;
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
    // Sanity check
    if (input.audioDataUri.length < 1000) {
      return getInvalidReport(input.language, "Empty recording");
    }

    try {
      // 1. PRIMARY PATH: Sarvam STT + Sarvam-M
      const sarvamTranscript = await transcribeWithSarvam(input.audioDataUri);
      
      if (verifyMantra(sarvamTranscript)) {
        try {
          // Attempt Sarvam-M reasoning first
          return await analyzeWithSarvamM(sarvamTranscript, input.language);
        } catch (sarvamMError) {
          console.warn('Sarvam-M failed, falling back to Gemini for analysis...');
          return await analyzeWithGemini(input.audioDataUri, input.language);
        }
      } else {
        // Mantra verify failed via Sarvam STT, but Sarvam might be less accurate than Gemini for audio.
        // Let's try Gemini as a fallback for the WHOLE process if Sarvam says no.
        console.log('Sarvam STT did not verify mantra, trying Gemini fallback...');
        const geminiResult = await analyzeWithGemini(input.audioDataUri, input.language);
        if (geminiResult.isMantraMatch) return geminiResult;
        
        return getInvalidReport(input.language, sarvamTranscript || "Invalid Mantra");
      }

    } catch (globalError: any) {
      console.error('Voice Flow Error:', globalError);
      // FINAL FALLBACK: Attempt Gemini if Sarvam STT failed entirely
      try {
        return await analyzeWithGemini(input.audioDataUri, input.language);
      } catch (e) {
        return getInvalidReport(input.language, "Analysis Error");
      }
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
