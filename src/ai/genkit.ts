import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';

/**
 * Genkit initialization for Sarvam AI.
 * We use the genkitx-openai plugin configured with Sarvam's endpoint.
 */
export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.SARVAM_AI_API_KEY,
      config: {
        baseURL: 'https://api.sarvam.ai/v1',
      },
    }),
  ],
});
