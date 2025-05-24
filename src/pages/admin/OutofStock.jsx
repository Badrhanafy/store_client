import React from 'react';
import { FiAlertTriangle, FiEdit, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OutOfStockProducts = ({ products, onEditProduct, onRestock }) => {
  const outOfStockProducts = products.filter(product => product.qte <= 0);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }
  };

  // Modern alert header animation
  const alertVariants = {
    initial: { 
      backgroundColor: 'rgba(248, 113, 113, 1)', // red-400
      scale: 1 
    },
    animate: { 
      backgroundColor: ['rgba(248, 113, 113, 1)', 'rgba(248, 113, 113, 0.9)', 'rgba(248, 113, 113, 1)'],
      scale: [1, 1.005, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Text fade animation
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Icon animation
  const iconVariants = {
    hidden: { rotate: 0 },
    visible: {
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with modern alert animation */}
      <motion.div 
        className="bg-red-400 px-6 py-4 flex items-center justify-between"
        variants={alertVariants}
        initial="initial"
        animate={outOfStockProducts.length > 0 ? "animate" : "initial"}
      >
        <div className="flex items-center">
          <motion.div
            variants={iconVariants}
            animate={outOfStockProducts.length > 0 ? "visible" : "hidden"}
          >
            <FiAlertTriangle className="text-white mr-3" size={24} />
          </motion.div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold text-white">Out of Stock Products</h2>
          </motion.div>
          <motion.span 
            className="ml-3 bg-white text-red-400 px-2 py-1 rounded-full text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {outOfStockProducts.length}
          </motion.span>
        </div>
        <motion.button 
          onClick={() => onRestock()}
          className="flex items-center text-white hover:text-red-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiRefreshCw className="mr-1" />
          Refresh
        </motion.button>
      </motion.div>

      {/* Content - rest remains the same */}
      <div className="p-4">
        {outOfStockProducts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600">All products are in stock!</h3>
            <p className="text-gray-400 mt-1">No out-of-stock items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outOfStockProducts.map(product => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="border border-red-50 rounded-lg overflow-hidden bg-white transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    {product.image && (
                      <div className="flex-shrink-0 h-16 w-16 mr-4">
                        <img 
                          className="h-16 w-16 rounded object-cover" 
                          src={`http://localhost:8000/${product.image}`} 
                          alt={product.title}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-700 line-clamp-2">
                          {product.title}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-400 ml-2">
                          Out of Stock
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{product.category}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="text-indigo-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => onRestock(product)}
                            className="text-green-400 hover:text-green-600 p-1 rounded-full hover:bg-green-50"
                          >
                            <FiPlus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional info */}
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {product.colors?.map((color, index) => (
                        <div 
                          key={index} 
                          className="flex items-center px-2 py-1 rounded-full bg-gray-50 text-xs"
                        >
                          <div 
                            className="w-3 h-3 rounded-full mr-1 border border-gray-100"
                            style={{ backgroundColor: color }}
                          />
                          {color}
                        </div>
                      ))}
                    </div>
                    {product.sizes?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.sizes.map((size, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded-full bg-gray-50 text-xs text-gray-500"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutOfStockProducts;