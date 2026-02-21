
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for the Mantravaahini app.
 * We use the googleAI plugin to support multi-modal (audio) analysis.
 */
export const ai = genkit({
  plugins: [googleAI()],
});
