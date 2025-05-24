import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiChevronDown, FiPlus, FiX, FiSave, FiTag, FiDollarSign, FiHash } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ProductEditForm = ({ product, onSave, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    colors: [],
    sizes: []
  });
  
  // Temporary values for adding new colors/sizes
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  
  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        price: product.price || '',
        category: product.category || '',
        colors: product.colors || [],
        sizes: product.sizes || []
      });
    }
  }, [product]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new color
  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor('');
    }
  };

  // Remove color
  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  // Add new size
  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };

  // Remove size
  const removeSize = (sizeToRemove) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-4xl">
      {/* Form Header */}
      <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Edit Product</h3>
        <button 
          onClick={onCancel}
          className="text-white hover:text-indigo-200 transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>
      
      {/* Form Content - Landscape Layout */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiEdit2 className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product title"
                  required
                />
              </div>
            </div>
            
            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (DH)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            {/* quantity field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (DH)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="qte"
                  value={formData.qte}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="men">Men's Clothing</option>
                  <option value="women">Women's Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="footwear">Footwear</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Colors Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <AnimatePresence>
                  {formData.colors.map((color, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm"
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add color (e.g. #FF0000 or 'Red')"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <motion.button
                  type="button"
                  onClick={addColor}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
                >
                  <FiPlus />
                </motion.button>
              </div>
            </div>
            
            {/* Sizes Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <AnimatePresence>
                  {formData.sizes.map((size, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add size (e.g. S, M, L, XL)"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <motion.button
                  type="button"
                  onClick={addSize}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
                >
                  <FiPlus />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions - Centered at bottom */}
        <div className="flex justify-center space-x-3 pt-6 mt-6 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiSave className="mr-2" />
            Save Changes
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;