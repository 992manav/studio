'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/avatar-generator.ts';
import '@/ai/flows/customer-chat.ts';
import '@/ai/flows/live-chat.ts';
