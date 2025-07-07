"use client";

import ShopSim from "@/components/shop-sim/ShopSim";
import RightPanel from "@/components/right-panel/RightPanel";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <main className="flex-1 relative">
        <ShopSim />
      </main>
      <RightPanel />
    </div>
  );
}
