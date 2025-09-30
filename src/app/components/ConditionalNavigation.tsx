'use client';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

const ConditionalNavigation = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  
  if (isDashboard) {
    return null;
  }
  
  return <Navigation />;
};

export default ConditionalNavigation;