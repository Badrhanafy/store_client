import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiX } from 'react-icons/fi';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalItems(getCartItems());
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [getCartItems]);

  const handleUpdateQuantity = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
    setLocalItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    setLocalItems(prev => prev.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const errors = {};
    if (!customerInfo.customer_name.trim()) errors.customer_name = t('cart.errors.nameRequired');
    if (!customerInfo.phone.trim()) errors.phone = t('cart.errors.phoneRequired');
    if (!customerInfo.email.trim()) {
      errors.email = t('cart.errors.emailRequired');
    } else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email)) {
      errors.email = t('cart.errors.emailInvalid');
    }
    if (!customerInfo.address.trim()) errors.address = t('cart.errors.addressRequired');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initiateOrder = () => {
    if (localItems.length === 0) {
      alert(t('cart.alerts.emptyCart'));
      return;
    }
    setShowOrderModal(true);
  };

  const submitOrder = async () => {
    if (!validateForm()) return;

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
      alert(t('cart.alerts.orderSuccess'));
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
      alert(t('cart.alerts.orderError'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t('cart.orderModal.title')}</h2>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('cart.orderModal.name')} *
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={customerInfo.customer_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.customer_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.customer_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customer_name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('cart.orderModal.phone')} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('cart.orderModal.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('cart.orderModal.address')} *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={submitOrder}
                    className="w-full bg-indigo-600 py-3 px-4 rounded-md text-white font-medium hover:bg-indigo-700 transition duration-300"
                  >
                    {t('cart.orderModal.submitOrder')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                className="w-full bg-indigo-600 py-3 px-4 rounded-md text-white font-medium hover:bg-indigo-700 transition duration-300"
                disabled={cartCount === 0}
              >
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