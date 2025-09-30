'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log('Forgot password request for:', email);
    setIsSubmitted(true);
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
                
                {/* Shopping Scene Illustration */}
                <div className="bg-gradient-to-br from-orange-200 to-blue-200 rounded-3xl p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="relative">
                      {/* Woman with shopping bag */}
                      <div className="absolute left-4 bottom-8">
                        <div className="w-12 h-12 bg-red-500 rounded-full mb-2"></div>
                        <div className="w-8 h-16 bg-red-600 rounded mx-auto mb-2"></div>
                        <div className="w-6 h-8 bg-blue-600 rounded mx-auto"></div>
                      </div>
                      
                      {/* Phone/Device with Sale */}
                      <div className="bg-yellow-400 rounded-2xl p-6 mb-4 relative ml-16 min-h-[120px]">
                        <div className="bg-blue-500 rounded-t-lg h-4 mb-2"></div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-blue-900 mb-1">BLACK</div>
                          <div className="text-lg font-bold text-blue-900 mb-1">FRIDAY</div>
                          <div className="text-2xl font-bold text-blue-900">50%</div>
                          <div className="text-sm font-bold text-blue-900">OFF</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Account Recovery
                      </h3>
                      <p className="text-sm text-gray-600">
                        We'll help you get back into your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forgot Password Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {!isSubmitted ? (
                <>
                  {/* Heading */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Forgot password?
                    </h2>
                    <p className="text-gray-600">
                      Don't worry, it happens enter email or phone number associated with your account.
                    </p>
                  </div>

                  {/* Forgot Password Form */}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email/Phone Field */}
                    <div>
                      <input
                        id="email"
                        name="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Email or phone number"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Submit
                      </button>
                    </div>
                  </form>

                  {/* Back to Login Link */}
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                      Remember your password?{' '}
                      <a href="/login" className="font-medium text-orange-500 hover:text-orange-600">
                        Back to Sign In
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                /* Success Message */
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Check your email
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Try another email
                    </button>
                    
                    <a
                      href="/login"
                      className="block w-full text-center bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Back to Sign In
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}