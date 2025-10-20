import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SalesCategoriesCard = () => {
  const [timeframe, setTimeframe] = useState('Weekly');

  // Define data for different timeframes
  const weeklyData = [
    { name: 'Smartphones', value: 3843, color: '#4338ca' },
    { name: 'Laptops & PC', value: 755, color: '#8b5cf6' },
    { name: 'Accessories', value: 1650, color: '#c4b5fd' }
  ];

  const monthlyData = [
    { name: 'Smartphones', value: 15843, color: '#4338ca' },
    { name: 'Laptops & PC', value: 3755, color: '#8b5cf6' },
    { name: 'Accessories', value: 6650, color: '#c4b5fd' }
  ];

  const yearlyData = [
    { name: 'Smartphones', value: 189843, color: '#4338ca' },
    { name: 'Laptops & PC', value: 45755, color: '#8b5cf6' },
    { name: 'Accessories', value: 81650, color: '#c4b5fd' }
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

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  return <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-700">Sales Categories</h3>
            <p className="text-xs text-gray-400">
              Your sales grouped by categories
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
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="relative h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-gray-500 text-xs">Total Sales</p>
              <h3 className="text-lg font-bold">
                {total.toLocaleString()} Units
              </h3>
            </div>
          </div>
          <div className="w-full mt-4 space-y-2">
            {chartData.map((item, index) => <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                backgroundColor: item.color
              }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {item.value.toLocaleString()} Units
                </span>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};

export default SalesCategoriesCard;