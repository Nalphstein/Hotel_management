import Link from 'next/link';

export default function Navigation() {
  return (
   <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8  rounded-full flex items-center justify-center mr-3">
                <img src="/Frame.svg" alt="Horizon Logo" />
                {/* <span className="text-white text-sm font-bold">H</span> */}
              </div>
              <span className="text-xl font-semibold text-gray-900">Horizon</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact Us</Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">About Us</Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
  );
}