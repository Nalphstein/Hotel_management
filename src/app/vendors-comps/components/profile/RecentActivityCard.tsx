import React from 'react';
const activities = [{
  id: 1,
  type: 'order',
  description: 'New order placed',
  orderId: 'ORD-2025-0005',
  time: '2 hours ago'
}, {
  id: 2,
  type: 'product',
  description: 'Added new product',
  productName: 'MacBook Pro M3',
  time: '1 day ago'
}, {
  id: 3,
  type: 'payment',
  description: 'Payment received',
  amount: '$1,999.00',
  time: '2 days ago'
}, {
  id: 4,
  type: 'customer',
  description: 'New customer registered',
  customerName: 'Emma Johnson',
  time: '3 days ago'
}, {
  id: 5,
  type: 'order',
  description: 'Order status updated',
  orderId: 'ORD-2025-0002',
  status: 'Shipped',
  time: '4 days ago'
}];
const getActivityIcon = type => {
  switch (type) {
    case 'order':
      return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>;
    case 'product':
      return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.27002 6.96002L12 12L20.73 6.96002" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22.08V12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>;
    case 'payment':
      return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>;
    case 'customer':
      return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>;
    default:
      return null;
  }
};
const RecentActivityCard = () => {
  return <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="font-medium text-gray-700 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map(activity => <div key={activity.id} className="flex items-start">
              {getActivityIcon(activity.type)}
              <div className="ml-3">
                <p className="text-sm font-medium">{activity.description}</p>
                {activity.orderId && <p className="text-xs text-gray-500">
                    Order ID: {activity.orderId}
                  </p>}
                {activity.productName && <p className="text-xs text-gray-500">
                    Product: {activity.productName}
                  </p>}
                {activity.amount && <p className="text-xs text-gray-500">
                    Amount: {activity.amount}
                  </p>}
                {activity.customerName && <p className="text-xs text-gray-500">
                    Customer: {activity.customerName}
                  </p>}
                {activity.status && <p className="text-xs text-gray-500">
                    Status: {activity.status}
                  </p>}
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default RecentActivityCard;