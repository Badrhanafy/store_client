import React, { useState, useEffect } from 'react';
import { FiUsers, FiX, FiBell, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotificationCenter = ({ API_URL }) => {
  const { t } = useTranslation();
  const [notificationData, setNotificationData] = useState({
    notifications: [],
    unread_count: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('adminToken');

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationData({
        notifications: response.data.notifications.data,
        unread_count: response.data.unread_count
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/admin/notifications/${id}/read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        ),
        unread_count: prev.unread_count - 1
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${API_URL}/admin/notifications/mark-all-read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ 
          ...n, 
          read_at: new Date().toISOString() 
        })),
        unread_count: 0
      }));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatNotification = (notification) => {
    return {
      id: notification.id,
      type: notification.data.type,
      message: notification.data.message,
      created_at: notification.data.timestamp || notification.created_at,
      read: !!notification.read_at,
      orderId: notification.data.order_id, // Added orderId for cancellation notifications
      userId: notification.data.user_id    // Added userId for user-related notifications
    };
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_user':
        return <FiUsers className="text-indigo-500" />;
      case 'App\\Notifications\\OrderCancelledNotification':
        return <FiShoppingBag className="text-red-500" />;
      default:
        return <FiBell className="text-indigo-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {notificationData.unread_count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificationData.unread_count}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200"
          >
            <div className="p-3 border-b border-gray-200 font-medium text-gray-700 flex justify-between items-center">
              <span>{t('notifications')}</span>
              <div className="flex items-center space-x-2">
                {notificationData.unread_count > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {t('markAllAsRead')}
                  </button>
                )}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-pulse flex justify-center">
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : notificationData.notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">{t('noNotifications')}</div>
              ) : (
                notificationData.notifications.map((notification) => {
                  const formattedNotification = formatNotification(notification);
                  const isCancelledOrder = formattedNotification.type === 'App\\Notifications\\OrderCancelledNotification';
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 ${!formattedNotification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          {getNotificationIcon(formattedNotification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {formattedNotification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(formattedNotification.created_at).toLocaleString()}
                          </p>
                          {isCancelledOrder && formattedNotification.orderId && (
                            <div className="mt-1">
                              <Link
                                to={`/admin/orders/${formattedNotification.orderId}`}
                                className="text-xs text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                                onClick={() => markAsRead(notification.id)}
                              >
                                View order details <FiShoppingBag className="ml-1" size={12} />
                              </Link>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {!formattedNotification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mb-1"></div>
                          )}
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            Mark as read
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="p-2 border-t border-gray-200 text-center">
              <Link 
                to="/admin/notifications" 
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;