'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/config';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  vendorName: string;
  status: string;
  createdAt: any; // Firestore timestamp
}

interface UserProfile {
  username: string;
  othername: string;
  email: string;
  phone?: string;
  createdAt: any;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  // Helper to format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Handle both Firestore Timestamp and Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  // Fetch user profile data
  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      setProfileLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({
            username: userData.username || '',
            othername: userData.othername || '',
            email: userData.email || user.email || '',
            phone: userData.phone || '',
            createdAt: userData.createdAt || user.metadata?.creationTime
          });
        } else {
          // Fallback to auth data if no user document exists
          setUserProfile({
            username: '',
            othername: '',
            email: user.email || '',
            phone: '',
            createdAt: user.metadata?.creationTime
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to auth data on error
        setUserProfile({
          username: '',
          othername: '',
          email: user.email || '',
          phone: '',
          createdAt: user.metadata?.creationTime
        });
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch user orders
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    // Try to fetch orders from localStorage
    try {
      const storedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      // Filter orders for current user
      const userOrders = storedOrders.filter((order: any) => order.userId === user.uid);
      
      // Convert stored orders to the expected format
      const formattedOrders = userOrders.map((order: any) => ({
        id: order.orderId,
        orderId: order.orderId,
        productName: order.productName,
        productImage: order.productImage,
        price: order.price,
        quantity: order.quantity,
        vendorName: order.vendorName || 'Vendor',
        status: order.status || 'pending',
        createdAt: order.createdAt
      }));
      
      setOrders(formattedOrders);
      setLoading(false);
      return;
    } catch (storageError) {
      console.warn("Could not read orders from localStorage:", storageError);
    }
    
    // Fallback to Firestore if localStorage fails
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    // Set up real-time listener for orders
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderId: data.orderId,
          productName: data.productName,
          productImage: data.productImage,
          price: data.price,
          quantity: data.quantity,
          vendorName: data.vendorName || 'Vendor',
          status: data.status || 'pending',
          createdAt: data.createdAt
        } as Order;
      });
      
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.warn('Could not fetch orders from Firestore (permissions error). This is expected in development.', error);
      setLoading(false);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  // Get full name for display
  const getFullDisplayName = () => {
    if (profileLoading) return 'Loading...';
    
    if (userProfile) {
      const fullName = `${userProfile.othername} ${userProfile.username}`.trim();
      return fullName || user.displayName || 'User';
    }
    
    return user.displayName || 'User';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">View your order history and account details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{getFullDisplayName()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userProfile?.email || user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {userProfile?.createdAt 
                        ? formatDate(userProfile.createdAt)
                        : user.metadata?.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString() 
                          : 'Unknown Date'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Order History</h2>
                  <p className="text-gray-600">Track your recent orders</p>
                </div>
                
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                    <Link href="/dashboard">
                      <span className="mt-4 inline-block bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                        Start Shopping
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={order.productImage} 
                              alt={order.productName} 
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{order.productName}</p>
                              <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(order.price)}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </span>
                            </div>
                            
                            <Link href={`/dashboard/order-tracking/${order.orderId}`}>
                              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Track Order
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}