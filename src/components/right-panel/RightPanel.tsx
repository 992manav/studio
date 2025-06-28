"use client";

import { useState } from 'react';
import { ShoppingCart } from '@/components/shop-sim/ShoppingCart';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import type { Product } from '@/lib/types';
import './RightPanel.css';
import cn from 'classnames';

export default function RightPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const handleProductClick = (product: Product | number) => {
    // This functionality is not needed in the sidebar view.
  };
  
  return (
    <div className={cn('right-panel', { open: isOpen })}>
      <div className="panel-header">
        <Button
          variant="ghost"
          size="icon"
          className="toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
        <h2 className="panel-title">
            <ShoppingCartIcon className="h-5 w-5" />
            <span>My Cart</span>
        </h2>
      </div>
      <div className="panel-content">
        <ShoppingCart onProductClick={handleProductClick} />
      </div>
    </div>
  );
}
