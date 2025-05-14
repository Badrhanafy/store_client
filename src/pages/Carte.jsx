import React, { useEffect, useState } from 'react';
import { 
  FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiX, 
  FiSend, FiAlertCircle, FiMapPin, FiShoppingBag, 
  FiPhone, FiMail, FiCheckCircle, FiInfo, FiUser 
} from 'react-icons/fi';
import axios from "axios";
import { useCart } from './CartContext';
import { useTranslation } from 'react-i18next';

const Cart = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { 
    cartCount,
    getCartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  } = useCart();

  const [localItems, setLocalItems] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show notification function
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalItems(getCartItems());
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [getCartItems]);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    setLocalItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    setLocalItems(prev => prev.filter(item => item.id !== id));
    showNotification(t('cart.alerts.itemRemoved'), 'success');
  };

  const validateForm = () => {
    const errors = {};
    if (!customerInfo.customer_name.trim()) {
      errors.customer_name = t('cart.errors.nameRequired');
    } else if (customerInfo.customer_name.trim().length < 2) {
      errors.customer_name = t('cart.errors.nameTooShort');
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = t('cart.errors.phoneRequired');
    } else if (!/^[\d\s+\-()]{8,}$/.test(customerInfo.phone)) {
      errors.phone = t('cart.errors.phoneInvalid');
    }

    if (!customerInfo.email.trim()) {
      errors.email = t('cart.errors.emailRequired');
    } else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email)) {
      errors.email = t('cart.errors.emailInvalid');
    }

    if (!customerInfo.address.trim()) {
      errors.address = t('cart.errors.addressRequired');
    } else if (customerInfo.address.trim().length < 10) {
      errors.address = t('cart.errors.addressTooShort');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const initiateOrder = () => {
    if (localItems.length === 0) {
      showNotification(t('cart.alerts.emptyCart'), 'error');
      return;
    }
    setShowOrderModal(true);
  };

  const submitOrder = async () => {
    if (!validateForm()) {
      showNotification(t('cart.alerts.formErrors'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/api/orders/panier', {
        user_id: 1, // You might want to get this from auth context
        customer_name: customerInfo.customer_name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        total_price: getCartTotal(),
        items: localItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      console.log(response.data);
      showNotification(t('cart.alerts.orderSuccess'), 'success');
      clearCart();
      setLocalItems([]);
      setShowOrderModal(false);
      // Reset form
      setCustomerInfo({
        customer_name: '',
        phone: '',
        email: '',
        address: ''
      });
    } catch (error) {
      console.error(error);
      showNotification(
        error.response?.data?.message || t('cart.alerts.orderError'), 
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Notification component
  const Notification = ({ message, type, onClose }) => {
    const bgColor = {
      success: 'bg-green-50 border-green-400',
      error: 'bg-red-50 border-red-400',
      info: 'bg-blue-50 border-blue-400'
    };
    
    const textColor = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800'
    };
    
    const icon = {
      success: <FiCheckCircle className="h-5 w-5 text-green-500" />,
      error: <FiAlertCircle className="h-5 w-5 text-red-500" />,
      info: <FiInfo className="h-5 w-5 text-blue-500" />
    };

    return (
      <div className={`fixed top-4 right-4 z-50 border-l-4 ${bgColor[type]} ${textColor[type]} p-4 shadow-lg rounded-md max-w-sm w-full transition-transform duration-300 animate-slideIn`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icon[type]}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md ${textColor[type]} hover:${textColor[type]} focus:outline-none`}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="mt-1 flex items-start text-red-600 text-sm">
      <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-1.5 h-4 w-4" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-slideUp">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                    <FiShoppingBag size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Procced
                  </h2>
                </div>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={customerInfo.customer_name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      formErrors.customer_name ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={'name'}
                  />
                  {formErrors.customer_name && (
                    <ErrorMessage message={formErrors.customer_name} />
                  )}
                </div>
                
                {/* Phone Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiPhone />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={'phone'}
                  />
                  {formErrors.phone && (
                    <ErrorMessage message={formErrors.phone} />
                  )}
                </div>
                
                {/* Email Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={'email'}
                  />
                  {formErrors.email && (
                    <ErrorMessage message={formErrors.email} />
                  )}
                </div>
                
                {/* Address Field */}
                <div className="relative">
                  <div className="absolute left-3 top-4 text-gray-400">
                    <FiMapPin />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={'address'}
                  />
                  {formErrors.address && (
                    <ErrorMessage message={formErrors.address} />
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    onClick={submitOrder}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('cart.orderModal.processing')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiSend className="mr-2" />
                        {'submitOrder'}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Content */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">
            {t('cart.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {cartCount === 0 ? 
              t('cart.emptyState.readyMessage') : 
              t('cart.reviewMessage')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : cartCount === 0 ? (
          <div className="text-center py-16">
            <FiShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {t('cart.emptyState.title')}
            </h3>
            <p className="text-gray-500 mb-6">
              {t('cart.emptyState.subtitle')}
            </p>
            <button 
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              onClick={() => window.location.href = '/AllProducts'}
            >
              {t('cart.emptyState.continueShopping')}
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {localItems.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition duration-150">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-md bg-gray-200 overflow-hidden">
                      {item.image ? (
                        <img 
                          src={`http://localhost:8000/${item.image}`} 
                          alt={item.title} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23e5e7eb"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="14">No Image</text></svg>';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <FiShoppingCart size={32} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label={t('cart.removeItem', { title: item.title })}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mt-1">
                      {item.description || t('cart.noDescription')}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label={t('cart.decreaseQuantity')}
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label={t('cart.increaseQuantity')}
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      
                      <p className="text-lg font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} {t('cart.currency')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('cart.subtotal')}
                </h3>
                <p className="text-xl font-semibold text-gray-900">
                  {getCartTotal().toFixed(2)} {t('cart.currency')}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {t('cart.shippingNotice')}
              </p>
              <button 
                onClick={initiateOrder}
                className="w-full bg-indigo-600 py-3 px-4 rounded-md text-white font-medium hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                disabled={cartCount === 0}
              >
                <FiShoppingBag className="mr-2" />
                {t('cart.checkoutButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;