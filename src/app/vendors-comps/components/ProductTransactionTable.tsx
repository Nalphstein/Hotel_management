import React from 'react';
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
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600">
              <FilterIcon size={14} className="mr-1.5" />
              Filter
            </button>
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600">
              <SettingsIcon size={14} className="mr-1.5" />
              Customize
            </button>
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600">
              <DownloadIcon size={14} className="mr-1.5" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-3 font-medium w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </th>
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Order Date</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => <tr key={index} className="border-b border-gray-100 text-sm">
                  <td className="py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="py-4 text-gray-600 font-medium">
                    {transaction.id}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                        {transaction.icon}
                      </span>
                      {transaction.product}
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{transaction.date}</td>
                  <td className="py-4 font-medium">{transaction.price}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : transaction.status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {transaction.status === 'Completed' && '•'}
                      {transaction.status === 'Unpaid' && '•'}
                      {transaction.status === 'Pending' && '•'}
                      <span className="ml-1">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <EditIcon size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
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