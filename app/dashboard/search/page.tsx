'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { db } from '../../../lib/firebase/config';
import { collection, query as firestoreQuery, where, getDocs } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
}

// Client-only component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const productsRef = collection(db, 'products');
          const searchTerm = query.toLowerCase();
          const q = firestoreQuery(productsRef, where('searchKeywords', 'array-contains', searchTerm));
          
          const querySnapshot = await getDocs(q);
          
          const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching products:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const groupedResults = searchResults.reduce((acc: Record<string, Product[]>, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-600 text-base sm:text-lg">
          No products found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedResults).map(([category, products]) => (
        <div key={category}>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            {category} ({products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
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
  );
}

// Loading fallback component
function SearchLoading() {
  return (
    <div className="flex justify-center items-center h-48 sm:h-64">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense fallback={<SearchLoading />}>
          <SearchContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}