import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    FiShoppingCart,
    FiMenu,
    FiPrinter,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiX,
    FiPieChart,
    FiSettings,
    FiLogOut,
    FiUsers,
    FiDollarSign
} from 'react-icons/fi';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const OrdersComponent = ({
    sidebarOpen = false,
    setSidebarOpen = () => { },
    changeLanguage = () => { },
    i18n
}) => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalSales: 0,
        pendingOrders: 0,
        completedOrders: 0,
        averageOrderValue: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Added local state for mobile sidebar

    // Get current language safely
    const currentLanguage = i18n?.language || 'en';

    // API base URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.187.1:8000/api';

    // Safe number formatting function
    const formatPrice = (price) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    // View order details for invoice
    const viewOrderInvoice = (order) => {
        setSelectedOrder(order);
        setShowInvoice(true);
    };

    // Close invoice modal
    const closeInvoice = () => {
        setShowInvoice(false);
        setSelectedOrder(null);
    };

    // Print invoice
    const printInvoice = () => {
        window.print();
    };

    // Fetch orders from backend
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/orders`);
            const processedOrders = response.data.map(order => ({
                ...order,
                total_price: parseFloat(order.total_price) || 0,
                order_items: order.order_items?.map(item => ({
                    ...item,
                    price: parseFloat(item.price) || 0
                }))
            }));
            setOrders(processedOrders);
            calculateStats(processedOrders);
            setError(null);
            toast.success(t('ordersLoaded'));
        } catch (err) {
            setError(t('failedToFetchOrders'));
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate dashboard statistics
    const calculateStats = (orders) => {
        const totalSales = orders.reduce((sum, order) => {
            if (order.status === 'completed') {
                const price = typeof order.total_price === 'string'
                    ? parseFloat(order.total_price)
                    : order.total_price;
                return sum + (isNaN(price) ? 0 : price);
            }
            return sum;
        }, 0);

        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const completedOrders = orders.filter(order => order.status === 'completed').length;
        const averageOrderValue = completedOrders > 0 ? totalSales / completedOrders : 0;

        setStats({
            totalSales,
            pendingOrders,
            completedOrders,
            averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
        });
    };

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        const loadingToast = toast.loading(t('updatingOrderStatus'));
        try {
            await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus });
            toast.success(t('orderStatusUpdated'), { id: loadingToast });
            fetchOrders();
        } catch (err) {
            console.error('Error updating order:', err);
            toast.error(t('failedToUpdateOrderStatus'), { id: loadingToast });
            setError(t('failedToUpdateOrderStatus'));
        }
    };

    // Delete order
    const deleteOrder = async (orderId) => {
        toast((t) => (
            <div className="flex flex-col space-y-2">
                <p>{t('confirmDeleteOrder')}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadingToast = toast.loading(t('deletingOrder'));
                            try {
                                await axios.delete(`${API_URL}/orders/${orderId}`);
                                await fetchOrders();
                                toast.success(t('orderDeleted'), { id: loadingToast });
                            } catch (err) {
                                toast.error(t('failedToDeleteOrder'), { id: loadingToast });
                                console.error('Error deleting order:', err);
                            }
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {t('delete')}
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Filter orders based on search query
    const filteredOrders = orders.filter(order =>
        (order.customer_name && order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.id.toString().includes(searchQuery) ||
        (order.phone && order.phone.includes(searchQuery))
    );

    // Fetch data when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className={`flex h-screen bg-gray-100 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            <Toaster
                position={currentLanguage === 'ar' ? 'top-left' : 'top-right'}
                toastOptions={{
                    className: '',
                    style: {
                        padding: '16px',
                        color: '#374151',
                    },
                    success: {
                        style: {
                            background: '#ECFDF5',
                            border: '1px solid #10B981',
                        },
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#FFFFFF',
                        },
                    },
                    error: {
                        style: {
                            background: '#FEF2F2',
                            border: '1px solid #EF4444',
                        },
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#FFFFFF',
                        },
                    },
                    loading: {
                        style: {
                            background: '#EFF6FF',
                            border: '1px solid #3B82F6',
                        },
                    },
                }}
            />

            {/* Mobile sidebar backdrop */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 lg:static z-30 w-64 bg-black text-white transition-all duration-300 ease-in-out 
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} 
  ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-64'} lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between border-b border-indigo-700">
                        <h1 className="text-xl font-bold">FORTIS SPACE</h1>
                        <button
                            className="lg:hidden text-white"
                            onClick={() => setMobileSidebarOpen(false)}
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <nav className="p-4 flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                                >
                                    <FiPieChart className="mr-3" />
                                    {t('dashboard')}
                                </button>
                            </li>
                            <li>
                                <button
                                    className="w-full flex items-center p-3 rounded-lg bg-indigo-700"
                                >
                                    <FiShoppingCart className="mr-3" />
                                    {t('orders')}
                                    {stats.pendingOrders > 0 && (
                                        <span className="ml-auto bg-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                                            {stats.pendingOrders}
                                        </span>
                                    )}
                                </button>
                            </li>
                            <li>
                                <Link
                                    className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                                    to={"/admin/AllProductsFortest"}
                                >
                                    <FiUsers className="mr-3" />
                                    {t('products')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                                    to={"/admin/settings"}
                                >
                                    <FiSettings className="mr-3" />
                                    {t('storeSettings')}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-indigo-700">
                        <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`px-2 py-1 text-xs rounded ${currentLanguage === 'en' ? 'bg-white text-indigo-800' : 'bg-indigo-700'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => changeLanguage('fr')}
                                    className={`px-2 py-1 text-xs rounded ${currentLanguage === 'fr' ? 'bg-white text-indigo-800' : 'bg-indigo-700'}`}
                                >
                                    FR
                                </button>
                                <button
                                    onClick={() => changeLanguage('ar')}
                                    className={`px-2 py-1 text-xs rounded ${currentLanguage === 'ar' ? 'bg-white text-indigo-800' : 'bg-indigo-700'}`}
                                >
                                    AR
                                </button>
                            </div>
                            <button className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700">
                                <FiLogOut className="mr-3" />
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                            <button
                                className="mr-4 text-gray-600 lg:hidden"
                                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} // Fixed this line
                            >
                                <FiMenu size={24} />
                            </button>
                            <button
                                className="hidden lg:block mr-4 text-gray-600"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <FiMenu size={24} />
                            </button>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                                {t('orderManagement')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative hidden sm:block">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('searchOrders')}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                AD
                            </div>
                        </div>
                    </div>

                    {/* Mobile search bar */}
                    <div className="px-4 pb-4 sm:hidden">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('searchOrders')}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                            <h2 className="text-xl sm:text-2xl font-semibold">{t('orderManagement')}</h2>
                            <div className="relative w-full sm:w-64">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('searchOrders')}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('order')}</th>
                                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customer')}</th>
                                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('phone')}</th>
                                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('items')}</th>
                                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <div className="flex flex-col">
                                                            <span>#{order.id}</span>
                                                            <span className="text-xs text-gray-500 sm:hidden">
                                                                {order.customer_name || t('guest')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex flex-col">
                                                            <span>{order.customer_name || t('guest')}</span>
                                                            {order.address && (
                                                                <span className="text-xs text-gray-400 mt-1">{order.address}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {order.phone || 'N/A'}
                                                    </td>
                                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(order.created_at)}
                                                    </td>
                                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex flex-col">
                                                            <span>{order.order_items?.length || 0}</span>
                                                            {order.size && (
                                                                <span className="text-xs text-gray-400">{t('size')}: {order.size}</span>
                                                            )}
                                                            {order.category && (
                                                                <span className="text-xs text-gray-400">{t('category')}: {order.category}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${formatPrice(order.total_price)}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                              ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                              ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                                                                {order.status}
                                                            </span>
                                                            {order.payment && (
                                                                <span className={`px-1 inline-flex text-xs leading-5 rounded 
                                ${order.payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                    {order.payment.payment_method}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                                                            <button
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                                onClick={() => {
                                                                    // Implement order details view or edit modal
                                                                    console.log('View order:', order);
                                                                }}
                                                            >
                                                                <FiEdit size={16} />
                                                            </button>
                                                            {order.status === 'shipped' && (
                                                                <button
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    onClick={() => viewOrderInvoice(order)}
                                                                    title={t('viewInvoice')}
                                                                >
                                                                    <FiPrinter size={16} />
                                                                </button>
                                                            )}
                                                            <select
                                                                className="text-xs sm:text-sm border rounded p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                                value={order.status}
                                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            >
                                                                <option value="pending">{t('pending')}</option>
                                                                <option value="shipped">{t('shipped')}</option>
                                                                <option value="completed">{t('completed')}</option>
                                                                <option value="cancelled">{t('cancelled')}</option>
                                                            </select>
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => deleteOrder(order.id)}
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredOrders.length === 0 && !loading && (
                                    <div className="p-8 text-center text-gray-500">
                                        {t('noOrdersFound')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Invoice Modal */}
            {showInvoice && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeInvoice}></div>
                        </div>

                        {/* Modal content */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full print:shadow-none print:max-w-full print:rounded-none print:align-top">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 print:p-0">
                                {/* Invoice Header */}
                                <div className="flex justify-between items-start mb-8 print:mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{t('invoice')}</h2>
                                        <p className="text-gray-600">{t('order')} # {selectedOrder.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600">{t('date')}: {formatDate(selectedOrder.created_at)}</p>
                                        <p className="text-gray-600">{t('status')}: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  ${selectedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                  ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                                            {selectedOrder.status}
                                        </span></p>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="mb-8 print:mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">{t('customerInformation')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-medium text-gray-700">{t('name')}:</p>
                                            <p>{selectedOrder.customer_name || t('guest')}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">{t('phone')}:</p>
                                            <p>{selectedOrder.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">{t('email')}:</p>
                                            <p>{selectedOrder.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">{t('address')}:</p>
                                            <p>{selectedOrder.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-8 print:mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">{t('orderItems')}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('product')}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quantity')}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('total')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedOrder.order_items?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                                                    {item.size && (
                                                                        <div className="text-sm text-gray-500">{t('size')}: {item.size}</div>
                                                                    )}
                                                                    {item.color && (
                                                                        <div className="text-sm text-gray-500">{t('color')}: {item.color}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ${formatPrice(item.price)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ${formatPrice(item.price * item.quantity)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent">
                                    <div className="flex justify-end">
                                        <div className="w-full md:w-1/3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">{t('subtotal')}:</span>
                                                <span>${formatPrice(selectedOrder.total_price)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">{t('shipping')}:</span>
                                                <span>$0.00</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">{t('tax')}:</span>
                                                <span>$0.00</span>
                                            </div>
                                            <div className="flex justify-between py-2 font-bold text-lg">
                                                <span>{t('total')}:</span>
                                                <span>${formatPrice(selectedOrder.total_price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                {selectedOrder.payment && (
                                    <div className="mt-6 print:mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">{t('paymentInformation')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-medium text-gray-700">{t('method')}:</p>
                                                <p>{selectedOrder.payment.payment_method}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">{t('status')}:</p>
                                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedOrder.payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {selectedOrder.payment.payment_status}
                                                </p>
                                            </div>
                                            {selectedOrder.payment.transaction_id && (
                                                <div>
                                                    <p className="font-medium text-gray-700">{t('transactionId')}:</p>
                                                    <p>{selectedOrder.payment.transaction_id}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal footer */}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse print:hidden">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={printInvoice}
                                >
                                    <FiPrinter className="mr-2" /> {t('printInvoice')}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={closeInvoice}
                                >
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersComponent;