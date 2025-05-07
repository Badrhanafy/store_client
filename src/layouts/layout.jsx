import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';

export default function Layout() {
  const fontClasses = {
    heading: "font-['Playfair_Display'] font-bold",
    subheading: "font-['Montserrat'] font-medium",
    body: "font-['Open_Sans']",
    nav: "font-['Raleway'] font-medium"
  };

  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/Login", text: "Login" },
    { to: "/Signup", text: "Signup" },
    { to: "/form", text: "Add product" },
    { to: "/AllProducts", text: "Products" }
  ];

  return (
    <div>
      <header>
        {/* Main Navbar - White background on desktop */}
        <nav className={`${fontClasses.nav} fixed w-full z-50 bg-white shadow-sm mb-4`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="block">
                  <img
                    src="FORTIS-01.png"
                    alt="Fortis Logo"
                    className="h-12 md:h-16 w-auto max-w-[180px] md:max-w-[220px] object-contain"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 flex-1 mx-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    className='px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300'
                  >
                    {link.text}
                  </Link>
                ))}
              </div>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                <button className="p-2 text-gray-600 hover:text-indigo-600">
                  <FiSearch size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600">
                  <FiUser size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600">
                  <FiHeart size={20} />
                </button>
                <div className="p-2 text-gray-600 hover:text-indigo-600 relative">
                  <Link to="/cart">
                    <FiShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Button - Black background */}
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

        {/* Mobile Sidebar - Full black background */}
        <div className={`md:hidden fixed inset-0 z-40 bg-black transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="container mx-auto px-6 py-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="block" onClick={toggleMenu}>
                <img
                  src="FORTIS-01.png"
                  style={{width:"30vh",height:"10vh",border:"1px solid blue"}}
                  alt="Fortis Logo"
                  className="w-46 object-contain filter brightness-0 invert"
                />
              </Link>
              <button
                onClick={toggleMenu}
                className="p-2 text-white hover:text-indigo-400 focus:outline-none"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6 flex-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className='px-3 py-4 text-white hover:text-indigo-400 transition-colors duration-300 text-xl font-medium'
                  onClick={toggleMenu}
                >
                  {link.text}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-8 py-8">
              <button className="p-2 text-white hover:text-indigo-400">
                <FiSearch size={24} />
              </button>
              <button className="p-2 text-white hover:text-indigo-400">
                <FiUser size={24} />
              </button>
              <button className="p-2 text-white hover:text-indigo-400">
                <FiHeart size={24} />
              </button>
              <div className="p-2 text-white hover:text-indigo-400 relative">
                <Link to="/cart" onClick={toggleMenu}>
                  <FiShoppingBag size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ position: "relative", top: "12vh" }}>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}