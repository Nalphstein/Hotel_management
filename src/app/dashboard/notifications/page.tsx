'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'order' | 'sale' | 'payment' | 'product';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionText?: string;
  actionLink?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order ORD-2943 has been delivered. Please let us know your feedback!',
      time: '2 hours ago',
      isRead: false,
      actionText: 'View Order',
      actionLink: '/dashboard/profile'
    },
    {
      id: '2',
      type: 'sale',
      title: 'Flash Sale: 24 Hours Only!',
      message: 'Get up to 30% off on all Apple devices - Limited time offer!',
      time: 'Yesterday',
      isRead: false,
      actionText: 'View Offers',
      actionLink: '/dashboard'
    },
    {
      id: '3',
      type: 'payment',
      title: 'New Payment Method Added',
      message: 'You\'ve successfully added a new credit card ending in 4567 to your account.',
      time: '2 days ago',
      isRead: true
    },
    {
      id: '4',
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order ORD-2940 has been shipped. Estimated delivery: May 25, 2024.',
      time: '3 days ago',
      isRead: true,
      actionText: 'View Details',
      actionLink: '/dashboard/profile'
    },
    {
      id: '5',
      type: 'product',
      title: 'New MacBook Pro Models Available',
      message: 'Checkout the new MacBook Pro is now available. Check it out!',
      time: '1 week ago',
      isRead: true,
      actionText: 'View Items',
      actionLink: '/dashboard'
    }
  ]);

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotionsOffers: true,
    accountActivity: true,
    newProductArrivals: true
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case 'sale':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      case 'product':
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17v2a2 2 0 002 2h6m-6-4V9a2 2 0 012-2h6" />
            </svg>
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {getNotificationIcon(notification.type)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          {notification.actionText && notification.actionLink && (
                            <Link href={notification.actionLink}>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                                {notification.actionText}
                              </button>
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.time}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order Updates</h3>
                    <p className="text-sm text-gray-600">Get notified about your order status</p>
                  </div>
                  <button
                    onClick={() => togglePreference('orderUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.orderUpdates ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Promotions & Offers</h3>
                    <p className="text-sm text-gray-600">Receive deals and special discounts</p>
                  </div>
                  <button
                    onClick={() => togglePreference('promotionsOffers')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.promotionsOffers ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.promotionsOffers ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Account Activity</h3>
                    <p className="text-sm text-gray-600">Security alerts and account updates</p>
                  </div>
                  <button
                    onClick={() => togglePreference('accountActivity')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.accountActivity ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.accountActivity ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">New Product Arrivals</h3>
                    <p className="text-sm text-gray-600">Be the first to know about new products</p>
                  </div>
                  <button
                    onClick={() => togglePreference('newProductArrivals')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.newProductArrivals ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.newProductArrivals ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}