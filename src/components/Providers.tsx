"use client";

import { GameProvider } from '@/contexts/GameContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GameProvider>
            {children}
        </GameProvider>
    )
}
