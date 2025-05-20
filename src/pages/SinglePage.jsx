import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiMessageSquare, FiStar, FiChevronRight, FiCheck, FiPlus, FiMinus, FiCreditCard, FiTruck, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from './CartContext'; // Adjust the import path as needed

const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

const CustomToast = ({ type, message }) => {
  const icon = {
    success: <FiCheck className="text-green-500 text-xl" />,
    error: <FiCheck className="text-red-500 text-xl" />,
    info: <FiCheck className="text-blue-500 text-xl" />,
    warning: <FiCheck className="text-yellow-500 text-xl" />
  }[type];

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-0.5">{icon}</div>
      <div className="ml-3">
        <p className={`${fontClasses.body} text-sm text-gray-800`}>{message}</p>
      </div>
    </div>
  );
};

const showToast = (type, message) => {
  toast[type](<CustomToast type={type} message={message} />, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: '!bg-white !text-gray-800 !shadow-md !rounded-lg !border !border-gray-200',
    bodyClassName: `${fontClasses.body}`,
  });
};

const ReviewCard = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <span className="text-indigo-600 font-medium">
              {review.clientName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className={`${fontClasses.subheading} text-gray-900`}>{review.clientName}</h4>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({review.rating}.0)</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className={`${fontClasses.body} text-gray-700`}>{review.impression}</p>
    </motion.div>
  );
};

const ImageGallery = ({ images, activeImage, handleImageChange, direction, returnToMainImage }) => {
  return (
    <div>
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
              src={`http://localhost:8000/${images[activeImage]?.image_path}`}
              alt="Product"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </AnimatePresence>

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

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
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
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-24 object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailsForm = ({ 
  product, 
  isWishlist, 
  setIsWishlist, 
  size, 
  setSize, 
  quantity, 
  setQuantity, 
  customer_name, 
  setname, 
  phone, 
  setPhone, 
  address, 
  setAddress, 
  paymentMethod, 
  setPaymentMethod, 
  orderSuccess, 
  placeOrder,
  selectedColor,
  setSelectedColor,
  addToCart
}) => {
  const isOutOfStock = product.qte === 0;
  const maxQuantity = product.qte;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
      {/* Out of Stock Ribbon */}
      {isOutOfStock && (
        <div className="absolute -right-8 -top-8 w-32 h-32 z-10">
          <div className="absolute transform rotate-45 bg-red-600 text-center text-white font-bold py-1 right-0 top-0 w-48 shadow-lg">
            <span className="flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1 animate-pulse" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              SOLD OUT
            </span>
          </div>
        </div>
      )}

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

      <div className="mb-6">
        <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Price</h3>
        <div className="flex items-center">
          <p className={`${fontClasses.heading} text-3xl ${isOutOfStock ? 'text-gray-400' : 'text-indigo-600'}`}>
            {product.price} DH
          </p>
          {isOutOfStock && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="ml-4 px-3 py-1 bg-red-100 border border-red-200 text-red-800 rounded-full flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Out of Stock</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Select Size</h3>
        <div className="grid grid-cols-4 gap-3">
          {product.sizes.map((s) => (
            <motion.button
              key={s}
              whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
              type="button"
              onClick={() => !isOutOfStock && setSize(s)}
              className={`py-2 px-3 rounded-lg border-2 ${
                size === s 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={isOutOfStock}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Select Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <motion.button
                key={color}
                whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                type="button"
                onClick={() => !isOutOfStock && setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  selectedColor === color 
                    ? 'border-indigo-600 ring-2 ring-indigo-300' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Select color ${color}`}
                disabled={isOutOfStock}
              >
                {selectedColor === color && (
                  <FiCheck className="text-white text-sm" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center justify-between mb-8">
        <h3 className={`${fontClasses.subheading} text-lg text-gray-900`}>Quantity</h3>
        <div className="flex items-center">
          <button
            onClick={() => !isOutOfStock && setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock || quantity <= 1}
            className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg ${
              isOutOfStock || quantity <= 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiMinus />
          </button>
          <div className={`w-12 h-10 flex items-center justify-center border-t border-b border-gray-300 ${
            isOutOfStock ? 'opacity-60' : ''
          }`}>
            {quantity}
          </div>
          <button
            onClick={() => !isOutOfStock && setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={isOutOfStock || quantity >= maxQuantity}
            className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg ${
              isOutOfStock || quantity >= maxQuantity 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-100'
            }`}
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

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className={`${fontClasses.subheading} text-lg text-gray-900 mb-3`}>Payment Method</h3>
          <div className="space-y-3">
            <motion.div
              whileHover={!isOutOfStock ? { scale: 1.01 } : {}}
              onClick={() => !isOutOfStock && setPaymentMethod('cash')}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
              } ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}
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
              whileHover={!isOutOfStock ? { scale: 1.01 } : {}}
              onClick={() => !isOutOfStock && showToast('info', 'Online payment option coming soon!')}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
              } ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'opacity-60'}`}
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

        <div className="flex gap-4">
          <motion.button
            whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
            type="button"
            onClick={!isOutOfStock ? addToCart : null}
            disabled={isOutOfStock}
            className={`${fontClasses.subheading} flex-1 bg-white border-2 py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isOutOfStock 
                ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <FiShoppingBag className="mr-2" />
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </motion.button>

          <motion.button
            whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isOutOfStock}
            className={`${fontClasses.subheading} flex-1 py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <FiCheck className="mr-2" />
            {isOutOfStock ? 'Sold Out' : 'Order Now'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart: addToCartContext, cartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [phone, setPhone] = useState('');
  const [customer_name, setname] = useState('');
  const [address, setAddress] = useState('');
  const [size, setSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [direction, setDirection] = useState(0);
  const [clientImpression, setImpression] = useState('');
  const [clientName, setClN] = useState('');
  const [rating, setRating] = useState(5);
  const [impressions, setImpressions] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get(`http://localhost:8000/api/products/${id}`),
      axios.get(`http://localhost:8000/api/products/${id}/images`),
      axios.get(`http://localhost:8000/api/product/${id}/impressions`)
    ])
      .then(([productResponse, imagesResponse, impressionsResponse]) => {
        setProduct(productResponse.data);
        const allImages = [
          { id: 0, image_path: productResponse.data.image, is_main: true },
          ...imagesResponse.data.images
        ];
        setProductImages(allImages);
        setImpressions(impressionsResponse.data);
        
        // Set default color if available
        if (productResponse.data.colors && productResponse.data.colors.length > 0) {
          setSelectedColor(productResponse.data.colors[0]);
        }
        
        // Set default size if available
        if (productResponse.data.sizes && productResponse.data.sizes.length > 0) {
          setSize(productResponse.data.sizes[0]);
        }
        
        // Calculate average rating
        if (impressionsResponse.data.length > 0) {
          const total = impressionsResponse.data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(total / impressionsResponse.data.length);
        }
        
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        showToast('error', 'Failed to load product details. Please try again later.');
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

  const handleAddToCart = () => {
    if (!selectedColor) {
      showToast('error', 'Please select a color');
      return;
    }

    const cartItem = {
      id: `${product.id}-${size}-${selectedColor}`, // Unique identifier for cart items
      product_id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.image,
      quantity,
      size,
      color: selectedColor
    };

    addToCartContext(cartItem);
    showToast('success', 'Item added to cart!');
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        product_id: product.id,
        quantity,
        phone,
        address,
        size,
        color: selectedColor,
        customer_name,
        payment_method: paymentMethod
      };

      await axios.post('http://localhost:8000/api/orders', orderData);
      setOrderSuccess(true);
      showToast('success', 'Order placed successfully!');
      
      // Reset form after successful order
      setTimeout(() => {
        setOrderSuccess(false);
        setQuantity(1);
        setSize(product.sizes?.[0] || 'M');
        setname('');
        setPhone('');
        setAddress('');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('error', 'Failed to place order. Please check your details and try again.');
    }
  };

  const saveReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/submitImpression", {
        clientName,
        clientImpression,
        rating,
        product_id: id
      });

      // Update the reviews list with the new review
      const newReview = {
        clientName,
        impression: clientImpression,
        rating,
        created_at: new Date().toISOString()
      };
      
      setImpressions([newReview, ...impressions]);
      
      // Update average rating
      const newTotalRating = impressions.reduce((sum, review) => sum + review.rating, 0) + rating;
      setAverageRating(newTotalRating / (impressions.length + 1));
      
      // Reset form
      setClN('');
      setImpression('');
      setRating(5);
      setShowReviewForm(false);
      
      showToast('success', 'Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('error', "We couldn't submit your review. Please try again later.");
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
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs and Cart Button */}
        <div className="flex justify-between items-center mb-6">
          <div className={`${fontClasses.body} flex items-center text-sm text-gray-600`}>
            <span className="hover:text-indigo-600 cursor-pointer">Home</span>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className="hover:text-indigo-600 cursor-pointer"><Link to={"/AllProducts"}>Products</Link></span>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
          
          <Link to="/cart" className="relative">
            <FiShoppingBag className="text-gray-700 text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Images and Reviews */}
          <div>
            <ImageGallery 
              images={productImages} 
              activeImage={activeImage} 
              handleImageChange={handleImageChange} 
              direction={direction} 
              returnToMainImage={returnToMainImage} 
            />

            {/* Review Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`${fontClasses.subheading} text-xl text-gray-900 flex items-center`}>
                    <FiMessageSquare className="text-indigo-600 mr-2" />
                    Customer Reviews
                  </h3>
                  {impressions.length > 0 && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        {averageRating.toFixed(1)} out of 5 ({impressions.length} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className={`${fontClasses.subheading} text-sm px-4 py-2 rounded-lg flex items-center ${
                    showReviewForm ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </motion.button>
              </div>

              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={saveReview} className="mb-6 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="clientName" className={`${fontClasses.subheading} block text-sm text-gray-700 mb-1`}>
                            Your Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="clientName"
                              value={clientName}
                              onChange={(e) => setClN(e.target.value)}
                              className={`${fontClasses.body} w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                              placeholder="Your name"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`${fontClasses.subheading} block text-sm text-gray-700 mb-1`}>
                            Your Rating
                          </label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                              >
                                <FiStar
                                  className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="clientImpression" className={`${fontClasses.subheading} block text-sm text-gray-700 mb-1`}>
                            Your Review
                          </label>
                          <textarea
                            id="clientImpression"
                            value={clientImpression}
                            onChange={(e) => setImpression(e.target.value)}
                            className={`${fontClasses.body} w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            rows="4"
                            placeholder="Share your detailed experience with this product..."
                            required
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className={`${fontClasses.subheading} w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300`}
                        >
                          Submit Review
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {impressions.length === 0 ? (
                  <div className="text-center py-8">
                    <FiMessageSquare className="mx-auto text-gray-300 text-4xl mb-2" />
                    <p className={`${fontClasses.body} text-gray-500`}>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  impressions.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details Form */}
          <div>
            <ProductDetailsForm
              product={product}
              isWishlist={isWishlist}
              setIsWishlist={setIsWishlist}
              size={size}
              setSize={setSize}
              quantity={quantity}
              setQuantity={setQuantity}
              customer_name={customer_name}
              setname={setname}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              orderSuccess={orderSuccess}
              placeOrder={placeOrder}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              addToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}