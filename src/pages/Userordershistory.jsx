import React, { useState, useEffect } from 'react';
import { 
  FiShoppingBag, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiXCircle, 
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiUser,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiInfo,
  FiCheck,
  FiAlertTriangle
} from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UserOrders = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [notification, setNotification] = useState(null);
  const { phone } = useParams();
  const token = sessionStorage.getItem("UserToken");

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    
    // Load luxury fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add subtle gold gradient to body
    document.body.style.background = 'radial-gradient(ellipse at center, #f9f9f9 0%, #f0f0f0 100%)';
    
    return () => {
      document.body.style.background = '';
    };
  }, [i18n.language]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:8000/api/ordersHistory/userPhone`, {
        params: { phone },
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setOrders(response.data);
    } catch (err) {
      console.error('Order fetch error:', err.response?.data || err.message);
      setError(err.response?.data?.message || t('failedToLoadOrders'));
      showNotification('error', err.response?.data?.message || t('failedToLoadOrders'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phone) fetchUserOrders();
  }, [phone]);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      setCancelError(null);
      
      await axios.patch(`http://192.168.1.13:8000/api/orders/${orderId}/cancel`, {
        phone: phone
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      showNotification('success', t('orderCancelledSuccessfully'));
    } catch (err) {
      console.error('Cancel order error:', err);
      const errorMsg = err.response?.data?.message || t('cancelOrderFailed');
      setCancelError(errorMsg);
      showNotification('error', errorMsg);
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    const baseClasses = "h-6 w-6";
    
    switch (statusLower) {
      case 'pending': 
        return <FiClock className={`${baseClasses} text-amber-500`} />;
      case 'processing': 
        return <FiTruck className={`${baseClasses} text-blue-500`} />;
      case 'completed': 
        return <FiCheckCircle className={`${baseClasses} text-emerald-500`} />;
      case 'cancelled': 
        return <FiXCircle className={`${baseClasses} text-rose-500`} />;
      default: 
        return <FiShoppingBag className={`${baseClasses} text-gray-400`} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const baseClasses = "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium";
    
    switch (statusLower) {
      case 'pending':
        return <span className={`${baseClasses} bg-amber-50 text-amber-800 border border-amber-100`}>{t('status.pending')}</span>;
      case 'processing':
        return <span className={`${baseClasses} bg-blue-50 text-blue-800 border border-blue-100`}>{t('status.processing')}</span>;
      case 'completed':
        return <span className={`${baseClasses} bg-emerald-50 text-emerald-800 border border-emerald-100`}>{t('status.completed')}</span>;
      case 'cancelled':
        return <span className={`${baseClasses} bg-rose-50 text-rose-800 border border-rose-100`}>{t('status.cancelled')}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>{status}</span>;
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-MA' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-400"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-rose-100"
        >
          <div className="flex items-center">
            <div className="bg-rose-100 p-3 rounded-full mr-4">
              <FiAlertCircle className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 font-serif">{t('error')}</h3>
              <p className="text-gray-600 font-sans">{error}</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto text-center py-20 px-4"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full mb-6 shadow-inner">
          <FiShoppingBag className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="text-2xl font-serif font-medium text-gray-900 mb-3">{t('noOrdersFound')}</h3>
        <p className="text-gray-600 max-w-md mx-auto font-sans">
          {t('noOrdersDescription')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-lg overflow-hidden ${
              notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200' :
              notification.type === 'error' ? 'bg-rose-50 border border-rose-200' :
              'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex items-center p-4">
              <div className={`flex-shrink-0 ${
                notification.type === 'success' ? 'text-emerald-500' :
                notification.type === 'error' ? 'text-rose-500' :
                'text-blue-500'
              }`}>
                {notification.type === 'success' ? <FiCheck className="h-6 w-6" /> :
                 notification.type === 'error' ? <FiAlertTriangle className="h-6 w-6" /> :
                 <FiInfo className="h-6 w-6" />}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-emerald-800' :
                  notification.type === 'error' ? 'text-rose-800' :
                  'text-blue-800'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 p-1 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              className={`h-1 ${
                notification.type === 'success' ? 'bg-emerald-500' :
                notification.type === 'error' ? 'bg-rose-500' :
                'bg-blue-500'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-serif font-medium text-gray-900 mb-3">{t('yourOrders')}</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto font-sans">
          {t('orderHistoryDescription')}
        </p>
      </motion.div>

      {/* Order Status Tabs */}
      <div className="flex flex-wrap justify-center mb-12 gap-2">
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeTab === tab
                ? tab === 'cancelled'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : tab === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : tab === 'processing'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : tab === 'pending'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t(`status.${tab}`)}
            {tab !== 'all' && (
              <span className="ml-2 bg-white bg-opacity-50 rounded-full px-2 py-1 text-xs">
                {orders.filter(o => o.status === tab).length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Cancelled Orders Section (only shown when not filtered) */}
      {activeTab === 'all' && orders.some(o => o.status === 'cancelled') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
            <h2 className="text-2xl font-serif font-medium text-rose-800 mb-4 flex items-center">
              <FiXCircle className="h-6 w-6 mr-3" />
              {t('cancelledOrders')}
            </h2>
            <p className="text-rose-700 mb-6 font-sans">
              {t('cancelledOrdersDescription')}
            </p>
            
            <div className="space-y-4">
              {orders
                .filter(order => order.status === 'cancelled')
                .map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-4 rounded-lg border border-rose-100 shadow-xs flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-serif font-medium text-gray-900">
                        {t('order')} #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500 font-sans">
                        {format(new Date(order.created_at), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-rose-600 font-medium font-sans">
                        {formatPrice(order.total_price)}
                      </span>
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="text-rose-600 hover:text-rose-800 transition-colors"
                      >
                        {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Orders List */}
      <div className="space-y-8">
        {filteredOrders
          .filter(order => activeTab === 'all' ? order.status !== 'cancelled' : true)
          .map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                transform: "translateY(-5px)"
              }}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
            >
              <motion.div 
                className="p-8 cursor-pointer"
                onClick={() => toggleOrder(order.id)}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6">
                    <motion.div 
                      className={`p-4 rounded-xl ${order.status === 'pending' ? 'bg-gradient-to-br from-amber-50 to-amber-100' : 
                                     order.status === 'processing' ? 'bg-gradient-to-br from-blue-50 to-blue-100' : 
                                     order.status === 'completed' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100' : 
                                     order.status === 'cancelled' ? 'bg-gradient-to-br from-rose-50 to-rose-100' : 'bg-gray-50'}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {getStatusIcon(order.status)}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-serif font-medium text-gray-900">
                        {t('order')} #{order.id}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500 font-sans">
                        <span>{format(new Date(order.created_at), 'MMMM dd, yyyy')}</span>
                        <span className="mx-3 text-gray-300">|</span>
                        <span>{format(new Date(order.created_at), 'hh:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="hidden sm:block">
                      {getStatusBadge(order.status)}
                    </div>
                    <motion.div 
                      className="text-gray-400"
                      animate={{ 
                        rotate: expandedOrder === order.id ? 180 : 0,
                        scale: expandedOrder === order.id ? 1.2 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiChevronDown className="h-6 w-6" />
                    </motion.div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: <FiPackage />, label: t('items'), value: order.order_items?.length || 0 },
                    { icon: <FiCreditCard />, label: t('total'), value: formatPrice(order.total_price) },
                    { icon: <FiUser />, label: t('customer'), value: order.customer_name },
                    { icon: <FiTruck />, label: t('delivery'), value: order.delivery_method || t('standard') }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 border border-gray-100"
                      whileHover={{ 
                        backgroundColor: 'rgba(249, 250, 251, 1)',
                        scale: 1.03,
                        borderColor: 'rgba(209, 213, 219, 0.5)'
                      }}
                    >
                      <div className="p-3 bg-gray-50 rounded-lg mr-4">
                        {React.cloneElement(item.icon, { className: "h-5 w-5 text-gray-600" })}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-sans uppercase tracking-wider">{item.label}</p>
                        <p className="text-lg font-medium text-gray-900 font-serif mt-1">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-8 py-8 bg-gradient-to-b from-white to-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                          <h4 className="text-lg font-serif font-medium text-gray-900 mb-6 flex items-center">
                            <FiPackage className="h-5 w-5 text-gray-600 mr-3" />
                            {t('orderItems')}
                          </h4>
                          <ul className="divide-y divide-gray-100">
                            {order.order_items?.map((item) => (
                              <motion.li 
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="py-5 hover:bg-gray-50 rounded-lg px-4 transition-colors duration-300"
                              >
                                <div className="flex items-start">
                                  {item.product?.image && (
                                    <motion.div 
                                      className="flex-shrink-0 relative"
                                      initial={{ scale: 0.9 }}
                                      animate={{ scale: 1 }}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-20 rounded-lg"></div>
                                      <img 
                                        src={`http://localhost:8000/${item.product.image}`} 
                                        alt={item.product.title}
                                        className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                                        onError={(e) => e.target.style.display = 'none'}
                                      />
                                    </motion.div>
                                  )}
                                  <div className={`ml-6 flex-1 min-w-0 ${i18n.language === 'ar' ? 'mr-6' : 'ml-6'}`}>
                                    <p className="text-lg font-serif font-medium text-gray-900">
                                      {item.product?.title || t('productNotAvailable')}
                                    </p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                                      {[
                                        { label: t('size'), value: item.size },
                                        { label: t('color'), value: item.color },
                                        { label: t('quantity'), value: item.quantity },
                                        { label: t('price'), value: formatPrice(item.price) }
                                      ].map((detail, i) => (
                                        <motion.p 
                                          key={i}
                                          className="text-sm text-gray-600 font-sans"
                                          whileHover={{ scale: 1.02 }}
                                        >
                                          <span className="text-gray-400">{detail.label}:</span>{' '}
                                          <span className="font-medium text-gray-700">{detail.value}</span>
                                        </motion.p>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="ml-6 flex-shrink-0">
                                    <p className="text-lg font-serif font-medium text-gray-900">
                                      {formatPrice(item.price * item.quantity)}
                                    </p>
                                  </div>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-8">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <h4 className="text-lg font-serif font-medium text-gray-900 mb-6 flex items-center">
                              <FiMapPin className="h-5 w-5 text-gray-600 mr-3" />
                              {t('shippingAddress')}
                            </h4>
                            <motion.div 
                              className="text-sm text-gray-700 bg-white p-6 rounded-xl border border-gray-100 shadow-xs transition-all duration-300 font-sans"
                              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.03)" }}
                            >
                              <p className="font-serif font-medium text-gray-900"><span className='bg-yellow-300'>{order.customer_name}</span></p>
                              <p className="mt-3">{order.address}</p>
                              <p className="mt-2">{order.phone}</p>
                              {order.additional_info && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-xs text-gray-400 uppercase tracking-wider">{t('additionalInfo')}</p>
                                  <p className="text-sm text-gray-700 mt-2">{order.additional_info}</p>
                                </div>
                              )}
                            </motion.div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h4 className="text-lg font-serif font-medium text-gray-900 mb-6 flex items-center">
                              <FiCreditCard className="h-5 w-5 text-gray-600 mr-3" />
                              {t('paymentDetails')}
                            </h4>
                            <motion.div 
                              className="text-sm text-gray-700 bg-white p-6 rounded-xl border border-gray-100 shadow-xs transition-all duration-300 font-sans"
                              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.03)" }}
                            >
                              <div className="flex justify-between py-3">
                                <span className="text-gray-500">{t('paymentMethod')}:</span>
                                <span className="font-medium capitalize">
                                  {order.payment?.payment_method || t('notSpecified')}
                                </span>
                              </div>
                              {order.payment?.transaction_id && (
                                <div className="flex justify-between py-3 border-t border-gray-100">
                                  <span className="text-gray-500">{t('transactionId')}:</span>
                                  <span className="font-medium">{order.payment.transaction_id}</span>
                                </div>
                              )}
                              <div className="flex justify-between py-3 border-t border-gray-100">
                                <span className="text-gray-500">{t('totalPaid')}:</span>
                                <span className="font-serif font-medium text-gray-900">{formatPrice(order.total_price)}</span>
                              </div>
                            </motion.div>
                          </motion.div>

                          {(order.status === 'pending' || order.status === 'processing') && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="pt-6 border-t border-gray-100"
                            >
                              <motion.button
                                onClick={() => cancelOrder(order.id)}
                                disabled={cancellingOrder === order.id}
                                className={`w-full flex items-center justify-center px-6 py-3 rounded-xl border border-rose-100 text-rose-700 transition-all duration-300 font-sans font-medium ${
                                  cancellingOrder === order.id 
                                    ? 'opacity-70 cursor-not-allowed' 
                                    : 'hover:bg-rose-50 hover:shadow-xs hover:border-rose-200'
                                }`}
                                whileHover={cancellingOrder === order.id ? {} : { 
                                  backgroundColor: 'rgba(255, 228, 230, 0.7)',
                                  scale: 1.02
                                }}
                                whileTap={cancellingOrder === order.id ? {} : { scale: 0.98 }}
                              >
                                {cancellingOrder === order.id ? (
                                  <>
                                    <FiLoader className="animate-spin h-5 w-5 mr-3" />
                                    {t('cancelling')}...
                                  </>
                                ) : (
                                  <>
                                    <FiX className="h-5 w-5 mr-3" />
                                    {t('cancelOrder')}
                                  </>
                                )}
                              </motion.button>
                              {cancelError && cancellingOrder === order.id && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 text-sm text-rose-600 font-sans"
                                >
                                  {cancelError}
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default UserOrders;