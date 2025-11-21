'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, FilterIcon, ArrowUpDownIcon, EyeIcon, DownloadIcon } from 'lucide-react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, Timestamp } from 'firebase/firestore';

// --- Component Imports ---
import OrderDetailsModal from '../components/orders/OrderDetailsModal';

// --- Type Definition for an Order document ---
interface Order {
  id: string; // Firestore document ID
  orderId: string; // Your custom readable ID
  customerName: string; // Store customer name directly for easier display
  customerEmail: string;
  createdAt: Timestamp;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  // Add other fields as needed for the details modal
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
}

// Add interface for TransactionData if it doesn't exist
interface TransactionData {
  id: string;
  // Add other properties as needed based on your actual data structure
  amount: number;
  date: Timestamp;
  status: string;
}

// Update the component to accept transactions prop
const OrdersComponent = ({ transactions }: { transactions?: TransactionData[] }) => {
  const { user } = useAuth(); // Get the current authenticated vendor

  // --- State Management ---
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Effect to Listen for Real-Time Order Updates ---
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const ordersRef = collection(db, 'orders');
      // Create a query to get all orders where the vendorId matches the current user's ID
      const q = query(ordersRef, where('vendorId', '==', user.uid));

      // onSnapshot creates a real-time listener.
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setAllOrders(fetchedOrders);
        setIsLoading(false);
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  // --- Client-Side Filtering and Sorting ---
  // useMemo is used to prevent re-calculating on every render
  const sortedOrders = useMemo(() => {
    const filtered = allOrders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'date-asc') return a.createdAt.toMillis() - b.createdAt.toMillis();
      if (sortBy === 'date-desc') return b.createdAt.toMillis() - a.createdAt.toMillis();
      if (sortBy === 'total-asc') return a.total - b.total;
      if (sortBy === 'total-desc') return b.total - a.total;
      return 0;
    });
  }, [allOrders, searchTerm, statusFilter, sortBy]);


  // --- Handlers ---

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      // The real-time listener will automatically update the UI.
      // We just need to update the selectedOrder state for the modal.
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };
  
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
  const getStatusColor = (status: string) => { /* ... unchanged ... */ };
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        {/* ... Export button ... */}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {/* ... Search and Filter UI (unchanged) ... */}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10">Loading orders...</td></tr>
              ) : sortedOrders.length > 0 ? (
                sortedOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">{order.orderId}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.customerName}</p>
                        <p className="text-gray-500 text-xs">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{order.createdAt.toDate().toLocaleDateString()}</td>
                    <td className="px-4 py-4 font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-indigo-600 hover:text-indigo-800 flex items-center" onClick={() => setSelectedOrder(order)}>
                        <EyeIcon size={16} className="mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={newStatus => handleUpdateStatus(selectedOrder.id, newStatus)}
        />
      )}
    </div>
  );
};

export default OrdersComponent;