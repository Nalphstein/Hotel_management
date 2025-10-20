'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation' in App Router
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We wait until loading is false before we check if a user exists.
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [user, loading, router]);

  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is authenticated, render the page content
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading, the useEffect will handle the redirect.
  // Return null or a loading spinner to prevent flashing of content.
  return null;
};

export default ProtectedRoute;