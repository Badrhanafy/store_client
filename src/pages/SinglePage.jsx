import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiMessageSquare, FiStar, FiChevronRight, FiCheck, FiPlus, FiMinus, FiCreditCard, FiTruck, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
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
              src={`http://localhost:8000/${images[activeImage]?.image_path}`}
              alt="Product"
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

const ReviewSection = ({ 
  impressions, 
  averageRating, 
  showReviewForm, 
  setShowReviewForm, 
  saveReview, 
  clientName, 
  setClN, 
  rating, 
  setRating, 
  clientImpression, 
  setImpression 
}) => {
  return (
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

      {/* Review Form */}
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

      {/* Reviews List */}
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
  );
};

const ProductDetailsForm = ({ 
  product, 
  isWishlist, 
  setIsWishlist, 
  taille, 
  setTaille, 
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
  placeOrder 
}) => {
  return (
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
              className={`py-2 px-3 rounded-lg border-2 ${
                taille === size ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'
              }`}
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
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
              }`}
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
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 opacity-60'
              }`}
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
  );
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
  const [direction, setDirection] = useState(0);
  const [clientImpression, setImpression] = useState('');
  const [clientName, setClN] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewSubmited, setReviewSubmitted] = useState(0);
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
      .then(([productResponse, imagesResponse, Impressionsresponse]) => {
        setProduct(productResponse.data);
        const allImages = [
          { id: 0, image_path: productResponse.data.image, is_main: true },
          ...imagesResponse.data.images
        ];
        setProductImages(allImages);
        setImpressions(Impressionsresponse.data);
        
        // Calculate average rating
        if (Impressionsresponse.data.length > 0) {
          const total = Impressionsresponse.data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(total / Impressionsresponse.data.length);
        }
        
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
      
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert("We couldn't submit your review. Please try again later.");
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
        {/* Breadcrumbs */}
        <div className={`${fontClasses.body} flex items-center text-sm text-gray-600 mb-6`}>
          <span className="hover:text-indigo-600 cursor-pointer">Home</span>
          <FiChevronRight className="mx-2 text-gray-400" />
          <span className="hover:text-indigo-600 cursor-pointer"><Link to={"/AllProducts"}>Products</Link></span>
          <FiChevronRight className="mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.title}</span>
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
            
            <ReviewSection 
              impressions={impressions}
              averageRating={averageRating}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              saveReview={saveReview}
              clientName={clientName}
              setClN={setClN}
              rating={rating}
              setRating={setRating}
              clientImpression={clientImpression}
              setImpression={setImpression}
            />
          </div>

          {/* Right Column - Product Details Form */}
          <div>
            <ProductDetailsForm 
              product={product}
              isWishlist={isWishlist}
              setIsWishlist={setIsWishlist}
              taille={taille}
              setTaille={setTaille}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}