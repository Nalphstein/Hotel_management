import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { FilterIcon, SearchIcon, CalendarIcon, DownloadIcon, EyeIcon, CheckIcon, XIcon } from 'lucide-react';
const orders = [{
  id: 'ORD-39382',
  customer: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  date: '13 Feb 2025',
  amount: '$1,245.89',
  status: 'Completed',
  payment: 'Credit Card',
  items: 3
}, {
  id: 'ORD-39381',
  customer: {
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  date: '13 Feb 2025',
  amount: '$299.99',
  status: 'Pending',
  payment: 'PayPal',
  items: 1
}, {
  id: 'ORD-39380',
  customer: {
    name: 'Michael Brown',
    email: 'michael@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  date: '12 Feb 2025',
  amount: '$1,849.50',
  status: 'Processing',
  payment: 'Credit Card',
  items: 4
}, {
  id: 'ORD-39379',
  customer: {
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  date: '12 Feb 2025',
  amount: '$99.99',
  status: 'Completed',
  payment: 'Apple Pay',
  items: 1
}, {
  id: 'ORD-39378',
  customer: {
    name: 'David Miller',
    email: 'david@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  date: '11 Feb 2025',
  amount: '$599.99',
  status: 'Cancelled',
  payment: 'Credit Card',
  items: 1
}, {
  id: 'ORD-39377',
  customer: {
    name: 'Jessica Wilson',
    email: 'jessica@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  date: '11 Feb 2025',
  amount: '$2,499.00',
  status: 'Completed',
  payment: 'Bank Transfer',
  items: 5
}, {
  id: 'ORD-39376',
  customer: {
    name: 'Robert Taylor',
    email: 'robert@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  date: '10 Feb 2025',
  amount: '$149.99',
  status: 'Processing',
  payment: 'PayPal',
  items: 2
}, {
  id: 'ORD-39375',
  customer: {
    name: 'Jennifer Martinez',
    email: 'jennifer@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  date: '10 Feb 2025',
  amount: '$899.95',
  status: 'Completed',
  payment: 'Credit Card',
  items: 3
}];
const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'All' && order.status !== statusFilter) {
      return false;
    }
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  return <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and process customer orders
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
          <DownloadIcon size={18} className="mr-1.5" />
          Export Orders
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input type="text" placeholder="Search orders by ID or customer..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>All time</option>
                </select>
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <CalendarIcon size={16} />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">
                <FilterIcon size={16} className="mr-1.5" />
                More Filters
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment Method</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-indigo-600">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img src={order.customer.avatar} alt={order.customer.name} className="w-8 h-8 rounded-full mr-3 object-cover" />
                      <div>
                        <div className="text-sm font-medium">
                          {order.customer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.date}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {order.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status === 'Completed' && <CheckIcon size={12} className="mr-1" />}
                      {order.status === 'Cancelled' && <XIcon size={12} className="mr-1" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.payment}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.items}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 bg-gray-100 rounded text-gray-500 hover:bg-gray-200">
                      <EyeIcon size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-100 border border-indigo-200 rounded text-sm text-indigo-700 font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </PageContainer>;
};
export default OrdersPage;