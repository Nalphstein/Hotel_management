'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { CheckCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCheckout } from '../../../context/CheckoutContext';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string>;
  vendorName: string;
  status: string;
  createdAt: any; // Firestore timestamp
}

export default function OrderSuccessPage() {
    const params = useParams();
    const orderId = params?.orderId as string;
    
    const { item } = useCheckout(); // Get the item from checkout context
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper to format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
    };

    // Helper to format date
    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        // Handle both Firestore Timestamp and Date objects
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    // Create order object from checkout item
    useEffect(() => {
        if (item && orderId) {
            // Debug log to see what data we're receiving
            console.log("Order success page received item:", item);
            
            const orderData: Order = {
                id: orderId,
                orderId: orderId,
                productName: item.name,
                productImage: item.image,
                price: item.price,
                quantity: item.quantity || 1,
                selectedOptions: item.selectedOptions || {},
                vendorName: item.vendorName || 'Vendor',
                status: 'pending',
                createdAt: new Date()
            };
            
            // Debug log to see what we're creating
            console.log("Order data created:", orderData);
            
            // Store order in localStorage to ensure it appears in profile
            try {
                const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                // Check if order already exists to avoid duplicates
                const orderExists = existingOrders.some((o: any) => o.orderId === orderId);
                if (!orderExists) {
                    existingOrders.push(orderData);
                    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
                    console.log("Order added to localStorage:", orderId);
                }
            } catch (storageError) {
                console.warn("Could not store order in localStorage:", storageError);
            }
            
            setOrder(orderData);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [item, orderId]);

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
                    <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center mb-6">
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-mono font-semibold text-lg">{orderId}</p>
                    </div>

                    <div className="border rounded-lg overflow-hidden mb-6">
                        <div className="flex items-center space-x-4 p-4">
                            {order ? (
                                <>
                                    <img 
                                        src={order.productImage} 
                                        alt={order.productName} 
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-grow text-left">
                                        <p className="font-semibold text-gray-800">{order.productName}</p>
                                        <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-800">{formatPrice(order.price)}</p>
                                </>
                            ) : (
                                <>
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                    <div className="flex-grow text-left">
                                        <p className="font-semibold text-gray-800">Product Name</p>
                                        <p className="text-sm text-gray-500">Qty: 1</p>
                                    </div>
                                    <p className="font-bold text-gray-800">{formatPrice(9999)}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {order && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Vendor</span>
                                <span className="font-medium">{order.vendorName || 'Vendor'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Date</span>
                                <span className="font-medium">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium capitalize">{order.status}</span>
                            </div>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mb-8">
                        You will receive an email confirmation shortly with your order details.
                        You can track your order status from your profile page.
                    </p>

                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <span className="w-full block bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 text-center">
                                Continue Shopping
                            </span>
                        </Link>
                        <Link href={`/order-tracking/${orderId}`}>
                            <span className="w-full block bg-white text-gray-800 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 text-center">
                                Track Order
                            </span>
                        </Link>
                        <Link href="/dashboard/profile">
                            <span className="w-full block bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 text-center">
                                View Order History
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}