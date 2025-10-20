'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 1. Import Firebase, ProtectedRoute, and define the Product type correctly
import ProtectedRoute from '../../components/ProtectedRoute'; // Adjust path
import { db } from '../../../lib/firebase/config';
import { collection, query as firestoreQuery, where, getDocs } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Use number for price
  image: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. useEffect to query Firestore
  useEffect(() => {
    // Only search if there's a query string
    if (query) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const productsRef = collection(db, 'products');
          // Firestore queries are case-sensitive, so we search with a lowercase version of the query
          const searchTerm = query.toLowerCase();

          // Use the 'array-contains' query to find products where the searchTerm
          // exists within the searchKeywords array.
          const q = firestoreQuery(productsRef, where('searchKeywords', 'array-contains', searchTerm));
          
          const querySnapshot = await getDocs(q);
          
          const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          
          setSearchResults(results);

        } catch (error) {
          console.error("Error searching products:", error);
          // Optionally set an error state to show to the user
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    } else {
      // If there's no query, clear results and stop loading
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query]); // Re-run the search whenever the query parameter changes

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  // Group results by category (this logic remains the same)
  const groupedResults = searchResults.reduce((acc: Record<string, Product[]>, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // 3. Wrap the entire component in ProtectedRoute
  return (
    <ProtectedRoute>
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
            {/* ... No results UI ... */}
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
                      {/* ... Product card JSX ... */}
                      <div className="p-3 sm:p-4">
                        {/* ... */}
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                          {/* Use product.slug for a clean URL */}
                          <Link href={`/product/${product.slug}`}>
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
    </ProtectedRoute>
  );
}