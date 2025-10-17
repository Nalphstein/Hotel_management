'use client';
import React, { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the props for the layout component
interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout = ({ children }: VendorLayoutProps) => {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [vendorInitials, setVendorInitials] = useState('JD'); // Default to 'JD' if no name is found
  
  // Extract the vendor section from the pathname
  const isActive = (path: string) => {
    if (path === '/vendor') {
      return pathname === '/vendor';
    }
    return pathname?.startsWith(path);
  };

  // Get vendor initials from user data stored in localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const fullName = `${parsedData.username} ${parsedData.othername}`;
        // Get first two letters of the full name
        const initials = fullName.substring(0, 2).toUpperCase();
        setVendorInitials(initials);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/vendor" className="flex items-center">
                 <div className="w-8 h-8  rounded-full flex items-center justify-center mr-3">
                <img src="/Frame.svg" alt="Horizon Logo" />
                {/* <span className="text-white text-sm font-bold">H</span> */}
              </div>
                <h1 className="text-xl font-bold text-black">Horizon</h1>
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/vendor" 
                  className={`px-4 py-2 ${isActive('/vendor') && !isActive('/vendor/products') && !isActive('/vendor/orders') ? 'bg-gray-900 text-white' : 'text-gray-500'} rounded-full font-medium text-sm flex items-center`}
                >
                  <span className="mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                  Dashboard
                </Link>
                <Link 
                  href="/vendor/products" 
                  className={`px-4 py-2 ${isActive('/vendor/products') ? 'bg-gray-900 text-white' : 'text-gray-500'} rounded-full font-medium text-sm flex items-center`}
                >
                  <span className="mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5C5 6.67157 5.67157 6 6.5 6H17.5C18.3284 6 19 6.67157 19 7.5V19.5C19 20.3284 18.3284 21 17.5 21H6.5C5.67157 21 5 20.3284 5 19.5V7.5Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  Products
                </Link>
                <Link 
                  href="/vendor/orders" 
                  className={`px-4 py-2 ${isActive('/vendor/orders') ? 'bg-gray-900 text-white' : 'text-gray-500'} rounded-full font-medium text-sm flex items-center`}
                >
                  <span className="mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Orders
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
      
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <BellIcon size={20} />
              </button>
              <div className="relative">
                <button 
                  className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {vendorInitials}
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href="/vendor/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-4xl mb-6 mx-auto leading-relaxed">
            Horizon is solely to help you find vendors for anything you desire. Built for students, by students. A safe and trusted community to help you save and earn on campus.
          </p>
          <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-700 pt-6">
            <span className="text-white mt-4"> Horizon.com@gmail.com</span>
            <span className="text-white mt-4">FAQ</span>
            <span className="text-white mt-4"> Horizon 2024. All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VendorLayout;