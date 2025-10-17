import React from 'react';
import { XIcon, TruckIcon, CheckIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
const OrderDetailsModal = ({
  order,
  onClose,
  onUpdateStatus
}) => {
  const getStatusIcon = status => {
    switch (status) {
      case 'Completed':
        return <CheckIcon size={16} className="text-green-500" />;
      case 'Processing':
        return <ClockIcon size={16} className="text-blue-500" />;
      case 'Shipped':
        return <TruckIcon size={16} className="text-purple-500" />;
      case 'Pending':
        return <ClockIcon size={16} className="text-yellow-500" />;
      case 'Cancelled':
        return <AlertTriangleIcon size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className="ml-2 text-gray-500">{order.id}</span>
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
              <p className="font-medium">{order.customer}</p>
              <p className="text-gray-600">{order.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Order Information
              </h3>
              <p className="font-medium">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
              <div className="flex items-center mt-1">
                <span className="mr-2">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Shipping Address
              </h3>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Payment Information
              </h3>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Order Items
          </h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-2 font-medium">Item</th>
                  <th className="px-4 py-2 font-medium">Price</th>
                  <th className="px-4 py-2 font-medium">Quantity</th>
                  <th className="px-4 py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => <tr key={item.id} className="border-b border-gray-200 last:border-0">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>)}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td className="px-4 py-3" colSpan={3} align="right">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Update Order Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(status => <button key={status} onClick={() => onUpdateStatus(status)} disabled={order.status === status} className={`px-3 py-1 rounded-md text-sm ${order.status === status ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {status}
                </button>)}
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