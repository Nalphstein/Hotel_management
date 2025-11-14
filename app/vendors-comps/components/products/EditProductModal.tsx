'use client';
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, UploadIcon, ImageIcon } from 'lucide-react';

// Define the Product interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  vendorId: string;
  features?: string[];
}

// Define the props interface
interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (product: Product) => Promise<void>;
  productToEdit: Product;
  categories: string[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onUpdate, productToEdit, categories }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Product>(productToEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // This effect updates the form data whenever a different product is selected for editing
  useEffect(() => {
    // Initialize features array if it doesn't exist
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        features: productToEdit.features ? [...productToEdit.features] : ['']
      });
      // Set preview URL to the existing image
      setPreviewUrl(productToEdit.image);
    }
  }, [productToEdit]);

  useEffect(() => {
    // Revoke the object URL to avoid memory leaks
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  // Handle image file selection and convert to data URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData(prev => ({
          ...prev,
          image: dataUrl // Save data URL as image
        }));
        setPreviewUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: url
    }));
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
        setFormData(prev => ({
          ...prev,
          image: dataUrl // Save data URL as image
        }));
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
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  // Add a new empty feature field
  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  // Remove a feature field
  const removeFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Filter out empty features before saving
      const filteredFeatures = (formData.features || []).filter(feature => feature.trim() !== '');
      const dataToSave: Product = {
        ...formData,
        features: filteredFeatures.length > 0 ? filteredFeatures : undefined
      };
      
      await onUpdate(dataToSave); // Pass the updated data to the parent's update handler
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Error updating product.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><XIcon size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800" required>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800" min="0" step="0.01" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800" min="0" required />
              </div>
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
                  {(formData.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                      />
                      {(formData.features || []).length > 1 && (
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
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium disabled:bg-indigo-400">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;