'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string>;
  vendorId?: string; // Add vendorId as optional
  vendorName?: string; // Add vendorName as optional
}

type CheckoutContextType = {
  item: CheckoutItem | null;
  initiateCheckout: (item: CheckoutItem) => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [item, setItem] = useState<CheckoutItem | null>(null);
  const router = useRouter();

  const initiateCheckout = (checkoutItem: CheckoutItem) => {
    setItem(checkoutItem);
    router.push('/dashboard/checkout'); // Redirect to the checkout page
  };

  return (
    <CheckoutContext.Provider value={{ item, initiateCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};