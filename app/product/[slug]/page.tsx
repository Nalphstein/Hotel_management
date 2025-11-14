'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// --- Imports for Firebase, Authentication, and Checkout ---
import ProtectedRoute from '../../components/ProtectedRoute'; 
import { useCheckout } from '../../../context/CheckoutContext'; // Hook to initiate the checkout flow
import { db } from '../../../lib/firebase/config';      
import { collection, query, where, getDocs, limit, doc, getDoc, DocumentData } from 'firebase/firestore';

// --- Type Definitions for Data Integrity ---
// This ensures our code is type-safe and matches our Firestore data model.
interface ProductOption {
  id: string;
  label: string;
  priceModifier: number;
}

interface Product {
  id: string; // The Firestore document ID
  slug: string; // The URL-friendly identifier
  name: string;
  description: string;
  price: number; // Stored as a number for calculations
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  features?: string[]; // Marked as optional for data safety
  options?: {
    [key: string]: ProductOption[]; // Allows for various option types (colors, sizes, etc.)
  };
  vendorId?: string; // Add vendorId to product type
}

// Define the structure of vendor data
interface VendorData {
  username: string;
  // Add other vendor fields as needed
}

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params?.slug as string;
  
  const { initiateCheckout } = useCheckout(); // Get the function to start the checkout process

  // --- State Management ---
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [vendorName, setVendorName] = useState<string>(''); // Store vendor name

  // --- Data Fetching Effect ---
  // Fetches the specific product from Firestore based on the 'slug' from the URL
  useEffect(() => {
    if (!productSlug) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where("slug", "==", productSlug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0];
          const productData = { id: productDoc.id, ...productDoc.data() } as Product;
          setProduct(productData);
          
          // Use stored vendor name if available, otherwise fetch it
          if (productData.vendorId) {
            if (productData.vendorName) {
              setVendorName(productData.vendorName);
            } else {
              try {
                const vendorDoc = await getDoc(doc(db, 'users', productData.vendorId));
                if (vendorDoc.exists()) {
                  const vendorData = vendorDoc.data() as VendorData;
                  setVendorName(vendorData.username || 'Unknown Vendor');
                }
              } catch (error) {
                console.error("Error fetching vendor name:", error);
              }
            }
          }
          
          // Initialize default option selections for the product
          const initialOptions: Record<string, string> = {};
          if (productData.options) {
            Object.entries(productData.options).forEach(([optionType, options]) => {
              if (options && options.length > 0) {
                initialOptions[optionType] = options[0].id;
              }
            });
          }
          setSelectedOptions(initialOptions);
        } else {
          setProduct(null); // Set to null if no product is found with that slug
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  // --- Helper Functions ---

  // Calculates the final price based on the base price and any selected options
  const calculatePrice = (): number => {
    if (!product) return 0;
    // Use `price` for consistency
    if (!product.options) return product.price;
    
    let totalPrice = product.price;
    
    Object.entries(selectedOptions).forEach(([optionType, selectedId]) => {
      const optionGroup = product.options?.[optionType as keyof typeof product.options];
      if (optionGroup) {
        const selectedOption = optionGroup.find(opt => opt.id === selectedId);
        if (selectedOption) {
          totalPrice += selectedOption.priceModifier;
        }
      }
    });
    
    return totalPrice;
  };

  // Updates the state when a user selects a different product option
  const handleOptionChange = (optionType: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionType]: optionId }));
  };
  
  // Formats a number into Nigerian Naira currency string
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const optionLabels: Record<string, string> = {
    colors: 'Colour', memory: 'Memory', storage: 'Storage', sizes: 'Size',
    serviceTypes: 'Service Type', materials: 'Material', durations: 'Duration'
  };

  // --- "Buy Now" Handler ---
  const handleBuyNow = () => {
    if (!product) return;

    // Assemble the item details for the checkout context
    const checkoutItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: calculatePrice(), // Use the final calculated price
      quantity: 1,
      selectedOptions: selectedOptions,
    };

    // Trigger the global checkout process
    initiateCheckout(checkoutItem);
  };
  
  // Renders a block of selectable product options
  const renderOptionSection = (optionType: string, options: ProductOption[], label: string) => {
    return (
      <div key={optionType}>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">{label}</h3>
        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionChange(optionType, option.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                selectedOptions[optionType] === option.id
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
              {option.priceModifier > 0 && (
                <span className="ml-1 text-xs sm:text-sm text-gray-500">(+{formatPrice(option.priceModifier)})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- Conditional Rendering for Loading and Not Found States ---

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-center p-4 bg-gray-50">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you are looking for does not exist or may have been moved.</p>
            <Link href="/dashboard" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-medium">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 sm:mb-6">
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
              <span>›</span>
              <Link href="/dashboard" className="hover:text-gray-700">{product.category}</Link>
              <span>›</span>
              <span className="text-gray-900 truncate max-w-[100px] sm:max-w-none">{product.name}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Product Image */}
            <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-auto object-contain max-h-[400px]" />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description}</p>
              </div>

              {/* Vendor name with blue tick */}
              {vendorName && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Sold by </span>
                  <span className="text-sm font-medium text-gray-900 ml-1">{vendorName}</span>
                  {/* Blue tick verification badge */}
                  <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Dynamic Options Rendering */}
              {product.options && (
                <div className="space-y-6">
                  {Object.entries(product.options).map(([optionType, options]) => 
                    options && options.length > 0 ? 
                      renderOptionSection(optionType, options, optionLabels[optionType] || optionType) 
                      : null
                  )}
                </div>
              )}

              {/* Price and Buy Button */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formatPrice(calculatePrice())}
                  </div>
                  <button
                    onClick={handleBuyNow} // This button now starts the checkout process
                    className="bg-gray-800 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Buy now
                  </button>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 text-sm mt-1">•</span>
                      <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                  {(!product.features || product.features.length === 0) && (
                      <li className="text-sm text-gray-500">No key features listed.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}