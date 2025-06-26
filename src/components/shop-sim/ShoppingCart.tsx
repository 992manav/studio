"use client";

import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ShoppingCartProps {
    onProductClick: (product: Product | number) => void;
}

export const ShoppingCart = ({ onProductClick }: ShoppingCartProps) => {
  const { cart, wallet, updateQuantity, handleCheckout, removeFromCart } = useGame();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCartIcon className="text-primary" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
      </div>
      
      <ScrollArea className="flex-grow pr-4 -mr-4">
        {cart.length > 0 && (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md border" data-ai-hint={item.hint || 'product image'} />
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {cart.length > 0 && (
        <div className="flex-shrink-0 pt-4">
          <Separator />
          <div className="space-y-2 text-lg my-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>Wallet:</span>
              <span className="font-semibold">${wallet.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
            onClick={handleCheckout}
            disabled={total === 0}
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};
