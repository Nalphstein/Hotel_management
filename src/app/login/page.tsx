'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login authentication
    console.log('Login attempt:', formData);
    
    // Simulate successful login
    // In a real app, you would get user type from the backend
    const userData = localStorage.getItem('userData');
    let userType = 'user'; // Default to user
    
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        userType = parsedUserData.userType || 'user';
      } catch (error) {
        console.log('Error parsing user data, defaulting to user type');
      }
    }
    
    localStorage.setItem('userData', JSON.stringify({
      username: formData.username,
      userType: userType
    }));
    
    // Simulate authentication token for existing user
    localStorage.setItem('authToken', 'existing_user_token');
    
    // Redirect based on user type
    if (userType === 'vendor') {
      // Redirect to vendor dashboard for vendors
      window.location.href = '/vendor';
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
            
            {/* Left Side - Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-8">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <img src="/Frame.svg" alt="Horizon Logo" className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-bold text-gray-900">Horizon</span>
                </div>
                <img src="/sign_in.svg" alt="" className='w-90 h-90' />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {/* Tab Navigation */}
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <div className="flex-1 text-center py-2 bg-orange-400 text-white rounded-md font-medium">
                  Sign in
                </div>
                <a href="/signup" className="flex-1 text-center py-2 text-gray-600 hover:text-gray-800">
                  Sign Up
                </a>
              </div>

              {/* Sign in heading and description */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign in
                </h2>
                <p className="text-gray-600">
                  Enter your login information and have access to goodness!
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-500"
                    placeholder="Username"
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-500 pr-12"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                  </button>
                </div>

                {/* Remember me and Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-400 focus:ring-orange-500 border-gray-300 rounded mr-2"
                    />
                    <label htmlFor="remember-me" className="text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="/forgot-password" className="text-orange-400 hover:text-orange-500 text-sm">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium w-full"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}