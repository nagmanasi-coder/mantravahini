
'use server';
/**
 * @fileOverview AI Flow for Kalajnana (Daily Horoscope).
 * 
 * Generates spiritually-attuned predictions for 12 Rashi and 12 Lagna.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictionSchema = z.record(z.string()).describe("Map of sign index (0-11) to prediction text.");

const KalajnanaOutputSchema = z.object({
  date: z.string(),
  rashiPredictions: PredictionSchema,
  lagnaPredictions: PredictionSchema,
});

export async function generateDailyKalajnana(date: string) {
  return kalajnanaFlow(date);
}

const kalajnanaFlow = ai.defineFlow(
  {
    name: 'kalajnanaFlow',
    inputSchema: z.string(),
    outputSchema: KalajnanaOutputSchema,
  },
  async (date) => {
    const signs = [
      "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
      "Kataka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", 
      "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
      "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
    ];

    const systemPrompt = `You are an expert Vedic Astrologer and Spiritual Guide for the Mantravaahini app.
      DATE: ${date}
      
      YOUR TASK:
      Generate a daily horoscope (ದಿನ ಭವಿಷ್ಯ) for the 12 Rashi (Moon Signs) and 12 Lagna (Ascendants).
      
      INSTRUCTIONS:
      1. LANGUAGE: Always respond in Kannada (ಕನ್ನಡ).
      2. TONE: Spiritual, optimistic, encouraging, and precise.
      3. CONTENT: Focus on health, spiritual growth, family peace, and professional success.
      4. LENGTH: Keep each prediction between 2-3 concise sentences.
      5. FORMAT: Return valid JSON with "rashiPredictions" and "lagnaPredictions" as objects keyed by numbers "0" to "11".
      
      SIGN MAPPING:
      0: Mesha, 1: Vrishabha, 2: Mithuna, 3: Kataka, 4: Simha, 5: Kanya, 
      6: Tula, 7: Vrishchika, 8: Dhanu, 9: Makara, 10: Kumbha, 11: Meena.`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: systemPrompt,
      output: { schema: KalajnanaOutputSchema },
    });

    if (!output) throw new Error("Divine prediction failed.");
    return { ...output, date };
  }
);
