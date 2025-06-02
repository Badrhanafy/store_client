import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiHeart, FiShoppingBag, FiStar, FiChevronRight, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { t } from 'i18next';
// Font classes (consistent with homepage)
const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};
const baseurl='http://localhost:8000'
// Notification Component
const Notification = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ type: 'spring', damping: 25 }}
    className="fixed bottom-6 right-6 bg-blue-100 shadow-xl rounded-lg p-4 max-w-xs border-l-4 border-indigo-500 z-50"
    style={{ width: "40vh" }}
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 h-6 w-6 text-indigo-500" aria-hidden="true">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className={`${fontClasses.body} text-gray-800`}>{message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={onClose}
          className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

// Product Card Component
const ProductCard = ({ product, onAddToCart, hoveredProduct, setHoveredProduct }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart(product);
    addToCart(product);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={`${baseurl}/${product.image}`}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <FiHeart className="text-gray-700" />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FiShoppingBag className="text-gray-700" />
          </button>
        </div>

        {product.onSale && (
          <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            SALE
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`${fontClasses.subheading} text-lg text-gray-800 group-hover:text-indigo-600 transition-colors`}>
              {product.title}
            </h3>
            <p className={`${fontClasses.body} text-gray-500 text-sm mt-1 line-clamp-2`}>
              {product.description || 'No description available'}
            </p>
          </div>
          <div className="flex items-center">
            <FiStar className="text-yellow-400 fill-current" />
            <span className={`${fontClasses.body} text-gray-600 ml-1`}>{product.rating || '4.5'}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className={`${fontClasses.heading} text-xl text-gray-900`}>{product.price} DH</span>
            {product.originalPrice && (
              <span className={`${fontClasses.body} text-gray-400 line-through ml-2`}>{product.originalPrice} DH</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${fontClasses.body} bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300`}
          >
            <Link to={`product/${product.id}`}>Show More</Link>
          </motion.button>
        </div>
      </div>

      {product.colors && (
        <div className="px-6 pb-6 flex space-x-2">
          {product.colors.map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Main ProductList Component
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${baseurl}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showNotification(`${product.title} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className={`${fontClasses.body} text-gray-600`}>Loading our finest collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className={`${fontClasses.body} text-red-500`}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`${fontClasses.body} mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition-colors duration-300`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 relative">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className={`${fontClasses.heading} text-3xl md:text-4xl text-gray-800`}>{t("Our Collection")}</h2>
            <p className={`${fontClasses.body} text-gray-600 mt-2`}>{t("Discover pieces that tell your story")}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className={`${fontClasses.subheading} text-gray-600 mr-2`}>View all</span>
            <FiChevronRight className="text-gray-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              hoveredProduct={hoveredProduct}
              setHoveredProduct={setHoveredProduct}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className={`${fontClasses.body} border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-full transition-colors duration-300 flex items-center mx-auto`}>
            Load More
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}