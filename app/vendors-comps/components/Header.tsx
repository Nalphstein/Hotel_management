'use client';
import React, { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, UserIcon } from 'lucide-react';

// 1. Import Next.js routing hooks and Link component
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// 2. Import Firebase and Authentication hooks/functions
import { useAuth } from '../../../context/AuthContext'; // Adjust path
import { auth, db } from '../../../lib/firebase/config';   // Adjust path
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const Header = () => {
  const { user } = useAuth(); // Get the current authenticated user
  const pathname = usePathname(); // Next.js hook for the current path
  const router = useRouter();   // Next.js hook for navigation

  // --- State Management ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Effect to fetch user-specific data (name, notifications)
  useEffect(() => {
    if (user) {
      // --- Fetch user's name ---
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setUserName(docSnap.data().username || '');
        }
      });

      // --- Listen for real-time unread notifications ---
      const notifsRef = collection(db, 'users', user.uid, 'notifications');
      const q = query(notifsRef, where('isRead', '==', false));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUnreadNotifications(snapshot.size);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, [user]);

  // 4. Secure logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // 5. Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendor/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/vendor" className="flex items-center">
              {/* ... Logo SVG ... */}
              <h1 className="text-xl font-bold text-gray-800">Sellora</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {/* 6. Use Next.js Link and pathname for active styles */}
              <Link href="/vendor" className={`px-4 py-2 ${pathname === '/vendor' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'} rounded-full font-medium text-sm flex items-center`}>
                {/* ... Dashboard Icon ... */}
                Dashboard
              </Link>
              <Link href="/vendor/products" className={`px-4 py-2 ${pathname === '/vendor/products' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'} rounded-full font-medium text-sm flex items-center`}>
                {/* ... Products Icon ... */}
                Products
              </Link>
              <Link href="/vendor/orders" className={`px-4 py-2 ${pathname === '/vendor/orders' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'} rounded-full font-medium text-sm flex items-center`}>
                {/* ... Orders Icon ... */}
                Orders
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />
              <div className="absolute left-3 top-2.5 text-gray-400"><SearchIcon size={16} /></div>
            </form>
            
            {/* 7. Dynamic Notification Bell */}
            <Link href="/vendor/notifications" className="relative p-2 text-gray-500 hover:text-gray-700">
              <BellIcon size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            
            <div className="relative">
              {/* 8. Dynamic Profile Button */}
              <button
                className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {userName ? getInitials(userName) : <UserIcon size={16} />}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/vendor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowProfileMenu(false)}>
                    Profile
                  </Link>
                  {/* 9. Secure Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;