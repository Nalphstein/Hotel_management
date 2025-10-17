'use client';
import React from 'react';
import ProfileComponent from '../../vendors-comps/pages/Profile';
import VendorLayout from '../components/VendorLayout';

const VendorProfilePage = () => {
  return (
    <VendorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileComponent />
      </div>
    </VendorLayout>
  );
};

export default VendorProfilePage;