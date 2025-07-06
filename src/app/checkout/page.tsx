"use client";

import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { cart, wallet, processTransaction } = useGame();
  const router = useRouter();
  
  // Redirect to home if cart is empty after initial mount
  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/');
    }
  }, [cart, router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + taxes + shipping;
  const discount = 0; // Placeholder for discount logic

  const handlePlaceOrder = () => {
    const success = processTransaction();
    if (success) {
      router.push('/');
    }
  };

  if (cart.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
            <ShoppingCart className="w-16 h-16 text-primary mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Redirecting you to the store...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-foreground">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold cursor-pointer" onClick={() => router.push('/')}>ShopSim</h1>
          <Button variant="ghost" onClick={() => router.push('/')}>Back to Store</Button>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span>1</span>
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Anytown" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="12345" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span>2</span>
                  <span>Payment Method</span>
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="credit-card" className="space-y-4">
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-grow flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-6 h-6" /> Credit/Debit Card
                    </Label>
                  </div>
                  <div className="p-4 space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="•••• •••• •••• 1234" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="card-name">Name on Card</Label>
                            <Input id="card-name" placeholder="John M Doe" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="expiry">Expiration</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                        </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4 opacity-50 cursor-not-allowed">
                    <RadioGroupItem value="paypal" id="paypal" disabled />
                    <Label htmlFor="paypal" className="flex-grow cursor-not-allowed">PayPal</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-4 pr-3 -mr-3">
                    {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md border bg-white" data-ai-hint={item.hint || 'product image'}/>
                        <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes</span>
                        <span>${taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                </div>
                <Separator />
                 <div className="flex justify-between text-lg font-bold">
                  <span>Order total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-primary font-semibold">
                  <span>Wallet Balance</span>
                  <span>${wallet.toFixed(2)}</span>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={handlePlaceOrder} disabled={total > wallet}>
                    {total > wallet ? 'Insufficient Funds' : 'Place Order'}
                 </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
