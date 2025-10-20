import React, { useState } from 'react';
import { SearchIcon, FilterIcon, ArrowUpDownIcon, EyeIcon, DownloadIcon } from 'lucide-react';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
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
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
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
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === orderId ? {
      ...order,
      status: newStatus
    } : order));
    setSelectedOrder(prev => prev ? {
      ...prev,
      status: newStatus
    } : null);
  };
  return <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center text-sm font-medium">
          <DownloadIcon size={16} className="mr-2" />
          Export Orders
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <input type="text" placeholder="Search by order ID, customer name or email..." className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  {statuses.map(status => <option key={status} value={status}>
                      {status}
                    </option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FilterIcon size={14} />
                </div>
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date-desc">Date: Newest First</option>
                  <option value="date-asc">Date: Oldest First</option>
                  <option value="total-desc">Total: High to Low</option>
                  <option value="total-asc">Total: Low to High</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ArrowUpDownIcon size={14} />
                </div>
              </div>
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
              {sortedOrders.map(order => <tr key={order.id} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-black">{order.id}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.customer}
                      </p>
                      <p className="text-gray-500 text-xs">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 font-medium text-black">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center" onClick={() => handleViewOrder(order)}>
                      <EyeIcon size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {sortedOrders.length === 0 && <div className="text-center py-10">
            <p className="text-gray-500">No orders found.</p>
          </div>}
      </div>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} onUpdateStatus={(newStatus: string) => updateOrderStatus(selectedOrder.id, newStatus)} />}
    </div>;
};
export default Orders;