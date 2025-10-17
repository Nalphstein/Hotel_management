import React, { useState } from 'react';
import { PlusIcon, SearchIcon, FilterIcon, ArrowUpDownIcon } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import AddProductModal from '../components/products/AddProductModal';
// Mock product data for a marketplace vendor dashboard
const initialProducts = [
// Electronics & Gadgets
{
  id: 1,
  name: 'Apple iPhone 15 Pro',
  category: 'Electronics',
  price: 999,
  stock: 124,
  image: 'https://images.unsplash.com/photo-1696862380169-116fa2914051?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 2,
  name: 'MacBook Pro M3',
  category: 'Electronics',
  price: 1999,
  stock: 47,
  image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop'
}, {
  id: 3,
  name: 'Bluetooth Speakers',
  category: 'Electronics',
  price: 79,
  stock: 112,
  image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2069&auto=format&fit=crop'
}, {
  id: 4,
  name: 'Smart Watch',
  category: 'Wearables',
  price: 199,
  stock: 65,
  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop'
},
// Food & Groceries
{
  id: 5,
  name: 'Organic Fruit Basket',
  category: 'Food',
  price: 39.99,
  stock: 25,
  image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 6,
  name: 'Artisan Cheese Selection',
  category: 'Food',
  price: 49.95,
  stock: 18,
  image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop'
}, {
  id: 7,
  name: 'Gourmet Coffee Beans',
  category: 'Food',
  price: 24.99,
  stock: 42,
  image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 8,
  name: 'Premium Chocolate Box',
  category: 'Food',
  price: 32.5,
  stock: 30,
  image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2070&auto=format&fit=crop'
},
// Home Services
{
  id: 9,
  name: 'Laundry Service - Basic',
  category: 'Laundry',
  price: 29.99,
  stock: 999,
  image: 'https://images.unsplash.com/photo-1545173168-9f1c6e67b31b?q=80&w=2071&auto=format&fit=crop'
}, {
  id: 10,
  name: 'Laundry Service - Premium',
  category: 'Laundry',
  price: 49.99,
  stock: 999,
  image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 11,
  name: 'Home Cleaning - 2 Hours',
  category: 'Home Services',
  price: 59.99,
  stock: 50,
  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 12,
  name: 'Handyman Service',
  category: 'Home Services',
  price: 79.99,
  stock: 30,
  image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop'
},
// Fashion
{
  id: 13,
  name: 'Designer T-shirt',
  category: 'Fashion',
  price: 39.99,
  stock: 85,
  image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop'
}, {
  id: 14,
  name: 'Leather Handbag',
  category: 'Fashion',
  price: 129.99,
  stock: 23,
  image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop'
},
// Beauty & Personal Care
{
  id: 15,
  name: 'Organic Skincare Set',
  category: 'Beauty',
  price: 89.99,
  stock: 34,
  image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 16,
  name: 'Premium Hair Styling Kit',
  category: 'Beauty',
  price: 64.99,
  stock: 27,
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop'
},
// Books & Stationery
{
  id: 17,
  name: 'Bestseller Book Bundle',
  category: 'Books',
  price: 49.99,
  stock: 42,
  image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop'
}, {
  id: 18,
  name: 'Premium Notebook Set',
  category: 'Stationery',
  price: 29.99,
  stock: 56,
  image: 'https://images.unsplash.com/photo-1544391591-020a4a85ff41?q=80&w=2071&auto=format&fit=crop'
},
// Furniture
{
  id: 19,
  name: 'Ergonomic Office Chair',
  category: 'Furniture',
  price: 249.99,
  stock: 18,
  image: 'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=2071&auto=format&fit=crop'
}, {
  id: 20,
  name: 'Minimalist Coffee Table',
  category: 'Furniture',
  price: 179.99,
  stock: 12,
  image: 'https://images.unsplash.com/photo-1594224457860-23fdb4147ea3?q=80&w=2070&auto=format&fit=crop'
},
// Sports & Fitness
{
  id: 21,
  name: 'Yoga Mat Premium',
  category: 'Fitness',
  price: 45.99,
  stock: 38,
  image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 22,
  name: 'Smart Fitness Tracker',
  category: 'Fitness',
  price: 129.99,
  stock: 41,
  image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=2068&auto=format&fit=crop'
},
// Food Delivery
{
  id: 23,
  name: 'Meal Prep Service - Weekly',
  category: 'Food Delivery',
  price: 89.99,
  stock: 25,
  image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=2064&auto=format&fit=crop'
}, {
  id: 24,
  name: 'Gourmet Dinner for Two',
  category: 'Food Delivery',
  price: 59.99,
  stock: 15,
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop'
}];
const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const handleAddProduct = newProduct => {
    setProducts([...products, {
      ...newProduct,
      id: products.length + 1
    }]);
    setIsAddModalOpen(false);
  };
  const handleDeleteProduct = id => {
    setProducts(products.filter(product => product.id !== id));
  };
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock') return b.stock - a.stock;
    return a.name.localeCompare(b.name); // default sort by name
  });
  const categories = ['All', ...new Set(products.map(product => product.category))];
  return <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Marketplace Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your products across multiple categories
          </p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center text-sm font-medium" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon size={16} className="mr-2" />
          Add New Product
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  {categories.map(category => <option key={category} value={category}>
                      {category}
                    </option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FilterIcon size={14} />
                </div>
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="name">Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock">Stock</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ArrowUpDownIcon size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {categoryFilter === 'All' && <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.filter(cat => cat !== 'All').map(category => <button key={category} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center" onClick={() => setCategoryFilter(category)}>
                  <div className="text-indigo-600 mb-2">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {category}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {products.filter(p => p.category === category).length}{' '}
                    items
                  </span>
                </button>)}
          </div>
        </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map(product => <ProductCard key={product.id} product={product} onDelete={() => handleDeleteProduct(product.id)} />)}
      </div>
      {sortedProducts.length === 0 && <div className="text-center py-10">
          <p className="text-gray-500">No products found.</p>
        </div>}
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddProduct} categories={categories.filter(cat => cat !== 'All')} />
    </div>;
};
// Helper function to get an icon for each category
const getCategoryIcon = category => {
  const iconSize = 24;
  switch (category) {
    case 'Electronics':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="2" x2="9" y2="4"></line>
          <line x1="15" y1="2" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="22"></line>
          <line x1="15" y1="20" x2="15" y2="22"></line>
          <line x1="20" y1="9" x2="22" y2="9"></line>
          <line x1="20" y1="15" x2="22" y2="15"></line>
          <line x1="2" y1="9" x2="4" y2="9"></line>
          <line x1="2" y1="15" x2="4" y2="15"></line>
        </svg>;
    case 'Food':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>;
    case 'Laundry':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <circle cx="12" cy="12" r="1"></circle>
        </svg>;
    case 'Home Services':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>;
    case 'Fashion':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </svg>;
    case 'Beauty':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>;
    case 'Books':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>;
    case 'Stationery':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>;
    case 'Furniture':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M12 11V3a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v8"></path>
          <path d="M20 11V3a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v8"></path>
        </svg>;
    case 'Fitness':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M6 8H5a4 4 0 0 0 0 8h1"></path>
          <rect x="6" y="5" width="12" height="14" rx="2"></rect>
        </svg>;
    case 'Food Delivery':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>;
    case 'Wearables':
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="7"></circle>
          <polyline points="12 9 12 12 13.5 13.5"></polyline>
          <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>
        </svg>;
    default:
      return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>;
  }
};
export default Products;