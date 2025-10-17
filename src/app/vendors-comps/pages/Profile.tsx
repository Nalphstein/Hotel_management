import React, { useState } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CreditCardIcon, KeyIcon, SaveIcon } from 'lucide-react';
import ProfileStats from '../components/profile/ProfileStats';
import RecentActivityCard from '../components/profile/RecentActivityCard';
// Mock user data
const initialUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  role: 'Store Owner',
  address: {
    street: '123 Commerce St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States'
  },
  paymentMethods: [{
    id: 1,
    type: 'visa',
    last4: '4242',
    expiry: '04/26'
  }, {
    id: 2,
    type: 'mastercard',
    last4: '5678',
    expiry: '09/25'
  }],
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
  joinedDate: '2023-05-15'
};
const Profile = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
  };
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
              <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-6 mb-4 md:mb-0">
                  <img src={userData.profileImage} alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon size={16} className="text-gray-400" />
                        </div>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="text" name="address.zip" value={formData.address.zip} onChange={handleChange} placeholder="ZIP Code" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          </div>
                        </div>
                        <div>
                          <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="Country" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={() => {
                  setFormData(userData);
                  setIsEditing(false);
                }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium flex items-center">
                      <SaveIcon size={16} className="mr-1" />
                      Save Changes
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
                      {userData.paymentMethods.map(method => <div key={method.id} className="flex items-center">
                          <CreditCardIcon size={16} className="text-gray-400 mr-2" />
                          <span className="capitalize">
                            {method.type} •••• {method.last4} (expires{' '}
                            {method.expiry})
                          </span>
                        </div>)}
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