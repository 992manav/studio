"use client";

import { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { trendingProducts, products as allProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Wand2 } from 'lucide-react';
import type { Product } from '@/lib/types';

interface AiRecommendationsProps {
  onProductClick: (product: Product | number) => void;
}

export const AiRecommendations = ({ onProductClick }: AiRecommendationsProps) => {
  const { cart, addToCart } = useGame();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (cart.length === 0) {
        setRecommendations([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const cartItems = cart.map((item) => item.name);
        const result = await getProductRecommendations({ cartItems, trendingProducts });
        const recommendedProducts = result.recommendedProducts
          .map(name => allProducts.find(p => p.name === name))
          .filter((p): p is Product => !!p);
        setRecommendations(recommendedProducts);
      } catch (e) {
        setError('Could not fetch recommendations.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchRecommendations, 500);
    return () => clearTimeout(debounceTimer);
  }, [cart]);

  return (
    <div className="flex-shrink-0">
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Wand2 className="text-accent" />
        You Might Also Like
      </h3>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && <p className="text-destructive">{error}</p>}
      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-3">
          {recommendations.map(product => (
            <Card key={product.id} className="p-3 flex items-center gap-3 bg-secondary/50">
                <Image src={product.image} alt={product.name} width={48} height={48} className="rounded-md border" data-ai-hint={product.hint || 'product suggestion'} />
              <div className="flex-grow cursor-pointer" onClick={() => onProductClick(product)}>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
              <Button size="sm" onClick={() => addToCart(product)}>Add</Button>
            </Card>
          ))}
        </div>
      )}
      {!loading && !error && recommendations.length === 0 && cart.length > 0 && (
         <p className="text-sm text-muted-foreground">No recommendations right now. Keep shopping!</p>
      )}
       {!loading && !error && recommendations.length === 0 && cart.length === 0 && (
         <p className="text-sm text-muted-foreground">Add items to your cart to get personalized recommendations.</p>
      )}
    </div>
  );
};
