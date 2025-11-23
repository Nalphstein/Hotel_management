import React from 'react';
import { XIcon, TruckIcon, CheckIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';

const OrderDetailsModal = ({
  order,
  onClose,
  onUpdateStatus
}) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckIcon size={16} className="text-green-500" />;
      case 'processing':
        return <ClockIcon size={16} className="text-blue-500" />;
      case 'shipped':
        return <TruckIcon size={16} className="text-purple-500" />;
      case 'pending':
        return <ClockIcon size={16} className="text-yellow-500" />;
      case 'cancelled':
        return <AlertTriangleIcon size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Handle both Firestore Timestamp and Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className="ml-2 text-gray-500">{order.orderId}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Customer Information
              </h3>
              <p className="font-medium">{order.clientName}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Order Information
              </h3>
              <p className="font-medium">
                Date: {formatDate(order.createdAt)}
              </p>
              <div className="flex items-center mt-1">
                <span className="mr-2">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Order Item
          </h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
            <div className="flex items-center p-4">
              <img src={order.productImage} alt={order.productName} className="w-16 h-16 object-cover rounded-lg" />
              <div className="ml-4 flex-grow">
                <h4 className="font-medium">{order.productName}</h4>
                {Object.entries(order.selectedOptions).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-500 capitalize">{key}: {String(value)}</p>
                ))}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(order.price)}</p>
                <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                <p className="font-medium mt-1">{formatCurrency(order.price * order.quantity)}</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Update Order Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button 
                  key={status} 
                  onClick={() => {
                    console.log("Update status button clicked, status:", status);
                    console.log("Order object:", order);
                    console.log("onUpdateStatus function:", onUpdateStatus);
                    onUpdateStatus(status);
                  }}
                  disabled={order.status === status}
                  className={`px-3 py-1 rounded-md text-sm ${
                    order.status === status 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>;
};

export default OrderDetailsModal;