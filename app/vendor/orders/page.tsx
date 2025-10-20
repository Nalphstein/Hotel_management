'use client';
import React from 'react';
import OrdersComponent from '../../vendors-comps/pages/Orders';
import VendorLayout from '../components/VendorLayout';

const VendorOrdersPage = () => {
  return (
    <VendorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersComponent />
      </div>
    </VendorLayout>
  );
};

export default VendorOrdersPage;