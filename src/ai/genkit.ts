
import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';

/**
 * Genkit initialization for Sarvam AI.
 * Sarvam AI provides an OpenAI-compatible API.
 */
export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.SARVAM_AI_API_KEY,
      baseURL: 'https://api.sarvam.ai/v1',
    }),
  ],
  model: 'openai/sarvam-1',
});
