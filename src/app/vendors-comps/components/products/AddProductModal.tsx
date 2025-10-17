import React, { useState } from 'react';
import { XIcon, ImageIcon } from 'lucide-react';
const AddProductModal = ({
  isOpen,
  onClose,
  onAdd,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0] || '',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop'
  });
  const [previewImage, setPreviewImage] = useState(null);
  const isService = () => {
    return ['Laundry', 'Home Services', 'Food Delivery'].includes(formData.category);
  };
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    if (name === 'image' && value) {
      setPreviewImage(value);
    }
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      category: categories[0] || '',
      price: '',
      stock: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop'
    });
    setPreviewImage(null);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
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
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                {categories.map(category => <option key={category} value={category}>
                    {category}
                  </option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="0" step="0.01" required />
            </div>
            {!isService() && <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="0" required />
              </div>}
            {isService() && <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Slots
                </label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="0" required />
              </div>}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="flex">
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  <ImageIcon size={16} />
                </span>
              </div>
            </div>
            {(previewImage || formData.image) && <div className="md:col-span-2">
                <div className="mt-2 h-40 bg-gray-100 rounded-md overflow-hidden">
                  <img src={previewImage || formData.image} alt="Preview" className="w-full h-full object-contain" onError={() => setPreviewImage('https://via.placeholder.com/400x300?text=Image+Not+Found')} />
                </div>
              </div>}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">
              Add {isService() ? 'Service' : 'Product'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddProductModal;