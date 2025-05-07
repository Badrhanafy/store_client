import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Consistent with your store's font classes
const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Auth Header */}
        <div className="bg-black py-6 px-8 text-center">
          <h2 className={`${fontClasses.heading} text-3xl text-white`}>
            {isLogin ? 'Welcome Back' : 'Join StyleHaven'}
          </h2>
          <p className={`${fontClasses.body} text-indigo-100 mt-2`}>
            {isLogin ? 'Sign in to your account' : 'Create your free account'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="py-8 px-8">
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>
            )}

            <div className="mb-4">
              <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  minLength={isLogin ? 6 : 8}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className={`${fontClasses.body} ml-2 block text-sm text-gray-700`}>
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className={`${fontClasses.body} text-indigo-600 hover:text-indigo-500`}>
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`${fontClasses.subheading} w-full bg-black hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300`}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <FiArrowRight className="ml-2" />
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`${fontClasses.body} px-2 bg-white text-gray-500`}>
                  {isLogin ? 'New to StyleHaven?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLogin(!isLogin)}
              className={`${fontClasses.subheading} mt-4 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300`}
            >
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </motion.button>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <p className={`${fontClasses.body} text-center text-gray-500 text-sm mb-3`}>
              Or continue with
            </p>
            <div className="grid grid-cols-3 gap-3 ">
              {['Google', 'Facebook', 'Twitter'].map((provider) => (
                <motion.button
                  key={provider}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${fontClasses.body} hover:shadow-lg w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 flex items-center justify-center`}
                >
                  <img 
                    src={`https://logo.clearbit.com/${provider.toLowerCase()}.com`} 
                    alt={provider}
                    className="h-5 mr-2"
                  />
                  {provider}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}