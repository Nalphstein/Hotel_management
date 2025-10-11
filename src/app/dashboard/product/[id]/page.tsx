'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  features: string[];
  // Dynamic options based on category
  options?: {
    colors?: ProductOption[];
    memory?: ProductOption[];
    storage?: ProductOption[];
    sizes?: ProductOption[];
    serviceTypes?: ProductOption[];
    materials?: ProductOption[];
    durations?: ProductOption[];
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Comprehensive product database with category-specific options
  const productDatabase: Record<string, Product> = {
    // FOOD PRODUCTS - Size-based pricing
    'jollof-rice': {
      id: 'jollof-rice',
      name: 'Smoky Jollof Rice, drumstick',
      description: 'Enjoy the finest Jollof Rice delivered with seasoned chicken for your savory sweet and savory taste buds. You\'ll be guaranteed!',
      basePrice: 5000,
      image: '/api/placeholder/300/300',
      category: 'Food',
      rating: 4.8,
      features: [
        'Rice served with Rice',
        'Rice with sauce', 
        'Excellent in Quality'
      ],
      options: {
        sizes: [
          { id: 'small', label: 'Small', value: 'Small', priceModifier: 0 },
          { id: 'medium', label: 'Medium', value: 'Medium', priceModifier: 1000 },
          { id: 'large', label: 'Large', value: 'Large', priceModifier: 2000 }
        ]
      }
    },
    'grilled-chicken': {
      id: 'grilled-chicken',
      name: 'Grilled Chicken & Rice',
      description: 'Perfectly grilled chicken served with seasoned rice and vegetables.',
      basePrice: 4500,
      image: '/api/placeholder/300/300',
      category: 'Food',
      rating: 4.6,
      features: [
        'Grilled to perfection',
        'Served with seasoned rice',
        'Fresh vegetables included'
      ],
      options: {
        sizes: [
          { id: 'small', label: 'Small', value: 'Small', priceModifier: 0 },
          { id: 'medium', label: 'Medium', value: 'Medium', priceModifier: 800 },
          { id: 'large', label: 'Large', value: 'Large', priceModifier: 1500 }
        ]
      }
    },
    
    // GADGETS PRODUCTS - Color, Memory, Storage-based pricing
    'macbook-air-m3': {
      id: 'macbook-air-m3',
      name: 'MacBook Air (15 inch, M3 chip)',
      description: 'The MacBook Air with M3 CPU chip brings extraordinary performance and efficiency to the most portable Mac laptop. With groundbreaking performance per watt, it\'s the perfect combination for ultra-thin design and incredible power.',
      basePrice: 2700000,
      image: '/api/placeholder/400/300',
      category: 'Gadgets',
      rating: 4.8,
      features: [
        '15.3-inch Liquid Retina display with True Tone',
        'Apple M3 chip with 8-core CPU',
        'Works Great with iPhone and iPad',
        'All-day battery life',
        'Six speakers with force-canceling woofers',
        'Three-mic array with directional beamforming',
        'Four Thunderbolt 4 ports'
      ],
      options: {
        colors: [
          { id: 'silver', label: 'Silver', value: 'Silver', priceModifier: 0 },
          { id: 'spacegray', label: 'Space Gray', value: 'Space Gray', priceModifier: 0 },
          { id: 'gold', label: 'Gold', value: 'Gold', priceModifier: 0 }
        ],
        memory: [
          { id: '8gb', label: '8GB', value: '8GB', priceModifier: 0 },
          { id: '16gb', label: '16GB', value: '16GB', priceModifier: 200000 },
          { id: '24gb', label: '24GB', value: '24GB', priceModifier: 400000 }
        ],
        storage: [
          { id: '256gb', label: '256GB', value: '256GB', priceModifier: 0 },
          { id: '512gb', label: '512GB', value: '512GB', priceModifier: 300000 },
          { id: '1tb', label: '1TB', value: '1TB', priceModifier: 600000 }
        ]
      }
    },
    'smartphone-charger': {
      id: 'smartphone-charger',
      name: 'Fast Smartphone Charger',
      description: 'Universal fast charging cable compatible with all modern devices.',
      basePrice: 3500,
      image: '/api/placeholder/300/300',
      category: 'Gadgets',
      rating: 4.5,
      features: [
        'Fast charging technology',
        'Universal compatibility',
        'Durable cable design'
      ],
      options: {
        colors: [
          { id: 'white', label: 'White', value: 'White', priceModifier: 0 },
          { id: 'black', label: 'Black', value: 'Black', priceModifier: 0 }
        ]
      }
    },
    
    // SERVICES PRODUCTS - Duration and service type-based pricing
    'room-cleaning': {
      id: 'room-cleaning',
      name: 'Room Cleaning Service',
      description: 'Professional hotel room cleaning and maintenance service.',
      basePrice: 8000,
      image: '/api/placeholder/300/300',
      category: 'Services',
      rating: 4.9,
      features: [
        'Professional cleaning staff',
        'Eco-friendly products',
        'Same-day service available'
      ],
      options: {
        serviceTypes: [
          { id: 'basic', label: 'Basic Clean', value: 'Basic', priceModifier: 0 },
          { id: 'deep', label: 'Deep Clean', value: 'Deep', priceModifier: 3000 },
          { id: 'premium', label: 'Premium Clean', value: 'Premium', priceModifier: 5000 }
        ]
      }
    },
    'laundry-service': {
      id: 'laundry-service',
      name: 'Laundry Service',
      description: 'Same-day laundry and dry cleaning service.',
      basePrice: 5500,
      image: '/api/placeholder/300/300',
      category: 'Services',
      rating: 4.8,
      features: [
        'Same-day service',
        'Professional dry cleaning',
        'Pickup and delivery'
      ],
      options: {
        durations: [
          { id: 'same-day', label: 'Same Day', value: 'Same Day', priceModifier: 0 },
          { id: 'express', label: 'Express (2hrs)', value: 'Express', priceModifier: 2000 }
        ]
      }
    },
    
    // SUPPLIES PRODUCTS - Material and quantity-based pricing
    'toiletries-kit': {
      id: 'toiletries-kit',
      name: 'Hotel Toiletries Kit',
      description: 'Complete toiletries kit with shampoo, soap, and towels.',
      basePrice: 2500,
      image: '/api/placeholder/300/300',
      category: 'Supplies',
      rating: 4.4,
      features: [
        'Complete toiletry set',
        'High-quality materials',
        'Travel-friendly packaging'
      ],
      options: {
        materials: [
          { id: 'standard', label: 'Standard', value: 'Standard', priceModifier: 0 },
          { id: 'premium', label: 'Premium', value: 'Premium', priceModifier: 1000 },
          { id: 'luxury', label: 'Luxury', value: 'Luxury', priceModifier: 2000 }
        ]
      }
    },
    
    // OTHERS PRODUCTS - Duration and group size-based pricing
    'city-tour': {
      id: 'city-tour',
      name: 'City Tour Package',
      description: 'Guided tour of local attractions and landmarks.',
      basePrice: 15000,
      image: '/api/placeholder/300/300',
      category: 'Others',
      rating: 4.6,
      features: [
        'Professional tour guide',
        'Transportation included',
        'Visit major landmarks'
      ],
      options: {
        durations: [
          { id: 'half-day', label: 'Half Day (4hrs)', value: 'Half Day', priceModifier: 0 },
          { id: 'full-day', label: 'Full Day (8hrs)', value: 'Full Day', priceModifier: 8000 }
        ],
        sizes: [
          { id: 'solo', label: 'Solo', value: 'Solo', priceModifier: 0 },
          { id: 'couple', label: 'Couple', value: 'Couple', priceModifier: 5000 },
          { id: 'group', label: 'Group (4+)', value: 'Group', priceModifier: 12000 }
        ]
      }
    }
  };

  useEffect(() => {
    const foundProduct = productDatabase[productId];
    if (foundProduct) {
      setProduct(foundProduct);
      // Initialize default selections for all option types
      const initialOptions: Record<string, string> = {};
      if (foundProduct.options) {
        Object.entries(foundProduct.options).forEach(([optionType, options]) => {
          if (options && options.length > 0) {
            initialOptions[optionType] = options[0].id;
          }
        });
      }
      setSelectedOptions(initialOptions);
    }
  }, [productId]);

  // Dynamic pricing calculation based on selected options
  const calculatePrice = () => {
    if (!product || !product.options) return product?.basePrice || 0;
    
    let totalPrice = product.basePrice;
    
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

  // Dynamic option selection handler
  const handleOptionChange = (optionType: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: optionId
    }));
  };

  // Render option section based on option type
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
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
              {option.priceModifier > 0 && (
                <span className="ml-1 text-xs sm:text-sm text-gray-500">
                  (+₦{option.priceModifier.toLocaleString()})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h2>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Define option labels for better UX
  const optionLabels: Record<string, string> = {
    colors: 'Colour',
    memory: 'Memory',
    storage: 'Storage',
    sizes: 'Size',
    serviceTypes: 'Service Type',
    materials: 'Material',
    durations: 'Duration'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
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
          <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIzMC45MDQgMTUwIDI1NiAxMjQuOTA0IDI1NiA5NFMyMzAuOTA0IDM4IDIwMCAzOEMxNjkuMDk2IDM4IDE0NCA2My4wOTYgMTQ0IDk0QzE0NCAxMjQuOTA0IDE2OS4wOTYgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOUM5Q0ExIi8+CjxwYXRoIGQ9Ik0xNjggMjEySDIzMkwyMjQgMTg4SDE3NkwxNjggMjEyWiIgZmlsbD0iIzlDOUNBMSIvPgo8L3N2Zz4K';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description}</p>
            </div>

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
                  ₦ {calculatePrice().toLocaleString()}
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                  Buy now
                </button>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-sm">•</span>
                    <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* You might also like */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Mock related products */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">4.8</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Sample Product {item}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Product description here</p>
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-gray-900">₦ 2,700,000</span>
                  <button className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                    Buy now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}