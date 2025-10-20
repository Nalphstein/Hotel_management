'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed
import { db } from '../../../lib/firebase/config';      // Adjust path as needed
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// --- Type Definition for the chart data format ---
// Recharts expects an array of objects with keys like 'name' and 'value'.
interface ChartDataPoint {
  name: string; // e.g., 'Mon', 'Week 1', 'Jan'
  value: number; // The total sales for that period
}

const SalesOverviewCard = () => {
  const { user } = useAuth(); // Get the current authenticated vendor from our context
  
  // --- State Management ---
  const [timeframe, setTimeframe] = useState('Weekly');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Effect to Fetch and Process Sales Data from Firestore ---
  useEffect(() => {
    // Don't run the fetch if the user object isn't available yet
    if (!user) return;

    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        // 1. Determine the date range based on the selected timeframe
        const now = new Date();
        let startDate: Date;

        switch (timeframe) {
          case 'Monthly':
            // Start of the current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'Yearly':
            // Start of the current year
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          case 'Weekly':
          default:
            // Start of the current week (assuming Sunday is the first day)
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            break;
        }
        startDate.setHours(0, 0, 0, 0); // Set to the very beginning of the start day

        // 2. Query Firestore for the vendor's completed orders within the date range
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('vendorId', '==', user.uid),
          where('status', '==', 'completed'),
          where('createdAt', '>=', Timestamp.fromDate(startDate))
        );

        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => doc.data());

        // 3. Aggregate the raw order data into the format needed for the chart
        let aggregatedData: { [key: string]: number } = {};

        if (timeframe === 'Weekly') {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          days.forEach(day => aggregatedData[day] = 0); // Initialize all days to 0

          orders.forEach(order => {
            const dayOfWeek = days[order.createdAt.toDate().getDay()];
            aggregatedData[dayOfWeek] += order.amount;
          });

          setChartData(days.map(day => ({ name: day, value: aggregatedData[day] })));
        } 
        else if (timeframe === 'Monthly') {
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          for (let i = 1; i <= daysInMonth; i++) aggregatedData[i] = 0; // Initialize all days of the month to 0

          orders.forEach(order => {
              const dayOfMonth = order.createdAt.toDate().getDate();
              aggregatedData[dayOfMonth] += order.amount;
          });

          // Format for chart, e.g., { name: '1', value: 1500 }, { name: '2', value: 0 }...
          setChartData(Object.keys(aggregatedData).map(day => ({ name: day, value: aggregatedData[day] })));
        }
        else if (timeframe === 'Yearly') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          months.forEach(month => aggregatedData[month] = 0); // Initialize all months to 0

          orders.forEach(order => {
              const month = months[order.createdAt.toDate().getMonth()];
              aggregatedData[month] += order.amount;
          });

          setChartData(months.map(month => ({ name: month, value: aggregatedData[month] })));
        }

      } catch (error) {
        console.error("Error fetching sales overview data:", error);
        // Optionally, set an error state here to show a message in the UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [user, timeframe]); // This effect re-runs whenever the user logs in or the timeframe changes

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-700">Sales Overview</h3>
            <p className="text-xs text-gray-400">
              Your sales performance for the selected period
            </p>
          </div>
          <div className="relative">
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="h-64 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(value: number) => `$${value/1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesOverviewCard;