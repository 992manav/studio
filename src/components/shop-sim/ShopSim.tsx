"use client";

import React, { useState, useCallback } from "react";
import type { Product, Npc, ChatMessage } from "@/lib/types";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import { chatWithCustomer } from "@/ai/flows/customer-chat";
import { ThreeScene } from "./ThreeScene";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { Wallet } from "./Wallet";
import { CustomerChatDialog } from "./CustomerChatDialog";

export default function ShopSim() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { getProductById, cart } = useGame();
  const { toast } = useToast();

  // Chat state
  const [chattingWith, setChattingWith] = useState<Npc | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  const handleProductClick = useCallback(
    (product: Product | number) => {
      const productData =
        typeof product === "number" ? getProductById(product) : product;
      if (productData) {
        setSelectedProduct(productData);
      }
    },
    [getProductById]
  );

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const handleNpcClick = useCallback((npc: Npc) => {
    setChattingWith(npc);
    setChatHistory([]); // Reset history for new chat
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!chattingWith) return;

    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { sender: "user", text: message },
    ];
    setChatHistory(newHistory);
    setIsAiReplying(true);

    try {
      const result = await chatWithCustomer({
        userName: "Player", // Could be customized later
        npcName: chattingWith.name,
        npcPersonality: chattingWith.personality,
        userCart: cart.map((item) => item.name),
        chatHistory: newHistory.map((c) => ({
          sender: c.sender === "user" ? "Player" : chattingWith.name,
          message: c.text,
        })),
        userMessage: message,
      });

      setChatHistory((prev) => [
        ...prev,
        { sender: "npc", text: result.response },
      ]);
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
    <div className="relative h-full w-full font-body bg-background text-foreground overflow-hidden">
      <ThreeScene
        onProductClick={handleProductClick}
        onNpcClick={handleNpcClick}
        cart={cart}
      />
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <Wallet />
      </div>
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
