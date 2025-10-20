'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase/config';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userType = userData.userType;

        if (userType === 'vendor') {
          window.location.href = '/vendor';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError('User data not found. Please contact support.');
      }
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('Failed to log in. Please check your credentials.');
          console.error("Login Error:", err);
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
                  <span className="text-4xl font-bold text-gray-900">Horizon</span>
                </div>
                <img src="/sign_in.svg" alt="" className='w-90 h-90' />
              </div>
            </div>

            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <div className="flex-1 text-center py-2 bg-orange-400 text-white rounded-md font-medium">
                  Sign in
                </div>
                <a href="/signup" className="flex-1 text-center py-2 text-gray-600 hover:text-gray-800">
                  Sign Up
                </a>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign in
                </h2>
                <p className="text-gray-600">
                  Enter your login information and have access to goodness!
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    // --- CORRECTED LINE ---
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    // --- CORRECTED LINE ---
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Password"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

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

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium w-full disabled:bg-gray-400"
                  >
                    {loading ? 'Logging in...' : 'Login'}
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