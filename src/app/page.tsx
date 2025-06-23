import { GameProvider } from '@/contexts/GameContext';
import ShopSim from '@/components/shop-sim/ShopSim';

export default function Home() {
  return (
    <GameProvider>
      <ShopSim />
    </GameProvider>
  );
}
