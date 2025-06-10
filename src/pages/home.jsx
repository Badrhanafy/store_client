import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// Constants
const API_ENDPOINT = process.env.REACT_APP_API_BASE_URL || 'http://localhot:8000/api';

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

  // Fetch all dynamic content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Fetch slides and categories simultaneously
        
          axios.get(`http://localhost:8000/api/slides`).then(
            response =>setSlides(response.data)
          )
          
      

       

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

  // Fallback content if API fails
  const loadFallbackContent = () => {
   /*  setSlides([
      {
        id: 1,
        title: t('home.slides.0.title'),
        subtitle: t('home.slides.0.subtitle'),
        cta: t('home.slides.0.cta'),
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        link: "/",
        bgColor: "bg-gradient-to-r from-amber-100 to-pink-200"
      },
      {
        id: 2,
        title: t('home.slides.1.title'),
        subtitle: t('home.slides.1.subtitle'),
        cta: t('home.slides.1.cta'),
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
        link: "/",
        bgColor: "bg-gradient-to-r from-blue-50 to-indigo-100"
      }
    ]); */

    setCategories([
      {
        id: 1,
        name: "9obiyat",
        image: "clothes/90biya.jpg",
        link: "/products/9obiyat",
        label: t('home.categories.9obiyat')
      },
      {
        id: 2,
        name: "chapeau",
        image: "clothes/caskette.jpeg",
        link: "/products/casketat",
        label: t('home.categories.casketat')
      }
    ]);
  };

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

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
      <CarouselSection 
        slides={slides} 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide}
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

// Componentized sections for better maintainability

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
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-lg"
            >
              <h1 className={`${fontClasses.heading} text-5xl md:text-6xl mb-4 leading-tight`}>
                {slide.title}
              </h1>
              <p className={`${fontClasses.subheading} text-xl mb-8`}>
                {slide.subtitle}
              </p>
              <Link
                to={slide.link || "/"}
                className={`${fontClasses.body} bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full transition-colors duration-300 inline-block`}
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

const CategoriesSection = ({ categories, fontClasses, t }) => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <h2 className={`${fontClasses.heading} text-3xl text-center mb-12`}>
        {t('home.categoriesTitle')}
      </h2>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
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
  <section className="py-16 bg-indigo-200 text-white">
    <div className="container mx-auto px-6 text-center">
      <h2 className={`${fontClasses.heading} text-3xl text-black mb-4`}>{t("home.newsletter.title")}</h2>
      <p className={`${fontClasses.body} max-w-lg mx-auto mb-8 text-gray-600`}>
        {t("home.newsletter.subtitle")}
      </p>
      <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
        <input
          type="email"
          placeholder={t("home.newsletter.placeholder")}
          className="flex-grow px-4 py-3 rounded-full text-gray-800 focus:outline-none"
        />
        <button className={`${fontClasses.body} bg-indigo-500 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition-colors duration-300`}>
          {t("home.newsletter.button")}
        </button>
      </div>
    </div>
  </section>
);

const FooterSection = ({ fontClasses, t }) => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className={`${fontClasses.heading} text-xl mb-4`}>{t("footer.brandName")}</h3>
          <p className={`${fontClasses.body} text-gray-400`}>
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <h4 className={`${fontClasses.subheading} text-lg mb-4`}>{t("footer.shop")}</h4>
          <ul className="space-y-2">
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
          <h4 className={`${fontClasses.subheading} text-lg mb-4`}>{t("footer.company")}</h4>
          <ul className="space-y-2">
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
          <h4 className={`${fontClasses.subheading} text-lg mb-4`}>{t("footer.connect")}</h4>
          <div className="flex space-x-4">
            {t("footer.socialLinks", { returnObjects: true }).map((social, index) => (
              <a
                key={index}
                href="#"
                className={`${fontClasses.body} text-gray-400 hover:text-white transition-colors`}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p className={`${fontClasses.body}`}>
          &copy; {new Date().getFullYear()} {t("footer.brandName")}. {t("footer.copyright")}
        </p>
      </div>
    </div>
  </footer>
);

export default HomePage;