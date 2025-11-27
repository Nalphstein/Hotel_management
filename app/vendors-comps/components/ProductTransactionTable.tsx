'use client';
import React, { useState, useEffect } from 'react';
import { FilterIcon, SettingsIcon, DownloadIcon, EditIcon, TrashIcon } from 'lucide-react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed
import { db } from '../../../lib/firebase/config';      // Adjust path as needed
import { collection, query, where, orderBy, limit, onSnapshot, doc, deleteDoc, Timestamp } from 'firebase/firestore';

// --- Type Definition for a Transaction/Order document ---
// This ensures type safety and matches the data structure in Firestore.
interface Transaction {
  id: string; // The Firestore document ID
  orderId?: string; // Make orderId optional to handle cases where it's not present
  productName: string;
  category: string; // Used for the icon
  createdAt: Timestamp; // Use Firestore's Timestamp for accurate ordering
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled' | 'Unpaid';
};

// Helper function to get an icon based on the product category
const getProductIcon = (category: string) => {
    switch (category) {
        case 'Electronics': return '💻';
        case 'Wearables': return '⌚️';
        case 'Food': return '🍎';
        case 'Laundry': return '🧺';
        case 'Home Services': return '🏠';
        case 'Fashion': return '👕';
        case 'Beauty': return '💄';
        case 'Books': return '📚';
        case 'Stationery': return '✏️';
        case 'Furniture': return '🛋️';
        case 'Fitness': return '🏋️';
        case 'Food Delivery': return '🛵';
        default: return '📦';
    }
};

// Define props interface
interface ProductTransactionTableProps {
  transactions?: Transaction[]; // Make it optional to maintain backward compatibility
}

// Update component to accept props
const ProductTransactionTable = ({ transactions }: ProductTransactionTableProps) => {
  const { user } = useAuth(); // Get the current authenticated vendor from our context
  
  // --- State Management ---
  // Only use internal state if no transactions prop is provided
  const [internalTransactions, setInternalTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use either the prop transactions or internal state
  const effectiveTransactions = transactions || internalTransactions;
  const useInternalData = !transactions;

  // --- Effect to Listen for Real-Time Transaction Updates ---
  useEffect(() => {
    // Only run the query if the user object is available and we're using internal data
    if (user && useInternalData) {
      setIsLoading(true);
      // Create a query to get the 10 most recent orders for this vendor,
      // ordered by the creation date in descending order.
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('vendorId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10) // We only want to show the latest transactions on the dashboard
      );

      // onSnapshot creates a real-time listener.
      // The component will automatically re-render whenever new data matching the query arrives.
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedTransactions = snapshot.docs.map(doc => {
          const orderData = doc.data();
          return {
            id: doc.id,
            ...orderData,
            amount: (orderData.price || 0) * (orderData.quantity || 1)
          };
        }) as Transaction[];
        if (useInternalData) {
          setInternalTransactions(fetchedTransactions);
        }
        setIsLoading(false);
      });

      // Cleanup function: Detach the listener when the component unmounts to prevent memory leaks.
      return () => unsubscribe();
    } else if (!useInternalData) {
      // If we're using external transactions, we're not loading
      setIsLoading(false);
    }
  }, [user, useInternalData]); // The dependency array ensures this effect re-runs if the user logs in/out

  // --- Handler for Deleting a Transaction ---
  const handleDelete = async (transactionId: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction record? This action is often not recommended and cannot be undone.")) return;
    try {
        const docRef = doc(db, 'orders', transactionId);
        await deleteDoc(docRef);
        // No need to update state here. The onSnapshot listener will automatically
        // detect the deletion and re-render the component with the item removed.
    } catch (error) {
        console.error("Error deleting transaction: ", error);
        alert("Failed to delete transaction.");
    }
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  
  // Helper function to get the Tailwind CSS classes for a status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="font-medium text-gray-700">Product Transactions</h3>
            <p className="text-xs text-gray-400">
              Latest online transactions from your store.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <FilterIcon size={14} className="mr-1.5" />
              Filter
            </button>
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <DownloadIcon size={14} className="mr-1.5" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-3 font-medium w-10"><input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></th>
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Order Date</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-500">Loading latest transactions...</td></tr>
              ) : effectiveTransactions.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-500">No transactions found.</td></tr>
              ) : (
                effectiveTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                    <td className="py-4"><input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></td>
                    <td className="py-4 text-gray-600 font-medium">{transaction.orderId || transaction.id}</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-3 text-lg">
                          {getProductIcon(transaction.category)}
                        </span>
                        <span className="text-gray-800 font-medium">{transaction.productName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{transaction.createdAt.toDate().toLocaleDateString()}</td>
                    <td className="py-4 font-medium text-gray-800">{formatCurrency(transaction.amount)}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: 'currentColor' }}></span>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-indigo-600" title="Edit Transaction">
                          <EditIcon size={16} />
                        </button>
                        <button onClick={() => handleDelete(transaction.id)} className="text-gray-400 hover:text-red-600" title="Delete Transaction">
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductTransactionTable;