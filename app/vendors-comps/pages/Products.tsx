'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, FilterIcon, ArrowUpDownIcon } from 'lucide-react';

// --- Imports for Firebase and Authentication ---
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/config';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// --- Component Imports ---
import ProductCard from '../components/products/ProductCard';
import AddProductModal from '../components/products/AddProductModal';
import EditProductModal from '../components/products/EditProductModal'; // The modal for editing products

// --- Type Definition for a Product document ---
// This ensures type safety and matches the data structure in Firestore.
interface Product {
  id: string; // The Firestore document ID
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  vendorId: string; // Crucial for security and queries
}

// --- Your Predefined Static List of Categories ---
// This list is used for the "Add/Edit Product" modals and the filter dropdown.
const PREDEFINED_CATEGORIES = [
  'Gadgets', 'Food', 'Clothing', 'Stationary', 'Services', 'Skincare',
  'Books', 'Supplies', 'Essentials', 'Laundry Services', 'Aesthetics'
];

const ProductsComponent = () => {
  const { user } = useAuth(); // Get the current authenticated vendor from our context

  // --- State Management ---
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the "Add Product" modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State for the "Edit Product" modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProductToEdit, setCurrentProductToEdit] = useState<Product | null>(null);

  // States for client-side filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // --- Effect to Fetch Vendor's Products from Firestore ---
  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('vendorId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
          setProducts(fetchedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [user]);

  // --- Handlers for CRUD (Create, Read, Update, Delete) Operations ---

  const handleAddProduct = async (newProductData: Omit<Product, 'id' | 'vendorId'>) => {
    if (!user) return;
    try {
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, { ...newProductData, vendorId: user.uid });
      setProducts(prev => [...prev, { id: docRef.id, vendorId: user.uid, ...newProductData }]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Function to open the edit modal and set the product to be edited
  const handleEditClick = (product: Product) => {
    setCurrentProductToEdit(product);
    setIsEditModalOpen(true);
  };
  
  // Function to save the updated product data to Firestore
  const handleUpdateProduct = async (updatedProduct: Product) => {
    if (!updatedProduct) return;
    try {
      const productDocRef = doc(db, 'products', updatedProduct.id);
      // We don't need to update the vendorId or id, so we create a new object without them
      const { id, vendorId, ...dataToUpdate } = updatedProduct;
      await updateDoc(productDocRef, dataToUpdate);
      // Update the local state to reflect the changes instantly in the UI
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (error) {
      console.error("Error updating product:", error);
      throw error; // Re-throw to be caught by the modal for its own state management
    }
  };


  // --- Client-Side Filtering and Sorting Logic ---
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && (categoryFilter === 'All' || p.category === categoryFilter));
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock') return a.stock - b.stock;
    return a.name.localeCompare(b.name);
  });
  const filterCategories = ['All', ...PREDEFINED_CATEGORIES];
  const getCategoryIcon = (category: string) => { /* SVG icon logic can be placed here */ return <div></div>; };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marketplace Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products across multiple categories</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center text-sm font-medium hover:bg-indigo-700" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon size={16} className="mr-2" />
          Add New Product
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                  <input type="text" placeholder="Search products by name..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <div className="absolute left-3 top-2.5 text-gray-400"><SearchIcon size={16} /></div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                      {filterCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><FilterIcon size={14} /></div>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                      <option value="name">Sort by Name</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="stock">Stock</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ArrowUpDownIcon size={14} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={() => handleDeleteProduct(product.id)}
                onEdit={handleEditClick}
              />
            ))}
          </div>

          {products.length === 0 && !isLoading && (
            <div className="text-center py-10 col-span-full">
                <p className="text-gray-500">You haven't added any products yet.</p>
                <button onClick={() => setIsAddModalOpen(true)} className="mt-4 text-indigo-600 font-medium hover:underline">
                  Add your first product
                </button>
            </div>
          )}
          
          {sortedProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-10 col-span-full">
              <p className="text-gray-500">No products match your current filters.</p>
            </div>
          )}
        </>
      )}

      {/* RENDER THE MODALS */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        categories={PREDEFINED_CATEGORIES}
      />
      
      {currentProductToEdit && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentProductToEdit(null);
          }}
          onUpdate={handleUpdateProduct}
          productToEdit={currentProductToEdit}
          categories={PREDEFINED_CATEGORIES}
        />
      )}
    </div>
  );
};

export default ProductsComponent;