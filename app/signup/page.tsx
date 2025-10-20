'use client';
import { useState } from 'react';
// Import Firebase auth and Firestore services
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase/config'; // Adjust this path if your config is elsewhere

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    othername: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'user'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      handleNext();
      return;
    }

    // --- Final Submission Logic ---
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create user with email and password in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Save additional user data to the "users" collection in Firestore
      // We use the user's UID from Auth as the document ID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: formData.username,
        othername: formData.othername,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        userType: formData.userType,
        createdAt: new Date(),
      });

      // 3. Redirect based on user type
      if (formData.userType === 'vendor') {
        // Redirect to profile page for vendors to complete their profile
        window.location.href = '/vendor/profile';

      } else {
        window.location.href = '/preferences';
      }
      
    } catch (err: any) {
      // Handle Firebase errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email address is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('The password is too weak.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
          console.error("Signup Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  
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
                  <span className="text-2xl font-bold text-gray-900">Horizon</span>
                </div>
                <div>
                  <img src="/sign_out-name.svg" alt="" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <a href="/login" className="flex-1 text-center py-2 text-gray-600 hover:text-gray-800">
                  Sign in
                </a>
                <div className="flex-1 text-center py-2 bg-orange-400 text-white rounded-md font-medium">
                  Sign Up
                </div>
              </div>

              <div className="flex justify-center space-x-8 mb-8">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 transition-colors ${
                    currentStep === 1 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={`text-sm font-medium transition-colors ${
                    currentStep === 1 ? 'text-orange-500' : 'text-gray-600'
                  }`}>Name</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 transition-colors ${
                    currentStep === 2 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={`text-sm font-medium transition-colors ${
                    currentStep === 2 ? 'text-orange-500' : 'text-gray-600'
                  }`}>Contact</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 transition-colors ${
                    currentStep === 3 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={`text-sm font-medium transition-colors ${
                    currentStep === 3 ? 'text-orange-500' : 'text-gray-600'
                  }`}>Password</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Step 1: Name Fields */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <input
                        id="username" name="username" type="text" value={formData.username}
                        onChange={handleInputChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-orange-500"
                        placeholder="Username"
                      />
                      <p className="mt-2 text-xs text-gray-600">
                        Surname must correspond with your bank details.
                      </p>
                    </div>

                    <div>
                      <input
                        id="othername" name="othername" type="text" value={formData.othername}
                        onChange={handleInputChange} required
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Input Other Name"
                      />
                      <p className="mt-2 text-xs text-gray-600">
                        Other names must correspond with your bank details.
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        I want to:
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            id="user-type-user" name="userType" type="radio" value="user"
                            checked={formData.userType === 'user'} onChange={handleInputChange}
                            className="h-4 w-4 text-gray-900 text-orange-500 focus:ring-orange-500 border-gray-300"
                          />
                          <label htmlFor="user-type-user" className="ml-3 block text-sm text-gray-700">
                            <span className="font-medium">Buy products & services</span>
                            <p className="text-gray-500 text-xs mt-1">Browse and purchase from vendors</p>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="user-type-vendor" name="userType" type="radio" value="vendor"
                            checked={formData.userType === 'vendor'} onChange={handleInputChange}
                            className="h-4 w-4 text-gray-900 text-orange-500 focus:ring-orange-500 border-gray-300"
                          />
                          <label htmlFor="user-type-vendor" className="ml-3 block text-sm text-gray-700">
                            <span className="font-medium">Sell products & services</span>
                            <p className="text-gray-500 text-xs mt-1">Create a vendor account to sell</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Contact Fields */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <input
                        id="email" name="email" type="email" value={formData.email}
                        onChange={handleInputChange} required
                        className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Email"
                      />
                      <p className="mt-2 text-xs text-gray-600">
                        Required for pin resetting and withdrawal requests.
                      </p>
                    </div>

                    <div>
                      <input
                        id="phone" name="phone" type="tel" value={formData.phone}
                        onChange={handleInputChange} required
                        className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Phone number"
                      />
                       <p className="mt-2 text-xs text-gray-600">
                        Required for pin resetting and withdrawal requests.
                      </p>
                    </div>
                  </>
                )}

                {/* Step 3: Password Fields */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <input
                        id="password" name="password" type="password" value={formData.password}
                        onChange={handleInputChange} required
                        className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Password"
                      />
                       <p className="mt-2 text-xs text-gray-600">
                        Must be at least 6 characters long.
                      </p>
                    </div>

                    <div>
                      <input
                        id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword}
                        onChange={handleInputChange} required
                        className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </>
                )}
                
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <div className="flex justify-between items-center pt-6">
                  <button
                    type="button" onClick={handlePrevious}
                    className={`text-gray-600 hover:text-gray-800 text-lg font-medium ${
                      currentStep === 1 ? 'invisible' : 'visible'
                    }`}
                  >
                    ← Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:bg-gray-400"
                  >
                    {loading ? 'Creating...' : (currentStep === 3 ? 'Create Account' : 'Next')}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="font-medium text-orange-500 hover:text-orange-600">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}