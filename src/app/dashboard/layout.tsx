'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '../components/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('Mide');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.username || 'Mide');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page with query parameter
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <img src="/Frame.svg" alt="Horizon Logo" className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">Horizon</span>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-4 sm:mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search...'
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
            
            {/* Navigation Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link 
                href="/dashboard" 
                className={`text-gray-600 hover:text-gray-900 text-sm sm:text-base ${pathname === '/dashboard' ? 'text-gray-900 font-medium' : ''}`}
              >
                <span className="hidden sm:inline">Home</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
          
              <Link 
                href="/dashboard/help" 
                className={`text-gray-600 hover:text-gray-900 text-sm sm:text-base ${pathname === '/dashboard/help' ? 'text-gray-900 font-medium' : ''}`}
              >
                <span className="hidden sm:inline">Help</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
              <Link 
                href="/dashboard/profile" 
                className={`text-gray-600 hover:text-gray-900 text-sm sm:text-base ${pathname === '/dashboard/profile' ? 'text-gray-900 font-medium' : ''}`}
              >
                <span className="hidden sm:inline">Profile</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link 
                href="/dashboard/notifications" 
                className={`text-gray-600 hover:text-gray-900 relative ${pathname === '/dashboard/notifications' ? 'text-gray-900 font-medium' : ''}`}
                title="Notifications"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17v2a2 2 0 002 2h6m-6-4V9a2 2 0 012-2h6" />
                </svg>
                {/* Notification Badge */}
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
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {children}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}