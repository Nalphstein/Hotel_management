'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string>;
  buyerId: string;
  buyerEmail: string;
  vendorName: string;
  status: string;
  createdAt: any;
}

export default function VendorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchVendorOrders();
    }
  }, [user]);

  const fetchVendorOrders = async () => {
    try {
      // Listen to main orders collection where vendorId matches current vendor
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('vendorId', '==', user!.uid), orderBy('createdAt', 'desc'));

      // onSnapshot creates a real-time listener.
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Vendor orders snapshot:", snapshot.size, "documents");
        const fetchedOrders: Order[] = [];

        snapshot.forEach((doc) => {
          const orderData: any = doc.data();
          console.log("Order data:", orderData);

          const order = {
            id: doc.id,
            orderId: orderData.orderId,
            productName: orderData.productName,
            productImage: orderData.productImage,
            price: orderData.price,
            quantity: orderData.quantity,
            selectedOptions: orderData.selectedOptions || {},
            buyerId: orderData.buyerId,
            buyerEmail: orderData.buyerEmail || 'customer@example.com',
            vendorName: orderData.vendorName || 'Vendor',
            status: orderData.status || 'pending',
            createdAt: orderData.createdAt
          } as Order;

          fetchedOrders.push(order);
        });

        console.log("Fetched orders:", fetchedOrders);
        setOrders(fetchedOrders);
        setLoading(false);
      }, (error) => {
        console.error("Error in vendor orders listener:", error);
        setLoading(false);
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  // Helper to format date
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    // Handle both Firestore Timestamp and Date objects
    const d = date.toDate ? date.toDate() : new Date(date.seconds * 1000);
    return d.toLocaleDateString();
  };

  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'processing':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className= "flex justify-center items-center h-64" >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" > </div>
        </div>
    );
  }

  return (
    <div className= "space-y-6" >
    <div className="flex justify-between items-center" >
      <h1 className="text-2xl font-bold" > Order Management </h1>
        < p className = "text-gray-600" > { orders.length } orders </p>
          </div>

  {
    orders.length === 0 ? (
      <div className= "bg-white rounded-lg shadow p-8 text-center" >
      <p className="text-gray-500" > You don't have any orders yet.</p>
        </div>
      ) : (
      <div className= "bg-white rounded-lg shadow overflow-hidden" >
      <div className="overflow-x-auto" >
        <table className="min-w-full divide-y divide-gray-200" >
          <thead className="bg-gray-50" >
            <tr>
            <th scope="col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
              Order
              </th>
              < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Product
                </th>
                < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                  Customer
                  </th>
                  < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                    Date
                    </th>
                    < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                      Amount
                      </th>
                      < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                        Status
                        </th>
                        < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                          Actions
                          </th>
                          </tr>
                          </thead>
                          < tbody className = "bg-white divide-y divide-gray-200" >
                          {
                            orders.map((order) => (
                              <tr key= { order.id } className = "hover:bg-gray-50" >
                              <td className="px-6 py-4 whitespace-nowrap" >
                            <div className="text-sm font-medium text-gray-900" >#{ order.orderId } </div>
                            </td>
                            < td className = "px-6 py-4 whitespace-nowrap" >
                            <div className="flex items-center" >
                            <img className="h-10 w-10 rounded-md object-cover" src = { order.productImage } alt = { order.productName } />
                            <div className="ml-4" >
                            <div className="text-sm font-medium text-gray-900" > { order.productName } </div>
                            < div className = "text-sm text-gray-500" > Qty: { order.quantity } </div>
                            </div>
                            </div>
                            </td>
                            < td className = "px-6 py-4 whitespace-nowrap" >
                            <div className="text-sm text-gray-900" > { order.buyerEmail } </div>
                            </td>
                            < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                            { formatDate(order.createdAt)
                          }
                            </td>
                            < td className = "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" >
                              { formatPrice(order.price * order.quantity) }
                              </td>
                              < td className = "px-6 py-4 whitespace-nowrap" >
                                <span className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}` }>
                                  { getStatusIcon(order.status) }
                                  < span className = "ml-1 capitalize" > { order.status } </span>
                                    </span>
                                    </td>
                                    < td className = "px-6 py-4 whitespace-nowrap text-sm font-medium" >
                                    {
                                      order.status !== 'delivered' && order.status !== 'cancelled' && (
                                        <div className="flex space-x-2">
                                        {
                                          order.status === 'pending' && (
                                            <button
                              onClick={ () => updateOrderStatus(order.id, 'processing') }
    disabled = { updatingOrderId === order.id
  }
  className = "bg-blue-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
    >
    { updatingOrderId === order.id ? 'Processing...' : 'Process'
}
</button>
                          )}
{
  order.status === 'processing' && (
    <button
                              onClick={ () => updateOrderStatus(order.id, 'shipped') }
  disabled = { updatingOrderId === order.id
}
className = "bg-indigo-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
  >
  { updatingOrderId === order.id ? 'Shipping...' : 'Ship'}
</button>
                          )}
{
  order.status === 'shipped' && (
    <button
                              onClick={ () => updateOrderStatus(order.id, 'delivered') }
  disabled = { updatingOrderId === order.id
}
className = "bg-green-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
  >
  { updatingOrderId === order.id ? 'Delivering...' : 'Deliver'}
</button>
                          )}
<button
                            onClick={ () => updateOrderStatus(order.id, 'cancelled') }
disabled = { updatingOrderId === order.id}
className = "text-red-600 hover:text-red-900 text-xs disabled:opacity-50"
  >
  { updatingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
</button>
  </div>
                      )}
</td>
  </tr>
                ))}
</tbody>
  </table>
  </div>
  </div>
      )}
</div>
  );
}