export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  position: [number, number, number];
  size: [number, number, number];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AvatarConfig {
  color: string;
  texture: string | null;
}
