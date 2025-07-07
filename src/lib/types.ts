export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  position: [number, number, number];
  size: [number, number, number];
  hint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AvatarConfig {
  color: string;
  texture: string | null;
}

export interface Npc {
  id: number;
  name: string;
  personality: string;
  position: [number, number, number];
  color: string;
  path?: [number, number, number][];
  isEmployee?: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'npc';
  text: string;
  timestamp: number;
}
