'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed
import { db } from '../../../lib/firebase/config';      // Adjust path as needed
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// --- Type Definition for the chart's data format ---
// This ensures type safety for the data structure Recharts expects.
interface ChartDataPoint {
  name: string; // The category name, e.g., 'Electronics', 'Food'
  value: number; // The total sales amount for that category
  color: string;
}

// --- Predefined color palette for the chart ---
// We will cycle through these colors for the different pie chart segments.
const COLORS = ['#4338ca', '#8b5cf6', '#a78bfa', '#c4b5fd', '#60a5fa', '#f87171', '#fbbf24'];

const SalesCategoriesCard = () => {
  const { user } = useAuth(); // Get the current authenticated vendor from our context
  
  // --- State Management ---
  const [timeframe, setTimeframe] = useState('Weekly');
  const [categoryData, setCategoryData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Effect to Fetch and Process Sales Data from Firestore ---
  useEffect(() => {
    // Don't run the fetch if the user object isn't available yet
    if (!user) return;

    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        // 1. Determine the start date for the query based on the selected timeframe
        const now = new Date();
        let startDate: Date;
        switch (timeframe) {
          case 'Monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'Yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          case 'Weekly':
          default:
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
            break;
        }
        startDate.setHours(0, 0, 0, 0); // Set to the very beginning of the start day

        // 2. Query Firestore for the vendor's completed orders within the calculated date range
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('vendorId', '==', user.uid),
          where('status', '==', 'completed'),
          where('createdAt', '>=', Timestamp.fromDate(startDate))
        );
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => doc.data());

        // 3. Aggregate the raw order data by category
        const salesByCategory: { [key: string]: number } = {};
        orders.forEach(order => {
          const category = order.category || 'Uncategorized';
          salesByCategory[category] = (salesByCategory[category] || 0) + order.amount;
        });

        // 4. Transform the aggregated object into an array of objects for the chart,
        // assigning colors and sorting by value.
        const formattedChartData = Object.entries(salesByCategory)
          .map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length], // Cycle through our predefined colors
          }))
          .sort((a, b) => b.value - a.value); // Sort from largest to smallest category

        setCategoryData(formattedChartData);

      } catch (error) {
        console.error("Error fetching sales by category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [user, timeframe]); // This effect re-runs whenever the user logs in or the timeframe changes

  // Calculate the total sales to display in the center of the chart
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-700">Sales by Category</h3>
            <p className="text-xs text-gray-400">
              Revenue distribution for the period
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
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="relative h-40 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-gray-500 text-xs">Total Sales</p>
              <h3 className="text-lg font-bold text-gray-800">
                {formatCurrency(total)}
              </h3>
            </div>
          </div>

          <div className="w-full mt-4 space-y-2">
            {isLoading ? (
              <p className="text-center text-sm text-gray-500">Calculating categories...</p>
            ) : categoryData.length > 0 ? (
              categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-8">No sales data found for this period.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCategoriesCard;