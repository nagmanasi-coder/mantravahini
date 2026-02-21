
import { genkit } from 'genkit';

/**
 * Genkit initialization for the Mantravaahini app.
 * We use the standard genkit instance.
 */
export const ai = genkit({
  plugins: [], // No standard plugins needed as we call Sarvam via OpenAI package
});
