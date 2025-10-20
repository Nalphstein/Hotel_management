'use client';
import { useState, useEffect } from 'react';

// --- Imports for Firebase, Auth, and Layout ---
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase/config';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import VendorLayout from './components/VendorLayout';
import VendorProtectedRoute from '../components/VendorProtectedRoute'; 

// --- Imports for your UI Components ---
import StoreCard from '../vendors-comps/components/StoreCard';
import ChatPerformanceCard from '../vendors-comps/components/ChatPerformanceCard';
import SalesOverviewCard from '../vendors-comps/components/SalesOverviewCard';
import SalesCategoriesCard from '../vendors-comps/components/SalesCategoriesCard';
import ProductTransactionTable from '../vendors-comps/components/ProductTransactionTable';

// --- Type Definitions for Data Integrity ---
interface OrderData {
  amount: number;
  category: string;
  createdAt: Timestamp;
  // Add other fields from your order documents as needed
}

interface TransactionData extends OrderData {
  id: string;
  productName: string;
  status: string;
}

interface DashboardData {
  totalSales: number;
  salesLastMonth: number;
  salesByCategory: { [key: string]: number };
  recentTransactions: TransactionData[];
}

export default function VendorDashboard() {
  const { user } = useAuth(); // Get the current authenticated vendor
  
  // --- State Management ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching and Processing ---
  useEffect(() => {
    if (!user) return; // Don't fetch if user isn't loaded yet

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Query all 'completed' orders where the vendorId matches the current user's ID
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef, 
          where('vendorId', '==', user.uid), 
          where('status', '==', 'completed')
        );
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TransactionData[];
        
        // --- Perform Calculations ---
        const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const salesLastMonth = orders
          .filter(order => order.createdAt.toDate() > oneMonthAgo)
          .reduce((sum, order) => sum + order.amount, 0);

        const salesByCategory = orders.reduce((acc, order) => {
          const category = order.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + order.amount;
          return acc;
        }, {} as { [key: string]: number });
        
        // Sort by date to get the most recent transactions for the table
        const recentTransactions = orders
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
          .slice(0, 5); // Limit to the latest 5
          
        setData({ totalSales, salesLastMonth, salesByCategory, recentTransactions });

      } catch (error) {
        console.error("Error fetching vendor dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // --- Helper Function ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    // Wrap the entire page in the security components
    <VendorProtectedRoute>
      <VendorLayout>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : data ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your store and track performance</p>
            </div>
            
            {/* Pass the dynamic, calculated data as props to your UI components */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StoreCard 
                title="Total Sales" 
                subtitle="All-time revenue" 
                amount={formatCurrency(data.totalSales)} 
                percentage={0} // More complex calculation needed for percentage change
                trend="up" 
                type="" 
              />
              <StoreCard 
                title="Sales (Last 30 Days)" 
                subtitle="Revenue from last month" 
                amount={formatCurrency(data.salesLastMonth)} 
                percentage={0} // More complex calculation needed
                trend="up" 
                type="" 
              />
              <ChatPerformanceCard />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                {/* SalesOverviewCard would also need data, e.g., an array of monthly sales */}
                <SalesOverviewCard />
              </div>
              <div>
                <SalesCategoriesCard categoryData={data.salesByCategory} />
              </div>
            </div>
            
            <div className="mt-6">
              <ProductTransactionTable transactions={data.recentTransactions} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-gray-600 mt-2">Could not load dashboard data. Please try again later.</p>
          </div>
        )}
      </VendorLayout>
    </VendorProtectedRoute>
  );
}