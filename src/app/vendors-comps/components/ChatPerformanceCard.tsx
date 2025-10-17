import React from 'react';
import { MoreVerticalIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const data = [{
  name: 'Mon',
  value: 20
}, {
  name: 'Tue',
  value: 30
}, {
  name: 'Wed',
  value: 25
}, {
  name: 'Thu',
  value: 40
}, {
  name: 'Fri',
  value: 35
}, {
  name: 'Sat',
  value: 50
}, {
  name: 'Sun',
  value: 45
}];
const ChatPerformanceCard = () => {
  return <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-700">Chat Performance</h3>
            <p className="text-xs text-gray-400">Average response time</p>
          </div>
          <button className="text-gray-400">
            <MoreVerticalIcon size={16} />
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold">00:01:30</h2>
          <div className="flex items-center mt-1">
            <div className="flex items-center text-green-500">
              <span className="ml-1 text-xs font-medium">8%</span>
            </div>
            <span className="ml-2 text-xs text-gray-400">From last month</span>
          </div>
        </div>
        <div className="h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} activeDot={{
              r: 4
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
};
export default ChatPerformanceCard;