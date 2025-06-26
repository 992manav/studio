"use client";

import React, { useState } from 'react';
import type { Product, Npc, ChatMessage } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';
import { chatWithCustomer } from '@/ai/flows/customer-chat';
import { ThreeScene } from './ThreeScene';
import { ShoppingCart } from './ShoppingCart';
import { ProductDetailsDialog } from './ProductDetailsDialog';
import { Wallet } from './Wallet';
import { AvatarCustomizer } from './AvatarCustomizer';
import { CustomerChatDialog } from './CustomerChatDialog';

export default function ShopSim() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { getProductById, cart } = useGame();
  const { toast } = useToast();

  // Chat state
  const [chattingWith, setChattingWith] = useState<Npc | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  const handleProductClick = (product: Product | number) => {
    const productData = typeof product === 'number' ? getProductById(product) : product;
    if (productData) {
      setSelectedProduct(productData);
    }
  };
  
  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };
  
  const handleNpcClick = (npc: Npc) => {
    setChattingWith(npc);
    setChatHistory([]); // Reset history for new chat
  };

  const handleSendMessage = async (message: string) => {
    if (!chattingWith) return;

    const newHistory: ChatMessage[] = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(newHistory);
    setIsAiReplying(true);

    try {
        const result = await chatWithCustomer({
            userName: 'Player', // Could be customized later
            npcName: chattingWith.name,
            npcPersonality: chattingWith.personality,
            userCart: cart.map(item => item.name),
            chatHistory: newHistory.map(c => ({ sender: c.sender === 'user' ? 'Player' : chattingWith.name, message: c.text })),
            userMessage: message,
        });

        setChatHistory(prev => [...prev, { sender: 'npc', text: result.response }]);
    } catch (e) {
        console.error("Chat API failed:", e);
        toast({
            variant: "destructive",
            title: "Chat Error",
            description: "The other shopper seems busy. Try again later.",
        });
    } finally {
        setIsAiReplying(false);
    }
  };

  return (
    <div className="flex h-full w-full font-body bg-background text-foreground overflow-hidden">
      <div className="flex-1 relative">
        <ThreeScene 
            onProductClick={handleProductClick} 
            onNpcClick={handleNpcClick}
            cart={cart}
        />
        <div className="absolute top-4 left-4 flex items-center gap-4">
          <Wallet />
          <AvatarCustomizer />
        </div>
      </div>
      {/* <aside className="w-[400px] bg-card p-6 border-l border-border flex flex-col shadow-lg z-10">
        <ShoppingCart onProductClick={handleProductClick} />
      </aside> */}
      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDialog();
          }
        }}
      />
      <CustomerChatDialog
        npc={chattingWith}
        isOpen={!!chattingWith}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setChattingWith(null);
            }
        }}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        isAiReplying={isAiReplying}
      />
    </div>
  );
}
