"use client";

import { useGame } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet as WalletIcon } from 'lucide-react';

export const Wallet = () => {
  const { wallet } = useGame();

  return (
    <Card className="bg-primary text-primary-foreground shadow-lg">
      <CardContent className="p-3 flex items-center gap-3">
        <WalletIcon className="h-6 w-6" />
        <div className="text-xl font-bold">${wallet.toFixed(2)}</div>
      </CardContent>
    </Card>
  );
};
