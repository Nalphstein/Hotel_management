'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">About Horizon</h1>
          <p className="mt-3 text-xl text-gray-500 max-w-3xl mx-auto">
            We're on a mission to revolutionize how businesses manage their operations through innovative technology solutions.
          </p>
        </div>

        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-12 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    Founded in 2020, Horizon began with a simple idea: technology should empower businesses, not complicate them. 
                    What started as a small team of passionate developers has grown into a company that serves thousands of 
                    businesses worldwide.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Our platform was built from the ground up to address the real challenges faced by modern businesses. 
                    We believe in creating intuitive solutions that save time, reduce costs, and drive growth.
                  </p>
                  <p className="text-gray-600">
                    Today, we continue to innovate and expand our offerings, staying true to our core values of simplicity, 
                    reliability, and customer-first thinking.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
              <p className="text-gray-600">
                We believe in transparency and honesty in all our dealings, building trust with our customers and partners.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries to develop cutting-edge solutions that keep our customers ahead of the curve.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We're committed to fostering strong relationships with our customers, partners, and the broader community.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-12 md:p-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Journey</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-8">
                We're always looking for talented individuals who share our passion for innovation and excellence. 
                If you're interested in joining our team, we'd love to hear from you.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}