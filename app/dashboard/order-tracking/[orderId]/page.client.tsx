'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCheckout } from '../../../../context/CheckoutContext';
import { db } from '../../../../lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

// Define order status steps
const orderStatusSteps = [
  { id: 'pending', label: 'Order Placed', description: 'We have received your order' },
  { id: 'processing', label: 'Processing', description: 'Preparing your order for shipment' },
  { id: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
  { id: 'delivered', label: 'Delivered', description: 'Order has been delivered' }
];

// This function is required for static export with dynamic routes

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  
  const { item } = useCheckout(); // Get the item from checkout context
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  // Helper to format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Handle both Firestore Timestamp and Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  // Get current status index
  const getCurrentStatusIndex = () => {
    if (!order) return 0;
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

  // Create order object from checkout item or localStorage
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Order ID is missing');
      return;
    }

    const loadOrderData = async () => {
      // First, try to get order from Firestore
      try {
        // First try to find the order by orderId in the orders collection
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('orderId', '==', orderId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const orderDoc = querySnapshot.docs[0];
          const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
          setOrder(orderData);
          setLoading(false);
          return;
        }
      } catch (firestoreError) {
        console.warn("Could not fetch order from Firestore by orderId:", firestoreError);
      }
      
      // If not found by orderId, try to get order by document ID
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (orderSnap.exists()) {
          const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
          setOrder(orderData);
          setLoading(false);
          return;
        }
      } catch (firestoreError) {
        console.warn("Could not fetch order from Firestore by document ID:", firestoreError);
      }
      
      // If not found in Firestore, try to get order data from checkout context
      if (item) {
        // Debug log to see what data we're receiving
        console.log("Order tracking page received item from checkout context:", item);
        
        const orderData: Order = {
          id: orderId,
          orderId: orderId,
          productName: item.name,
          productImage: item.image,
          price: item.price,
          quantity: item.quantity || 1,
          selectedOptions: item.selectedOptions || {},
          vendorName: item.vendorName || 'Vendor',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Debug log to see what we're creating
        console.log("Order data created from checkout context:", orderData);
        
        // Store order in localStorage to ensure it appears in profile
        try {
          const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
          // Check if order already exists to avoid duplicates
          const orderExists = existingOrders.some((o: any) => o.orderId === orderId);
          if (!orderExists) {
            existingOrders.push(orderData);
            localStorage.setItem('userOrders', JSON.stringify(existingOrders));
            console.log("Order added to localStorage:", orderId);
          }
        } catch (storageError) {
          console.warn("Could not store order in localStorage:", storageError);
        }
        
        setOrder(orderData);
        setLoading(false);
        return;
      }
      
      // If no item in checkout context, try to get from localStorage
      try {
        const storedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const storedOrder = storedOrders.find((o: any) => o.orderId === orderId);
        
        if (storedOrder) {
          console.log("Order data found in localStorage:", storedOrder);
          
          const orderData: Order = {
            id: storedOrder.orderId,
            orderId: storedOrder.orderId,
            productName: storedOrder.productName,
            productImage: storedOrder.productImage,
            price: storedOrder.price,
            quantity: storedOrder.quantity || 1,
            selectedOptions: storedOrder.selectedOptions || {},
            vendorName: storedOrder.vendorName || 'Vendor',
            status: storedOrder.status || 'pending',
            createdAt: storedOrder.createdAt,
            updatedAt: storedOrder.updatedAt || storedOrder.createdAt
          };
          
          setOrder(orderData);
          setLoading(false);
          return;
        }
      } catch (storageError) {
        console.warn("Could not read order from localStorage:", storageError);
      }
      
      // If not found in localStorage, show error
      setLoading(false);
      setError('Order information not available');
    };

    loadOrderData();
  }, [item, orderId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
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
                  <p className="text-gray-600">Sold by {order.vendorName || 'Vendor'}</p>
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