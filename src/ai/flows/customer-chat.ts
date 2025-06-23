'use server';
/**
 * @fileOverview An AI flow for chatting with NPC customers in the store.
 *
 * - chatWithCustomer - A function that handles the chat conversation.
 * - CustomerChatInput - The input type for the chatWithCustomer function.
 * - CustomerChatOutput - The return type for the chatWithCustomer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerChatInputSchema = z.object({
  userName: z.string().describe("The user's avatar name."),
  npcName: z.string().describe("The name of the NPC the user is talking to."),
  npcPersonality: z.string().describe("A brief description of the NPC's personality and goals."),
  userCart: z.array(z.string()).describe("A list of items in the user's shopping cart."),
  chatHistory: z.array(z.object({
    sender: z.string(),
    message: z.string(),
  })).describe("The previous messages in this conversation."),
  userMessage: z.string().describe("The latest message from the user."),
});
export type CustomerChatInput = z.infer<typeof CustomerChatInputSchema>;

const CustomerChatOutputSchema = z.object({
  response: z.string().describe("The NPC's response to the user's message."),
});
export type CustomerChatOutput = z.infer<typeof CustomerChatOutputSchema>;

export async function chatWithCustomer(input: CustomerChatInput): Promise<CustomerChatOutput> {
  return customerChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerChatPrompt',
  input: {schema: CustomerChatInputSchema},
  output: {schema: CustomerChatOutputSchema},
  prompt: `You are an AI roleplaying as a character in a virtual store.

  Your Character:
  - Name: {{{npcName}}}
  - Personality & Goal: {{{npcPersonality}}}

  The User:
  - Name: {{{userName}}}
  - Their Shopping Cart: {{#if userCart}} {{{userCart}}} {{else}} (empty) {{/if}}

  Scenario:
  You are both shopping in a large retail store like Walmart. The user, {{{userName}}}, has approached you to talk.
  Based on your personality, respond to the user's message. Keep your responses concise and in character (1-3 sentences).
  Do not break character or mention that you are an AI.

  Conversation History:
  {{#each chatHistory}}
  {{this.sender}}: {{this.message}}
  {{/each}}

  New Message:
  {{{userName}}}: {{{userMessage}}}
  
  Your Response (as {{{npcName}}}):
  `,
});

const customerChatFlow = ai.defineFlow(
  {
    name: 'customerChatFlow',
    inputSchema: CustomerChatInputSchema,
    outputSchema: CustomerChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
