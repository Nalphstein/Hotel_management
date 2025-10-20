'use client';
import React, { useState, useEffect } from 'react';
import { MoreVerticalIcon, TrendingUpIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed
import { db } from '../../../lib/firebase/config';      // Adjust path as needed
import { doc, getDoc } from 'firebase/firestore';

// --- Type Definition for the stats object in Firestore ---
interface ChatStats {
  avgResponseTimeSeconds: number;
  changeVsLastMonth: number;
  // We'll keep the chart data static for this example, but it could also be pre-calculated
}

// Static chart data, as calculating this on the fly is complex
const chartData = [
  { name: 'Mon', value: 20 }, { name: 'Tue', value: 30 }, { name: 'Wed', value: 25 },
  { name: 'Thu', value: 40 }, { name: 'Fri', value: 35 }, { name: 'Sat', value: 50 },
  { name: 'Sun', value: 45 }
];

const ChatPerformanceCard = () => {
  const { user } = useAuth(); // Get the current authenticated vendor

  // --- State Management ---
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Effect to Fetch Pre-calculated Stats ---
  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          // Fetch the main user document to get the 'chatStats' map
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists() && docSnap.data().chatStats) {
            setStats(docSnap.data().chatStats as ChatStats);
          } else {
            // Set default/empty state if no stats are found
            setStats({ avgResponseTimeSeconds: 0, changeVsLastMonth: 0 });
          }
        } catch (error) {
          console.error("Error fetching chat stats:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  // Helper function to format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    if (isNaN(totalSeconds) || totalSeconds === 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-700">Chat Performance</h3>
            <p className="text-xs text-gray-400">Avg. response time</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVerticalIcon size={16} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="mt-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {formatTime(stats?.avgResponseTimeSeconds ?? 0)}
            </h2>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-green-500">
                <TrendingUpIcon size={14} />
                <span className="ml-1 text-xs font-medium">{stats?.changeVsLastMonth ?? 0}%</span>
              </div>
              <span className="ml-2 text-xs text-gray-400">From last month</span>
            </div>
          </div>
        )}
        
        <div className="h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelFormatter={() => ''}
                formatter={(value: number) => [`${value} chats`, 'Performance']}
              />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChatPerformanceCard;