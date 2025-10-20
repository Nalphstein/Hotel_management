'use client';
import { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Imports for Firebase and Authentication ---
import ProtectedRoute from '../../components/ProtectedRoute'; // Component to protect this route
import { useAuth } from '../../../context/AuthContext';         // Hook to get the current user
import { auth, db } from '../../../lib/firebase/config';      // Firebase configuration
import { signOut } from 'firebase/auth';                        // Firebase sign out function
import { doc, getDoc, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'; // Firestore functions

// --- Type Definitions for our Data ---
// Ensures type safety and provides autocompletion for our data objects
interface UserData {
  username: string;
  othername: string;
  email: string;
  phone: string;
}

interface Order {
  id: string; // The document ID from Firestore
  orderId: string;
  date: Timestamp; // Use Firestore's Timestamp type
  productName: string;
  amount: number; // Store price as a number for formatting
  category: string;
  productImage: string;
}

export default function ProfilePage() {
  const { user } = useAuth(); // Get the current authenticated user from our context
  const router = useRouter();

  // --- State Management ---
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Account Overview');

  // --- Data Fetching Effect ---
  // This effect runs once the `user` object is available from the AuthContext
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // 1. Fetch the user's profile document
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          }

          // 2. Fetch the 5 most recent orders from the 'orders' subcollection
          const ordersRef = collection(db, 'users', user.uid, 'orders');
          const q = query(ordersRef, orderBy('date', 'desc'), limit(5));
          const querySnapshot = await getDocs(q);
          const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
          setRecentOrders(orders);

        } catch (error) {
          console.error("Error fetching profile data:", error);
          // You could set an error state here to show a message to the user
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user]); // The dependency array ensures this effect re-runs if the user logs in/out

  // --- Handler for Secure Sign Out ---
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Use Firebase's secure sign out method
      router.push('/');  // Redirect to the homepage
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  // --- Helper Functions for Formatting Data ---
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const menuItems = [
    { icon: User, label: 'Account Overview' },
    { icon: Package, label: 'Order History' },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Sign Out', isSignOut: true }
  ];

  return (
    // This component ensures only logged-in users can see the content
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-lg font-medium text-gray-900">My Profile</h1>
          </div>

          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar Menu */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => item.isSignOut ? handleSignOut() : setActiveSection(item.label)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors mb-1 ${
                        activeSection === item.label ? 'bg-orange-50 text-orange-600' :
                        item.isSignOut ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {activeSection === 'Account Overview' && (
                  <>
                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-6">
                        {/* ... Profile avatar and heading ... */}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                          <p className="text-gray-900 font-medium">{`${userData?.username || ''} ${userData?.othername || ''}`.trim()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                          <p className="text-gray-900 font-medium">{userData?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                          <p className="text-gray-900 font-medium">{userData?.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                      {recentOrders.length > 0 ? (
                        <div className="space-y-3">
                          {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{order.productName}</p>
                                  <p className="text-xs text-gray-500">{formatDate(order.date)} • {order.orderId}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900 text-base">{formatPrice(order.amount)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">You have no recent orders.</p>
                      )}
                    </div>
                  </>
                )}

                {activeSection === 'Order History' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Full Order History</h2>
                     {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                          {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <span className="text-orange-600 font-semibold text-sm">{order.category.slice(0, 2).toUpperCase()}</span>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900">{order.orderId}</span>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">{order.category}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                                  <p className="text-sm text-gray-900">{order.productName}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatPrice(order.amount)}</p>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                         <p className="text-gray-500 text-sm">You have no orders to display.</p>
                      )}
                  </div>
                )}
                
                {/* Note: Settings functionality would be built out here */}
                {activeSection === 'Settings' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
                    <p className="text-gray-600">Settings management features would be implemented here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}