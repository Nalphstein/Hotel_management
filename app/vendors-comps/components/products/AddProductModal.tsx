'use client';
import React, { useState, useEffect } from 'react';
import { XIcon, ImageIcon } from 'lucide-react';

// --- Type Definitions for Props ---
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (productData: any) => Promise<void>;
  categories: string[];
}

// --- 1. A HELPER FUNCTION TO CREATE A URL-FRIENDLY SLUG ---
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd, categories }) => {
  const getInitialState = () => ({
    name: '',
    category: categories[0] || '',
    price: '',
    stock: '',
    image: '',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState());
    }
  }, [isOpen, categories]);

  const isService = () => {
    return ['Laundry', 'Home Services', 'Food Delivery'].includes(formData.category);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === 'price' || name === 'stock') ? (value === '' ? '' : Number(value)) : value,
    });
  };

  // --- 2. UPDATED SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create the slug from the product name before submitting
      const slug = slugify(formData.name);

      // Create a complete product object, including the new slug and default values
      const completeProductData = {
        ...formData,
        slug: slug,
        rating: 0,  // Add a default rating
        reviews: 0, // Add a default review count
      };

      // Pass the complete data object to the parent's onAdd function
      await onAdd(completeProductData);
      
      onClose(); // Close the modal on successful submission
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("There was an error adding the product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Add New {isService() ? 'Service' : 'Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isService() ? 'Service Name' : 'Product Name'}
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" required>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" min="0" step="0.01" required />
            </div>
            {!isService() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" min="0" required />
              </div>
            )}
            {isService() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Slots
                </label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" min="0" required />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="flex">
                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" required />
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  <ImageIcon size={16} />
                </span>
              </div>
            </div>
            {formData.image && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                <div className="mt-1 h-40 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium disabled:bg-indigo-400">
              {isSubmitting ? 'Adding...' : `Add ${isService() ? 'Service' : 'Product'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;