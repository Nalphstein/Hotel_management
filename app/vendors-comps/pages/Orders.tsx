'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, FilterIcon, ArrowUpDownIcon, EyeIcon, DownloadIcon } from 'lucide-react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, Timestamp, getDoc } from 'firebase/firestore';

// --- Component Imports ---
import OrderDetailsModal from '../components/orders/OrderDetailsModal';

// --- Type Definition for an Order document ---
interface Order {
  id: string; // Firestore document ID
  orderId: string; // Your custom readable ID
  customerName: string; // Store customer name directly for easier display
  customerEmail: string;
  createdAt: any; // Changed from Timestamp to any to handle both Firestore Timestamp and Date
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Updated to match our order statuses
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  selectedOptions: Record<string, string>;
  vendorName: string;
  clientName: string; // Added clientName
  // Add other fields as needed for the details modal
  items?: any[];
  shippingAddress?: any;
  paymentMethod?: string;
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
  console.log("OrdersComponent rendered");
  const { user } = useAuth(); // Get the current authenticated vendor
  console.log("Current user:", user);

  // --- State Management ---
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchVendorOrders = async () => {
    console.log("fetchVendorOrders called, user:", user);
    if (user) {
      setIsLoading(true);
      console.log("Fetching orders for vendor ID:", user.uid);
      // Listen to main orders collection where vendorId matches current vendor
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('vendorId', '==', user.uid), orderBy('createdAt', 'desc'));

      // onSnapshot creates a real-time listener.
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Vendor orders snapshot size:", snapshot.size);
        console.log("Query vendor ID:", user.uid);
        const fetchedOrders: Order[] = [];
        
        snapshot.forEach((doc) => {
          const orderData: any = doc.data();
          console.log("Order data:", orderData);
          console.log("Order vendorId:", orderData.vendorId);
          
          const order = { 
            id: doc.id, 
            orderId: orderData.orderId,
            customerName: orderData.clientName || 'Customer',
            customerEmail: orderData.clientEmail || 'customer@example.com',
            createdAt: orderData.createdAt,
            total: (orderData.price || 0) * (orderData.quantity || 1),
            status: orderData.status || 'pending',
            productName: orderData.productName,
            productImage: orderData.productImage,
            quantity: orderData.quantity,
            price: orderData.price,
            selectedOptions: orderData.selectedOptions || {},
            vendorName: orderData.vendorName || 'Vendor',
            clientName: orderData.buyerEmail || 'Customer'
          } as Order;
          
          fetchedOrders.push(order);
        });
        
        console.log("Fetched orders array:", fetchedOrders);
        setAllOrders(fetchedOrders);
        setIsLoading(false);
      }, (error) => {
        console.error("Error in vendor orders listener:", error);
        setIsLoading(false);
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }
  };

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

  // --- Effect to Listen for Real-Time Order Updates ---
  useEffect(() => {
    console.log("Orders useEffect called, user:", user);
    fetchVendorOrders();
  }, [user]);

  // --- Handlers ---

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      console.log("handleUpdateStatus called - Order ID:", orderId, "New Status:", newStatus);
      console.log("Updating order status - Order ID:", orderId, "New Status:", newStatus);
      const orderDocRef = doc(db, 'orders', orderId);
      console.log("Order document reference:", orderDocRef);
      
      // Check if the new status is valid
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(newStatus)) {
        console.error("Invalid status:", newStatus);
        alert("Invalid status selected.");
        return;
      }
      
      await updateDoc(orderDocRef, { status: newStatus });
      console.log("Order status updated successfully");
      // The real-time listener will automatically update the UI.
      // We just need to update the selectedOrder state for the modal.
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.code === 'permission-denied') {
        console.error("Permission denied when updating order status");
        alert("You don't have permission to update this order status.");
      } else {
        alert("Failed to update order status.");
      }
    }
  };
  
  const statuses = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Handle both Firestore Timestamp and Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button className="bg-green-500 text-white px-3 py-2 rounded-md flex items-center">
          <DownloadIcon size={16} className="mr-1" /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <SearchIcon size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search orders..."
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <FilterIcon size={16} className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ArrowUpDownIcon size={16} className="text-black ml-2" />
            <select
              className="border text-black border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Date (newest first)</option>
              <option value="date-asc">Date (oldest first)</option>
              <option value="total-desc">Total (highest first)</option>
              <option value="total-asc">Total (lowest first)</option>
            </select>
          </div>
        </div>
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
                    <td className="px-4 py-4 font-medium text-black">{order.orderId}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.customerName}</p>
                        <p className="text-gray-500 text-xs">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4 font-medium text-black">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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