'use server';
/**
 * @fileOverview AI Text-to-Speech (TTS) Flow for Spiritual Content.
 *
 * - generateSpiritualAudio - Converts text into a WAV data URI using high-quality Indian-accented voices.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const TTSInputSchema = z.object({
  text: z.string().describe("The spiritual text to convert to speech."),
  language: z.enum(['kn', 'en']).describe("The language of the text."),
});

export async function generateSpiritualAudio(input: z.infer<typeof TTSInputSchema>) {
  return ttsGeneratorFlow(input);
}

const ttsGeneratorFlow = ai.defineFlow(
  {
    name: 'ttsGeneratorFlow',
    inputSchema: TTSInputSchema,
    outputSchema: z.object({
      audioDataUri: z.string(),
    }),
  },
  async (input) => {
    // Selection of voices that sound most appropriate for Indian spiritual content
    // Achernar is well-tuned for Kannada rhythm. Algenib provides a clear, professional English.
    const voiceName = input.language === 'kn' ? 'Achernar' : 'Algenib';

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
        // Relax safety settings for spiritual content to prevent "No valid candidates" errors
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
      },
      prompt: input.text,
    });

    if (!media) {
      throw new Error('No audio generated from divine source.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavData = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
