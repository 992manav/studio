"use client";

import React, { useState } from 'react';
import type { Product } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';
import { ThreeScene } from './ThreeScene';
import { ShoppingCart } from './ShoppingCart';
import { ProductDetailsDialog } from './ProductDetailsDialog';
import { Wallet } from './Wallet';
import { AvatarCustomizer } from './AvatarCustomizer';

export default function ShopSim() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { getProductById, cart } = useGame();

  const handleProductClick = (product: Product | number) => {
    const productData = typeof product === 'number' ? getProductById(product) : product;
    if (productData) {
      setSelectedProduct(productData);
    }
  };
  
  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex h-screen w-full font-body bg-background text-foreground overflow-hidden">
      <main className="flex-1 relative">
        <ThreeScene onProductClick={handleProductClick} cart={cart} />
        <div className="absolute top-4 left-4 flex items-center gap-4">
          <Wallet />
          <AvatarCustomizer />
        </div>
      </main>
      <aside className="w-[400px] bg-card p-6 border-l border-border flex flex-col gap-6 shadow-lg z-10">
        <ShoppingCart onProductClick={handleProductClick} />
      </aside>
      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDialog();
          }
        }}
      />
    </div>
  );
}
