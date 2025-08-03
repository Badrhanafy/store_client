import React, { useState, useEffect, useContext } from 'react';
import { FiHeart, FiChevronLeft, FiChevronRight, FiEye , FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { WishlistContext } from '../../context/Wishlistecontext';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/new-arrivals');
        setProducts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching new arrivals:', err);
        setError(err.message);
        setProducts([
          {
            id: 1,
            title: "Fallback Product 1",
            price: "99.99",
            category: "men",
            image: "https://via.placeholder.com/300",
            is_new: true,
            rating: 4.5
          },
          {
            id: 2,
            title: "Fallback Product 2",
            price: "129.99",
            category: "women",
            image: "https://via.placeholder.com/300",
            is_new: false,
            rating: 4.2
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center max-w-md mx-auto">
        Error loading new arrivals: {error}
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium products
          </p>
        </div>

        {products.length > 0 ? (
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:scale-110"
              aria-label="Previous"
            >
              <FiChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            <div className="overflow-hidden px-12">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.5
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-full max-w-sm bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                    <div className="relative">
                      <img
                        src={products[currentIndex].image}
                        alt={products[currentIndex].title}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <button
                        onClick={() => toggleWishlist(products[currentIndex])}
                        className={`absolute top-4 right-4 p-2 rounded-full ${
                          isInWishlist(products[currentIndex].id) 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-white text-gray-700'
                        } shadow-sm hover:scale-110 transition-all duration-300`}
                        aria-label={isInWishlist(products[currentIndex].id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <FiHeart className="h-5 w-5" />
                      </button>
                      {products[currentIndex].is_new && (
                        <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          New
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{products[currentIndex].title}</h3>
                          <p className="text-gray-500 text-sm capitalize">{products[currentIndex].category}</p>
                        </div>
                        <div className="flex items-center">
                          <FiStar className="h-4 w-4 text-amber-400" />
                          <span className="ml-1 text-gray-700">
                            {products[currentIndex].rating || '4.5'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 mb-6">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(products[currentIndex].price)}
                        </span>
                      </div>

                      <Link
                        to={`/AllProducts/product/${products[currentIndex].id}`}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        <FiEye className="h-5 w-5 mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:scale-110"
              aria-label="Next"
            >
              <FiChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals available at the moment.</p>
          </div>
        )}

        {products.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? 'bg-amber-500 w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;