'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // All products data - in a real app, this would come from an API
  const allProducts = {
    Food: [
      {
        id: 'jollof-rice',
        name: 'Slow cooked smoky Jollof Rice',
        description: 'Slow cooked smoky jollof rice with rich spices and aroma.',
        price: '₦ 5,000',
        image: '/Jollof_rice.jpg',
        rating: 4.8,
        reviews: 24,
        category: 'Food'
      },
      {
        id: 'grilled-chicken',
        name: 'Grilled Chicken & Rice',
        description: 'Perfectly grilled chicken served with seasoned rice.',
        price: '₦ 4,500',
        image: '/Rectangle_68.png', // Using an actual image from your public folder
        rating: 4.6,
        reviews: 18,
        category: 'Food'
      }
    ],
    Gadgets: [
      {
        id: 'macbook-air-m3',
        name: 'MacBook Air (15 inch, M3 chip)',
        description: 'Lightweight and powerful laptop with M3 chip.',
        price: '₦ 2,700,000',
        image: '/computer-2.jpg',
        rating: 4.8,
        reviews: 32,
        category: 'Gadgets'
      },
      {
        id: 'smartphone-charger',
        name: 'Fast Smartphone Charger',
        description: 'Universal fast charging cable compatible with all devices.',
        price: '₦ 3,500',
        image: '/computer-2.jpg', // Using an actual image from your public folder
        rating: 4.5,
        reviews: 15,
        category: 'Gadgets'
      }
    ],
    Services: [
      {
        id: 'room-cleaning',
        name: 'Room Cleaning Service',
        description: 'Professional hotel room cleaning and maintenance.',
        price: '₦ 8,000',
        image: '/Image.jpg', // Using an actual image from your public folder
        rating: 4.9,
        reviews: 45,
        category: 'Services'
      },
      {
        id: 'laundry-service',
        name: 'Laundry Service',
        description: 'Same-day laundry and dry cleaning service.',
        price: '₦ 5,500',
        image: '/shirt.jpg', // Using an actual image from your public folder
        rating: 4.8,
        reviews: 28,
        category: 'Services'
      }
    ],
    Supplies: [
      {
        id: 'toiletries-kit',
        name: 'Hotel Toiletries Kit',
        description: 'Complete toiletries kit with shampoo, soap, and towels.',
        price: '₦ 2,500',
        image: '/Image.jpg', // Using an actual image from your public folder
        rating: 4.4,
        reviews: 12,
        category: 'Supplies'
      }
    ],
    Others: [
      {
        id: 'city-tour',
        name: 'City Tour Package',
        description: 'Guided tour of local attractions and landmarks.',
        price: '₦ 15,000',
        image: '/computer-2.jpg', // Using an actual image from your public folder
        rating: 4.6,
        reviews: 22,
        category: 'Others'
      }
    ]
  };

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Flatten all products into a single array
        const allProductsArray = Object.values(allProducts).flat();
        
        // Filter products based on search query
        const results = allProductsArray.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(results);
        setIsLoading(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query]);

  // Group results by category
  const groupedResults = searchResults.reduce((acc: Record<string, Product[]>, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          {!isLoading && (
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              We couldn't find any products matching "{query}"
            </p>
            <Link href="/dashboard">
              <button className="bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base">
                Browse all products
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([category, products]) => (
              <div key={category}>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {category} ({products.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-32 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center">
                        {product.image.startsWith('/') ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl sm:text-5xl md:text-6xl">{product.image}</span>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="flex items-center mb-2 sm:mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-xs sm:ml-2 sm:text-sm text-gray-600">({product.reviews})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-gray-900">{product.price}</span>
                          <Link href={`/dashboard/product/${product.id}`}>
                            <button className="bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                              Buy now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}