'use server';
/**
 * @fileOverview A live chat AI agent for shopping assistance.
 *
 * - liveChat - A function that handles the live chat conversation.
 * - LiveChatInput - The input type for the liveChat function.
 * - LiveChatOutput - The return type for the liveChat function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const LiveChatInputSchema = z.object({
  userQuery: z.string().describe("The user's spoken question or command."),
  cartItems: z.array(z.string()).describe("The list of item names in the user's cart."),
  productCatalog: z.array(z.any()).describe('A list of all available products in the store to provide context.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation.'),
});
export type LiveChatInput = z.infer<typeof LiveChatInputSchema>;

const LiveChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's text response to the user."),
  audioDataUri: z.string().describe("The chatbot's audio response as a data URI."),
});
export type LiveChatOutput = z.infer<typeof LiveChatOutputSchema>;


export async function liveChat(input: LiveChatInput): Promise<LiveChatOutput> {
  return liveChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'liveChatPrompt',
  input: {schema: LiveChatInputSchema},
  output: {schema: z.object({response: z.string()})},
  prompt: `You are Gemini, a friendly and helpful voice-activated shopping assistant in a virtual store.
Your goal is to help the user with their shopping. You have access to the user's current shopping cart and the entire product catalog, which includes the 3D position of every item.

**Store Layout:**
- The store is a large rectangle. The entrance is at the front (positive Z direction).
- Aisles run from front to back. The main aisles are at X positions: -16, -8, 8, and 16.
- A back wall aisle runs left-to-right at Z position -22.
- A product's \`position\` is an [x, y, z] coordinate. Use the 'x' and 'z' values to describe its location. For example, a product at x: -15.5, z: 10 is on the left side of the first aisle (Aisle at x=-16), towards the front of the store.

**Your Tasks:**
- Answer questions about products, including their price, description, and location.
- Give recommendations based on the user's cart.
- Assist with any other shopping-related questions.
- Keep your responses conversational, concise, and helpful. Do not mention that you are an AI or that the user is in a virtual store or simulation.

Here is the user's current shopping cart:
{{#if cartItems}}
{{#each cartItems}}
- {{{this}}}
{{/each}}
{{else}}
(The cart is empty)
{{/if}}

Here is the full product catalog for your reference (includes name, price, description, category, and position):
{{{json productCatalog}}}

Here is the recent conversation history (user is 'user', you are 'model'):
{{#each chatHistory}}
{{this.role}}: {{this.content}}
{{/each}}

User's new question: {{{userQuery}}}
Gemini's response:
`,
});

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

const liveChatFlow = ai.defineFlow(
  {
    name: 'liveChatFlow',
    inputSchema: LiveChatInputSchema,
    outputSchema: LiveChatOutputSchema,
  },
  async (input) => {
    const {output: textOutput} = await prompt(input);
    if (!textOutput?.response) {
      throw new Error('Failed to generate text response.');
    }

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: textOutput.response,
    });

    if (!media) {
      throw new Error('no media returned from TTS');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      response: textOutput.response,
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
