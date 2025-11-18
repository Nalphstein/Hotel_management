'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

// --- Type Definitions for Data Integrity ---
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number; // Marked as optional to handle data that might be missing the field
  reviews?: number; // Marked as optional
  slug?: string; // Make slug optional since we filter for it
  isFeatured?: boolean;
  vendorId?: string; // Add vendorId to product type
  vendorName?: string; // Add vendorName field
};

// --- Reusable Star Rating Component ---
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [activeCategory, setActiveCategory] = useState('Food');
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendorNames, setVendorNames] = useState<Record<string, string>>({}); // Store vendor names

  const categories = ['Food', 'Gadgets', 'Services', 'Supplies', 'Others'];

  // --- Effect to fetch initial page data (user name AND featured product) ---
  useEffect(() => {
    if (user) {
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          // Define references for both queries
          const userDocRef = doc(db, 'users', user.uid);
          const productsRef = collection(db, 'products');

          // The query to automatically find the product with the highest 'rating'.
          const featuredQuery = query(productsRef, orderBy("rating", "desc"), limit(1));
          
          // Use Promise.all to run both fetches concurrently for better performance
          const [userDocSnap, featuredSnapshot] = await Promise.all([
            getDoc(userDocRef),
            getDocs(featuredQuery)
          ]);

          // Process the user's name
          if (userDocSnap.exists()) {
            setUserName(userDocSnap.data().username || 'User');
          }

          // Process the featured product result
          if (!featuredSnapshot.empty) {
            const doc = featuredSnapshot.docs[0];
            const productData: any = { id: doc.id, ...doc.data() };
            // Safeguard: only set the featured product if it has a slug
            if (productData.slug !== undefined) {
              setFeaturedProduct(productData as Product);
            }
          }
        } catch (err: any) {
          console.error("Error fetching initial dashboard data:", err);
          // Pro-Tip: Check the console for an error message asking to create an index!
          // This query (`orderBy('rating')`) requires a single-field index on the 'rating' field.
          // Firestore usually prompts you to create this automatically.
          setError('Failed to load essential dashboard data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [user]);

  // Effect to fetch products whenever the active category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      setProducts([]);
      try {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, where("category", "==", activeCategory));
        const querySnapshot = await getDocs(q);
        
        // First, map the documents without type casting
        const rawData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Then filter and cast to Product type
        const fetchedProducts = rawData.filter(p => 'slug' in p && p.slug !== undefined) as Product[];
        
        setProducts(fetchedProducts);
        
        // Use stored vendor names if available, otherwise fetch them
        const vendorNamesMap: Record<string, string> = {};
        
        // First, use all stored vendor names
        for (const product of fetchedProducts) {
          if (product.vendorId && product.vendorName) {
            vendorNamesMap[product.vendorId] = product.vendorName;
          }
        }
        
        // Then, fetch missing vendor names (for older products without stored vendorName)
        const vendorIdsToFetch = fetchedProducts
          .filter(p => p.vendorId && !p.vendorName)
          .map(p => p.vendorId) as string[];
        
        // Remove duplicates
        const uniqueVendorIds = [...new Set(vendorIdsToFetch)];
        
        for (const vendorId of uniqueVendorIds) {
          try {
            const vendorDoc = await getDoc(doc(db, 'users', vendorId));
            if (vendorDoc.exists()) {
              vendorNamesMap[vendorId] = vendorDoc.data().username || 'Unknown Vendor';
            }
          } catch (error) {
            console.error(`Error fetching vendor ${vendorId}:`, error);
          }
        }
        
        setVendorNames(vendorNamesMap);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to load products.');
      } finally {
        setIsProductsLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };
  
  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Greeting */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-normal text-gray-700">Hello {userName},</h1>
          </div>

          {/* Dynamic "Highlight of the week" Section */}
          {featuredProduct && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0 md:pr-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Highlight of the week!</h2>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{featuredProduct.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">{featuredProduct.description}</p>
                  {/* Vendor name with blue tick for featured product */}
                  {featuredProduct.vendorId && vendorNames[featuredProduct.vendorId] && (
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-gray-600">Sold by </span>
                      <span className="text-sm font-medium text-gray-900 ml-1">{vendorNames[featuredProduct.vendorId]}</span>
                      {/* Blue tick verification badge */}
                      <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Starting from {formatPrice(featuredProduct.price)}</span>
                  </div>
                  <Link href={`/product/${featuredProduct.slug}`}>
                    <button className="bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      Get it now!
                    </button>
                  </Link>
                </div>
                <div className="md:ml-8 mt-4 md:mt-0 flex justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
                    <img src={featuredProduct.image} alt={featuredProduct.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full transition-colors text-sm sm:text-base ${
                  activeCategory === category
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid Section */}
          {isProductsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">There are no products available in the {activeCategory} category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100">
                    <Link href={`/product/${product.slug}`}><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></Link>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center mb-3">
                      <StarRating rating={product.rating || 0} />
                      <span className="ml-2 text-sm text-gray-500">({product.reviews || 0} reviews)</span>
                    </div>
                    {/* Vendor name with blue tick */}
                    {product.vendorId && vendorNames[product.vendorId] && (
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-gray-600">Sold by </span>
                        <span className="text-sm font-medium text-gray-900 ml-1">{vendorNames[product.vendorId]}</span>
                        {/* Blue tick verification badge */}
                        <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <Link href={`/dashboard/product/${product.slug}`}>
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          Buy now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}