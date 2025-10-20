'use client';
import React from 'react';
import StoreCard from '../vendors-comps/components/StoreCard';
import ChatPerformanceCard from '../vendors-comps/components/ChatPerformanceCard';
import SalesOverviewCard from '../vendors-comps/components/SalesOverviewCard';
import SalesCategoriesCard from '../vendors-comps/components/SalesCategoriesCard';
import ProductTransactionTable from '../vendors-comps/components/ProductTransactionTable';
import VendorLayout from './components/VendorLayout';

const VendorDashboard = () => {
  return (
    <VendorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your store and track performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          <StoreCard 
            title="Store" 
            subtitle="Get locally with ease" 
            amount="$14,590" 
            percentage={7.2} 
            trend="up" 
            type="From last month" 
          />

          <ChatPerformanceCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 text-black">
          <div className="lg:col-span-2">
            <SalesOverviewCard />
          </div>
          <div>
            <SalesCategoriesCard />
          </div>
        </div>
        
        <div className="mt-6 text-gray-900">
          <ProductTransactionTable />
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;