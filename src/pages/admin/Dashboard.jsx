import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiUsers, FiDollarSign, FiPieChart, FiSettings, FiLogOut, FiMenu, FiX, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
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

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Safe number formatting function
  const formatPrice = (price) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Fetch orders from Laravel backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders`);
      // Process orders to ensure numeric values
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
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard statistics
  const calculateStats = (orders) => {
    const totalSales = orders.reduce((sum, order) => {
      const price = typeof order.total_price === 'string' 
        ? parseFloat(order.total_price) 
        : order.total_price;
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

    setStats({
      totalSales,
      pendingOrders,
      completedOrders,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
    });
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus });
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order status.');
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${API_URL}/orders/${orderId}`);
        fetchOrders(); // Refresh orders after deletion
      } catch (err) {
        console.error('Error deleting order:', err);
        setError('Failed to delete order.');
      }
    }
  };

  // Fetch orders on component mount and when activeTab changes to orders
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    (order.customer_name && order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    order.id.toString().includes(searchQuery) ||
    (order.phone && order.phone.includes(searchQuery))
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:static z-30 w-64 bg-indigo-800 text-white transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} 
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-64'} lg:translate-x-0`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          <h1 className="text-xl font-bold">StoreAdmin</h1>
          <button 
            className="lg:hidden text-white" 
            onClick={() => setMobileSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <FiPieChart className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'orders' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => setActiveTab('orders')}
              >
                <FiShoppingCart className="mr-3" />
                Orders
                {stats.pendingOrders > 0 && (
                  <span className="ml-auto bg-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'products' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => setActiveTab('products')}
              >
                <FiShoppingCart className="mr-3" />
                Products
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => setActiveTab('settings')}
              >
                <FiSettings className="mr-3" />
                Store Settings
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <button className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700">
            <FiLogOut className="mr-3" />
            Logout
          </button>
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
                onClick={() => setMobileSidebarOpen(true)}
              >
                <FiMenu size={24} />
              </button>
              <button 
                className="hidden lg:block mr-4 text-gray-600" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                {activeTab === 'orders' && 'Order Management'}
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'products' && 'Product Management'}
                {activeTab === 'settings' && 'Store Settings'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                AD
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Store Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                      <FiShoppingCart size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500">Pending Orders</p>
                      <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                      <FiShoppingCart size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500">Completed Orders</p>
                      <p className="text-2xl font-bold">{stats.completedOrders}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                      <FiPieChart size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500">Avg. Order Value</p>
                      <p className="text-2xl font-bold">${stats.averageOrderValue}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent orders preview */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name || 'Guest'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatPrice(order.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Order Management</h2>
                <div className="relative w-64">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customer_name || 'Guest'}
                              {order.address && (
                                <div className="text-xs text-gray-400 mt-1">{order.address}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.phone || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.order_items?.length || 0}
                              {order.size && (
                                <div className="text-xs text-gray-400 mt-1">Size: {order.size}</div>
                              )}
                              {order.category && (
                                <div className="text-xs text-gray-400">Category: {order.category}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatPrice(order.total_price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                                {order.status}
                              </span>
                              {order.payment && (
                                <div className="text-xs mt-1">
                                  <span className={`px-1 inline-flex leading-5 rounded 
                                    ${order.payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {order.payment.payment_method}: {order.payment.payment_status}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={() => {
                                    // Implement order details view or edit modal
                                    console.log('View order:', order);
                                  }}
                                >
                                  <FiEdit />
                                </button>
                                <select 
                                  className="text-sm border rounded p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancel</option>
                                </select>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => deleteOrder(order.id)}
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination would go here */}
                  {filteredOrders.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                      No orders found matching your search criteria.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Store Settings</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                      <input 
                        type="text" 
                        id="store-name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue="My Awesome Store"
                      />
                    </div>
                    <div>
                      <label htmlFor="store-currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select 
                        id="store-currency" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="default-status" className="block text-sm font-medium text-gray-700 mb-1">Default Order Status</label>
                      <select 
                        id="default-status" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;