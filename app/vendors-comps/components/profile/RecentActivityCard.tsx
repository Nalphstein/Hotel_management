'use client';
import React, { useState, useEffect } from 'react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../../context/AuthContext'; // Adjust path
import { db } from '../../../../lib/firebase/config';      // Adjust path
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
const getActivityIcon = (type: string) => { /* ... SVG icon logic ... */ };

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