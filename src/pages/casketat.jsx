import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function Casketat() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [casketat, setcasketat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        const casketatProducts = response.data.filter(
          product => product.category === 'cascketat'
        );
        setcasketat(casketatProducts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run only once

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {t('collection.errorLoading')}: {error}
      </div>
    );
  }

  if (casketat.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No items found 
        </h3>
        <p className="text-gray-500 mb-6">
          {t('collection.emptyMessage')}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        {t('collection.casketatTitle')}
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {casketat.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/AllProducts/product/${product.id}`} className="block">
              <div className="relative pb-[100%] bg-gray-100">
                {product.image ? (
                  <img
                    src={`http://localhost:8000/${product.image}`}
                    alt={product.title}
                    className="absolute h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23e5e7eb"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="14">No Image</text></svg>';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <FiShoppingCart size={32} />
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/AllProducts/product/${product.id}`} className="hover:underline">
                  <h3 className="font-semibold text-gray-800">{product.title}</h3>
                </Link>
                <button className="text-gray-400 hover:text-red-500">
                  <FiHeart size={20} />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description || t('collection.noDescription')}
              </p>

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">
                  {product.price} {t('collection.currency')}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                >
                  <FiShoppingCart size={16} />
                  {t('collection.addToCart')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}