
import { genkit } from 'genkit';
import { openai } from 'genkitx-openai';

/**
 * Genkit initialization for Sarvam AI.
 * We use the genkitx-openai plugin configured with Sarvam's endpoint.
 */
export const ai = genkit({
  plugins: [
    openai({
      apiKey: process.env.SARVAM_AI_API_KEY,
      config: {
        baseURL: 'https://api.sarvam.ai/v1',
      },
    }),
  ],
});
