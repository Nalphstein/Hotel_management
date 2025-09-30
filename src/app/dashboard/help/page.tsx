'use client';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    'Getting Started',
    'Account & Profile', 
    'Payments & Billing',
    'Booking & Rooms',
    'Services & Facilities',
    'Technical Support'
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I book a room?',
      answer: 'To book a room, go to the "Rooms" section on the main dashboard, select your preferred room type, choose your dates, and follow the booking process. You can pay using various payment methods available on our platform.',
      category: 'Getting Started'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit cards, debit cards, bank transfers, and mobile payment options. All payments are processed securely through our encrypted payment gateway.',
      category: 'Payments & Billing'
    },
    {
      id: 3,
      question: 'How long does checking take?',
      answer: 'Standard check-in time is 3:00 PM and check-out is 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability and additional charges.',
      category: 'Booking & Rooms'
    },
    {
      id: 4,
      question: 'What is the cancellation policy?',
      answer: 'Cancellation policies vary by room type and rate. Generally, you can cancel up to 24-48 hours before your arrival date without penalty. Please check your specific booking terms for detailed cancellation policies.',
      category: 'Booking & Rooms'
    },
    {
      id: 5,
      question: 'How do I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page, enter your email address, and we\'ll send you instructions to reset your password. Make sure to check your spam folder if you don\'t receive the email within a few minutes.',
      category: 'Account & Profile'
    }
  ];

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      action: 'Start Chat',
      available: true
    },
    {
      title: 'Phone Support',
      description: 'Call us directly for immediate assistance',
      icon: '📞',
      action: 'Call Now',
      available: true
    },
    {
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: '📧',
      action: 'Send Email',
      available: true
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'Getting Started' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
            </div>
          )}
        </div>

        {/* Support Options */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Still need help?</h2>
          <p className="text-gray-600 text-center mb-8">Our support team is here to assist you</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    option.available
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!option.available}
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}