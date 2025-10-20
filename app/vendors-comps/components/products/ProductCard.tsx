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
}

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void; // 1. Add an onEdit prop
}

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