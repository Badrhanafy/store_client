import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const id = 2;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
    // For RTL languages like Arabic
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    products.filter((product) => {
      return product.title === searchQuery
    }).map((produit, i) => {
      return <div className='bg-red-400'>  {produit.price}</div>
    })
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/Login", text: "Login" },
    { to: "/Fortis/Contacts", text: "Contact" },
    { to: "/form", text: "Add product" },
    { to: "/AllProducts", text: "Products" }
  ];

  return (
    <div>
      <header>
        <nav className={`${fontClasses.nav} fixed w-full z-50 bg-white shadow-sm mb-4`}>
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

              {/* Desktop Navigation */}
              <center>
                         <div className="hidden md:flex items-center space-x-6 flex-1 mx-8">
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
              </center>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                {/* Search Icon with Tooltip */}
                <div className="relative group">
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-600 hover:text-indigo-600"
                  >
                    <FiSearch size={20} />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {t("Search")}
                      <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black transform -translate-x-1/2"></div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: isSearchOpen ? 1 : 0,
                      width: isSearchOpen ? '250px' : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className={`absolute right-full top-0 bg-white shadow-md rounded-lg overflow-hidden ${isSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  >
                    <form onSubmit={handleSearchSubmit} className="flex">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("Search products...")}
                        className="px-4 py-2 w-full focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 text-indigo-600 hover:bg-indigo-50"
                      >
                        <FiSearch size={18} />
                      </button>
                    </form>
                  </motion.div>
                </div>

                {/* Language Selector with Tooltip */}
                <div className="relative group">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center p-2 text-gray-600 hover:text-indigo-600"
                  >
                    <FiGlobe size={20} className="mr-1" />
                    <span className="text-sm uppercase">{i18n.language}</span>
                    <FiChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {t("Language")}
                      <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black transform -translate-x-1/2"></div>
                    </div>
                  </div>

                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50">
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

                {/* User Icon with Tooltip */}
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-indigo-600">
                    <FiUser size={20} />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {t("Account")}
                      <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black transform -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Wishlist Icon with Tooltip */}
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-indigo-600">
                    <FiHeart size={20} />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {t("Wishlist")}
                      <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black transform -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Cart Icon with Tooltip */}
                <div className="relative group">
                  <div className="p-2 text-gray-600 hover:text-indigo-600 relative">
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
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {t("Cart")}
                      <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black transform -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        <div className={`md:hidden fixed inset-0 z-40 bg-black transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="container mx-auto px-6 py-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <NavLink to="/" className="block" onClick={toggleMenu}>
                <img
                  src="FORTIS-01.png"
                  style={{ width: "30vh", height: "10vh", border: "1px solid blue" }}
                  alt="Fortis Logo"
                  className="w-46 object-contain filter brightness-0 invert"
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

            {/* Mobile Search Input */}
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

            <div className="flex flex-col space-y-6 flex-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-4 transition-colors duration-300 text-xl font-medium ${isActive
                      ? 'text-indigo-400 border-l-4 border-indigo-400 pl-4'
                      : 'text-white hover:text-indigo-400'
                    }`
                  }
                  onClick={toggleMenu}
                >
                  {t(link.text)}
                </NavLink>
              ))}
            </div>

            {/* Mobile Language Selector */}
            <div className="px-3 py-4">
              <div className="flex items-center space-x-4">
                <FiGlobe size={24} className="text-white" />
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  value={i18n.language}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 py-8">
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
        </div>
      </header>

      <main style={{ position: "relative", top: "12vh" }}>
        <Outlet />
      </main>

      
    </div>
  );
}