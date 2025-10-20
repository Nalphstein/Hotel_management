'use client';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Adjust path
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config'; // Adjust path

export default function VendorProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isVendor, setIsVendor] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait until Firebase Auth has initialized

    if (!user) {
      router.push('/login'); // If not logged in, redirect to login
      return;
    }

    // User is logged in, now verify their type
    const verifyUserType = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists() && docSnap.data().userType === 'vendor') {
        setIsVendor(true);
      } else {
        // If not a vendor, redirect to the regular user dashboard
        router.push('/dashboard'); 
      }
      setIsVerifying(false);
    };

    verifyUserType();
  }, [user, authLoading, router]);

  if (authLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isVendor) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}