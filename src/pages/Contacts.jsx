import { FiMail, FiPhone, FiUser, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('contact.title')}</h1>
          <p className="text-gray-500 max-w-md mx-auto">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Info - Simpler Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-50 p-6 rounded-xl md:w-1/3"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5">{t('contact.infoTitle')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-indigo-500">
                  <FiMail className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">{t('contact.emailTitle')}</h3>
                  <p className="text-gray-500 text-sm">contact@fortis-store.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-indigo-500">
                  <FiPhone className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">{t('contact.phoneTitle')}</h3>
                  <p className="text-gray-500 text-sm">+212 6 00 00 00 00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-indigo-500">
                  <FiMessageSquare className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">{t('contact.hoursTitle')}</h3>
                  <p className="text-gray-500 text-sm">{t('contact.hoursWeekdays')}</p>
                  <p className="text-gray-500 text-sm">{t('contact.hoursWeekend')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Clean Design */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:w-2/3"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('contact.formTitle')}</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.nameLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('contact.namePlaceholder')}
                    className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.messageLabel')}
                </label>
                <textarea
                  rows={4}
                  placeholder={t('contact.messagePlaceholder')}
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium mt-2"
              >
                {t('contact.submitButton')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}