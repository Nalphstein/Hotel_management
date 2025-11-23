'use client';
import { useCheckout } from '../../../context/CheckoutContext';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase/config';
import { collection, addDoc, doc, serverTimestamp } from 'firebase/firestore';

// --- Import the Paystack clone modal component ---
import PaystackCloneModal from '../../components/PaystackCloneModal';

// This function creates an order record.
async function createOrderInFirestore(user: any, item: any): Promise<string> {
    console.log("Creating order for user:", user.uid, "with item:", item);
    
    try {
        // Generate a unique order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Get user's display name
        let clientName = 'Anonymous Customer';
        if (user.username) {
            clientName = user.username;
        } else if (user.othername) {
            clientName = user.othername;
        } else if (user.email) {
            clientName = user.email.split('@')[0];
        }
        
        // Create order object with correct field names for Firestore rules
        const orderData = {
            orderId: orderId,
            buyerId: user.uid,  // Changed from userId to buyerId to match rules
            clientName: clientName,
            clientEmail: user.email,
            productId: item.productId || item.id,
            productName: item.name,
            productImage: item.image,
            vendorId: (item.vendorId && typeof item.vendorId === 'string' && item.vendorId.trim() !== '') ? item.vendorId : null,
            vendorName: item.vendorName || 'Vendor',
            price: item.price,
            quantity: item.quantity || 1,
            selectedOptions: item.selectedOptions || {},
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        // Validate required fields before attempting to save
        if (!orderData.vendorId) {
            throw new Error("Vendor information is missing. Cannot create order.");
        }
        
        // Save order to Firestore
        const ordersRef = collection(db, 'orders');
        const orderDoc = await addDoc(ordersRef, orderData);
        
        // Also add order reference to user's subcollection
        if (user.uid) {
            try {
                const userOrdersRef = collection(db, 'users', user.uid, 'orders');
                await addDoc(userOrdersRef, {
                    orderId: orderId,
                    orderRef: doc(db, 'orders', orderDoc.id),
                    createdAt: serverTimestamp()
                });
            } catch (userOrderError) {
                console.warn("Could not add order to user's subcollection:", userOrderError);
            }
        }
        
        // If vendorId exists, also add order reference to vendor's subcollection
        if (item.vendorId) {
            try {
                const vendorOrdersRef = collection(db, 'users', item.vendorId, 'vendorOrders');
                await addDoc(vendorOrdersRef, {
                    orderId: orderId,
                    orderRef: doc(db, 'orders', orderDoc.id),
                    clientId: user.uid,
                    clientName: clientName,
                    clientEmail: user.email,
                    createdAt: serverTimestamp()
                });
            } catch (vendorOrderError) {
                console.warn("Could not add order to vendor's subcollection:", vendorOrderError);
            }
        }
        
        // Store order in localStorage for demo purposes
        try {
            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            existingOrders.push({...orderData, id: orderDoc.id});
            localStorage.setItem('userOrders', JSON.stringify(existingOrders));
            console.log("Order stored in localStorage with ID:", orderId);
        } catch (storageError) {
            console.warn("Could not store order in localStorage:", storageError);
        }
        
        // Return the order ID
        return orderId;
    } catch (error) {
        console.error("Error creating order:", error);
        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes("permission")) {
                throw new Error("Permission denied when creating order. Please check your authentication.");
            } else if (error.message.includes("vendor")) {
                throw new Error("Vendor information is missing. Cannot create order.");
            }
        }
        throw error;
    }
}

export default function CheckoutPage() {
  const { item } = useCheckout(); // Get the item to be purchased from our global context
  const { user } = useAuth();     // Get the current logged-in user
  const router = useRouter();

  // --- State Management for the checkout flow ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false); // For the "Finalizing" state after payment

  // Effect to redirect the user if they land on this page without an item in the context
  useEffect(() => {
    // We add a small delay to ensure the context has had a chance to load,
    // preventing a premature redirect on a slow connection.
    const timer = setTimeout(() => {
        if (!item) {
            router.replace('/dashboard');
        }
    }, 500);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [item, router]);

  // This function is the callback that gets triggered when the Paystack modal reports a successful "payment"
  const handleSuccessfulPayment = async () => {
    if (!user || !item) return;

    // First, close the payment modal
    setIsModalOpen(false);
    
    // Now, show a loading state on the main page while we "create the order"
    setIsCreatingOrder(true);
    
    try {
      // Call our mock function to simulate saving the order to Firestore
      const orderId = await createOrderInFirestore(user, item);
      
      // On success, redirect the user to the success page, passing the new order ID in the URL
      router.push(`/dashboard/order-success/${orderId}`);
    } catch (error) {
      console.error("Order creation failed after payment simulation:", error);
      // Show more specific error message to user
      let errorMessage = "There was an error creating your order record. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
      setIsCreatingOrder(false); // Reset loading state on error
    }
  };

  // Render a loading state while context is loading or if there's no item
  if (!item || !user) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        </ProtectedRoute>
    );
  }

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
          
          {/* Order Summary Section */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h2>
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0"/>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{item.name}</p>
                {/* Display selected options, if any */}
                {Object.entries(item.selectedOptions).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-500 capitalize">{key}: {String(value)}</p>
                ))}
              </div>
              <p className="font-bold text-lg text-gray-800">{formatPrice(item.price)}</p>
            </div>
          </div>

          {/* Payment Section */}
          <div>
             <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Details</h2>
             <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <p className="text-gray-600 text-center">You will be prompted to enter your card details in the next step.</p>
             </div>
          </div>
          
          <div className="mt-8">
            {/* This button's only job is to open the payment modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isCreatingOrder}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              {isCreatingOrder ? 'Finalizing Order...' : `Pay ${formatPrice(item.price)}`}
            </button>
          </div>
        </div>
      </div>

      {/* The Paystack Clone Modal */}
      {/* It is rendered here but remains hidden until `isModalOpen` is true. */}
      {/* We pass it all the necessary data and callback functions it needs to operate. */}
      <PaystackCloneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessfulPayment}
        email={user.email || 'customer@example.com'}
        amount={item.price}
        currency="NGN"
      />
    </ProtectedRoute>
  );
}