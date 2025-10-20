'use client';
import React from 'react';

// --- Imports for Layout and Security ---
import VendorLayout from '../components/VendorLayout';
import VendorProtectedRoute from '../../components/VendorProtectedRoute'; // Secures the page for vendors only

// --- The UI and Logic Component ---
import ProfileComponent from '../../vendors-comps/pages/Profile'; // The detailed profile component

/**
 * This is the main page component for the `/vendor/profile` route.
 * Its primary job is to structure the page with the correct layout and security.
 */
const VendorProfilePage = () => {
  return (
    // VendorProtectedRoute ensures only users with `userType: 'vendor'` can access this.
    // It will handle loading states and redirection if the user is not a vendor.
    <VendorProtectedRoute>
      <VendorLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* The ProfileComponent contains all the visual elements and logic for the profile. */}
          <ProfileComponent />
        </div>
      </VendorLayout>
    </VendorProtectedRoute>
  );
};

export default VendorProfilePage;