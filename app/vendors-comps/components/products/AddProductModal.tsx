'use client';
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, ImageIcon, UploadIcon } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getInitialState = () => ({
    name: '',
    category: categories[0] || '',
    price: '',
    stock: '',
    image: '',
    features: [''], // Add features array with one empty feature by default
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState());
      setPreviewUrl(null);
    }
  }, [isOpen, categories]);

  useEffect(() => {
    // Revoke the object URL to avoid memory leaks
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  // Handle image file selection and convert to data URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData({
          ...formData,
          image: dataUrl // Save data URL as image
        });
        setPreviewUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      image: url
    });
    setPreviewUrl(url || null);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData({
          ...formData,
          image: dataUrl // Save data URL as image
        });
        setPreviewUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle changes to features
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  // Add a new empty feature field
  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  // Remove a feature field
  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // --- 2. UPDATED SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create the slug from the product name before submitting
      const slug = slugify(formData.name);

      // Filter out empty features
      const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');

      // Create a complete product object, including the new slug and default values
      const completeProductData = {
        ...formData,
        slug: slug,
        rating: 0,  // Add a default rating
        reviews: 0, // Add a default review count
        features: filteredFeatures.length > 0 ? filteredFeatures : undefined, // Only include features if there are any
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Add New {isService() ? 'Service' : 'Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 p-4">
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
                  Product Image
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                
                {/* URL input as alternative */}
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">
                    Or enter image URL
                  </label>
                  <div className="flex">
                    <input 
                      type="text" 
                      name="image" 
                      value={formData.image} 
                      onChange={handleUrlChange} 
                      placeholder="https://example.com/image.jpg" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" 
                    />
                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                      <ImageIcon size={16} />
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                  <div className="mt-1 h-40 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-contain" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                  </div>
                </div>
              )}
              
              {/* Key Features Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Another Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 p-4 border-t flex-shrink-0">
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