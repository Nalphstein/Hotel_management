import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, MoreVerticalIcon } from 'lucide-react';
interface StoreCardProps {
  title: string;
  subtitle: string;
  amount: string;
  percentage: number;
  trend: 'up' | 'down';
  type: string;
}
const StoreCard = ({
  title,
  subtitle,
  amount,
  percentage,
  trend,
  type
}: StoreCardProps) => {
  return <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${title === 'Offline Store' ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium ${title === 'Offline Store' ? 'text-white/80' : 'text-gray-500'} text-sm`}>
              {title}
            </h3>
            <p className={`text-xs ${title === 'Offline Store' ? 'text-white/70' : 'text-gray-400'}`}>
              {subtitle}
            </p>
          </div>
          <button className={`${title === 'Offline Store' ? 'text-white/70' : 'text-gray-400'}`}>
            <MoreVerticalIcon size={16} />
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold">{amount}</h2>
          <div className="flex items-center mt-1">
            <div className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
              <span className="ml-1 text-xs font-medium">{percentage}%</span>
            </div>
            <span className={`ml-2 text-xs ${title === 'Offline Store' ? 'text-white/70' : 'text-gray-400'}`}>
              {type}
            </span>
          </div>
        </div>
      </div>
    </div>;
};
export default StoreCard;