"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import type { Product } from '@/lib/types';
import Image from 'next/image';

interface ProductDetailsDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailsDialog = ({ product, isOpen, onOpenChange }: ProductDetailsDialogProps) => {
  const { addToCart } = useGame();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>{product.category}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="w-full h-64 relative">
                <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint={product.hint || 'product detail'} />
            </div>
          <p>{product.description}</p>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleAddToCart} className="bg-accent text-accent-foreground hover:bg-accent/90">Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
