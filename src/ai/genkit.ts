
import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.SARVAM_AI_API_KEY,
      baseURL: 'https://api.sarvam.ai/v1',
    }),
  ],
  model: 'openai/sarvam-1',
});
