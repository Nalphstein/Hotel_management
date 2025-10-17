import React, { useState } from 'react';
import { FilterIcon, SettingsIcon, DownloadIcon, EditIcon, TrashIcon } from 'lucide-react';

const transactions = [{
  id: 'PORD89721-IW',
  product: 'Apple iPad Gen 10',
  icon: '📱',
  date: '13 February, 2025',
  price: '$378',
  status: 'Unpaid'
}, {
  id: 'PORD89721-JM',
  product: 'Apple iPhone 13',
  icon: '📱',
  date: '13 February, 2025',
  price: '$721',
  status: 'Unpaid'
}, {
  id: 'PORD89721-TN',
  product: 'Apple MacBook Air M2',
  icon: '💻',
  date: '13 February, 2025',
  price: '$941',
  status: 'Unpaid'
}, {
  id: 'PORD89721-GF',
  product: 'Apple iMac 2023',
  icon: '🖥️',
  date: '13 February, 2025',
  price: '$938',
  status: 'Completed'
}, {
  id: 'PORD89721-MF',
  product: 'Apple AirPods 4',
  icon: '🎧',
  date: '13 February, 2025',
  price: '$449',
  status: 'Completed'
}, {
  id: 'PORD89721-AN',
  product: 'Apple iPhone 15',
  icon: '📱',
  date: '13 February, 2025',
  price: '$721',
  status: 'Pending'
}];

const ProductTransactionTable = () => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showCustomizeOptions, setShowCustomizeOptions] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('Last 7 Days');
  const [visibleColumns, setVisibleColumns] = useState({
    orderId: true,
    productName: true,
    orderDate: true,
    price: true,
    status: true
  });

  // Handle checkbox selection for individual transaction
  const handleSelectTransaction = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, id]);
    } else {
      setSelectedTransactions(prev => prev.filter(transactionId => transactionId !== id));
    }
  };

  // Handle select all transactions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(transactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  // Handle edit action
  const handleEdit = (id: string) => {
    console.log(`Editing transaction: ${id}`);
    alert(`Edit functionality for transaction ${id} would be implemented here.`);
  };

  // Handle delete action
  const handleDelete = (id: string) => {
    console.log(`Deleting transaction: ${id}`);
    alert(`Delete functionality for transaction ${id} would be implemented here.`);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilterOptions(!showFilterOptions);
    setShowCustomizeOptions(false); // Close customize options if open
  };

  // Handle customize button click
  const handleCustomizeClick = () => {
    setShowCustomizeOptions(!showCustomizeOptions);
    setShowFilterOptions(false); // Close filter options if open
  };

  // Handle export button click
  const handleExportClick = () => {
    alert('Export functionality would be implemented here.');
  };

  // Apply filters
  const handleApplyFilters = () => {
    console.log('Applying filters:', { status: filterStatus, dateRange: filterDateRange });
    alert(`Filters applied: Status - ${filterStatus}, Date Range - ${filterDateRange}`);
    // In a real app, this would filter the transactions data
    setShowFilterOptions(false);
  };

  // Apply column customization
  const handleApplyCustomization = () => {
    console.log('Applying column customization:', visibleColumns);
    alert('Column customization applied!');
    setShowCustomizeOptions(false);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Check if all transactions are selected
  const allSelected = selectedTransactions.length === transactions.length && transactions.length > 0;

  // Filter transactions based on applied filters (simplified for demo)
  const filteredTransactions = transactions.filter(transaction => {
    if (filterStatus === 'All') return true;
    return transaction.status === filterStatus;
  });

  return <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="font-medium text-gray-700">Product Transaction</h3>
            <p className="text-xs text-gray-400">
              Latest online transactions, status or pay now
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button 
              onClick={handleFilterClick}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <FilterIcon size={14} className="mr-1.5" />
              Filter
            </button>
            <button 
              onClick={handleCustomizeClick}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <SettingsIcon size={14} className="mr-1.5" />
              Customize
            </button>
            <button 
              onClick={handleExportClick}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <DownloadIcon size={14} className="mr-1.5" />
              Export
            </button>
          </div>
        </div>

        {/* Filter Options Dropdown */}
        {showFilterOptions && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Filter Options</h4>
              <button 
                onClick={() => setShowFilterOptions(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select 
                  className="w-full rounded border-gray-300 text-sm p-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date Range</label>
                <select 
                  className="w-full rounded border-gray-300 text-sm p-2"
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleApplyFilters}
                  className="w-full bg-indigo-600 text-white py-1.5 px-4 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customize Options Dropdown */}
        {showCustomizeOptions && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Customize Columns</h4>
              <button 
                onClick={() => setShowCustomizeOptions(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="mt-2">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={visibleColumns.orderId}
                    onChange={() => toggleColumnVisibility('orderId')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Order ID</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={visibleColumns.productName}
                    onChange={() => toggleColumnVisibility('productName')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Product Name</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={visibleColumns.orderDate}
                    onChange={() => toggleColumnVisibility('orderDate')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Order Date</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={visibleColumns.price}
                    onChange={() => toggleColumnVisibility('price')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Price</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={visibleColumns.status}
                    onChange={() => toggleColumnVisibility('status')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Status</span>
                </label>
              </div>
              <div className="mt-4">
                <button 
                  onClick={handleApplyCustomization}
                  className="w-full bg-indigo-600 text-white py-1.5 px-4 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Apply Customization
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-3 font-medium w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                {visibleColumns.orderId && <th className="pb-3 font-medium">Order ID</th>}
                {visibleColumns.productName && <th className="pb-3 font-medium">Product Name</th>}
                {visibleColumns.orderDate && <th className="pb-3 font-medium">Order Date</th>}
                {visibleColumns.price && <th className="pb-3 font-medium">Price</th>}
                {visibleColumns.status && <th className="pb-3 font-medium">Status</th>}
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => <tr key={index} className="border-b border-gray-100 text-sm">
                  <td className="py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={(e) => handleSelectTransaction(transaction.id, e.target.checked)}
                    />
                  </td>
                  {visibleColumns.orderId && (
                    <td className="py-4 text-gray-600 font-medium">
                      {transaction.id}
                    </td>
                  )}
                  {visibleColumns.productName && (
                    <td className="py-4">
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          {transaction.icon}
                        </span>
                        {transaction.product}
                      </div>
                    </td>
                  )}
                  {visibleColumns.orderDate && (
                    <td className="py-4 text-gray-600">{transaction.date}</td>
                  )}
                  {visibleColumns.price && (
                    <td className="py-4 font-medium">{transaction.price}</td>
                  )}
                  {visibleColumns.status && (
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : transaction.status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {transaction.status === 'Completed' && '•'}
                        {transaction.status === 'Unpaid' && '•'}
                        {transaction.status === 'Pending' && '•'}
                        <span className="ml-1">{transaction.status}</span>
                      </span>
                    </td>
                  )}
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(transaction.id)}
                        className="text-gray-400 hover:text-indigo-600"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};

export default ProductTransactionTable;