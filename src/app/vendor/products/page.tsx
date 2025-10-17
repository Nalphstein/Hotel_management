'use client';
import React from 'react';
import ProductsComponent from '../../vendors-comps/pages/Products';
import VendorLayout from '../components/VendorLayout';

const VendorProductsPage = () => {
  return (
    <VendorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsComponent />
      </div>
    </VendorLayout>
  );
};

export default VendorProductsPage;