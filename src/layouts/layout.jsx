import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { FiSearch, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
export default function Layout() {
  const fontClasses = {
    heading: "font-['Playfair_Display'] font-bold",
    subheading: "font-['Montserrat'] font-medium",
    body: "font-['Open_Sans']",
    nav: "font-['Raleway'] font-medium"
  };
  return (
    <div >
      <header >






        {/* Navigation Bar */}
        <nav className={`${fontClasses.nav} fixed w-full z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm mb-4`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Logo */}
              <div className="text-2xl font-bold mb-4 md:mb-0">
                <span className="text-indigo-600">Style</span>
                <span className="text-gray-800">Haven</span>
              </div>

              {/* Centered Navigation Links */}
              <div className="flex space-x-1 md:space-x-6">
                {[<Link to={"/"} className='text ml-4'> Home</Link>, <Link to={"/Login"} className='text ml-4'> login</Link>, <Link to={"/Signup"} className='text ml-4'> Signup</Link>, <Link to={"/form"} className='text ml-4'> Add product</Link>, <Link to={"/AllProducts"} className='text ml-4'> See Prodducts</Link>].map((item) => (
                  <div
                    key={item}
                    href="#"
                    className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button className="p-2 text-gray-600 hover:text-indigo-600">
                  <FiSearch size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600">
                  <FiUser size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600">
                  <FiHeart size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600 relative">
                  <FiShoppingBag size={20} />
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

      </header>
      <main  style={{position:"relative",top:"12vh"}}>
        <Outlet />
      </main>
      <footer>footer</footer>

    </div>
  )
}
