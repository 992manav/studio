
"use client";

import { useState, useCallback } from "react";
import ShopSim from "@/components/shop-sim/ShopSim";
import RightPanel from "@/components/right-panel/RightPanel";
import SidePanel from "@/components/side-panel/SidePanel";
import { WelcomeDialog } from "@/components/shop-sim/WelcomeDialog";

export default function Home() {
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);
  const [isWelcomeOpen, setWelcomeOpen] = useState(true);

  // Memoize the callback to prevent it from being a new function on every render
  const handleCheckoutCounterClick = useCallback(() => {
    setRightPanelOpen((o) => !o);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <WelcomeDialog isOpen={isWelcomeOpen} onOpenChange={setWelcomeOpen} />
      <SidePanel />
      <div className="flex-1 relative">
        <main className="w-full h-full">
          <ShopSim onCheckoutCounterClick={handleCheckoutCounterClick} />
        </main>
        <RightPanel isOpen={isRightPanelOpen} setIsOpen={setRightPanelOpen} />
      </div>
    </div>
  );
}
