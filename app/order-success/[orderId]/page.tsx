'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { CheckCircleIcon } from 'lucide-react';

export default function OrderSuccessPage() {
    const params = useParams();
    const orderId = params?.orderId as string;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
                    <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-mono font-semibold text-lg">{orderId}</p>
                    </div>

                    <p className="text-sm text-gray-500 mb-8">
                        You will receive an email confirmation shortly with your order details.
                        In a real app, this page would fetch the order details from Firestore to display a full receipt.
                    </p>

                    <Link href="/dashboard">
                        <span className="w-full block bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
                            Continue Shopping
                        </span>
                    </Link>
                </div>
            </div>
        </ProtectedRoute>
    );
}