import { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Font classes
  const fontClasses = {
    heading: "font-['Playfair_Display'] font-bold",
    subheading: "font-['Montserrat'] font-medium",
    body: "font-['Open_Sans']",
    nav: "font-['Raleway'] font-medium"
  };

  // Category data with personalized links
  const categories = [
    { 
      name: "9obiyat", 
      image: "clothes/90biya.jpg",
      link: "/products/9obiyat",
      label: t('home.categories.9obiyat')
    },
    { 
      name: "chapeau", 
      image: "clothes/caskette.jpeg",
      link: "/products/casketat",
      label: t('home.categories.casketat')
    },
    { 
      name: "tshirts", 
      image: "clothes/thirt2.jpg",
      link: "/products/shirts",
      label: t('home.categories.shirts')
    }
  ];

  // Slides data with translations
  const slides = [
    {
      title: t('home.slides.0.title'),
      subtitle: t('home.slides.0.subtitle'),
      cta: t('home.slides.0.cta'),
      bgColor: "bg-gradient-to-r from-amber-100 to-pink-200",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: t('home.slides.1.title'),
      subtitle: t('home.slides.1.subtitle'),
      cta: t('home.slides.1.cta'),
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-100",
      image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
    },
    {
      title: t('home.slides.2.title'),
      subtitle: t('home.slides.2.subtitle'),
      cta: t('home.slides.2.cta'),
      bgColor: "bg-gradient-to-r from-rose-50 to-purple-100",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <div className="relative h-screen pt-16 overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10 text-white">
              <div className="max-w-lg">
                <h1 className={`${fontClasses.heading} text-5xl md:text-6xl mb-4 leading-tight`}>
                  {slide.title}
                </h1>
                <p className={`${fontClasses.subheading} text-xl mb-8`}>
                  {slide.subtitle}
                </p>
                <button className={`${fontClasses.body} bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full transition-colors duration-300`}>
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              aria-label={`${t('home.goToSlide')} ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className={`${fontClasses.heading} text-3xl text-center mb-12`}>
            {t('home.categoriesTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className={`${fontClasses.heading} text-white text-2xl text-center px-4`}>
                    {category.label}
                  </h3>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link 
                    to={category.link}
                    className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  >
                    {t('home.shopNow')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of your component remains the same */}
      {/* Newsletter Section */}
      <section className="py-16 bg-indigo-600 text-white">
        {/* ... existing newsletter code ... */}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        {/* ... existing footer code ... */}
      </footer>
    </div>
  );
};

export default HomePage;