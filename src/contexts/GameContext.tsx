
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import type { CartItem, Product, AvatarConfig } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface GameContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  wallet: number;
  handleCheckout: () => void; // This will navigate
  processTransaction: () => boolean; // This will handle logic
  avatarConfig: AvatarConfig;
  setAvatarConfig: (config: AvatarConfig) => void;
  getProductById: (id: number) => Product | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wallet, setWallet] = useState(500);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ color: '#E54ED0', texture: null });
  const { toast } = useToast();
  const router = useRouter();

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
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
  }, [toast]);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const processTransaction = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const shipping = subtotal > 0 ? 5.99 : 0;
    const finalTotal = subtotal + taxes + shipping;

    if (finalTotal > wallet) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Insufficient funds in your wallet.",
      });
      return false;
    }
    setWallet((prev) => prev - finalTotal);
    setCart([]);
    toast({
      title: "Checkout Successful!",
      description: `You spent $${finalTotal.toFixed(2)}. Your new balance is $${(wallet - finalTotal).toFixed(2)}.`,
    });
    return true;
  }, [cart, wallet, toast]);

  const handleCheckout = useCallback(() => {
      if (cart.length === 0) {
          toast({
              variant: "destructive",
              title: "Cart is empty",
              description: "Please add items to your cart before checking out.",
          });
          return;
      }
      router.push('/checkout');
  }, [cart.length, router, toast]);

  const getProductById = useCallback((id: number): Product | undefined => {
    return allProducts.find(p => p.id === id);
  }, []);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    wallet,
    handleCheckout,
    processTransaction,
    avatarConfig,
    setAvatarConfig,
    getProductById
  }), [cart, wallet, avatarConfig, addToCart, removeFromCart, updateQuantity, clearCart, handleCheckout, processTransaction, getProductById]);


  return (
    <GameContext.Provider value={value}>
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
