"use client";

import ShopSim from "@/components/shop-sim/ShopSim";
import RightPanel from "@/components/right-panel/RightPanel";
import SidePanel from "@/components/side-panel/SidePanel";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidePanel />
      <main className="flex-1 relative">
        <ShopSim />
      </main>
      <RightPanel />
    </div>
  );
}
