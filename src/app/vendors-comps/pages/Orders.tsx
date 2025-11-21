import React, { useState } from 'react';
import { SearchIcon, FilterIcon, ArrowUpDownIcon, EyeIcon, DownloadIcon } from 'lucide-react';
import OrderDetailsModal from '../../../app/vendors-comps/components/orders/OrderDetailsModal';
// Mock order data
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

const initialOrders: Order[] = [{
  id: 'ORD-2025-0001',
  customer: 'John Smith',
  email: 'john@example.com',
  date: '2025-02-10',
  total: 1299,
  status: 'Completed',
  items: [{
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999,
    quantity: 1
  }, {
    id: 2,
    name: 'AirPods Pro 2',
    price: 249,
    quantity: 1
  }, {
    id: 3,
    name: 'USB-C Cable',
    price: 19,
    quantity: 1
  }],
  shippingAddress: {
    street: '123 Apple St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States'
  },
  paymentMethod: 'Credit Card (**** 4242)'
}, {
  id: 'ORD-2025-0002',
  customer: 'Emma Johnson',
  email: 'emma@example.com',
  date: '2025-02-11',
  total: 2248,
  status: 'Processing',
  items: [{
    id: 1,
    name: 'MacBook Air M3',
    price: 1099,
    quantity: 1
  }, {
    id: 2,
    name: 'Magic Mouse',
    price: 99,
    quantity: 1
  }, {
    id: 3,
    name: 'USB-C Hub',
    price: 49,
    quantity: 1
  }],
  shippingAddress: {
    street: '456 Maple Ave',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    country: 'United States'
  },
  paymentMethod: 'PayPal'
}, {
  id: 'ORD-2025-0003',
  customer: 'Michael Brown',
  email: 'michael@example.com',
  date: '2025-02-12',
  total: 599,
  status: 'Shipped',
  items: [{
    id: 1,
    name: 'iPad Air',
    price: 599,
    quantity: 1
  }],
  shippingAddress: {
    street: '789 Pine Rd',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  paymentMethod: 'Credit Card (**** 1234)'
}, {
  id: 'ORD-2025-0004',
  customer: 'Sarah Wilson',
  email: 'sarah@example.com',
  date: '2025-02-13',
  total: 1647,
  status: 'Cancelled',
  items: [{
    id: 1,
    name: 'iPhone 15',
    price: 799,
    quantity: 1
  }, {
    id: 2,
    name: 'AppleCare+',
    price: 149,
    quantity: 1
  }, {
    id: 3,
    name: 'iPhone Case',
    price: 49,
    quantity: 1
  }],
  shippingAddress: {
    street: '321 Oak Ln',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    country: 'United States'
  },
  paymentMethod: 'Credit Card (**** 5678)'
}, {
  id: 'ORD-2025-0005',
  customer: 'David Lee',
  email: 'david@example.com',
  date: '2025-02-14',
  total: 1998,
  status: 'Pending',
  items: [{
    id: 1,
    name: 'MacBook Pro 14"',
    price: 1999,
    quantity: 1
  }],
  shippingAddress: {
    street: '654 Cherry St',
    city: 'Austin',
    state: 'TX',
    zip: '73301',
    country: 'United States'
  },
  paymentMethod: 'Apple Pay'
}];
const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Also update the selected order if it's the one being updated
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'total-asc') return a.total - b.total;
    if (sortBy === 'total-desc') return b.total - a.total;
    return 0;
  });
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  return <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <DownloadIcon size={16} className="mr-2" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="total-desc">Highest Amount</option>
                  <option value="total-asc">Lowest Amount</option>
                </select>
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <ArrowUpDownIcon size={16} />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <FilterIcon size={16} className="mr-1.5" />
                More Filters
              </button>
            </div>
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
              {sortedOrders.length > 0 ? sortedOrders.map(order => <tr key={order.id} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium">{order.id}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{order.customer}</p>
                      <p className="text-gray-500 text-xs">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
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
                </tr>) : <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedOrder && (
  <OrderDetailsModal 
    order={selectedOrder} 
    onClose={() => setSelectedOrder(null)} 
    onUpdateStatus={(newStatus: string) => handleUpdateStatus(selectedOrder.id, newStatus)} 
  />
)}

    </div>;
};

export default Orders;