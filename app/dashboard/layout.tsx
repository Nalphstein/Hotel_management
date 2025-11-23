'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// --- Firebase and Context Imports ---
import { useAuth } from '../../context/AuthContext'; // Hook to get the current user
import { signOut } from 'firebase/auth'; // Firebase's sign out function
import { auth, db } from '../../lib/firebase/config'; // Your Firebase config
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'; // Firestore functions

// --- Component Imports ---
import Footer from '../components/Footer'; // Make sure the path is correct

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the authenticated user from our global context
  const { user } = useAuth(); 
  
  // Next.js hooks for navigation and path detection
  const router = useRouter();
  const pathname = usePathname();

  // Component state
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu

  // Effect hook to fetch user data and set up real-time listeners
  useEffect(() => {
    // Only run this logic if the user object is available from the AuthContext
    if (user) {
      // 1. Fetch the user's name from their Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          // Set the username from the document data, with a fallback
          setUserName(docSnap.data().username || 'User');
        }
      });

      // 2. Set up a real-time listener for unread notifications
      const notificationsCollection = collection(db, 'users', user.uid, 'notifications');
      const q = query(notificationsCollection, where('read', '==', false));
      
      // onSnapshot listens for changes. It fires once initially, and then every
      // time the query results change (e.g., a new notification is added).
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // The number of unread notifications is the number of documents in the result
        setUnreadNotifications(querySnapshot.size);
      });

      // 3. Cleanup function: This is crucial to prevent memory leaks.
      // It detaches the listener when the component is unmounted.
      return () => unsubscribe();
    }
  }, [user]); // This effect re-runs whenever the `user` object changes

  // Handles the user logout process securely
  const handleLogout = async () => {
    try {
      await signOut(auth); // Use Firebase's signOut function
      router.push('/'); // Redirect to the homepage after successful logout
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Handles the search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Shared Dashboard Header */};
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <img src="/Frame.svg" alt="Horizon Logo" className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">Horizon</span>
            </Link>
            
            {/* Hamburger Menu Button (Mobile) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex-1 md:max-w-lg mx-4 sm:mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search products, services...'
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
            
            {/* Navigation Icons & Links - Desktop */}
            <div className="hidden md:flex items-center space-x-4 sm:space-x-6">
              <Link 
                href="/dashboard" 
                className={`text-gray-600 hover:text-gray-900 text-sm sm:text-base ${pathname === '/dashboard' ? 'text-gray-900 font-medium' : ''}`}
              >
                <span className="hidden sm:inline">Home</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </Link>
          
              <Link 
                href="/dashboard/help" 
                className={`text-gray-600 hover:text-gray-900 text-sm sm:text-base ${pathname === '/dashboard/help' ? 'text-gray-900 font-medium' : ''}`}
              >
                <span className="hidden sm:inline">Help</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </Link>
              <Link 
                href="/dashboard/profile" 
                className={`text-gray-600 hover:text-gray-900 text-sm sm:text-base ${pathname === '/dashboard/profile' ? 'text-gray-900 font-medium' : ''}`}
              >
                <span className="hidden sm:inline">Profile</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
              <Link 
                href="/dashboard/notifications" 
                className={`text-gray-600 hover:text-gray-900 relative ${pathname === '/dashboard/notifications' ? 'text-gray-900 font-medium' : ''}`}
                title="Notifications"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17v2a2 2 0 002 2h6m-6-4V9a2 2 0 012-2h6" /></svg>
                {/* Notification Badge: Renders only if there are unread notifications */}
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Search Bar - Mobile */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search products, services...'
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>
              
              {/* Navigation Links - Mobile */}
              <Link 
                href="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard' ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dashboard/help" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard/help' ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <Link 
                href="/dashboard/profile" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard/profile' ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/dashboard/notifications" 
                className={`block px-3 py-2 rounded-md text-base font-medium relative ${pathname === '/dashboard/notifications' ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Notifications
                {unreadNotifications > 0 && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content Rendered Here */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Shared Footer */}
      <Footer />
    </div>
  );
}