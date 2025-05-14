import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import Lottie from "lottie-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <FiAlertCircle className="text-red-500 text-4xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-500 mb-6">
            We're having trouble loading this content. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Casketat = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8000/api/products');
        const casketatProducts = response.data.filter(
          product => product.category === 'cascketat'
        );
        setProducts(casketatProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || err.message || t('collection.errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  const handleAddToCart = async (product) => {
    try {
      setAddingToCart(product.id);
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">{t('collection.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 w-full max-w-md">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          {t('collection.retry')}
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-64 h-64 mb-6 flex items-center justify-center bg-gray-100 rounded-lg">
          <FiShoppingCart className="text-gray-300 text-6xl" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          {t('collection.emptyTitle')}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {t('collection.emptyMessage')}
        </p>
        <Link 
          to="/AllProducts" 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          {t('collection.browseProducts')}
        </Link>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          {t('collection.casketatTitle')}
        </motion.h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <Link 
                to={`/AllProducts/product/${product.id}`} 
                className="block group"
                aria-label={`View ${product.title} details`}
              >
                <div className="relative pb-[100%] bg-gray-50">
                  {product.image ? (
                    <img
                      src={`http://localhost:8000/${product.image}`}
                      alt={product.title}
                      className="absolute h-full w-full object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23e5e7eb"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="14">No Image</text></svg>';
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <FiShoppingCart size={32} />
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link 
                    to={`/AllProducts/product/${product.id}`} 
                    className="hover:underline"
                    aria-label={`View ${product.title} details`}
                  >
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
                  </Link>
                  <button 
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    aria-label={`Add ${product.title} to favorites`}
                  >
                    <FiHeart size={20} />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                  {product.description || t('collection.noDescription')}
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">
                    {product.price.toFixed(2)} {t('collection.currency')}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                      addingToCart === product.id
                        ? 'bg-indigo-400 text-white cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <FiLoader className="animate-spin" size={16} />
                        {t('collection.adding')}
                      </>
                    ) : (
                      <>
                        <FiShoppingCart size={16} />
                        {t('collection.addToCart')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Casketat;