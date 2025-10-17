import React from 'react';
import { ShoppingBagIcon, DollarSignIcon, UsersIcon } from 'lucide-react';
const ProfileStats = () => {
  return <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="font-medium text-gray-700 mb-4">Your Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <ShoppingBagIcon size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-lg font-bold">284</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <DollarSignIcon size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-bold">$12,875</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <UsersIcon size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-lg font-bold">182</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileStats;