'use client';
import { useState, useEffect } from 'react';

// --- Imports for Firebase ---
import { db } from '../../../lib/firebase/config'; // Adjust this path if necessary
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// --- Type Definitions for our Firestore data ---
// This ensures our code is type-safe and easier to work with.
interface FAQ {
  id: string; // The Firestore document ID
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string; // The Firestore document ID
  name: string;
  order: number; // For sorting the tabs
}

export default function HelpPage() {
  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null); // Use string for Firestore IDs

  // State for data fetched from Firestore
  const [allFAQs, setAllFAQs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<string[]>(['Getting Started']); // Start with a default
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching Effect ---
  // This effect runs once when the component is first mounted.
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories and FAQs at the same time for better performance
        const categoriesQuery = query(collection(db, 'faqCategories'), orderBy('order', 'asc'));
        const faqsQuery = query(collection(db, 'faqs'), orderBy('order', 'asc'));

        const [categoriesSnapshot, faqsSnapshot] = await Promise.all([
          getDocs(categoriesQuery),
          getDocs(faqsQuery)
        ]);
        
        // Process and set categories state
        const fetchedCategories = categoriesSnapshot.docs.map(doc => doc.data().name as string);
        setCategories(['Getting Started', ...fetchedCategories]);
        
        // Process and set FAQs state
        const fetchedFAQs = faqsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FAQ[];
        setAllFAQs(fetchedFAQs);

      } catch (error) {
        console.error("Error fetching help content:", error);
        // Optionally set an error state to show a message to the user
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // The empty dependency array ensures this runs only once

  // --- Filtering and UI Logic ---
  
  // Filter the FAQs based on the active category and search query
  const filteredFAQs = allFAQs.filter(faq => {
    const matchesCategory = activeCategory === 'Getting Started' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle the search form submission (can be expanded later)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Toggle the accordion for an FAQ item
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // Static data for support options, as this rarely changes
  const supportOptions = [
    { title: 'Live Chat', description: 'Chat with our support team in real-time', icon: '💬', action: 'Start Chat', available: true },
    { title: 'Phone Support', description: 'Call us directly for immediate assistance', icon: '📞', action: 'Call Now', available: true, contact: '+234 806 311 544' },
    { title: 'Email Support', description: 'Send us an email and we\'ll respond within 24 hours', icon: '📧', action: 'Send Email', available: true, contact: 'support@horizon.com' }
  ];

  // State for tooltips
  const [showTooltip, setShowTooltip] = useState<{[key: string]: boolean}>({});

  // Function to toggle tooltip visibility
  const toggleTooltip = (title: string) => {
    // Close all other tooltips first
    const newShowTooltip = Object.keys(showTooltip).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as {[key: string]: boolean});
    
    // Toggle the selected tooltip
    newShowTooltip[title] = !showTooltip[title];
    setShowTooltip(newShowTooltip);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    // Show feedback to user
    alert(`${title} copied to clipboard: ${text}`);
    // Close tooltip after copying
    setShowTooltip({});
  };

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside any tooltip
      const tooltips = document.querySelectorAll('.tooltip-container');
      let isInsideTooltip = false;
      
      tooltips.forEach(tooltip => {
        if (tooltip.contains(event.target as Node)) {
          isInsideTooltip = true;
        }
      });
      
      // Close tooltips if click is outside
      if (!isInsideTooltip && Object.keys(showTooltip).some(key => showTooltip[key])) {
        setShowTooltip({});
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for help..." className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Help Center...</p>
          </div>
        ) : (
          <>
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
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4 prose prose-sm max-w-none text-gray-600">
                        <p>{faq.answer}</p>
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
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl mb-4">{option.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        option.available
                          ? 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-md transform hover:-translate-y-0.5'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!option.available}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing tooltip when clicking button
                        option.contact && toggleTooltip(option.title);
                      }}
                    >
                      {option.action}
                    </button>
                    {option.contact && showTooltip[option.title] && (
                      <div className="relative tooltip-container">
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm rounded py-2 px-3 mb-2 shadow-lg z-10">
                          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
                          <div className="flex items-center justify-between">
                            <span className="mr-2">{option.contact}</span>
                            <button
                              className="text-gray-300 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent closing tooltip when clicking copy button
                                copyToClipboard(option.contact, option.title);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
