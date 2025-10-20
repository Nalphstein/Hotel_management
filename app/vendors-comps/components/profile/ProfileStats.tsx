'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBagIcon, DollarSignIcon, UsersIcon } from 'lucide-react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../../context/AuthContext'; // Adjust path
import { db } from '../../../../lib/firebase/config';      // Adjust path
import { collection, query, where, getDocs } from 'firebase/firestore';

// --- Type Definition for the stats we'll calculate ---
interface Stats {
  totalOrders: number;
  revenue: number;
  customers: number;
}

const ProfileStats = () => {
  const { user } = useAuth(); // Get the current authenticated vendor
  
  // --- State Management ---
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Effect to Fetch and Calculate Stats from Firestore ---
  useEffect(() => {
    // Don't run the query until the user object is available
    if (user) {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          // Query the 'orders' collection for all completed orders belonging to this vendor
          const ordersRef = collection(db, 'orders');
          const q = query(
            ordersRef,
            where('vendorId', '==', user.uid),
            where('status', '==', 'completed')
          );
          const querySnapshot = await getDocs(q);

          // Get the raw data from the documents
          const orders = querySnapshot.docs.map(doc => doc.data());
          
          // --- Perform Calculations ---
          
          // 1. Total Orders is simply the number of documents found
          const totalOrders = querySnapshot.size;

          // 2. Revenue is the sum of the 'amount' field in each order
          const revenue = orders.reduce((sum, order) => sum + order.amount, 0);

          // 3. Customers is the count of *unique* buyer IDs
          const customerIds = new Set(orders.map(order => order.buyerId));
          const customers = customerIds.size;

          // Update the state with the calculated values
          setStats({ totalOrders, revenue, customers });

        } catch (error) {
          console.error("Error fetching profile stats:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStats();
    }
  }, [user]); // Rerun this effect if the user object changes

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // --- Render a loading state while fetching ---
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          <div className="flex items-center"><div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div><div className="flex-1"><div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div><div className="h-4 bg-gray-300 rounded w-1/2"></div></div></div>
          <div className="flex items-center"><div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div><div className="flex-1"><div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div><div className="h-4 bg-gray-300 rounded w-1/2"></div></div></div>
          <div className="flex items-center"><div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div><div className="flex-1"><div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div><div className="h-4 bg-gray-300 rounded w-1/2"></div></div></div>
        </div>
      </div>
    );
  }
  
  // --- Render the component with live data ---
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="font-medium text-gray-700 mb-4">Your Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <ShoppingBagIcon size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-lg font-bold text-gray-800">{stats?.totalOrders ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <DollarSignIcon size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(stats?.revenue ?? 0)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <UsersIcon size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-lg font-bold text-gray-800">{stats?.customers ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;