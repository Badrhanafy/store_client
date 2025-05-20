import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiArrowRight, FiAlertCircle, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

const socialProviders = [
  { name: 'Google', color: 'bg-red-500 hover:bg-red-600', icon: 'https://www.google.com/favicon.ico' },
  { name: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700', icon: 'https://www.facebook.com/favicon.ico' },
  { name: 'Twitter', color: 'bg-sky-400 hover:bg-sky-500', icon: 'https://www.twitter.com/favicon.ico' }
];

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const endpoint = isLogin ? 'http://localhost:8000/api/login' : 'http://localhost:8000/api/register';
      const response = await axios.post(endpoint, {
        ...formData,
        remember_me: rememberMe
      });
      
      const { user, token } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (onLoginSuccess) onLoginSuccess(user, token);
      if(user.role === 'admin'){
          navigate('/admin/dashboard')
      }
      else{
        navigate('/')
      }
     /*  navigate('/'); */
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {});
        } else if (error.response.status === 401) {
          setApiError('Invalid email or password');
        } else {
          setApiError(error.response.data.message || 'An error occurred');
        }
      } else {
        setApiError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setApiError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Glowing Blobs */}
      <div className="fixed -left-20 -top-20 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed -right-20 -bottom-20 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed right-1/2 bottom-1/2 w-64 h-64 bg-pink-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card with glass morphism effect */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
            {/* Auth Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-8 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2 className={`${fontClasses.heading} text-3xl text-white`}>
                  {isLogin ? 'Welcome Back' : 'Join StyleHaven'}
                </h2>
                <p className={`${fontClasses.body} text-indigo-100 mt-2`}>
                  {isLogin ? 'Sign in to continue your journey' : 'Create your free account today'}
                </p>
              </motion.div>
            </div>

            {/* Auth Form */}
            <div className="py-8 px-8">
              <AnimatePresence>
                {apiError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-3 bg-red-50/90 border border-red-200 text-red-600 rounded-lg flex items-start"
                  >
                    <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
                    <span className={`${fontClasses.body} text-sm`}>{apiError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mb-5"
                  >
                    <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className={`${errors.name ? 'text-red-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                        placeholder="John Doe"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${fontClasses.body} mt-1 text-sm text-red-600`}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                <div className="mb-5">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className={`${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${fontClasses.body} mt-1 text-sm text-red-600`}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="mb-6">
                  <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className={`${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`${fontClasses.body} w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500 bg-red-50/50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      placeholder={isLogin ? 'Enter your password' : 'Create a password (min 8 chars)'}
                      minLength={isLogin ? 6 : 8}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <FiEyeOff className="text-gray-400 hover:text-indigo-600 transition-colors" />
                      ) : (
                        <FiEye className="text-gray-400 hover:text-indigo-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${fontClasses.body} mt-1 text-sm text-red-600`}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                  {!isLogin && (
                    <div className="mt-2">
                      {['At least 8 characters', '1 uppercase letter', '1 number', '1 special character'].map((req, i) => (
                        <div key={i} className="flex items-center mt-1">
                          <FiCheck 
                            className={`mr-2 text-xs ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} 
                          />
                          <span className={`${fontClasses.body} text-xs ${formData.password.length >= 8 ? 'text-gray-600' : 'text-gray-400'}`}>
                            {req}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all"
                        disabled={isLoading}
                      />
                      <label htmlFor="remember-me" className={`${fontClasses.body} ml-2 block text-sm text-gray-700`}>
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link to="/PasswoRdreset" className={`${fontClasses.body} text-indigo-600 hover:text-indigo-500 transition-colors`}>
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  className={`${fontClasses.subheading} w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'shadow-lg hover:shadow-indigo-200/50'}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </span>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/60"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`${fontClasses.body} px-2 bg-white/80 text-gray-500`}>
                      {isLogin ? 'New to StyleHaven?' : 'Already have an account?'}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleAuthMode}
                  className={`${fontClasses.subheading} mt-4 w-full border border-gray-300/60 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50/50 hover:border-gray-400/60`}
                  disabled={isLoading}
                >
                  {isLogin ? 'Create an account' : 'Sign in instead'}
                </motion.button>
              </div>

              {/* Social Login */}
              <div className="mt-6">
                <p className={`${fontClasses.body} text-center text-gray-500 text-sm mb-3`}>
                  Or continue with
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {socialProviders.map((provider) => (
                    <motion.button
                      key={provider.name}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${fontClasses.body} ${provider.color} text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center transition-all duration-300 shadow hover:shadow-md`}
                      type="button"
                      disabled={isLoading}
                    >
                      <img 
                        src={provider.icon}
                        alt={provider.name}
                        className="h-5 mr-2 filter brightness-0 invert"
                      />
                      {provider.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className={`${fontClasses.body} text-xs text-gray-500`}>
              © {new Date().getFullYear()} StyleHaven. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}