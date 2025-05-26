import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiMenu, 
  FiPieChart, 
  FiSettings, 
  FiLogOut, 
  FiUsers,
  FiX,
  FiSearch,
  FiSave
} from 'react-icons/fi';
import { motion } from 'framer-motion';


const SettingsComponent = ({ 
  sidebarOpen = true, // Default to open for desktop
  setSidebarOpen = () => {},
  changeLanguage = () => {},
  i18n 
}) => {
  const { t } = useTranslation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'Fortis Space',
    currency: 'USD',
    defaultOrderStatus: 'pending',
    maintenanceMode: false
  });

  // Get current language safely
  const currentLanguage = i18n?.language || 'en';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Settings saved:', formData);
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Enhanced Sidebar - Persistent for desktop */}
      <div className={`hidden lg:flex flex-col z-30 w-64 bg-black text-white h-full fixed`}>
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          <h1 className="text-xl font-bold">FORTIS SPACE</h1>
          <button
            className="text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
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
              <Link
                className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                to={"/admin/orders"}
              >
                <FiShoppingCart className="mr-3" />
                {t('orders')}
              </Link>
            </li>
            <li>
              <button
                className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
              >
                <FiUsers className="mr-3" />
                {t('products')}
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center p-3 rounded-lg bg-indigo-700"
              >
                <FiSettings className="mr-3" />
                {t('storeSettings')}
              </button>
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

      {/* Mobile Sidebar - Only appears on mobile */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ 
          x: mobileSidebarOpen ? 0 : -256,
          height: '100vh'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`lg:hidden fixed z-30 w-64 bg-black text-white flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          <h1 className="text-xl font-bold">FORTIS SPACE</h1>
          <button
            className="text-white"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <FiPieChart className="mr-3" />
                {t('dashboard')}
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <FiShoppingCart className="mr-3" />
                {t('orders')}
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center p-3 rounded-lg hover:bg-indigo-700"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <FiUsers className="mr-3" />
                {t('products')}
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center p-3 rounded-lg bg-indigo-700"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <FiSettings className="mr-3" />
                {t('storeSettings')}
              </button>
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
      </motion.div>

      {/* Main content - Adjusted for persistent sidebar */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                className="mr-4 text-gray-600 lg:hidden"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                <FiMenu size={24} />
                {/* just for commit */}
              </button>
              <button
                className="hidden lg:block mr-4 text-gray-600"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                {t('storeSettings')}
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchSettings')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                placeholder={t('searchSettings')}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </header>

        {/* Settings content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">{t('generalSettings')}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('storeName')}
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('currency')}
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="defaultOrderStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('defaultOrderStatus')}
                    </label>
                    <select
                      id="defaultOrderStatus"
                      name="defaultOrderStatus"
                      value={formData.defaultOrderStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">{t('pending')}</option>
                      <option value="processing">{t('processing')}</option>
                      <option value="completed">{t('completed')}</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      name="maintenanceMode"
                      checked={formData.maintenanceMode}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                      {t('maintenanceMode')}
                    </label>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">{t('appearanceSettings')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('primaryColor')}
                      </label>
                      <div className="flex space-x-2">
                        {['indigo', 'blue', 'green', 'red', 'purple', 'pink'].map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full bg-${color}-600`}
                            onClick={() => console.log('Color selected:', color)}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('theme')}
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-gray-800"
                          onClick={() => console.log('Dark theme selected')}
                        />
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-white border border-gray-300"
                          onClick={() => console.log('Light theme selected')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiSave className="mr-2" />
                    {t('saveChanges')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SettingsComponent;