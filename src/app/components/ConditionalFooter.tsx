'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on dashboard routes (they have their own footer)
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  
  return <Footer />;
}