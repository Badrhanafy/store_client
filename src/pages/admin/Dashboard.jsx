import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import fortisLogo from './assets/FORTIS-01.svg';
import {
  FiShoppingCart, FiUsers, FiDollarSign, FiPrinter, FiPieChart,
  FiSettings, FiLogOut, FiMenu, FiX, FiSearch, FiEdit, FiTrash2,
  FiPlus, FiImage, FiChevronDown, FiChevronUp, FiUpload, FiHash,
  FiType, FiPlusCircle, FiMoreHorizontal
} from 'react-icons/fi';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';
import NotificationCenter from './Notificationscenter';
import { motion, AnimatePresence } from 'framer-motion';
import ProductEditForm from './ProductEdit';
import OutOfStockProducts from './OutofStock';
import { useNavigate } from 'react-router-dom';
import SliderManagement from './SliderManagement';
// Font classes consistent with your store
const fontClasses = {
  heading: "font-['Playfair_Display'] font-bold",
  subheading: "font-['Montserrat'] font-medium",
  body: "font-['Open_Sans']",
  nav: "font-['Raleway'] font-medium"
};
const ProfileDropdown = ({ admin, onLogout }) => {
  return (
    <motion.div
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
        <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
      </div>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <FiLogOut className="mr-2" />
        Logout
      </button>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0
  });
  //edit product form 
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/login");
  };
  
  const handleSaveProduct = async (updatedData) => {
    try {
      // Call your API to update the product
      const response = await axios.put(`${API_URL}/products/${editingProduct.id}`, updatedData);

      // Update local state or refetch products
      fetchProducts();

      // Close the edit form
      setIsEditing(false);
      setEditingProduct(null);

      // Show success message
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  //
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [viewOrderModal, setViewOrderModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  // Product form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    qte: '',
    image: null,
    category: '',
    colors: [],
    sizes: []
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  // API base URL
  const API_URL = 'http://localhost:8000/api';

  // Configure axios
  axios.defaults.withCredentials = true;

  // Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };
  const viewOrderDetails = async (order) => {
    try {
      // If you need to fetch more detailed information about the order
      // const response = await axios.get(`${API_URL}/orders/${order.id}`);
      // setSelectedOrderDetails(response.data);

      // Or use the existing order data if it's sufficient
      setSelectedOrderDetails(order);
      setViewOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };
  // Get CSRF token
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    getCsrfToken();
  }, []);

  // Animation variants
  const expandVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const imageUploadVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  // Format price
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

  // Toggle product details expansion
  const toggleProductDetails = async (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
      try {
        const response = await axios.get(`${API_URL}/products/${productId}/images`);
        setSelectedProductImages(response.data.images || []);
      } catch (error) {
        console.error('Error fetching product images:', error);
        toast.error('Failed to load product images');
      }
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, productId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i]);
    }

    try {
      await axios.post(`${API_URL}/admin/products/${productId}/add-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Images uploaded successfully!');
      // Refresh product images
      const response = await axios.get(`${API_URL}/products/${productId}/images`);
      setSelectedProductImages(response.data.images || []);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setImageUploading(false);
      e.target.value = ''; // Reset file input
    }
  };
  const Tooltip = ({ children, text }) => {
    return (
      <motion.div
        className="relative inline-block"
        initial="hidden"
        whileHover="visible"
      >
        {children}
        <motion.div
          className="absolute z-50 w-max px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg"
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.2 }}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '100%',
            marginBottom: '5px'
          }}
        >
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-solid border-gray-800 border-l-transparent border-r-transparent" />
        </motion.div>
      </motion.div>
    );
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
      toast.success(t('ordersLoaded'));
    } catch (err) {
      setError(t('failedToFetchOrders'));
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setError(null);
      toast.success(t('productsLoaded'));
    } catch (error) {
      console.log(error);
      setError(t('failedToFetchProducts'));
    }
  };

  // Delete image
  const deleteImage = async (productId, imageId) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${productId}/images/${imageId}`);
      toast.success(response.data.message);
      // Refresh images after deletion
      const imagesResponse = await axios.get(`${API_URL}/products/${productId}/images`);
      setSelectedProductImages(imagesResponse.data.images || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete image');
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

    const averageOrderValue = completedOrders > 0
      ? totalSales / completedOrders
      : 0;

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
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error(t('failedToUpdateOrderStatus'), { id: loadingToast });
      setError(t('failedToUpdateOrderStatus'));
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    toast(() => (
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
    ), {
      duration: 10000,
    });
  };

  // Fetch data when activeTab changes
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  // Filter orders based on search query
  const filteredOrders = orders
    .filter(order => {
      // Search filter
      const matchesSearch =
        (order.customer_name && order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.id.toString().includes(searchQuery) ||
        (order.phone && order.phone.includes(searchQuery));

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Nor Provided !';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSidebarOpen && !event.target.closest('.sidebar-container')) {
        setMobileSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  // Product form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor]
      });
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(color => color !== colorToRemove)
    });
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize]
      });
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(size => size !== sizeToRemove)
    });
  };
  const modalVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate()
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.75 }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    // Append all fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('qte', formData.qte);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('image', formData.image);

    // Convert arrays to JSON strings before appending
    formDataToSend.append('sizes', JSON.stringify(formData.sizes));
    formDataToSend.append('colors', JSON.stringify(formData.colors));

    try {
      const res = await axios.post(`${API_URL}/products`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      console.log('Product added:', res.data);
      setSuccess(true);
      fetchProducts(); // Refresh products list

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        qte: '',
        image: null,
        category: '',
        colors: [],
        sizes: []
      });
      setPreviewImage(null);

      setTimeout(() => setSuccess(false), 3000);
      setShowAddProduct(false); // Close the add product form
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      toast.error(`Error adding product: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  ////////////////////Profile and logout features 
  /* const [admin, setAdmin] = useState(null);
  const navigate = useNavigate()
    useEffect(() => {
      const token = sessionStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }
  
      axios.get("http://localhost:8000/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdmin(res.data.admin); // حسب شكل response ديالك
      })
      .catch((err) => {
        console.error("Error fetching admin profile:", err);
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
      });
    }, []);
  
    const handleLogout = () => {
      sessionStorage.removeItem("adminToken");
      navigate("/admin/login");
    }; */
  ///////////////////////Profile and logout features end
  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdmin(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admin profile:", err);
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
      });
  }, []); // ✅ had [] katdman ttsal gha marra wa7da
  return (
    <div className={`flex h-screen bg-gray-100 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
      <Toaster
        position={i18n.language === 'ar' ? 'top-left' : 'top-right'}
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
        className={`sidebar-container fixed lg:static z-30 w-64 bg-black text-white transition-all duration-300 ease-in-out 
             ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} 
             ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-64'} lg:translate-x-0
            h-screen lg:h-auto lg:min-h-screen flex flex-col`}
      >

        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          <h1 className="text-xl font-bold">FORTIS SPACE</h1>
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
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileSidebarOpen(false)
                  setSidebarOpen(false);;
                }}
              >
                <FiPieChart className="mr-3" />
                {t('dashboard')}
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'orders' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => {
                  setActiveTab('orders');
                  setMobileSidebarOpen(false);
                }}
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
              <button
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'products' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => {
                  setActiveTab('products');
                  setMobileSidebarOpen(false);
                }}
              >
                <FiShoppingCart className="mr-3" />
                {t('products')}
              </button>
            </li>
            {/* // In your sidebar navigation list */}
           
            <li>
              <button
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => {
                  setActiveTab('settings');
                  setMobileSidebarOpen(false);
                }}
              >
                <FiSettings className="mr-3" />
                {t('storeSettings')}
              </button>
            </li>
             <li>
              <button
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'slides' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                onClick={() => {
                  setActiveTab('slides');
                  setMobileSidebarOpen(false);
                }}
              >
                <FiImage className="mr-3" />
                Carousel Slides
              </button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${i18n.language === 'en' ? 'bg-white text-indigo-800' : 'bg-indigo-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-2 py-1 text-xs rounded ${i18n.language === 'fr' ? 'bg-white text-indigo-800' : 'bg-indigo-700'}`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-2 py-1 text-xs rounded ${i18n.language === 'ar' ? 'bg-white text-indigo-800' : 'bg-indigo-700'}`}
              >
                AR
              </button>
            </div>
            <button className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700" onClick={handleLogout}>
              <FiLogOut className="mr-3" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm ">
          <div className="flex items-center justify-between py-2 px-4">
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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                {activeTab === 'orders' && <img src={fortisLogo} alt="Logo" style={{ width: "20vh" }} />}
                {activeTab === 'dashboard' && <img src={fortisLogo} alt="Logo" style={{ width: "20vh" }} />}
                {activeTab === 'products' && <img src={fortisLogo} alt="Logo" style={{ width: "20vh" }} />}
               
                {activeTab === 'settings' && <img src={fortisLogo} alt="Logo" style={{ width: "20vh" }} />}
                 
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

              <NotificationCenter API_URL={API_URL} />

              <div className="relative">
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <motion.div
                        className="absolute right-4 mt-2 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseEnter={() => setShowProfileDropdown(true)}
                        onMouseLeave={() => setShowProfileDropdown(false)}
                      >
                        <ProfileDropdown admin={admin} onLogout={handleLogout} />
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Mobile search bar */}
          <div className="px-4 pb-4 sm:hidden ">
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

          {activeTab === 'dashboard' && (

            <div>

              {products.filter(product => product.qte <= 0).length > 0 && (
                <div className="mt-8">
                  <OutOfStockProducts
                    products={products}
                    onEditProduct={(product) => {
                      setEditingProduct(product);
                      setIsEditing(true);
                    }}
                    onRestock={(product) => {
                      console.log("Restock product:", product);
                    }}
                  />
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t('storeOverview')}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Total Sales Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-3 sm:mr-4">
                      <FiDollarSign size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">{t('totalSales')}</p>
                      <p className="text-lg sm:text-2xl font-bold">${stats.totalSales.toLocaleString(i18n.language)}</p>
                    </div>
                  </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-3 sm:mr-4">
                      <FiShoppingCart size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">{t('pendingOrders')}</p>
                      <p className="text-lg sm:text-2xl font-bold">{stats.pendingOrders.toLocaleString(i18n.language)}</p>
                    </div>
                  </div>
                </div>

                {/* Completed Orders Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 rounded-lg bg-green-100 text-green-600 mr-3 sm:mr-4">
                      <FiShoppingCart size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">{t('completedOrders')}</p>
                      <p className="text-lg sm:text-2xl font-bold">{stats.completedOrders.toLocaleString(i18n.language)}</p>
                    </div>
                  </div>
                </div>


              </div>


              {/* Recent orders preview */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">{t('recentOrders')}</h3>
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base"
                    onClick={() => setActiveTab('orders')}
                  >
                    {t('viewAll')}
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
                          <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('orderId')}
                          </th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('customer')}
                          </th>
                          <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('date')}
                          </th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('status')}
                          </th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('amount')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id}
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="truncate max-w-[100px] sm:max-w-none">
                                {order.customer_name || t('guest')}
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                                {t(order.status)}
                              </span>
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                              ${formatPrice(order.total_price)}
                            </td>
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

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                  <h2 className="text-xl sm:text-2xl font-semibold">{t('orderManagement')}</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                    <div className="flex gap-2">
                      <select
                        className="w-full sm:w-auto px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <select
                        className="w-full sm:w-auto px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </div>
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
                              {order.phone || 'Nor Provided !'}
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
                                {/* Details Button */}
                                <Tooltip text={t('viewDetails')}>
                                  <button
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={() => viewOrderDetails(order)}
                                  >
                                    <FiMoreHorizontal size={16} />
                                  </button>
                                </Tooltip>

                                {/* Print Button (if applicable) */}
                                {order.status === 'shipped' && (
                                  <Tooltip text={t('viewInvoice')}>
                                    <button
                                      className="text-indigo-600 hover:text-indigo-900"
                                      onClick={() => viewOrderInvoice(order)}
                                    >
                                      <FiPrinter size={16} />
                                    </button>
                                  </Tooltip>
                                )}
                                <Tooltip text={t('deleteOrder')}>
                                  <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => deleteOrder(order.id)}
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </Tooltip>
                                {/* Status Dropdown */}
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

                                {/* Delete Button */}

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
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Store Settings</h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="border-b border-gray-200 pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

                <div className="border-b border-gray-200 pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Order Settings</h3>
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

          {activeTab === "products" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">Product Management</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddProduct(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiPlusCircle className="mr-2" />
                    Add Product
                  </motion.button>
                </div>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white p-6 rounded-xl shadow-sm mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Add New Product</h3>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"
                    >
                      <p className="font-medium">Product added successfully!</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div>
                        {/* Title */}
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm mb-2" htmlFor="title">
                            Product Title
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiType className="text-gray-400" />
                            </div>
                            <input
                              id="title"
                              name="title"
                              type="text"
                              required
                              value={formData.title}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="e.g. Premium Cotton T-Shirt"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm mb-2" htmlFor="description">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows="4"
                            placeholder="Detailed product description..."
                          />
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm mb-2" htmlFor="category">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select a category</option>
                            <option value="men">Men's Clothing</option>
                            <option value="women">Women's Clothing</option>
                            <option value="accessories">Accessories</option>
                            <option value="footwear">Footwear</option>
                          </select>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        {/* Price */}
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm mb-2" htmlFor="price">
                            Price (DH)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiDollarSign className="text-gray-400" />
                            </div>
                            <input
                              id="price"
                              name="price"
                              type="number"
                              required
                              value={formData.price}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm mb-2" htmlFor="qte">
                            Quantity
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiHash className="text-gray-400" />
                            </div>
                            <input
                              id="qte"
                              name="qte"
                              type="number"
                              required
                              value={formData.qte}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm mb-2">
                            Product Image
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                              {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FiUpload className="w-8 h-8 text-gray-400 mb-3" />
                                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                                </div>
                              )}
                              <input
                                id="image"
                                name="image"
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                                required
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm mb-2">
                        Available Colors
                      </label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {formData.colors.map((color, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm"
                          >
                            <div
                              className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <FiX size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="Add color (e.g. #FF0000 or 'Red')"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <motion.button
                          type="button"
                          onClick={addColor}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
                        >
                          <FiPlus />
                        </motion.button>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-8">
                      <label className="block text-gray-700 text-sm mb-2">
                        Available Sizes
                      </label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {formData.sizes.map((size, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <FiX size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          placeholder="Add size (e.g. S, M, L, XL)"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <motion.button
                          type="button"
                          onClick={addSize}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
                        >
                          <FiPlus />
                        </motion.button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg flex items-center transition-colors duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Add Product'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {products.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.map(product => (
                            <React.Fragment key={product.id}>
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {product.image && (
                                      <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full" src={`http://localhost:8000/${product.image}`} alt={product.title} />
                                      </div>
                                    )}
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                      <div className="text-sm text-gray-500">{product.category}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${formatPrice(product.price)}
                                </td>
                                {/* In the products table row, modify the stock cell to show an out of stock indicator */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {product.qte <= 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Out of Stock
                                    </span>
                                  ) : (
                                    product.qte
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      className="text-indigo-600 hover:text-indigo-900"
                                      onClick={() => toggleProductDetails(product.id)}
                                    >
                                      {expandedProductId === product.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingProduct(product);
                                        setIsEditing(true);
                                      }}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      <FiEdit size={16} />
                                    </button>

                                    <button className="text-red-600 hover:text-red-900">
                                      <FiTrash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {expandedProductId === product.id && (
                                <motion.tr
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  variants={{
                                    hidden: {
                                      opacity: 0,
                                      height: 0,
                                      transition: {
                                        duration: 0.3,
                                        ease: "easeInOut",
                                        when: "afterChildren"
                                      }
                                    },
                                    visible: {
                                      opacity: 1,
                                      height: "auto",
                                      transition: {
                                        duration: 0.3,
                                        ease: "easeInOut",
                                        staggerChildren: 0.05
                                      }
                                    }
                                  }}
                                  className="bg-gray-50"
                                >
                                  <td colSpan="4" className="px-6 py-4 overflow-hidden bg-indigo-50">
                                    <motion.div
                                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {/* Left Column - Product Details */}
                                      <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <h3 className="text-lg font-medium mb-2">Product Details</h3>
                                        <div className="space-y-2">
                                          <p><span className="font-medium">Description:</span> {product.description}</p>
                                          <p><span className="font-medium">Colors:</span> {product.colors?.join(', ') || 'Nor Provided !'}</p>
                                          <p><span className="font-medium">Sizes:</span> {product.sizes?.join(', ') || 'Nor Provided !'}</p>
                                          <p><span className="font-medium">Category:</span> {product.category || 'Nor Provided !'}</p>
                                        </div>
                                      </motion.div>

                                      {/* Right Column - Product Images */}
                                      <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <h3 className="text-lg font-medium">Product Images</h3>
                                          <motion.label
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700"
                                          >
                                            <FiPlus className="mr-1" />
                                            Add Images
                                            <input
                                              type="file"
                                              className="hidden"
                                              multiple
                                              accept="image/*"
                                              onChange={(e) => handleImageUpload(e, product.id)}
                                            />
                                          </motion.label>
                                        </div>

                                        {imageUploading && (
                                          <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-2 text-sm text-gray-500"
                                          >
                                            Uploading images...
                                          </motion.div>
                                        )}

                                        <motion.div
                                          className="grid grid-cols-3 gap-2"
                                          variants={{
                                            hidden: { opacity: 0 },
                                            visible: {
                                              opacity: 1,
                                              transition: {
                                                staggerChildren: 0.1
                                              }
                                            }
                                          }}
                                        >
                                          {product.image && (
                                            <motion.div
                                              className="relative"
                                              variants={{
                                                hidden: { opacity: 0, y: 10 },
                                                visible: { opacity: 1, y: 0 }
                                              }}
                                            >
                                              <img
                                                src={`http://localhost:8000/${product.image}`}
                                                alt="Main product"
                                                className="w-full h-24 object-cover rounded"
                                              />
                                              <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">Main</span>
                                            </motion.div>
                                          )}

                                          {selectedProductImages.map((image, index) => (
                                            <motion.div
                                              key={index}
                                              className="relative"
                                              variants={{
                                                hidden: { opacity: 0, y: 10 },
                                                visible: { opacity: 1, y: 0 }
                                              }}
                                            >
                                              <img
                                                src={`http://localhost:8000/${image.image_path}`}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-24 object-cover rounded"
                                              />
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => deleteImage(product.id, image.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                              >
                                                ×
                                              </motion.button>
                                            </motion.div>
                                          ))}
                                        </motion.div>

                                        {selectedProductImages.length === 0 && !product.image && (
                                          <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-sm text-gray-500"
                                          >
                                            No additional images available
                                          </motion.p>
                                        )}
                                      </motion.div>
                                    </motion.div>
                                  </td>
                                </motion.tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No products found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'slides' && (<SliderManagement API_URL={API_URL} />)}
        </main>
      </div>

      {/* Invoice Modal */}

      {viewOrderModal && (
        <AnimatePresence>
          {/* Backdrop with fade animation */}
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setViewOrderModal(false)}
          ></motion.div>

          {/* Modal container - centered with smooth slide-up animation */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modern header with gradient */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Order Details</h2>
                    <p className="text-indigo-100">Order #{selectedOrderDetails?.id}</p>

                  </div>
                  <button
                    onClick={() => setViewOrderModal(false)}
                    className="text-white hover:text-indigo-200 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              {/* Content with smooth scroll */}
              <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
                {/* Customer Card with subtle shadow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUsers className="mr-2 text-indigo-500" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">{selectedOrderDetails?.customer_name || 'Guest'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{selectedOrderDetails?.email || 'Nor Provided !'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{selectedOrderDetails?.phone || 'Nor Provided !'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-800">{selectedOrderDetails?.address || 'Nor Provided !'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Order Items - Modern table with hover effects */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiShoppingCart className="mr-2 text-indigo-500" />
                    Order Items
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrderDetails?.order_items?.map((item, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {item.size && <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-2">Size: {item.size}</span>}
                                    {item.color && <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs">Color: {item.color}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${formatPrice(item.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${formatPrice(item.price * item.quantity)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Order Summary - Card with accent border */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border-l-4 border-indigo-500 bg-white rounded-lg shadow-sm p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiDollarSign className="mr-2 text-indigo-500" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${formatPrice(selectedOrderDetails?.total_price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-indigo-600">${formatPrice(selectedOrderDetails?.total_price)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Status and Actions - Sticky footer-like section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Order Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${selectedOrderDetails?.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedOrderDetails?.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${selectedOrderDetails?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedOrderDetails?.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                          {selectedOrderDetails?.status}
                        </span>
                      </div>
                      {selectedOrderDetails?.payment && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Payment</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedOrderDetails?.payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {selectedOrderDetails?.payment.payment_method}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <select
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        value={selectedOrderDetails?.status}
                        onChange={(e) => {
                          updateOrderStatus(selectedOrderDetails?.id, e.target.value);
                          setSelectedOrderDetails({
                            ...selectedOrderDetails,
                            status: e.target.value
                          });
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => {
                          setViewOrderModal(false);
                          viewOrderInvoice(selectedOrderDetails);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                      >
                        <FiPrinter size={16} />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
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

                    <div className="flex justify-center items-center text-center">
                      <img
                        src="/FORTIS-01.svg"
                        alt="Fortis Logo"
                        style={{
                          position: 'relative', left: '50vh',

                        }}
                        className=" invoice-logo border-4 h-22 md:h-18 w-auto max-w-[220px] md:max-w-[280px] object-contain transform hover:scale-105 transition-transform duration-200"
                      />
                    </div>
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
                      <p>{selectedOrder.phone || 'Nor Provided !'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{t('email')}:</p>
                      <p className={`${selectedOrder.email}? text-black : text-red-400`}>{selectedOrder.email || 'Nor Provided !'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{t('address')}:</p>
                      <p>{selectedOrder.address || 'Nor Provided !'}</p>
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
                                  <div className="text-sm font-medium text-gray-900">{item.product.title || selectedOrder.order_items[0].product.title}</div>
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
      {isEditing && (
        <div className="fixed inset-0  z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <ProductEditForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setIsEditing(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}
    </div>
  );

};

export default AdminDashboard;