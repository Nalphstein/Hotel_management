'use client';

import React, { useState } from 'react';
import { MoreVerticalIcon, EditIcon, TrashIcon, ShoppingCartIcon, TagIcon, PackageIcon } from 'lucide-react';

// --- Type Definition for a Product ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  vendorId: string; // Make vendorId required to match the Products page
  vendorName?: string; // Add vendorName field
  features?: string[]; // Add features field
  rating?: number; // Average rating from reviews
  reviews?: number; // Total number of reviews
}

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void; // 1. Add an onEdit prop
}

// --- Star Rating Component ---
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

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStockBadgeColor = (stock: number) => {
    if (stock > 50) return 'text-green-600';
    if (stock > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isService = () => {
    return ['Laundry', 'Home Services', 'Food Delivery'].includes(product.category);
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-md text-xs font-medium text-gray-700">
          {product.category}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800 text-lg leading-tight">{product.name}</h3>
            <div className="flex items-center mt-1">
              {isService() ? (
                <span className="inline-flex items-center text-xs text-indigo-600">
                  <PackageIcon size={12} className="mr-1" />
                  Service
                </span>
              ) : (
                <span className={`text-xs ${getStockBadgeColor(product.stock)}`}>
                  {product.stock} in stock
                </span>
              )}
            </div>
            {/* Rating Display */}
            {(product.rating !== undefined && product.rating > 0) && (
              <div className="flex items-center mt-2">
                <StarRating rating={product.rating} />
                <span className="ml-2 text-xs text-gray-600">({product.reviews || 0} reviews)</span>
              </div>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowMenu(!showMenu)}>
              <MoreVerticalIcon size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                {/* 2. Wire up the Edit button to call the onEdit prop */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    onEdit(product); // Pass the entire product object up to the parent
                    setShowMenu(false);
                  }}
                >
                  <EditIcon size={14} className="mr-2" />
                  Edit
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    onDelete(product.id);
                    setShowMenu(false);
                  }}
                >
                  <TrashIcon size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center flex-grow">
          <div className="flex items-center">
            <TagIcon size={16} className="text-gray-400 mr-1" />
            <span className="text-xl font-bold text-gray-800">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center text-sm font-medium transition-colors duration-200">
            <ShoppingCartIcon size={16} className="mr-2" />
            {isService() ? 'View Service' : 'View Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;