'use client';
import React, { useState, useEffect } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CreditCardIcon, KeyIcon, SaveIcon } from 'lucide-react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/config';
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs } from 'firebase/firestore';

// --- Imports for Child Components ---
import ProfileStats from '../components/profile/ProfileStats';
import RecentActivityCard from '../components/profile/RecentActivityCard';

// --- Type Definitions for our Data Structures ---
// This ensures our code is type-safe and matches our Firestore data model.
interface UserProfile {
  username: string;
  othername: string;
  email: string;
  phone: string;
  role?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  profileImage?: string;
  createdAt?: Timestamp;
}

interface PaymentMethod {
    id: string; // The Firestore document ID
    type: string;
    last4: string;
    expiry: string;
}

const ProfileComponent = () => {
  const { user } = useAuth(); // Get the current authenticated user from our context

  // --- State Management ---
  const [userData, setUserData] = useState<UserProfile | null>(null); // For displaying data
  const [formData, setFormData] = useState<UserProfile | null>(null); // For the edit form
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]); // For the subcollection data
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Effect to Fetch All User-Related Data from Firestore ---
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          // Use Promise.all to fetch the main profile and subcollections concurrently for efficiency
          const userDocRef = doc(db, 'users', user.uid);
          const paymentMethodsRef = collection(db, 'users', user.uid, 'paymentMethods');

          const [userDocSnap, paymentMethodsSnap] = await Promise.all([
            getDoc(userDocRef),
            getDocs(paymentMethodsRef)
          ]);

          // Process the main user profile document
          if (userDocSnap.exists()) {
            const fetchedData = userDocSnap.data() as UserProfile;
            setUserData(fetchedData);
            setFormData(fetchedData);
          } else {
            console.error("No user document found for this user!");
          }
          
          // Process the payment methods subcollection documents
          const fetchedMethods = paymentMethodsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as PaymentMethod[];
          setPaymentMethods(fetchedMethods);

        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setIsLoading(false);
        }
      };
      fetchUserData();
    }
  }, [user]); // The dependency array ensures this effect runs when the user object is available

  // Handles changes in the edit form, including the nested 'address' object
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev!,
        [parent]: {
          ...(prev![parent as keyof UserProfile] as object),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  // --- Handles Saving Form Changes to Firestore ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData) return;

    setIsSaving(true);
    const userDocRef = doc(db, 'users', user.uid);
    try {
      // Construct the object with only the fields that are part of the main user document
      const dataToUpdate = {
        username: formData.username,
        othername: formData.othername,
        phone: formData.phone,
        role: formData.role || '',
        address: formData.address || {},
      };
      
      await updateDoc(userDocRef, dataToUpdate);
      
      setUserData(formData); // Update the main display state to reflect changes
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Renders a loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Renders if no user data could be found
  if (!userData) {
    return <div className="text-center py-20">Could not load user profile data.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                {!isEditing && (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-6 mb-4 md:mb-0 bg-gray-200">
                  <img
                    src={userData.profileImage || `https://ui-avatars.com/api/?name=${userData.username}+${userData.othername}&background=random`}
                    alt={`${userData.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{`${userData.username} ${userData.othername}`}</h2>
                  <p className="text-gray-500">{userData.role || 'Vendor'}</p>
                  {userData.createdAt && (
                    <p className="text-gray-500 text-sm mt-1">
                      Member since {userData.createdAt.toDate().toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* TERNARY: RENDER EITHER THE EDITING FORM OR THE DISPLAY VIEW */}
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        {/* --- CORRECTED LINE --- */}
                        <input type="text" name="username" value={formData?.username || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder:text-gray-400" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        {/* --- CORRECTED LINE --- */}
                        <input type="text" name="othername" value={formData?.othername || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder:text-gray-400" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={formData?.email || ''} disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        {/* --- CORRECTED LINE --- */}
                        <input type="text" name="phone" value={formData?.phone || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder:text-gray-400" />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* --- CORRECTED LINES --- */}
                            <input type="text" name="address.street" value={formData?.address?.street || ''} onChange={handleChange} placeholder="Street Address" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"/>
                            <input type="text" name="address.city" value={formData?.address?.city || ''} onChange={handleChange} placeholder="City" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"/>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" name="address.state" value={formData?.address?.state || ''} onChange={handleChange} placeholder="State" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"/>
                                <input type="text" name="address.zip" value={formData?.address?.zip || ''} onChange={handleChange} placeholder="ZIP Code" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"/>
                            </div>
                            <input type="text" name="address.country" value={formData?.address?.country || ''} onChange={handleChange} placeholder="Country" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"/>
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(userData);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium flex items-center disabled:bg-indigo-400"
                    >
                      <SaveIcon size={16} className="mr-1" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center"><MailIcon size={16} className="text-gray-400 mr-2" /><span className="text-gray-800">{userData.email}</span></div>
                      <div className="flex items-center"><PhoneIcon size={16} className="text-gray-400 mr-2" /><span className="text-gray-800">{userData.phone}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
                    <div className="flex items-start">
                      <MapPinIcon size={16} className="text-gray-400 mr-2 mt-0.5" />
                      <div className="text-gray-800">
                        <p>{userData.address?.street}</p>
                        <p>{userData.address?.city}, {userData.address?.state} {userData.address?.zip}</p>
                        <p>{userData.address?.country}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Methods</h3>
                    <div className="space-y-2">
                      {paymentMethods.length > 0 ? (
                        paymentMethods.map(method => (
                          <div key={method.id} className="flex items-center">
                            <CreditCardIcon size={16} className="text-gray-400 mr-2" />
                            <span className="capitalize text-gray-800">{method.type} •••• {method.last4} (expires {method.expiry})</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No payment methods saved.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Security</h3>
                    <button className="flex items-center text-indigo-600 hover:text-indigo-800">
                      <KeyIcon size={16} className="text-gray-400 mr-2" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <ProfileStats />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;