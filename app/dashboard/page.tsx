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
  rating: number;
  reviews: number;
  slug: string;
  isFeatured?: boolean;
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

  const categories = ['Food', 'Gadgets', 'Services', 'Supplies', 'Others'];

  useEffect(() => {
    if (user) {
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const productsRef = collection(db, 'products');
          const featuredQuery = query(productsRef, orderBy("rating", "desc"), limit(1));
          
          const [userDocSnap, featuredSnapshot] = await Promise.all([
            getDoc(userDocRef),
            getDocs(featuredQuery)
          ]);

          if (userDocSnap.exists()) {
            setUserName(userDocSnap.data().username || 'User');
          }

          if (!featuredSnapshot.empty) {
            const doc = featuredSnapshot.docs[0];
            setFeaturedProduct({ id: doc.id, ...doc.data() } as Product);
          }
        } catch (err) {
          console.error("Error fetching initial dashboard data:", err);
          setError('Failed to load essential dashboard data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      setProducts([]);
      try {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, where("category", "==", activeCategory));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(fetchedProducts);
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

          {/* --- CORRECTED DYNAMIC "Highlight of the week" Section --- */}
          {/* This section will now only render if a featuredProduct was actually found. */}
          {featuredProduct && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0 md:pr-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Highlight of the week!</h2>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{featuredProduct.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">{featuredProduct.description}</p>
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
                      <StarRating rating={product.rating} />
                      <span className="ml-2 text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <Link href={`/product/${product.slug}`}>
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