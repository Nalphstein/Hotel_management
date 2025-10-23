'use client';
import { useState, useEffect } from 'react';
import { LockIcon, CheckIcon } from 'lucide-react';

// --- The PaystackMenuIcon SVG component has been removed ---

export default function PaystackCloneModal({ isOpen, onClose, onSuccess, email, amount, currency = 'NGN' }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });
  const [isVisible, setIsVisible] = useState(false);

  // An effect to handle the smooth fade/scale animation
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setCardData({ number: '', expiry: '', cvv: '' });
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Live input formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    // ... input formatting logic can be added here if desired ...
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'bg-opacity-30' : 'bg-opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-md shadow-2xl w-full max-w-lg flex flex-col overflow-hidden transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {/* --- CHANGE IS HERE: Replaced SVG component with an <img> tag --- */}
            {/* Make sure you have 'paystack-logo.svg' in your /public folder */}
            <img src="/paystack.svg" alt="Paystack Logo" className="w-6 h-6" />

            <div className="text-right">
              <p className="text-sm text-gray-500">{email}</p>
              <p className="font-bold" style={{ color: '#09A57C' }}>
                Pay {new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)}
              </p>
            </div>
          </div>
        </div>
        
        {/* --- Body --- */}
        <div className="flex-grow p-6">
          <h2 className="text-lg font-semibold text-gray-800 text-center mb-6">Enter your card details to pay</h2>
          
          <form onSubmit={handlePay}>
            <div className="space-y-4">
              {/* Custom Input: Card Number */}
              <div className="relative group">
                <label className="absolute top-2 left-3 text-xs font-bold uppercase tracking-wider text-[#3C74FF] pointer-events-none">Card Number</label>
                <input type="text" name="number" value={cardData.number} onChange={handleChange} placeholder="0000 0000 0000 0000" className="w-full pt-6 pb-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#3C74FF] text-gray-800" />
              </div>
              
              <div className="flex space-x-4">
                {/* Custom Input: Card Expiry */}
                <div className="relative flex-1 group">
                  <label className="absolute top-2 left-3 text-xs font-bold uppercase tracking-wider text-gray-400 group-focus-within:text-[#3C74FF]">Card Expiry</label>
                  <input type="text" name="expiry" value={cardData.expiry} onChange={handleChange} placeholder="MM / YY" className="w-full pt-6 pb-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#3C74FF] text-gray-800" />
                </div>
                {/* Custom Input: CVV */}
                <div className="relative flex-1 group">
                  <label className="absolute top-2 left-3 text-xs font-bold uppercase tracking-wider text-gray-400 group-focus-within:text-[#3C74FF]">CVV</label>
                  <input type="text" name="cvv" value={cardData.cvv} onChange={handleChange} placeholder="123" className="w-full pt-6 pb-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#3C74FF] text-gray-800" />
   
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={isProcessing || isSuccess}
                className="w-full flex items-center justify-center text-white py-3 rounded-md font-semibold text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ backgroundColor: '#3AB795' }}
              >
                {isProcessing && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>}
                {isSuccess && <CheckIcon size={24} />}
                {!isProcessing && !isSuccess && `Pay ${new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)}`}
              </button>
            </div>
          </form>
        </div>

        {/* --- Footer --- */}
        <div className="p-3 text-center">
          <div className="flex items-center justify-center text-sm">
              <LockIcon size={14} className="mr-2 text-gray-500" />
              <span className="text-gray-500">Secured by <span className="font-bold text-gray-800">paystack</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}