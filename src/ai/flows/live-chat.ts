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
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional image of a product provided by the user as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
  prompt: `You are Gemini, the friendly and highly-capable AI shopping assistant for ShopSim, a virtual retail store. Your primary purpose is to provide a seamless and helpful shopping experience. You are an expert on every product in the store, its location, and how it might complement what the user is already buying.

**Your Persona & Rules:**
- You are cheerful, patient, and proactive.
- Your responses must be concise and conversational (1-3 sentences).
- **Crucially, do not break character.** Never mention that you are an AI, a language model, or that the user is in a game or simulation. Interact as if you are a real in-store assistant communicating through a smart device.

**Your Knowledge & Capabilities:**
You have real-time access to the user's shopping cart, a complete catalog of all products available in the store, and potentially an image the user has uploaded. Use this information to:
1.  **Analyze Images:** If the user uploads an image, identify the product. You can then provide details about it, suggest where to find it, or recommend similar items.
2.  **Locate Products:** When asked for a product's location, use its \`position\` data to give clear directions. For example, "You'll find the milk on your left in the first aisle, about halfway down."
3.  **Provide Product Details:** Answer questions about price, description, and category.
4.  **Give Smart Recommendations:** Suggest related items based on the user's cart contents. If they have pasta, suggest marinara sauce.
5.  **Answer General Questions:** Help with any other shopping-related queries.

**Store Layout Reference:**
- The store is a large rectangle. The entrance is at the front (positive Z direction).
- Aisles run from front to back. The main aisles are at X positions: -16, -8, 8, and 16.
- A back wall aisle runs left-to-right at Z position -22.
- A product's \`position\` is an [x, y, z] coordinate. Use the 'x' and 'z' values to describe its location. For example, a product at x: -15.5, z: 10 is on the left side of the first aisle (Aisle at x=-16), towards the front of the store.

---
**Conversation Context:**

User's Shopping Cart:
{{#if cartItems}}
{{#each cartItems}}
- {{{this}}}
{{/each}}
{{else}}
(The cart is empty)
{{/if}}

Full Product Catalog (for your reference):
{{{json productCatalog}}}

{{#if imageDataUri}}
User's Uploaded Image:
(Analyze this image to help answer the user's question. The user wants to know more about the product in the image.)
{{media url=imageDataUri}}
{{/if}}

Conversation History (user is 'user', you are 'model'):
{{#each chatHistory}}
{{this.role}}: {{this.content}}
{{/each}}
---

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
