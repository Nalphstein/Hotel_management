'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Imports for Firebase and Authentication ---
import ProtectedRoute from '../../components/ProtectedRoute'; // Component to protect this route
import { useAuth } from '../../../context/AuthContext';         // Hook to get the current user
import { db } from '../../../lib/firebase/config';      // Firebase configuration
import {
  collection, query, orderBy, onSnapshot, doc,
  updateDoc, writeBatch, getDocs, where, Timestamp, getDoc
} from 'firebase/firestore'; // Firestore functions

// --- Type Definitions for Data Integrity ---
// Matches the data structure in your Firestore database
interface Notification {
  id: string; // The Firestore document ID
  type: 'order' | 'sale' | 'payment' | 'product';
  title: string;
  message: string;
  createdAt: Timestamp; // Use Firestore's Timestamp for accurate ordering
  isRead: boolean;
  actionText?: string;
  actionLink?: string;
}

interface Preferences {
  orderUpdates: boolean;
  promotionsOffers: boolean;
  accountActivity: boolean;
  newProductArrivals: boolean;
}

export default function NotificationsPage() {
  const { user } = useAuth(); // Get the current authenticated user from our global context

  // --- State Management ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching and Real-time Listener ---
  useEffect(() => {
    if (!user) return; // Don't proceed if the user is not yet loaded

    // 1. Set up a real-time listener for the notifications subcollection
    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));

    // onSnapshot listens for any changes and automatically updates the UI
    const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(fetchedNotifications);
      setIsLoading(false);
    });

    // 2. Fetch the user's notification preferences from their main document
    const userDocRef = doc(db, 'users', user.uid);
    getDoc(userDocRef).then(docSnap => {
      if (docSnap.exists() && docSnap.data().notificationPreferences) {
        setPreferences(docSnap.data().notificationPreferences as Preferences);
      } else {
        // If preferences don't exist in the DB, set a default state
        setPreferences({
          orderUpdates: true,
          promotionsOffers: true,
          accountActivity: true,
          newProductArrivals: true
        });
      }
    });

    // 3. Cleanup: This function is called when the component unmounts
    // It's crucial for preventing memory leaks by detaching the listener.
    return () => {
      unsubscribeNotifications();
    };
  }, [user]); // The dependency array ensures this effect runs when the user object is available

  // --- Firestore Update Handlers ---

  // Mark a single notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
    try {
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      console.error("Error updating notification: ", error);
    }
  };

  // Mark all unread notifications as read using an efficient batch write
  const markAllAsRead = async () => {
    if (!user || notifications.filter(n => !n.isRead).length === 0) return;

    const batch = writeBatch(db);
    const unreadQuery = query(collection(db, 'users', user.uid, 'notifications'), where('isRead', '==', false));
    const unreadSnapshot = await getDocs(unreadQuery);

    unreadSnapshot.docs.forEach(document => {
      batch.update(document.ref, { isRead: true });
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error marking all as read: ", error);
    }
  };

  // Toggle a preference and update the user's document in Firestore
  const togglePreference = async (key: keyof Preferences) => {
    if (!user || !preferences) return;

    const newPrefValue = !preferences[key];
    const userDocRef = doc(db, 'users', user.uid);

    try {
      // Use dot notation to update a specific field within the map
      await updateDoc(userDocRef, {
        [`notificationPreferences.${key}`]: newPrefValue
      });
      // Optimistically update the UI for a snappy feel
      setPreferences(prev => prev ? { ...prev, [key]: newPrefValue } : null);
    } catch (error) {
      console.error("Error updating preferences: ", error);
    }
  };

  // --- Helper Functions ---
  
  // Renders the correct icon based on notification type
  const getNotificationIcon = (type: string) => {
    // Return a React node (JSX element) instead of void
    switch (type) {
      case 'order':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'alert':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
    }
  };
  
  // Format Firestore Timestamp to a readable string (can be improved with a library like date-fns)
  const formatTime = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
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
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50 border border-blue-100 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => !notification.isRead && markAsRead(notification.id)}
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
                                  <Link href={notification.actionLink} className="inline-block mt-2">
                                    <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                      {notification.actionText}
                                    </span>
                                  </Link>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {formatTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" title="Unread"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You have no notifications yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              {preferences && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                      {/* ... Preference toggle sections ... */}
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
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                      </div>
                      {/* Repeat for other preferences */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}