import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesOverviewCard = () => {
  const [timeframe, setTimeframe] = useState('Weekly');

  // Define data for different timeframes
  const weeklyData = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 1800 },
    { name: 'Wed', value: 1400 },
    { name: 'Thu', value: 2200 },
    { name: 'Fri', value: 1900 },
    { name: 'Sat', value: 2400 },
    { name: 'Sun', value: 2000 }
  ];

  const monthlyData = [
    { name: 'Week 1', value: 8500 },
    { name: 'Week 2', value: 9200 },
    { name: 'Week 3', value: 7800 },
    { name: 'Week 4', value: 10500 }
  ];

  const yearlyData = [
    { name: 'Jan', value: 38000 },
    { name: 'Feb', value: 42000 },
    { name: 'Mar', value: 39000 },
    { name: 'Apr', value: 45000 },
    { name: 'May', value: 41000 },
    { name: 'Jun', value: 48000 }
  ];

  // Use useMemo to compute data based on timeframe
  const chartData = useMemo(() => {
    switch (timeframe) {
      case 'Monthly':
        return monthlyData;
      case 'Yearly':
        return yearlyData;
      case 'Weekly':
      default:
        return weeklyData;
    }
  }, [timeframe]);

  // Update tooltip formatter based on timeframe
  const getTooltipLabel = (label) => {
    switch (timeframe) {
      case 'Monthly':
        return `${label}, February 2025`;
      case 'Yearly':
        return `${label} 2025`;
      case 'Weekly':
      default:
        return `${label}, 13 February 2025`;
    }
  };

  return <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">Sales Overview</h3>
            <p className="text-xs text-gray-400">
              Monitor sales trends and gain insights to growth
            </p>
          </div>
          <div className="relative">
            <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={value => `$${value}`} />
              <Tooltip formatter={value => [`$${value}`, 'Sales']} labelFormatter={getTooltipLabel} contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }} />
              <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
};

export default SalesOverviewCard;