'use server';
/**
 * @fileOverview AI Text-to-Speech (TTS) Flow for Spiritual Content.
 *
 * - generateSpiritualAudio - Converts text into a WAV data URI using high-quality Indian-accented voices.
 * Includes advanced safety bypass for sacred chants and repetitive mantras.
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
    const voiceName = input.language === 'kn' ? 'Achernar' : 'Algenib';
    
    // Safety thresholds for spiritual content - set to BLOCK_NONE for all known categories
    const safetySettings: any = [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
    ];

    try {
      // Ensure text isn't just whitespace
      let textToSpeak = input.text.trim();
      if (!textToSpeak) throw new Error("No text provided.");

      // For very short mantras, the TTS engine sometimes fails. 
      // Adding a trailing period or space can help.
      if (textToSpeak.length < 5) {
        textToSpeak = textToSpeak + " . ";
      }

      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
          safetySettings,
        },
        prompt: textToSpeak,
      });

      if (!media || !media.url) {
        // Fallback: If media is null, it usually means a safety block even with BLOCK_NONE.
        // We try one more time with a slightly modified input.
        const retryResponse = await ai.generate({
          model: googleAI.model('gemini-2.5-flash-preview-tts'),
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
            safetySettings,
          },
          prompt: `Spiritual chant: ${textToSpeak}`,
        });

        if (!retryResponse.media || !retryResponse.media.url) {
          throw new Error('The AI model refused to generate audio for this specific text due to internal safety policies.');
        }
        
        return await processMedia(retryResponse.media.url);
      }

      return await processMedia(media.url);
    } catch (error: any) {
      console.error("TTS Generation Error:", error);
      throw new Error(error.message || "Failed to generate spiritual audio.");
    }
  }
);

async function processMedia(mediaUrl: string) {
  const audioBuffer = Buffer.from(
    mediaUrl.substring(mediaUrl.indexOf(',') + 1),
    'base64'
  );

  const wavData = await toWav(audioBuffer);

  return {
    audioDataUri: 'data:audio/wav;base64,' + wavData,
  };
}

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
