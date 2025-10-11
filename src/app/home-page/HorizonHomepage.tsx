"use client"
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

const HorizonHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="relative text-center">
            {/* Top Left Icon */}
            <div className="absolute top-5 -left-5  w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            {/* Top Right Icon */}
            <div className="absolute -bottom-3 right-20 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            {/* Bottom Left Icon */}
            <div className="absolute -bottom-13 left-20 w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            
            {/* Main Heading */}
            <div className="py-3">
              <h1 className="text-4xl md:text-5xl lg:text-4xl text-gray-800 leading-tight mx-auto">
                Horizon is a student based marketplace, created for you to 
                meet vendors and ensure you seamless purchase and 
                satisfaction at your convenience!
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-end">

            {/* Image placeholder 1 - Tallest */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-[280px] sm:h-[320px]">
              <img src="/Rectangle 65.svg" alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            
            {/* Image placeholder 2 - Medium */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-[220px] sm:h-[260px]">
               <img src="/Rectangle 64.svg" alt="" className="w-full h-full object-cover rounded-lg"/>
            </div>
            
            {/* Stats Card - Shortest (center valley) */}
            <div className="bg-slate-700 bg-[url(/111.svg)] bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-white p-6 h-[180px] sm:h-[200px]">
              <div className="text-3xl sm:text-4xl font-bold mb-2">1000+</div>
              <div className="text-xs sm:text-sm text-center text-gray-300">
                students catered for by student businesses
              </div>
            </div>
            
            {/* Image placeholder 3 - Medium */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-[220px] sm:h-[260px]">
               <img src="/Rectangle 62.svg" alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            
            {/* Image placeholder 4 - Tallest */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-[280px] sm:h-[320px]">
               <img src="/Rectangle 63.svg" alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

        {/* Buy, Sell and Request Section */}
     <section className="bg-slate-800 py-16 px-4 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-12 items-center">
            {/* Top Content */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Buy, Sell and Request for Services</h2>
              <p className="text-gray-300 text-lg">
                Join us and experience endless shopping possibilities and happy spending
              </p>
            </div>
            
            {/* Main Image and Reviews */}
            <div className="relative flex justify-center">
              {/* Main circular image */}
              <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center relative z-10">
                <img src="/Download_premium_png.png" alt="Main Shopping" className="w-72 h-72 object-cover rounded-full" />
                <img src="/Paper_preview 1.svg" alt=""  className='absolute -bottom-6 -right-41 w-50 h-90'/>
              </div>
              
              {/* Top Right Review Card */}
              <div className="absolute top-4 right-0 bg-white rounded-lg p-2 shadow-lg max-w-70 z-20">
          
                <div className="grid grid-cols-2 items-center ">
                  <div className="text-black text-sm text-center">It's affordable and campus-friendly!</div>
                  <div className="w-17 h-17 bg-gray-300 rounded-full ml-9 ">
                    <img src="/Ellipse13.png" alt="User" className="w-full h-full object-cover" />
                  </div>
                <div className="flex  ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                </div>
              </div>
              
              {/* Bottom Left Review Card */}
              <div className="absolute bottom-8 left-4 bg-white rounded-lg p-3 shadow-lg max-w-70 z-20">
                <div className="grid grid-cols-2 items-center ">
                  <div className="w-17 h-17 bg-gray-300 rounded-full ml-1">
                    <img src="/Ellipse12.png" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-black text-sm -ml-5">Horizon is absolutely satisfactory!</div>
                <div className="col-end-3">

                <div className="flex -ml-5"  >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                </div>
                </div>
              </div>
              
              {/* Learn More Button */}
              <div className="absolute bottom-4 right-8 z-20">
                <button className="bg-white text-slate-800 px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors text-sm font-medium">
                  <span>Learn More</span>
                  <div className="bg-slate-800 text-white rounded-full p-1.5 ml-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements - Paper Airplanes */}
        <div className="absolute top-10 left-10 w-12 h-12 text-white opacity-30">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        
        <div className="absolute bottom-10 right-10 w-16 h-16 text-white opacity-30">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        
        {/* Additional decorative shopping bag icons */}
        <div className="absolute top-20 right-20 w-8 h-8 text-white opacity-20">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
        
        <div className="absolute bottom-20 left-20 w-6 h-6 text-white opacity-20">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </section>
      {/* Be a Vendor Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Be a Vendor today!</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Connect with students in the university. Buy and sell what you want in your environment's tuition, and more. Connect with them from all round campus and know who you're buying from.
              </p>
              <p className="text-gray-600 mb-6 sm:mb-8">Join Us, It's Free!</p>
              
              <button className="w-45 h-17 bg-slate-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-slate-700 transition-colors text-semibold text-lg">
                Join Us!
              </button>
            </div>
            
            {/* Right Content - Vendor Image */}
            <div className="relative">
              <div className="w-full max-w-[600px] h-[260px] sm:h-[360px] md:h-[420px] lg:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                <img src="/Rectangle 68.png" alt="Vendor" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default HorizonHomepage;