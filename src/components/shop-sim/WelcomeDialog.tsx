"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gamepad2, Mic, Move, Mouse, ShoppingCart } from 'lucide-react';

interface WelcomeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog = ({ isOpen, onOpenChange }: WelcomeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Gamepad2 className="h-7 w-7 text-primary" />
            Welcome to ShopSim!
          </DialogTitle>
          <DialogDescription className="pt-2">
            Explore the store, chat with shoppers and the AI assistant, and buy products with your virtual wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
                <div className="rounded-md border bg-muted p-2">
                    <Move className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold">Move</p>
                    <p className="text-muted-foreground">W, A, S, D keys</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="rounded-md border bg-muted p-2">
                    <Mouse className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold">Interact</p>
                    <p className="text-muted-foreground">Click on items & people</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="rounded-md border bg-muted p-2">
                    <Mic className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold">AI Assistant</p>
                    <p className="text-muted-foreground">Use the left panel</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="rounded-md border bg-muted p-2">
                    <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold">View Cart</p>
                    <p className="text-muted-foreground">Use the right panel</p>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Start Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
