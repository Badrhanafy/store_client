import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiGlobe, FiChevronDown, FiLogOut, FiSettings, FiShoppingCart, FiStar } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { WishlistContext } from '../context/Wishlistecontext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import Lottie from "lottie-react";
import NotFound from '../pages/Notfound.json';
import { useTranslation } from 'react-i18next';
import fortisLogo from '../pages/admin/assets/FORTIS-01.svg';

export default function Layout() {
  const { wishlist } = useContext(WishlistContext);
  const fontClasses = {
    heading: "font-['Playfair_Display'] font-bold",
    subheading: "font-['Montserrat'] font-medium",
    body: "font-['Open_Sans']",
    nav: "font-['Raleway'] font-medium"
  };
  const baseurl = 'https://badrstore.42web.io/api';
  const { t, i18n } = useTranslation();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const userPanelRef = useRef(null);
  const searchResultsRef = useRef(null);
  const id = 2;
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const token = sessionStorage.getItem("UserToken");

  useEffect(() => {
    if (token) {
      axios
        .get(`${baseurl}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          sessionStorage.removeItem("UserToken");
        });
    }
  }, [token]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleUserPanel = () => {
    if (!token) {
      return;
    }
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("UserToken");
    setUser({});
    setIsUserPanelOpen(false);
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
    if (lng === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  useEffect(() => {
    axios.get(`${baseurl}/api/products`).then(
      res => setProducts(res.data))
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userPanelRef.current && !userPanelRef.current.contains(event.target)) {
        setIsUserPanelOpen(false);
      }
      if (searchResultsRef.current && isSearchOpen && !searchResultsRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchClose();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    handleSearchClose();
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/Login", text: "Login" },
    { to: "/Fortis/Contacts", text: "Contact" },
    { to: "/AllProducts", text: "Products" }
  ];

  return (
    <div className="relative">
      <header>
        <nav className={`${fontClasses.nav} fixed w-full z-40 bg-white shadow-sm`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <NavLink to="/" className="flex-shrink-0">
                  <img
                    src={fortisLogo}
                    alt="Fortis Logo"
                    style={{ height: "10vh" }}
                    className="h-26 md:h-22 w-auto max-w-[220px] md:max-w-[280px] object-contain transform hover:scale-105 transition-transform duration-200"
                  />
                </NavLink>
              </div>

              <div className="hidden md:flex items-center space-x-6 flex-1 mx-8 justify-center">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-3 py-2 transition-colors duration-300 ${isActive
                        ? 'text-indigo-600 font-medium border-b-2 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600'
                      }`
                    }
                  >
                    {t(link.text)}
                  </NavLink>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    aria-label="Search"
                  >
                    <FiSearch size={20} />
                  </button>
                </div>

                <div className="relative group">
                  <div
                    className="flex items-center p-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
                    onMouseEnter={() => setIsLanguageOpen(true)}
                    onMouseLeave={() => setIsLanguageOpen(false)}
                  >
                    <FiGlobe size={20} className="mr-1" />
                    <span className="text-sm uppercase">{i18n.language}</span>
                    <FiChevronDown size={16} className="ml-1" />
                  </div>

                  {isLanguageOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-100"
                      onMouseEnter={() => setIsLanguageOpen(true)}
                      onMouseLeave={() => setIsLanguageOpen(false)}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => changeLanguage('en')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          English
                        </button>
                        <button
                          onClick={() => changeLanguage('fr')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Français
                        </button>
                        <button
                          onClick={() => changeLanguage('ar')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          العربية
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <NavLink to="/whishlist" className="relative">
                  <FiHeart />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>

                <div className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative">
                  <NavLink to="/cart">
                    {({ isActive }) => (
                      <div className="relative">
                        <FiShoppingBag size={20} className={isActive ? 'text-indigo-600' : ''} />
                        {cartCount > 0 && (
                          <span className="absolute -top-3 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                </div>

                <div className="relative group">
                  <button
                    onClick={toggleUserPanel}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative"
                  >
                    <FiUser size={20} />
                    {token && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                    )}
                  </button>
                  {!token && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="px-4 py-2 text-sm text-gray-700">
                        {t('contact.sign')}
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <NavLink
                          to="/login"
                          className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                        >
                          Login
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              key="search-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={handleSearchClose}
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="container mx-auto px-4 pt-20 pb-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-w-3xl mx-auto relative" ref={searchResultsRef}>
                  <motion.div
                    animate={searchResults.length > 0 ? {
                      y: -100,
                      transition: { type: 'spring', damping: 15, stiffness: 300 }
                    } : {}}
                  >
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("Search products...")}
                        className="w-full px-6 py-5 text-xl md:text-2xl text-yellow-200 animation-color duration-500 focus:text-white focus:ring-yellow-200 focus:bg-black/50 rounded-sm bg-yellow-500/10 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        onClick={handleSearchClose}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <FiX size={24} />
                      </button>
                    </form>
                  </motion.div>

                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {searchResults.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring' }}
                          whileHover={{ scale: 1.03 }}
                          className="relative group rounded-xl overflow-hidden shadow-lg bg-white"
                        >
                          <Link
                            to={`AllProducts/product/${product.id}`}
                            className="absolute inset-0 z-10"
                            onClick={handleSearchClose}
                          />
                          <div className="aspect-square relative">
                            {product.image && (
                              <img
                                src={`${baseurl}/${product.image}`}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                              <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-medium truncate">{product.title}</h3>
                                <p className="text-indigo-300 font-semibold">${product.price}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 text-center"
                    >
                      <p className="text-white text-lg">No products found matching "{searchQuery}"</p>
                      <div width='20vh' style={{
                        width:"60vh",
                        marginTop:"-11vh",
                        marginLeft:"34vh"
                      }}> 
                        <Lottie animationData={NotFound} loop={true} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isUserPanelOpen && token && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-50"
                onClick={toggleUserPanel}
              />

              <motion.div
                ref={userPanelRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
                    <button
                      onClick={toggleUserPanel}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <FiUser size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{user.name || 'User'}</h3>
                      <p className="text-gray-600">{user.email || ''}</p>
                    </div>
                  </div>

                  <nav className="flex-1">
                    <ul className="space-y-2">
                      <li>
                        <NavLink
                          to={`/account/${user.id}`}
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiUser className="mr-3" size={20} />
                          <span>My Profile</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={`orders/${user.phone}`}
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiShoppingCart className="mr-3" size={20} />
                          <span>My Orders</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/whishlist"
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiHeart className="mr-3" size={20} />
                          <span>Wishlist</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/account/settings"
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiSettings className="mr-3" size={20} />
                          <span>Settings</span>
                        </NavLink>
                      </li>
                    </ul>
                  </nav>

                  <div className="mt-auto pt-6 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiLogOut className="mr-3" size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-black bg-opacity-90 md:hidden"
              onClick={toggleMenu}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3 }}
                className="h-full w-4/5 max-w-sm bg-gray-900 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="container mx-auto px-6 py-4 h-full flex flex-col w-full">
                  <div className="flex justify-between items-center mb-8">
                    <NavLink to="/" className="block" onClick={toggleMenu}>
                      <img
                        src={fortisLogo}
                        alt="Fortis Logo"
                        className="h-16 w-auto object-contain filter brightness-0 invert"
                      />
                    </NavLink>
                    <button
                      onClick={toggleMenu}
                      className="p-2 text-white hover:text-indigo-400 focus:outline-none"
                      aria-label="Close menu"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <div className="mb-6 px-3">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("Search products...")}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focuse:bg-yellow-200 focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <FiSearch size={20} />
                      </button>
                    </form>

                    {searchResults.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-[50vh] overflow-y-auto">
                        {searchResults.map(product => (
                          <Link
                            key={product.id}
                            to={`ApllProducts/product/${product.id}`}
                            className="block relative group"
                            onClick={toggleMenu}
                          >
                            <div className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                              {product.image && (
                                <div className="w-12 h-12 mr-3 flex-shrink-0">
                                  <img
                                    src={`${baseurl}/${product.image}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-white truncate">{product.title}</p>
                                <p className="text-indigo-300 text-sm">${product.price}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-4 flex-1">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          `px-4 py-3 text-lg font-medium transition-colors duration-300 ${isActive
                            ? 'text-indigo-400 bg-gray-800 rounded-lg'
                            : 'text-white hover:text-indigo-400 hover:bg-gray-800 hover:bg-opacity-50 rounded-lg'
                          }`
                        }
                        onClick={toggleMenu}
                      >
                        {t(link.text)}
                      </NavLink>
                    ))}
                  </div>

                  <div className="px-4 py-6">
                    <div className="flex items-center space-x-4">
                      <FiGlobe size={24} className="text-white" />
                      <select
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-around py-6 border-t border-gray-800">
                    <div className="group relative">
                      <button
                        className="p-2 text-white hover:text-indigo-400"
                        onClick={() => {
                          if (!token) {
                            navigate('/login');
                            toggleMenu();
                          } else {
                            toggleUserPanel();
                          }
                        }}
                      >
                        <FiUser size={24} />
                      </button>
                      {!token && (
                        <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="px-4 py-2 text-sm text-white">
                            Login to view your account
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="p-2 text-white hover:text-indigo-400">
                      <FiHeart size={24} />
                    </button>
                    <div className="p-2 text-white hover:text-indigo-400 relative">
                      <NavLink to="/cart" onClick={toggleMenu}>
                        {({ isActive }) => (
                          <div className="relative">
                            <FiShoppingBag size={24} className={isActive ? 'text-indigo-400' : ''} />
                            {cartCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                                {cartCount}
                              </span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
}