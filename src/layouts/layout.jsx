import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiGlobe, FiChevronDown, FiLogOut, FiSettings, FiShoppingCart, FiStar } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import fortisLogo from '../pages/admin/assets/FORTIS-01.svg';

export default function Layout() {
  const fontClasses = {
    heading: "font-['Playfair_Display'] font-bold",
    subheading: "font-['Montserrat'] font-medium",
    body: "font-['Open_Sans']",
    nav: "font-['Raleway'] font-medium"
  };

  const { t, i18n } = useTranslation();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const userPanelRef = useRef(null);
  const id = 2;
  const navigate = useNavigate()
  const [user,setuser]= useState({})
  const token = sessionStorage.getItem("UserToken")
  console.log(user.name);
  
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setuser(res.data);

      })
      .catch((err) => {
        console.error("Error fetching admin profile:", err);
        sessionStorage.removeItem("adminToken");
        
      });
  }, []);
  // Sample user data (replace with actual user data from your auth system)
  const [currentUser, setCurrentUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    isLoggedIn: true,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  });

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
  };

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const toggleUserPanel = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    setCurrentUser({ ...currentUser, isLoggedIn: false });
    setIsUserPanelOpen(false);
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
    axios.get("http://127.0.0.1:8000/api/products").then(
      res => setProducts(res.data))
  }, [id]);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userPanelRef.current && !userPanelRef.current.contains(event.target)) {
        setIsUserPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    products.filter((product) => {
      return product.title === searchQuery
    }).map((produit, i) => {
      return <div className='bg-red-400'>  {produit.price}</div>
    })
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
        {/* Main Navigation Bar */}
        <nav className={`${fontClasses.nav} fixed w-full z-40 bg-white shadow-sm`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <NavLink to="/" className="flex-shrink-0">
                  <img
                    src={fortisLogo}
                    alt="Fortis Logo"
                    style={{height:"10vh"}}
                    className="h-26 md:h-22 w-auto max-w-[220px] md:max-w-[280px] object-contain transform hover:scale-105 transition-transform duration-200"
                  />
                </NavLink>
              </div>

              {/* Desktop Navigation Links */}
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

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Search Icon */}
                <div className="relative">
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    aria-label="Search"
                  >
                    <FiSearch size={20} />
                  </button>
                </div>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <FiGlobe size={20} className="mr-1" />
                    <span className="text-sm uppercase">{i18n.language}</span>
                    <FiChevronDown size={16} className="ml-1" />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-100">
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

                {/* Wishlist Icon */}
                <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                  <FiHeart size={20} />
                </button>

                {/* Cart Icon */}
                <div className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative">
                  <NavLink to="/cart">
                    {({ isActive }) => (
                      <div className="relative">
                        <FiShoppingBag size={20} className={isActive ? 'text-indigo-600' : ''} />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                </div>
                
                {/* User Icon */}
                <div className="relative">
                  <button 
                    onClick={toggleUserPanel}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative"
                  >
                    <FiUser size={20} />
                    {currentUser.isLoggedIn && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
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

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              key="search-overlay"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleSearchClose();
                }
              }}
            >
              <div className="w-full max-w-2xl relative">
                <form 
                  onSubmit={handleSearchSubmit}
                  className="flex items-center border-b-2 border-gray-300 focus-within:border-indigo-600"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("Search products...")}
                    className="flex-1 px-6 py-4 text-xl focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="ml-4 p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <FiSearch size={24} className='text-yellow-500'/>
                  </button>
                </form>
                <button
                  onClick={handleSearchClose}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-16 p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Account Sidebar */}
        <AnimatePresence>
          {isUserPanelOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-50"
                onClick={toggleUserPanel}
              />
              
              {/* Sidebar */}
              <motion.div
                ref={userPanelRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
                    <button
                      onClick={toggleUserPanel}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                    <img
                      src={currentUser.avatar}
                      alt="User avatar"
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  {/* Navigation */}
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
                          to={`/orders/${user.phone}`}
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiShoppingCart className="mr-3" size={20} />
                          <span>My Orders</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/wishlist"
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiHeart className="mr-3" size={20} />
                          <span>Wishlist</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/settings"
                          className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          <FiSettings className="mr-3" size={20} />
                          <span>Settings</span>
                        </NavLink>
                      </li>
                    </ul>
                  </nav>

                  {/* Footer */}
                  <div className="mt-auto pt-6 border-t border-gray-200">
                    {currentUser.isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiLogOut className="mr-3" size={20} />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <NavLink
                          to="/login"
                          className="block w-full text-center p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/register"
                          className="block w-full text-center p-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          onClick={toggleUserPanel}
                        >
                          Create Account
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Menu */}
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

                  {/* Mobile Search */}
                  <div className="mb-6 px-3">
                    <form onSubmit={handleSearchSubmit} className="flex bg-gray-800 rounded-lg overflow-hidden">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("Search products...")}
                        className="px-4 py-3 w-full bg-transparent text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 text-white hover:bg-gray-700"
                      >
                        <FiSearch size={20} />
                      </button>
                    </form>
                  </div>

                  {/* Mobile Navigation Links */}
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

                  {/* Mobile Language Selector */}
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

                  {/* Mobile Icons */}
                  <div className="flex items-center justify-around py-6 border-t border-gray-800">
                    <button className="p-2 text-white hover:text-indigo-400">
                      <FiUser size={24} />
                    </button>
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