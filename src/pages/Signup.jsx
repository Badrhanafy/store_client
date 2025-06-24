import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};

export default function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    
    if (apiError) setApiError('');
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(Math.min(strength, 5));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
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
      const response = await axios.post('http://192.168.1.13:8000/api/register', formData);
      
      // Handle successful registration
      const { user, token } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Call the onRegisterSuccess callback if provided
      if (onRegisterSuccess) {
        onRegisterSuccess(user, token);
      }
      
      // Redirect to dashboard or home
      navigate('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // Laravel validation errors
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {});
        } else {
          setApiError(error.response.data.message || 'Registration failed. Please try again.');
        }
      } else {
        setApiError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', validator: (pwd) => pwd.length >= 8 },
    { text: '1 uppercase letter', validator: (pwd) => /[A-Z]/.test(pwd) },
    { text: '1 number', validator: (pwd) => /[0-9]/.test(pwd) },
    { text: '1 special character', validator: (pwd) => /[^A-Za-z0-9]/.test(pwd) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Registration Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8 text-center">
          <h2 className={`${fontClasses.heading} text-3xl text-white`}>
            Join StyleHaven
          </h2>
          <p className={`${fontClasses.body} text-indigo-100 mt-2`}>
            Create your free account
          </p>
        </div>

        {/* Registration Form */}
        <div className="py-8 px-8">
          {apiError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start"
            >
              <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
              <span className={`${fontClasses.body} text-sm`}>{apiError}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
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
                  className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className={`${fontClasses.body} mt-1 text-sm text-red-600`}>{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
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
                  className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className={`${fontClasses.body} mt-1 text-sm text-red-600`}>{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
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
                  className={`${fontClasses.body} w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Create a password (min 8 chars)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiCheck className="text-gray-400 hover:text-indigo-600" />
                  ) : (
                    <FiLock className="text-gray-400 hover:text-indigo-600" />
                  )}
                </button>
              </div>
              
              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Password requirements */}
              <div className="mt-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center mt-1">
                    <FiCheck 
                      className={`mr-2 ${req.validator(formData.password) ? 'text-green-500' : 'text-gray-300'}`} 
                      size={14}
                    />
                    <span className={`${fontClasses.body} text-xs ${req.validator(formData.password) ? 'text-gray-600' : 'text-gray-400'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
              
              {errors.password && (
                <p className={`${fontClasses.body} mt-1 text-sm text-red-600`}>{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label className={`${fontClasses.subheading} block text-gray-700 text-sm mb-2`} htmlFor="password_confirmation">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className={`${errors.password_confirmation ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`${fontClasses.body} w-full pl-10 pr-3 py-3 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
              {errors.password_confirmation && (
                <p className={`${fontClasses.body} mt-1 text-sm text-red-600`}>{errors.password_confirmation}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              className={`${fontClasses.subheading} w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`${fontClasses.body} px-2 bg-white text-gray-500`}>
                  Already have an account?
                </span>
              </div>
            </div>

            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${fontClasses.subheading} mt-4 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-50`}
                disabled={isLoading}
              >
                Sign in instead
              </motion.button>
            </Link>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-6 text-center">
            <p className={`${fontClasses.body} text-xs text-gray-500`}>
              By registering, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}