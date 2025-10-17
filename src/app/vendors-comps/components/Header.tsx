import React, { useState } from 'react';
import { SearchIcon, BellIcon, UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const Header = () => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <div className="text-indigo-600 mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 14L12 10L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Sellora</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-4 py-2 ${location.pathname === '/' ? 'bg-gray-900 text-white' : 'text-gray-500'} rounded-full font-medium text-sm flex items-center`}>
                <span className="mr-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                Dashboard
              </Link>
              <Link to="/products" className={`px-4 py-2 ${location.pathname === '/products' ? 'bg-gray-900 text-white' : 'text-gray-500'} rounded-full font-medium text-sm flex items-center`}>
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
              <Link to="/orders" className={`px-4 py-2 ${location.pathname === '/orders' ? 'bg-gray-900 text-white' : 'text-gray-500'} rounded-full font-medium text-sm flex items-center`}>
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
            <div className="relative hidden md:block">
              <input type="text" placeholder="Search Anything..." className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <BellIcon size={20} />
            </button>
            <div className="relative">
              <button className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                JD
              </button>
              {showProfileMenu && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowProfileMenu(false)}>
                    Profile
                  </Link>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;