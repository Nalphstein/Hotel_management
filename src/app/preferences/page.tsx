'use client';
import { useState, useEffect } from 'react';

export default function PreferencesPage() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [userType, setUserType] = useState<'user' | 'vendor'>('user');

  // Check user type on component mount
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUserType(parsedUserData.userType || 'user');
      } catch (error) {
        console.log('Error parsing user data, defaulting to user type');
      }
    }
  }, []);

  const preferences = [
    'Gadgets', 'Food', 'Clothing',
    'Stationary', 'Services', 'Skincare',
    'Books', 'Supplies', 'Essentials',
    'Laundry Services', 'Aesthetics', 'Books'
  ];

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSkip = () => {
    // Redirect based on user type
    if (userType === 'vendor') {
      // Redirect to vendor dashboard for vendors
      window.location.href = '/dashboard/vendor';
    } else {
      // Redirect to regular dashboard for users
      window.location.href = '/dashboard';
    }
  };

  const handleContinue = () => {
    // Save preferences and redirect to dashboard
    console.log('Selected preferences:', selectedPreferences);
    // Here you would typically save to backend/localStorage
    localStorage.setItem('userPreferences', JSON.stringify(selectedPreferences));
    
    // Redirect based on user type
    if (userType === 'vendor') {
      // Redirect to vendor dashboard for vendors
      window.location.href = '/dashboard/vendor';
    } else {
      // Redirect to regular dashboard for users
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Logo and Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-8">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <img src="/Frame.svg" alt="Horizon Logo" className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-bold text-gray-900">Horizon</span>
                </div>
                <div>
                   <img src="/sign_in.svg" alt="" />
                </div>
                
              
              </div>
            </div>

            {/* Right Side - Preferences Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Select your preference
                </h2>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Customize your product preference
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Choose the products that matter to you the most so you can experience seamless shopping
                  </p>
                </div>
              </div>

              {/* Preference Categories */}
              <div className="space-y-4 mb-8">
                <div className="flex flex-wrap gap-3">
                  {preferences.map((preference, index) => (
                    <button
                      key={index}
                      onClick={() => togglePreference(preference)}
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        selectedPreferences.includes(preference)
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {preference}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-800 text-lg font-medium"
                >
                  ← Skip
                </button>
                
                <button
                  onClick={handleContinue}
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}