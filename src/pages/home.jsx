import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Lottie from "lottie-react";
import animationData from './Animation - 1749846553631.json';
import axios from 'axios';

// Constants
const API_ENDPOINT = 'http://localhost:8000/api';

// Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      
      {hasHalfStar && (
        <div className="relative w-5 h-5">
          <svg
            className="absolute w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className="absolute w-5 h-5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      
      <span className="ml-2 text-sm text-gray-600">
        ({rating})
      </span>
    </div>
  );
};

// Font classes configuration
const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

const HomePage = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const sliderRef = useRef(null);

  // Fetch all dynamic content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [slidesRes, productsRes] = await Promise.all([
          axios.get(`${API_ENDPOINT}/slides`),
          axios.get(`${API_ENDPOINT}/products`)
        ]);

        setSlides(slidesRes.data);
        
        // Extract unique categories from products
        const products = productsRes.data;
        const uniqueCategories = [...new Set(products.map(p => p.category))]
          .filter(c => c)
          .map((category, index) => ({
            id: index + 1,
            name: category,
            image: products.find(p => p.category === category)?.images?.[0] || '/placeholder-category.jpg',
            link: `/products?category=${encodeURIComponent(category)}`,
            label: category
          }));
        
        setCategories(uniqueCategories);
        
        // Get top rated products
        const topRated = [...products]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
          
        setTopRatedProducts(topRated);

      } catch (err) {
        console.error('Failed to fetch content:', err);
        setError(err.message);
        loadFallbackContent();
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [t]);

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  // Fallback content if API fails
  const loadFallbackContent = () => {
    setCategories([
      {
        id: 1,
        name: "9obiyat",
        image: "clothes/90biya.jpg",
        link: "/products?category=9obiyat",
        label: t('home.categories.9obiyat')
      },
      {
        id: 2,
        name: "chapeau",
        image: "clothes/caskette.jpeg",
        link: "/products?category=chapeau",
        label: t('home.categories.casketat')
      }
    ]);
    
    setTopRatedProducts([
      {
        id: 1,
        name: "Premium Product 1",
        price: 129.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "9obiyat",
        discount: 15
      },
      {
        id: 2,
        name: "Luxury Item 2",
        price: 89.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
        category: "chapeau"
      },
      {
        id: 3,
        name: "Featured Product 3",
        price: 59.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
        category: "9obiyat",
        discount: 20
      },
      {
        id: 4,
        name: "Best Seller 4",
        price: 79.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
        category: "chapeau"
      }
    ]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className={`${fontClasses.body} mt-4 text-gray-600`}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && slides.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h3 className={`${fontClasses.heading} text-red-600 mb-2`}>{t('common.error')}</h3>
          <p className={`${fontClasses.body} text-gray-600 mb-4`}>{error}</p>
          <p className={`${fontClasses.body} text-gray-500`}>
            {t('home.fallbackMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <div className="absolute top-0 left-0 w-64 z-0">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <CarouselSection
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        fontClasses={fontClasses}
        t={t}
      />

      {/* Top Rated Products */}
      <TopRatedProductsSection
        products={topRatedProducts}
        sliderRef={sliderRef}
        fontClasses={fontClasses}
        t={t}
      />

      {/* Featured Categories */}
      <CategoriesSection
        categories={categories}
        fontClasses={fontClasses}
        t={t}
      />

      {/* Newsletter */}
      <NewsletterSection
        fontClasses={fontClasses}
        t={t}
      />

      {/* Footer */}
      <FooterSection
        fontClasses={fontClasses}
        t={t}
      />
    </div>
  );
};

// Componentized sections

const CarouselSection = ({ slides, currentSlide, setCurrentSlide, fontClasses, t }) => (
  <section className="relative h-screen pt-16 overflow-hidden">
    {slides.length > 0 ? (
      slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-lg"
            >
              <h1 className={`${fontClasses.heading} text-5xl md:text-6xl mb-6 leading-tight`}>
                {slide.title}
              </h1>
              <p className={`${fontClasses.subheading} text-xl mb-8`}>
                {slide.subtitle}
              </p>
              <Link
                to={slide.link || "/"}
                className={`${fontClasses.body} bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full transition-all duration-300 inline-block shadow-lg hover:shadow-xl`}
              >
                {slide.cta}
              </Link>
            </motion.div>
          </div>
        </div>
      ))
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <p className={`${fontClasses.body} text-gray-600`}>{t('home.noSlides')}</p>
      </div>
    )}

    {slides.length > 1 && (
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
            aria-label={`${t('home.goToSlide')} ${index + 1}`}
          />
        ))}
      </div>
    )}
  </section>
);

const TopRatedProductsSection = ({ products, sliderRef, fontClasses, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const visibleProducts = products.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  );

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`${fontClasses.heading} text-3xl md:text-4xl mb-2`}>
              {t('home.topRatedProducts')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          </div>
          <Link 
            to="/products" 
            className={`${fontClasses.subheading} text-indigo-600 hover:text-indigo-800 flex items-center`}
          >
            {t('home.viewAll')}
            <FiChevronRight className="ml-1" />
          </Link>
        </div>

        <div className="relative">
          {/* Navigation Arrows - Positioned in the padding area */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none"
            aria-label={t('home.previousProducts')}
          >
            <FiChevronLeft className="text-gray-700 text-2xl" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none"
            aria-label={t('home.nextProducts')}
          >
            <FiChevronRight className="text-gray-700 text-2xl" />
          </button>

          {/* Products Container */}
          <div 
            ref={sliderRef}
            className="relative overflow-visible mx-4"
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 group"
                >
                  <div className="relative pb-[120%]">
                    <img
                      src={`http://localhost:8000/${product.image}`}
                      alt={product.name}
                      className="absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        -{product.discount}%
                      </div>
                    )}

                    {/* Rating Stars */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <StarRating rating={product.impressions_avg_rating || 0} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className={`${fontClasses.subheading} text-lg mb-1 truncate`}>
                      {product.name}
                    </h3>
                    <p className={`${fontClasses.body} text-gray-500 text-sm mb-3`}>
                      {product.category || t('home.featuredProduct')}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`${fontClasses.heading} text-xl text-gray-900`}>
                          ${product.price || '0.00'}
                        </span>
                        {product.originalPrice && (
                          <span className={`${fontClasses.body} ml-2 text-gray-400 text-sm line-through`}>
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/AllProducts/product/${product.id}`}
                        className={`${fontClasses.subheading} bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm transition-colors`}
                      >
                        {t('home.viewDetails')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-indigo-600 w-8' : 'bg-gray-300'}`}
                aria-label={`${t('home.goToPage')} ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CategoriesSection = ({ categories, fontClasses, t }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className={`${fontClasses.heading} text-3xl md:text-4xl mb-3`}>
          {t('home.categoriesTitle')}
        </h2>
        <p className={`${fontClasses.body} text-gray-600 max-w-2xl mx-auto`}>
          {t('home.categoriesSubtitle')}
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className={`${fontClasses.heading} text-white text-2xl md:text-3xl text-center px-4`}>
                  {category.label}
                </h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link
                  to={category.link}
                  className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {t('home.shopNow')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className={`${fontClasses.body} text-gray-500`}>
            {t('home.noCategories')}
          </p>
        </div>
      )}
    </div>
  </section>
);

const NewsletterSection = ({ fontClasses, t }) => (
  <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
    <div className="container mx-auto px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className={`${fontClasses.heading} text-3xl md:text-4xl mb-4 text-gray-900`}>
          {t("home.newsletter.title")}
        </h2>
        <p className={`${fontClasses.body} mb-8 text-gray-600`}>
          {t("home.newsletter.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder={t("home.newsletter.placeholder")}
            className="flex-grow px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button className={`${fontClasses.subheading} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl`}>
            {t("home.newsletter.button")}
          </button>
        </div>
      </div>
    </div>
  </section>
);

const FooterSection = ({ fontClasses, t }) => (
  <footer className="bg-gray-900 text-white pt-20 pb-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className={`${fontClasses.heading} text-2xl mb-6`}>{t("footer.brandName")}</h3>
          <p className={`${fontClasses.body} text-gray-400 mb-6`}>
            {t("footer.tagline")}
          </p>
          <div className="flex space-x-4">
            {t("footer.socialLinks", { returnObjects: true }).map((social, index) => (
              <a
                key={index}
                href="#"
                className={`${fontClasses.body} text-gray-400 hover:text-white transition-colors text-xl`}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className={`${fontClasses.subheading} text-lg mb-6`}>{t("footer.shop")}</h4>
          <ul className="space-y-3">
            {t("footer.shopLinks", { returnObjects: true }).map((item, index) => (
              <li key={index}>
                <a href="#" className={`${fontClasses.body} text-gray-400 hover:text-white transition-colors`}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={`${fontClasses.subheading} text-lg mb-6`}>{t("footer.company")}</h4>
          <ul className="space-y-3">
            {t("footer.companyLinks", { returnObjects: true }).map((item, index) => (
              <li key={index}>
                <a href="#" className={`${fontClasses.body} text-gray-400 hover:text-white transition-colors`}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={`${fontClasses.subheading} text-lg mb-6`}>{t("footer.contact")}</h4>
          <address className={`${fontClasses.body} text-gray-400 not-italic`}>
            {t("footer.address")}<br />
            {t("footer.phone")}<br />
            {t("footer.email")}
          </address>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p className={`${fontClasses.body}`}>
          &copy; {new Date().getFullYear()} {t("footer.brandName")}. {t("footer.copyright")}
        </p>
      </div>
    </div>
  </footer>
);

export default HomePage;