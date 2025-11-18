'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string>;
  vendorName: string;
  status: string;
  createdAt: Date;
}

// Mock order data
const mockOrders: Order[] = [
  {
    id: 'mock-order-1',
    orderId: 'ORD-123456789',
    productName: 'Wireless Bluetooth Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    price: 8999,
    quantity: 1,
    selectedOptions: {
      color: 'Black',
      size: 'Standard'
    },
    vendorName: 'Tech Gadgets Store',
    status: 'shipped',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: 'mock-order-2',
    orderId: 'ORD-987654321',
    productName: 'Smart Fitness Watch',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    price: 12999,
    quantity: 1,
    selectedOptions: {
      color: 'Silver',
      band: 'Silicone'
    },
    vendorName: 'Fitness World',
    status: 'processing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  }
];

export default function MockOrderTrackingPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  
  // Find the mock order by orderId or use the first one as default
  const order = mockOrders.find(o => o.orderId === orderId) || mockOrders[0];

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  // Define order status steps
  const orderStatusSteps = [
    { id: 'pending', label: 'Order Placed', description: 'We have received your order' },
    { id: 'processing', label: 'Processing', description: 'Preparing your order for shipment' },
    { id: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
    { id: 'delivered', label: 'Delivered', description: 'Order has been delivered' }
  ];

  // Get current status index
  const getCurrentStatusIndex = () => {
    return orderStatusSteps.findIndex(step => step.id === order.status);
  };

  const currentStatusIndex = getCurrentStatusIndex();

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'processing':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking (Mock)</h1>
            <p className="text-gray-600">Track your order status and delivery updates</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.orderId}</h2>
                  <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatPrice(order.price)}</p>
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-4">
                <img 
                  src={order.productImage} 
                  alt={order.productName} 
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{order.productName}</h3>
                  <p className="text-gray-600">Sold by {order.vendorName}</p>
                  <div className="mt-2">
                    {Object.entries(order.selectedOptions).map(([key, value]) => (
                      <span key={key} className="text-sm text-gray-500 capitalize mr-2">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Qty: {order.quantity}</p>
                  <p className="font-medium">{formatPrice(order.price)}</p>
                </div>
              </div>
            </div>

            {/* Order Status Tracker */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Order Status</h3>
              
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                
                <div className="space-y-8">
                  {orderStatusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <div key={step.id} className="relative flex items-start">
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                              : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="ml-4 pt-1">
                          <h4 className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-900'}`}>
                            {step.label}
                          </h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          
                          {isCurrent && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                Your order is currently {step.label.toLowerCase()}. We'll notify you when it moves to the next stage.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-medium">Need help with your order?</h4>
                  <p className="text-sm text-gray-600">Contact our support team for assistance</p>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}