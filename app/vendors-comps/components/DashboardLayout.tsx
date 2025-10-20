import React from 'react';
import StoreCard from './StoreCard';
import ChatPerformanceCard from './ChatPerformanceCard';
import SalesOverviewCard from './SalesOverviewCard';
import SalesCategoriesCard from './SalesCategoriesCard';
import ProductTransactionTable from './ProductTransactionTable';
const DashboardLayout = () => {
  return <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StoreCard title="Offline Store" subtitle="Get locally with ease" amount="$14,590" percentage={7.2} trend="up" type="From last month" />
        <StoreCard title="Online Store" subtitle="Get locally with ease" amount="$6,284" percentage={1.8} trend="up" type="From last month" />
        <ChatPerformanceCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <SalesOverviewCard />
        </div>
        <div>
          <SalesCategoriesCard />
        </div>
      </div>
      <div className="mt-6">
        <ProductTransactionTable />
      </div>
    </div>;
};
export default DashboardLayout;