"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, Product, AvatarConfig } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  wallet: number;
  handleCheckout: () => void;
  avatarConfig: AvatarConfig;
  setAvatarConfig: (config: AvatarConfig) => void;
  getProductById: (id: number) => Product | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wallet, setWallet] = useState(500);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ color: '#FFA52A', texture: null });
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    toast({
      title: "Item Added",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };
  
  const clearCart = () => {
    setCart([]);
  }

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total > wallet) {
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: "Insufficient funds in your wallet.",
      });
      return;
    }
    setWallet((prev) => prev - total);
    setCart([]);
    toast({
      title: "Checkout Successful!",
      description: `You spent $${total.toFixed(2)}. Your new balance is $${(wallet - total).toFixed(2)}.`,
    });
  };

  const getProductById = (id: number): Product | undefined => {
    return allProducts.find(p => p.id === id);
  };

  return (
    <GameContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wallet,
        handleCheckout,
        avatarConfig,
        setAvatarConfig,
        getProductById
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
