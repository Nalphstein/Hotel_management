"use client"
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

const HorizonHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Horizon is a student based marketplace, created for you to 
            meet vendors and ensure you seamless purchase and 
            satisfaction at your convenience!
          </h1>
          
          <div className="flex justify-center space-x-16 mt-12">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Grid */}
      <section className="py-16 px-20">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-24">

            {/* Image placeholder 1 */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
              <img src="/Rectangle 65.svg" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Image placeholder 2 */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
               <img src="/Rectangle 64.svg" alt="" className="w-full h-full object-contain"/>
            </div>
            
            {/* Stats Card */}
            <div className="bg-slate-700 bg-[url(/111.svg)] bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-white p-6 min-h-[160px] sm:min-h-[200px]">
              <div className="text-3xl sm:text-4xl font-bold mb-2">1000+</div>
              <div className="text-xs sm:text-sm text-center text-gray-300">
                students catered for by student businesses
              </div>
            </div>
            
            {/* Image placeholder 3 */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
               <img src="/Rectangle 62.svg" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Image placeholder 4 */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
               <img src="/Rectangle 63.svg" alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

        {/* Buy, Sell and Request Section */}
     <section className="bg-slate-800 py-16 px-4 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-10 sm:gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl font-bold mb-4 text-center">Buy, Sell and Request for Services</h2>
              <p className="text-gray-300 text-lg text-center">
                Join us and experience endless shopping possibilities and happy spending
              </p>
              
              {/* Decorative Elements */}
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Main Image and Reviews */}
            <div className="relative">
              <div className="w-80 h-80 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
                <img src="/Download_premium_png.png" alt="Main Shopping" className="w-full h-full object-cover rounded-full" />
              </div>
              
              {/* Review Cards */}
              <div className="absolute -top-2 right-0 sm:top-4 sm:right-4 bg-white rounded-lg p-3 shadow-lg max-w-[75%] sm:max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2 overflow-hidden">
                    <img src="/Ellipse13.png" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-black text-xs sm:text-sm">5★ Reliable and prompt delivery</div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-6 left-2 sm:bottom-8 sm:left-4 bg-white rounded-lg p-3 shadow-lg max-w-[70%] sm:max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2 overflow-hidden">
                    <img src="/Ellipse12.png" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-black text-xs sm:text-sm">Horizon is absolutely spectacular</div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <button className="absolute bottom-2 right-2 sm:bottom-4 sm:right-8 bg-white text-slate-800 px-3 py-2 sm:px-4 sm:py-2 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors text-sm sm:text-base">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {/* Decorative Elements */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-1/4 right-6 sm:right-12 w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 rounded-full"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full"></div>
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
              
              <button className="bg-slate-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-slate-700 transition-colors">
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