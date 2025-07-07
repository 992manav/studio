"use client";

import { useState } from 'react';
import { ShoppingCart } from '@/components/shop-sim/ShoppingCart';
import { GeminiLiveChat } from '@/components/shop-sim/GeminiLiveChat';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen, ShoppingCart as ShoppingCartIcon, Bot } from 'lucide-react';
import type { Product } from '@/lib/types';
import './RightPanel.css';
import cn from 'classnames';

export default function RightPanel() {
  const [isOpen, setIsOpen] = useState(true);

  const handleProductClick = (product: Product | number) => {
    // This functionality is not needed in the sidebar view.
  };
  
  return (
    <aside className={cn('right-panel', { open: isOpen })}>
      <header className="panel-header">
        <Button
          variant="ghost"
          size="icon"
          className="toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
        <h2 className="panel-title">
            <span>Assistant & Cart</span>
        </h2>
      </header>
      <div className="panel-content flex flex-col h-full overflow-hidden">
        {/* Shopping Cart Section */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ShoppingCartIcon className="h-5 w-5"/> My Cart</h3>
          <div className="max-h-[35vh] md:max-h-60"> {/* Give cart a max height */}
             <ShoppingCart onProductClick={handleProductClick} />
          </div>
        </div>
        
        {/* Gemini Chat Section */}
        <div className="p-4 flex-grow flex flex-col min-h-0">
          <GeminiLiveChat />
        </div>
      </div>
    </aside>
  );
}
