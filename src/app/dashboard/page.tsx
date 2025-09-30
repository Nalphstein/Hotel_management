'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [userName, setUserName] = useState('Mide');
  const [activeCategory, setActiveCategory] = useState('Food');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Check authentication first
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      // Load user preferences from localStorage (simulating backend data)
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
      
      // Simulate user data
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.username || 'Mide');
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load user data');
      setIsLoading(false);
    }
  }, []);

  const categories = ['Food', 'Gadgets', 'Services', 'Supplies', 'Others'];

  const products = {
    Food: [
      {
        id: 'jollof-rice',
        name: 'Slow cooked smoky Jollof Rice',
        description: 'Slow cooked smoky jollof rice with rich spices and aroma.',
        price: '₦ 5,000',
        image: '🍛',
        rating: 4.8,
        reviews: 24
      },
      {
        id: 'grilled-chicken',
        name: 'Grilled Chicken & Rice',
        description: 'Perfectly grilled chicken served with seasoned rice.',
        price: '₦ 4,500',
        image: '🍗',
        rating: 4.6,
        reviews: 18
      }
    ],
    Gadgets: [
      {
        id: 'macbook-air-m3',
        name: 'MacBook Air (15 inch, M3 chip)',
        description: 'Lightweight and powerful laptop with M3 chip.',
        price: '₦ 2,700,000',
        image: '💻',
        rating: 4.8,
        reviews: 32
      },
      {
        id: 'smartphone-charger',
        name: 'Fast Smartphone Charger',
        description: 'Universal fast charging cable compatible with all devices.',
        price: '₦ 3,500',
        image: '🔌',
        rating: 4.5,
        reviews: 15
      }
    ],
    Services: [
      {
        id: 'room-cleaning',
        name: 'Room Cleaning Service',
        description: 'Professional hotel room cleaning and maintenance.',
        price: '₦ 8,000',
        image: '🧹',
        rating: 4.9,
        reviews: 45
      },
      {
        id: 'laundry-service',
        name: 'Laundry Service',
        description: 'Same-day laundry and dry cleaning service.',
        price: '₦ 5,500',
        image: '👔',
        rating: 4.8,
        reviews: 28
      }
    ],
    Supplies: [
      {
        id: 'toiletries-kit',
        name: 'Hotel Toiletries Kit',
        description: 'Complete toiletries kit with shampoo, soap, and towels.',
        price: 'N 2,500',
        image: '🧴',
        rating: 4.4,
        reviews: 12
      }
    ],
    Others: [
      {
        id: 'city-tour',
        name: 'City Tour Package',
        description: 'Guided tour of local attractions and landmarks.',
        price: '₦ 15,000',
        image: '🏛️',
        rating: 4.6,
        reviews: 22
      }
    ]
  };

  const currentProducts = products[activeCategory as keyof typeof products] || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-700">
            Hello {userName},
          </h1>
        </div>

        {/* Highlight of the week */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Highlight of the week!</h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Chowdeck jollof rice</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enjoy the delicious delivery with Chowdeck. Order now!
              </p>
              <div className="mb-4">
                <span className="text-lg font-bold text-gray-900">Starting from ₦ 2500</span>
              </div>
              <Link href="/dashboard/product/jollof-rice">
                <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Get it now!
                </button>
              </Link>
            </div>
            <div className="ml-8">
              <div className="w-48 h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-full flex items-center justify-center">
                <span className="text-6xl">🍛</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex space-x-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-6xl">{product.image}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <Link href={`/dashboard/product/${product.id}`}>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                      Buy now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state for categories with no products */}
        {currentProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600">Products in the {activeCategory} category will appear here.</p>
          </div>
        )}
      </div>
    </>
  );
}