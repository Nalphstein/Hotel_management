'use client';
import { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    username: 'Mide John Doe',
    email: 'mide.johnson@example.com',
    phone: '+2347008578574'
  });
  const [activeSection, setActiveSection] = useState('Account Overview');

  useEffect(() => {
    // Load user data
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const user = JSON.parse(savedUserData);
      setUserData({
        username: user.username || 'Mide John Doe',
        email: user.email || 'mide.johnson@example.com',
        phone: user.phone || '+2347008578574'
      });
    }
  }, []);

  const recentOrders = [
    {
      id: 'ORD-2943',
      date: 'Nov 14, 2024',
      product: 'MacBook Air (15 inch, M3 chip)',
      amount: '₦ 2,700,000',
      category: 'Gadgets',
      image: '/api/placeholder/60/60'
    },
    {
      id: 'ORD-2942',
      date: 'Nov 12, 2024', 
      product: 'MacBook Air (15 inch, M3 chip)',
      amount: '₦ 2,700,000',
      category: 'Gadgets',
      image: '/api/placeholder/60/60'
    }
  ];

  const menuItems = [
    { icon: User, label: 'Account Overview', active: true },
    { icon: Package, label: 'Order History', active: false },
    { icon: Settings, label: 'Settings', active: false },
    { icon: LogOut, label: 'Sign Out', active: false, isSignOut: true }
  ];

  const handleSignOut = () => {
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-medium text-gray-900">My Profile</h1>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4">
                  {menuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (item.isSignOut) {
                            handleSignOut();
                          } else {
                            setActiveSection(item.label);
                          }
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors mb-1 ${
                          activeSection === item.label
                            ? 'bg-blue-50 text-blue-600'
                            : item.isSignOut
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeSection === 'Account Overview' && (
                <>
                  {/* Profile Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                          <img 
                            src="/api/placeholder/64/64" 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRDFEMUQ2Ii8+CjxwYXRoIGQ9Ik0zMiA0MEMzNy41MjI4IDQwIDQyIDM1LjUyMjggNDIgMzBDNDIgMjQuNDc3MiAzNy41MjI4IDIwIDMyIDIwQzI2LjQ3NzIgMjAgMjIgMjQuNDc3MiAyMiAzMEMyMiAzNS41MjI4IDI2LjQ3NzIgNDAgMzIgNDBaIiBmaWxsPSIjOUM5Q0ExIi8+CjxwYXRoIGQ9Ik0xNiA1NkMxNiA0OC4yNjggMjMuMjY4IDQyIDMyIDQyQzQwLjczMiA0MiA0OCA0OC4yNjggNDggNTZIMTZaIiBmaWxsPSIjOUM5Q0ExIi8+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-1">Account Overview</h2>
                          <p className="text-gray-500 text-sm">Personal Information</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-gray-900 font-medium">{userData.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <p className="text-gray-900 font-medium">{userData.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <p className="text-gray-900 font-medium">{userData.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {recentOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg overflow-hidden">
                              <img 
                                src={order.image} 
                                alt={order.product}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xs">${order.category.slice(0, 2).toUpperCase()}</div>`;
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{order.id}</span>
                              </div>
                              <p className="text-sm text-gray-500">{order.date}</p>
                              <p className="text-sm text-gray-900">{order.product}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-lg">{order.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            {activeSection === 'Order History' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">{order.category.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{order.id}</span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">{order.category}</span>
                          </div>
                          <p className="text-sm text-gray-600">{order.date}</p>
                          <p className="text-sm text-gray-900">{order.product}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.amount}</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'Settings' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Notifications</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage your notification preferences</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Configure →
                    </button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Privacy</h3>
                    <p className="text-sm text-gray-600 mb-3">Control your privacy settings</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Manage →
                    </button>
                  </div>
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-600 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-500 mb-3">Permanently delete your account and data</p>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Delete Account →
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}