'use server';
/**
 * @fileOverview An AI flow for generating avatar images.
 *
 * - generateAvatar - A function that generates an avatar based on a text description.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAvatarInputSchema = z.object({
  description: z.string().describe("A text description of the avatar's shirt to generate."),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe("The generated avatar image as a data URI."),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  const {media} = await ai.generate({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: `Generate a seamless, tileable texture for a video game character's shirt based on the following description. The texture should be visually appealing and suitable for a 3D model. Do not include any text or logos unless specified. Style: simple, cartoonish. Description: ${input.description}`,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  if (!media?.url) {
    throw new Error('Image generation failed.');
  }

  return { avatarDataUri: media.url };
}
