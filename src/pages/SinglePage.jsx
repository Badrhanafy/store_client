import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiStar, FiChevronRight, FiCheck, FiPlus, FiMinus, FiCreditCard, FiTruck, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [phone, setPhone] = useState('');
  const [customer_name, setname] = useState('');
  const [address, setAddress] = useState('');
  const [taille, setTaille] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [direction, setDirection] = useState(0); // For slide animation direction

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get(`http://localhost:8000/api/products/${id}`),
      axios.get(`http://localhost:8000/api/products/${id}/images`)
    ])
    .then(([productResponse, imagesResponse]) => {
      setProduct(productResponse.data);
      const allImages = [
        { id: 0, image_path: productResponse.data.image, is_main: true },
        ...imagesResponse.data.images
      ];
      setProductImages(allImages);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, [id]);

  const handleImageChange = (newIndex) => {
    setDirection(newIndex > activeImage ? 1 : -1);
    setActiveImage(newIndex);
  };

  const returnToMainImage = () => {
    setDirection(-1);
    setActiveImage(0);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        product_id: product.id,
        quantity,
        phone,
        address,
        taille,
        customer_name,
        payment_method: paymentMethod
      };

      await axios.post('http://localhost:8000/api/orders', orderData);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className={`${fontClasses.body} text-gray-700`}>Product not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`${fontClasses.body} flex items-center text-sm text-gray-600 mb-6`}>
          <span className="hover:text-indigo-600 cursor-pointer">Home</span>
          <FiChevronRight className="mx-2 text-gray-400" />
          <span className="hover:text-indigo-600 cursor-pointer"><Link to={"/AllProducts"}>Products</Link></span>
          <FiChevronRight className="mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image with Animation */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 relative h-96">
              <AnimatePresence custom={direction}>
                <motion.div
                  key={activeImage}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={`http://localhost:8000/${productImages[activeImage]?.image_path || product.image}`}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Return to Main Image Button */}
              {activeImage !== 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={returnToMainImage}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md z-10"
                  title="Return to main image"
                >
                  <FiImage className="text-indigo-600" />
                </motion.button>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      activeImage === index 
                        ? 'border-indigo-600 ring-2 ring-indigo-300' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageChange(index)}
                  >
                    <img 
                      src={`http://localhost:8000/${image.image_path}`}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
            
          </div>

             {/* Product Details */}
             <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className={`${fontClasses.heading} text-3xl text-gray-900`}>{product.title}</h1>
                <button 
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiHeart className={`text-xl ${isWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>

              <p className={`${fontClasses.body} text-gray-700 mb-6`}>{product.description}</p>

              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className={`${fontClasses.body} text-gray-600 ml-2`}>
                  (128 reviews)
                </span>
              </div>

              <div className="mb-6">
                <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Price</h3>
                <p className={`${fontClasses.heading} text-3xl text-indigo-600`}>{product.price} DH</p>
              </div>

              <div className="mb-6">
                <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Select Size</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      type="button"
                      onClick={() => setTaille(size)}
                      className={`py-2 px-3 rounded-lg border-2 ${taille === size ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <h3 className={`${fontClasses.subheading} text-lg text-gray-900`}>Quantity</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={placeOrder}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="customer_name" className={`${fontClasses.subheading} block text-sm text-gray-700 mb-1`}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="customer_name"
                      value={customer_name}
                      onChange={(e) => setname(e.target.value)}
                      className={`${fontClasses.body} w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Type your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={`${fontClasses.subheading} block text-sm text-gray-700 mb-1`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${fontClasses.body} w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="06XXXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className={`${fontClasses.subheading} block text-sm text-gray-700 mb-1`}>
                      Delivery Address
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`${fontClasses.body} w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      rows="3"
                      placeholder="Your complete address"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Payment Method</h3>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FiTruck className="text-indigo-600 text-xl" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className={`${fontClasses.subheading} text-gray-900`}>Cash on Delivery</h4>
                        <p className={`${fontClasses.body} text-sm text-gray-600`}>Pay when you receive your order</p>
                      </div>
                      {paymentMethod === 'cash' && (
                        <div className="ml-auto">
                          <FiCheck className="text-indigo-600 text-xl" />
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => alert('Online payment coming soon!')}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 opacity-60'}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <FiCreditCard className="text-gray-500 text-xl" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className={`${fontClasses.subheading} text-gray-900`}>Online Payment</h4>
                        <p className={`${fontClasses.body} text-sm text-gray-600`}>Pay securely online (Coming Soon)</p>
                      </div>
                      {paymentMethod === 'online' && (
                        <div className="ml-auto">
                          <FiCheck className="text-indigo-600 text-xl" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {orderSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"
                  >
                    <p className={`${fontClasses.body} font-medium`}>Order placed successfully!</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`${fontClasses.subheading} w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-lg flex items-center justify-center transition-colors duration-300`}
                >
                  <FiShoppingBag className="mr-2" />
                  Complete Order
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}