import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiPlus, FiX, FiDollarSign, FiHash, FiType } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {useTranslation} from "react-i18next"
import { useEffect } from 'react';
axios.defaults.withCredentials = true;
// Consistent with your store's font classes
const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

export default function AddProduct() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    qte: '',
    image: null,
    category: '',
    colors: [],
    sizes: []
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
 useEffect(() => {
    const getCsrfToken = async () => {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    getCsrfToken();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor]
      });
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(color => color !== colorToRemove)
    });
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize]
      });
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(size => size !== sizeToRemove)
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formDataToSend = new FormData();
  
  // Append all simple fields
  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('price', formData.price);
  formDataToSend.append('qte', formData.qte);
  formDataToSend.append('category', formData.category);
  formDataToSend.append('image', formData.image);

  // Convert arrays to JSON strings before appending
  formDataToSend.append('sizes', JSON.stringify(formData.sizes));
  formDataToSend.append('colors', JSON.stringify(formData.colors));

  try {
    const res = await axios.post('http://localhost:8000/api/products', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      withCredentials: true,
    });
    
    console.log('Product added:', res.data);
    setSuccess(true);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      qte: '',
      image: null,
      category: '',
      colors: [],
      sizes: []
    });
    setPreviewImage(null);
    
    setTimeout(() => setSuccess(false), 3000);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    alert(`Error adding product: ${err.response?.data?.message || err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-indigo-600 py-6 px-8">
          <h2 className={`${fontClasses.heading} text-3xl text-white`}>{t("Add New Product")}</h2>
          <p className={`${fontClasses.body} text-indigo-100 mt-2`}>{t("Fill in the details for your new product")}</p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-6 rounded"
          >
            <p className={`${fontClasses.body} font-medium`}>Product added successfully!</p>
          </motion.div>
        )}

        {/* Product Form */}
        <div className="py-8 px-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Title */}
                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="title">
                    {t("Product Title")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiType className="text-gray-400" />
                    </div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="e.g. Premium Cotton T-Shirt"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="description">
                    {t("Description")}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className={`${fontClasses.body} w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    rows="4"
                    placeholder="Detailed product description..."
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${fontClasses.body} w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="">Select a category</option>
                    <option value="men">Men's Clothing</option>
                    <option value="women">Women's Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Price */}
                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="price">
                    {t("Price (DH)")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="qte">
                    Quantity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHash className="text-gray-400" />
                    </div>
                    <input
                      id="qte"
                      name="qte"
                      type="number"
                      required
                      value={formData.qte}
                      onChange={handleChange}
                      className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`}>
                    Product Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className={`${formData.body} flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}>
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                        </div>
                      )}
                      <input 
                        id="image" 
                        name="image" 
                        type="file" 
                        className="hidden" 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        required 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`}>
                Available Colors
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {formData.colors.map((color, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
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
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add color (e.g. #FF0000 or 'Red')"
                  className={`${fontClasses.body} flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
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

            {/* Size Selection */}
            <div className="mb-8">
              <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`}>
                Available Sizes
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {formData.sizes.map((size, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
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
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add size (e.g. S, M, L, XL)"
                  className={`${fontClasses.body} flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${fontClasses.subheading} bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg flex items-center transition-colors duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Product'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}