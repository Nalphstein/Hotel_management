'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ProductOption {
  id: string;
  label: string;
  value: string;
  priceModifier: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'Food' | 'Gadgets' | 'Services' | 'Supplies' | 'Others';
  rating: number;
  features?: string[];
  options?: {
    colors?: ProductOption[];
    memory?: ProductOption[];
    storage?: ProductOption[];
    sizes?: ProductOption[];
    serviceTypes?: ProductOption[];
    materials?: ProductOption[];
    durations?: ProductOption[];
  };
  selectedOptions?: Record<string, string>;
}

const productDatabase: Record<string, Product> = {
  'jollof-rice': {
    id: 'jollof-rice',
    name: 'Smoky Jollof Rice, drumstick',
    description: 'Enjoy the finest Jollof Rice delivered with seasoned chicken for your savory sweet and savory taste buds. You\'ll be guaranteed!',
    basePrice: 5000,
    image: '/api/placeholder/300/300',
    category: 'Food',
    rating: 4.8,
    options: {
      sizes: [
        { id: 'small', label: 'Small', value: 'Small', priceModifier: 0 },
        { id: 'medium', label: 'Medium', value: 'Medium', priceModifier: 1000 },
        { id: 'large', label: 'Large', value: 'Large', priceModifier: 2000 }
      ]
    }
  }
};

export default function DeliveryPage() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'delivery' | 'payment'>('delivery');
  useEffect(() => {
    const productId = searchParams.get('productId');
    
    if (productId && productDatabase[productId]) {
      const selectedProduct = {...productDatabase[productId]};
      const selectedOptions: Record<string, string> = {};
      
      const possibleOptions = ['color', 'memory', 'storage', 'size', 'serviceType', 'duration', 'material'];
      
      possibleOptions.forEach(optionType => {
        const value = searchParams.get(optionType);
        if (value) {
          const normalizedType = optionType === 'size' ? 'sizes' : 
                                optionType === 'serviceType' ? 'serviceTypes' : 
                                optionType === 'duration' ? 'durations' : 
                                optionType + 's';
          selectedOptions[normalizedType] = value;
        }
      });
      
      selectedProduct.selectedOptions = selectedOptions;
      setProduct(selectedProduct);
      
      let price = selectedProduct.basePrice;
      Object.entries(selectedOptions).forEach(([optionType, optionId]) => {
        const options = selectedProduct.options?.[optionType as keyof typeof selectedProduct.options];
        if (options) {
          const option = options.find(opt => opt.id === optionId);
          if (option) price += option.priceModifier;
        }
      });
      
      setTotalPrice(price);
    }
  }, [searchParams]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePayment = () => {
    alert('Payment processed!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {product && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} (250 reviews)</span>
          </div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          
          {product.selectedOptions && Object.entries(product.selectedOptions).map(([optionType, optionValue]) => {
            const optionLabels: Record<string, string> = {
              sizes: 'Size',
              colors: 'Color',
              memory: 'Memory',
              storage: 'Storage',
              serviceTypes: 'Service Type',
              durations: 'Duration',
              materials: 'Material'
            };
            const label = optionLabels[optionType] || optionType;
            return (
              <div key={optionType} className="mb-2">
                <span className="font-medium">{label}</span>
                <div className="flex gap-2 mt-1">
                  <button className="px-4 py-2 border-2 border-black rounded-full bg-black text-white">
                    {optionValue}
                  </button>
                </div>
              </div>
            );
          })}
          
          <div className="text-2xl font-bold mt-4">₦ {totalPrice.toLocaleString()}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-center">Your Vendor</h2>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full mb-4 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src="/vendor-avatar.jpg"
                  alt="Vendor"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className="font-semibold text-lg mb-2">Chowdeck NG</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">Email Address</p>
                <p>email.example@gmail.com</p>
                <p className="font-medium mt-2">Phone number</p>
                <p>+23400780964367</p>
                <p className="font-medium mt-2">Location</p>
                <p>No 5, Ahemd street, opposite AUN, Jimeta, yola</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('delivery')}
              className={`py-2 px-4 font-medium ${activeTab === 'delivery' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Delivery Address
            </button>
            <button 
              onClick={() => setActiveTab('payment')}
              className={`py-2 px-4 font-medium ${activeTab === 'payment' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Payment Details
            </button>
          </div>

          {/* Delivery Address Tab */}
          <div className={`border rounded-lg p-6 bg-white ${activeTab === 'delivery' ? 'block' : 'hidden'}`}>
            <h3 className="font-semibold text-lg mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campus Name</label>
                <input 
                  type="text" 
                  placeholder="Campus Name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Block</label>
                <input 
                  type="text" 
                  placeholder="Block" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input 
                  type="text" 
                  placeholder="Address" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={handleAddressSubmit}
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors font-medium"
              >
                Confirm Address
              </button>
              <div className="flex items-center">
                <input type="checkbox" id="update-save" className="mr-2 w-4 h-4" />
                <label htmlFor="update-save" className="text-sm text-gray-600">Update Saved Billing Address</label>
              </div>
            </div>
          </div>

          {/* Payment Details Tab */}
          <div className={`border rounded-lg p-6 bg-white ${activeTab === 'payment' ? 'block' : 'hidden'}`}>
            <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}