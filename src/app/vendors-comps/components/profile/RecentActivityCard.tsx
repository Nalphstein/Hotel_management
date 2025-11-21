'use client';
import React, { useState, useEffect } from 'react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../../../../context/AuthContext'; // Adjust path
import { db } from '../../../../../../lib/firebase/config.js';      // Adjust path
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

// --- Type Definition for an Activity document ---
interface Activity {
  id: string; // Document ID
  type: 'order' | 'product' | 'payment' | 'customer';
  description: string;
  createdAt: Timestamp;
  details: {
    orderId?: string;
    productName?: string;
    amount?: number;
    customerName?: string;
    status?: string;
  };
}

// --- Your Icon Component (unchanged) ---
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      );
    case 'product':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      );
    case 'payment':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'customer':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
};

const RecentActivityCard = () => {
  const { user } = useAuth(); // Get the current authenticated vendor
  
  // --- State Management ---
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Effect to Listen for Real-Time Activity Updates ---
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Define the query to get the 5 most recent activities for this user
      const activitiesRef = collection(db, 'users', user.uid, 'activities');
      const q = query(activitiesRef, orderBy('createdAt', 'desc'), limit(5));

      // onSnapshot creates a real-time listener.
      // The code inside will re-run automatically whenever the data changes.
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedActivities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];
        setActivities(fetchedActivities);
        setIsLoading(false);
      });

      // Cleanup the listener when the component is unmounted
      return () => unsubscribe();
    }
  }, [user]);

  // Helper to format timestamps into a "time ago" string
  // (In a real app, use a library like date-fns)
  const formatTimeAgo = (timestamp: Timestamp) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.toDate().getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="font-medium text-gray-700 mb-4">Recent Activity</h3>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-sm text-gray-500">No recent activity to display.</div>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start">
                {getActivityIcon(activity.type)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                  {/* Conditionally render details based on the activity type */}
                  {activity.details.orderId && <p className="text-xs text-gray-500">Order ID: {activity.details.orderId}</p>}
                  {activity.details.productName && <p className="text-xs text-gray-500">Product: {activity.details.productName}</p>}
                  {activity.details.amount && <p className="text-xs text-gray-500">Amount: ${activity.details.amount.toFixed(2)}</p>}
                  {activity.details.customerName && <p className="text-xs text-gray-500">Customer: {activity.details.customerName}</p>}
                  {activity.details.status && <p className="text-xs text-gray-500">Status: {activity.details.status}</p>}
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityCard;