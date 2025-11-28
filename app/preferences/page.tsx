'use client';
import { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext'; // Add this import
// 1. Import Firebase services and types
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase/config'; // Adjust path if needed

export default function PreferencesPage() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const { showAlert } = useAlert(); // Add this line to use the alert context
  
  // 2. Add state for user, loading, and submission status
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'user' | 'vendor'>('user');
  const [loading, setLoading] = useState(true); // Page loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state

  // 3. Use onAuthStateChanged to get the current user and their data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user type from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserType(userDocSnap.data().userType || 'user');
        } else {
          console.error("User document not found!");
          // Handle case where user exists in Auth but not Firestore
          window.location.href = '/signup'; 
        }
      } else {
        // No user is signed in, redirect to login
        window.location.href = '/login';
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Cleaned up preferences array to remove duplicates
  const preferences = [
    ...new Set([
      'Gadgets', 'Food', 'Clothing', 'Stationary', 'Services', 'Skincare',
      'Books', 'Supplies', 'Essentials', 'Laundry Services', 'Aesthetics'
    ])
  ];

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSkip = () => {
    // Redirect logic remains the same
    if (userType === 'vendor') {
      window.location.href = '/dashboard/vendor';
    } else {
      window.location.href = '/dashboard';
    }
  };

  // 4. Update handleContinue to save data to Firestore
  const handleContinue = async () => {
    if (!user) {
      console.error("No user found to save preferences for.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      // Add the 'preferences' array to the user's document
      await updateDoc(userDocRef, {
        preferences: selectedPreferences
      });

      // Redirect after successful save
      handleSkip(); // Re-use the same redirect logic

    } catch (error) {
      console.error("Error saving preferences:", error);
      showAlert("Could not save your preferences. Please try again.", "error"); // Use custom alert instead of native alert
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Add a loading state to the UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
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

            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

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

              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-800 text-lg font-medium"
                >
                  ← Skip
                </button>
                
                <button
                  onClick={handleContinue}
                  // 6. Disable button while submitting
                  disabled={isSubmitting}
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:bg-gray-400"
                >
                  {/* Change text during submission */}
                  {isSubmitting ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}