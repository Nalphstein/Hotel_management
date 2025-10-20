import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { PlusIcon, FilterIcon, SearchIcon, TagIcon, MoreVerticalIcon, EditIcon, TrashIcon } from 'lucide-react';
const products = [{
  id: 'PRD001',
  name: 'Apple iPhone 15 Pro',
  category: 'Smartphones',
  image: 'https://images.unsplash.com/photo-1696446700550-48c00dafd9a9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
  price: 999,
  stock: 43,
  status: 'In Stock'
}, {
  id: 'PRD002',
  name: 'Apple MacBook Air M2',
  category: 'Laptops',
  image: 'https://images.unsplash.com/photo-1662219708541-c9f3fd8a8d93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TWFjQm9vayUyMEFpciUyME0yfGVufDB8fDB8fHww',
  price: 1199,
  stock: 21,
  status: 'In Stock'
}, {
  id: 'PRD003',
  name: 'Apple iPad Pro 12.9"',
  category: 'Tablets',
  image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aVBhZCUyMFByb3xlbnwwfHwwfHx8MA%3D%3D',
  price: 1099,
  stock: 15,
  status: 'In Stock'
}, {
  id: 'PRD004',
  name: 'Apple Watch Series 9',
  category: 'Wearables',
  image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QXBwbGUlMjBXYXRjaHxlbnwwfHwwfHx8MA%3D%3D',
  price: 399,
  stock: 32,
  status: 'In Stock'
}, {
  id: 'PRD005',
  name: 'Apple AirPods Pro 2',
  category: 'Audio',
  image: 'https://images.unsplash.com/photo-1606741965996-cc9cb1f1f0be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QWlyUG9kcyUyMFByb3xlbnwwfHwwfHx8MA%3D%3D',
  price: 249,
  stock: 18,
  status: 'In Stock'
}, {
  id: 'PRD006',
  name: 'Apple HomePod Mini',
  category: 'Smart Home',
  image: 'https://images.unsplash.com/photo-1610824224672-5f78bd2f5e26?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SG9tZVBvZCUyME1pbml8ZW58MHx8MHx8fDA%3D',
  price: 99,
  stock: 0,
  status: 'Out of Stock'
}, {
  id: 'PRD007',
  name: 'Apple iMac 24"',
  category: 'Desktops',
  image: 'https://images.unsplash.com/photo-1621570273800-d59df7715c7a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aU1hYyUyMDI0JTIyJTIwTTF8ZW58MHx8MHx8fDA%3D',
  price: 1299,
  stock: 9,
  status: 'Low Stock'
}, {
  id: 'PRD008',
  name: 'Apple Mac Mini M2',
  category: 'Desktops',
  image: 'https://images.unsplash.com/photo-1610500796385-3ffc1ae2faa1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFjJTIwTWluaXxlbnwwfHwwfHx8MA%3D%3D',
  price: 599,
  stock: 5,
  status: 'Low Stock'
}];
const categories = ['All Categories', 'Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Audio', 'Smart Home', 'Desktops'];
const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All Categories' && product.category !== selectedCategory) {
      return false;
    }
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  return <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusIcon size={18} className="mr-1.5" />
          Add Product
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  {categories.map(category => <option key={category} value={category}>
                      {category}
                    </option>)}
                </select>
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <TagIcon size={16} />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">
                <FilterIcon size={16} className="mr-1.5" />
                Filter
              </button>
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {filteredProducts.map(product => <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-700">
                    <MoreVerticalIcon size={16} />
                  </button>
                </div>
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {product.status}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.category}
                    </p>
                  </div>
                  <span className="font-bold text-indigo-600">
                    ${product.price}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Stock: {product.stock} units
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-1.5 bg-gray-100 rounded text-gray-500 hover:bg-gray-200">
                      <EditIcon size={14} />
                    </button>
                    <button className="p-1.5 bg-gray-100 rounded text-gray-500 hover:bg-red-100 hover:text-red-500">
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </PageContainer>;
};
export default ProductsPage;