import React, { useState } from 'react';
import { FiShoppingBag, FiHeart, FiChevronRight,FiStar, FiCheck, FiCreditCard, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Consistent with your store's font classes
const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

const ProductDetailsPage = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Sample product data - replace with your actual data
  const product = {
    id: 1,
    title: "Premium Cotton T-Shirt",
    description: "Crafted from 100% organic cotton for ultimate comfort. This slim-fit t-shirt features reinforced stitching and a premium finish that lasts wash after wash.",
    price: 199.99,
    qte: 50,
    colors: ["#3B82F6", "#EF4444", "#10B981"], // blue, red, green
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
    ],
    rating: 4.5,
    reviews: 128
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Handle order submission
    console.log({
      productId: product.id,
      size: selectedSize,
      quantity,
      phone,
      address,
      paymentMethod
    });
    alert("Your order has been placed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className={`${fontClasses.body} flex items-center text-sm text-gray-600 mb-6`}>
          <span>Home</span>
          <FiChevronRight className="mx-2" />
          <span>Men</span>
          <FiChevronRight className="mx-2" />
          <span className="text-gray-900 font-medium">T-Shirts</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
              <img 
                src={product.images[activeImage]} 
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${activeImage === index ? 'border-indigo-600' : 'border-transparent'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className={`${fontClasses.heading} text-3xl text-gray-900 mb-2`}>{product.title}</h1>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className={`${fontClasses.body} text-gray-600 ml-2`}>
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiHeart className={`text-xl ${isWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>

              <p className={`${fontClasses.body} text-gray-700 mb-6`}>{product.description}</p>

              <div className="mb-6">
                <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Available Colors</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer"
                      style={{ backgroundColor: color }}
                      title={`Color option ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Select Size</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-lg border-2 ${selectedSize === size ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className={`${fontClasses.body} text-gray-600`}>Price</span>
                  <p className={`${fontClasses.heading} text-3xl text-gray-900`}>{product.price} DH</p>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitOrder}>
                <div className="space-y-4 mb-6">
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!selectedSize}
                  className={`${fontClasses.subheading} w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-lg flex items-center justify-center transition-colors duration-300 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
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
};

export default ProductDetailsPage;