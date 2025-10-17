import React, { useState, useEffect } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CreditCardIcon, KeyIcon, SaveIcon } from 'lucide-react';
import ProfileStats from '../components/profile/ProfileStats';
import RecentActivityCard from '../components/profile/RecentActivityCard';

// Define types
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  last4: string;
  expiry: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  role: string;
  address: Address;
  paymentMethods: PaymentMethod[];
  profileImage: string;
  joinedDate: string;
}

interface ParsedUserData {
  username: string;
  othername: string;
  email: string;
  phone: string;
  userType: string;
}

// Mock user data
const initialUserData: UserData = {
  name: '',
  email: '',
  phone: '',
  role: 'Vendor',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  },
  paymentMethods: [] as PaymentMethod[],
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
  joinedDate: new Date().toISOString().split('T')[0] // Today's date
};

const Profile = () => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isEditing, setIsEditing] = useState(true); // Start in editing mode for new vendors
  const [formData, setFormData] = useState<UserData>(initialUserData);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const parsedData: ParsedUserData = JSON.parse(savedUserData);
        const updatedUserData: UserData = {
          ...initialUserData,
          name: `${parsedData.username} ${parsedData.othername}`,
          email: parsedData.email,
          phone: parsedData.phone,
          role: parsedData.userType === 'vendor' ? 'Vendor' : 'Customer'
        };
        setUserData(updatedUserData);
        setFormData(updatedUserData);
        
        // Check if profile is complete
        const complete = updatedUserData.name && 
                        updatedUserData.email && 
                        updatedUserData.phone && 
                        updatedUserData.address.street &&
                        updatedUserData.address.city &&
                        updatedUserData.address.state &&
                        updatedUserData.address.zip &&
                        updatedUserData.address.country;
        setIsProfileComplete(!!complete);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        if (parent === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(formData);
    
    // Check if profile is now complete
    const complete = formData.name && 
                    formData.email && 
                    formData.phone && 
                    formData.address.street &&
                    formData.address.city &&
                    formData.address.state &&
                    formData.address.zip &&
                    formData.address.country;
    
    setIsProfileComplete(!!complete);
    
    // If profile is complete, save to localStorage and exit edit mode
    if (complete) {
      localStorage.setItem('vendorProfileComplete', 'true');
      setIsEditing(false);
    }
  };

  // Redirect to dashboard if profile is complete and user tries to access profile page again
  useEffect(() => {
    const profileComplete = localStorage.getItem('vendorProfileComplete');
    if (profileComplete === 'true' && !isEditing) {
      // In a real app, you would use router.push here
      // For now, we'll just show a message
      console.log('Profile is complete. Vendor can now access other pages.');
    }
  }, [isEditing]);

  return <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                {!isEditing && <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>}
              </div>
              
              {/* Profile completion message */}
              {isProfileComplete && !isEditing && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    Your profile is complete! You can now access all vendor dashboard features.
                  </p>
                </div>
              )}
              
              {/* Profile incomplete warning for new vendors */}
              {!isProfileComplete && !isEditing && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    Please complete your profile to access all vendor dashboard features.
                  </p>
                  <button 
                    className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium"
                    onClick={() => setIsEditing(true)}
                  >
                    Complete Profile
                  </button>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-6 mb-4 md:mb-0">
                  <img src={userData.profileImage} alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{userData.name || 'New Vendor'}</h2>
                  <p className="text-gray-500">{userData.role}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Member since{' '}
                    {new Date(userData.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {isEditing ? <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                          <UserIcon size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MailIcon size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input 
                        type="text" 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                        className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input 
                            type="text" 
                            name="address.street" 
                            value={formData.address.street} 
                            onChange={handleChange} 
                            placeholder="Street Address" 
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            required
                          />
                        </div>
                        <div>
                          <input 
                            type="text" 
                            name="address.city" 
                            value={formData.address.city} 
                            onChange={handleChange} 
                            placeholder="City" 
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            required
                          />
                        </div>
                        <div>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              name="address.state" 
                              value={formData.address.state} 
                              onChange={handleChange} 
                              placeholder="State" 
                              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                              required
                            />
                            <input 
                              type="text" 
                              name="address.zip" 
                              value={formData.address.zip} 
                              onChange={handleChange} 
                              placeholder="ZIP Code" 
                              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <input 
                            type="text" 
                            name="address.country" 
                            value={formData.address.country} 
                            onChange={handleChange} 
                            placeholder="Country" 
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    {isProfileComplete && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormData(userData);
                          setIsEditing(false);
                        }} 
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium flex items-center"
                    >
                      <SaveIcon size={16} className="mr-1" />
                      {isProfileComplete ? 'Save Changes' : 'Complete Profile'}
                    </button>
                  </div>
                </form> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MailIcon size={16} className="text-gray-400 mr-2" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon size={16} className="text-gray-400 mr-2" />
                        <span>{userData.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Address
                    </h3>
                    <div className="flex items-start">
                      <MapPinIcon size={16} className="text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p>{userData.address.street}</p>
                        <p>
                          {userData.address.city}, {userData.address.state}{' '}
                          {userData.address.zip}
                        </p>
                        <p>{userData.address.country}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Payment Methods
                    </h3>
                    <div className="space-y-2">
                      {userData.paymentMethods && userData.paymentMethods.length > 0 ? (
                        userData.paymentMethods.map((method: PaymentMethod) => (
                          <div key={method.id} className="flex items-center">
                            <CreditCardIcon size={16} className="text-gray-400 mr-2" />
                            <span className="capitalize">
                              {method.type} •••• {method.last4} (expires{' '}
                              {method.expiry})
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No payment methods added yet</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Security
                    </h3>
                    <div className="flex items-center">
                      <KeyIcon size={16} className="text-gray-400 mr-2" />
                      <button className="text-indigo-600 hover:text-indigo-800">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-6">
            <ProfileStats />
            <RecentActivityCard />
          </div>
        </div>
      </div>
    </div>;
};

export default Profile;