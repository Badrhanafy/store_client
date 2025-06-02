import { FiMail, FiPhone, FiUser, FiMessageSquare, FiMapPin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {t('contact.title')}
            </span>
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t('contact.subtitle')}
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Info - Elegant Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg lg:w-2/5"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 relative pb-2">
              {t('contact.infoTitle')}
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
            </h2>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-start gap-4 p-4 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t('contact.emailTitle')}</h3>
                  <p className="text-gray-600">contact@fortis-store.com</p>
                  <a 
                    href="mailto:contact@fortis-store.com" 
                    className="text-indigo-600 text-sm font-medium mt-1 inline-block hover:text-indigo-800 transition-colors"
                  >
                    {t('contact.sendEmail')}
                  </a>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4 p-4 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiPhone className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t('contact.phoneTitle')}</h3>
                  <p className="text-gray-600">+212 6 00 00 00 00</p>
                  <a 
                    href="tel:+212600000000" 
                    className="text-indigo-600 text-sm font-medium mt-1 inline-block hover:text-indigo-800 transition-colors"
                  >
                    {t('contact.callNow')}
                  </a>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4 p-4 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t('contact.addressTitle')}</h3>
                  <p className="text-gray-600">123 Business Avenue</p>
                  <p className="text-gray-600">Casablanca, Morocco</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4 p-4 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiMessageSquare className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t('contact.hoursTitle')}</h3>
                  <p className="text-gray-600">{t('contact.hoursWeekdays')}</p>
                  <p className="text-gray-600">{t('contact.hoursWeekend')}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form - Modern Design */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-lg lg:w-3/5"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 relative pb-2">
              {t('contact.formTitle')}
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
            </h2>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.nameLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t('contact.namePlaceholder')}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.emailLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('contact.subjectLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('contact.subjectPlaceholder')}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('contact.messageLabel')}
                </label>
                <textarea
                  rows={5}
                  placeholder={t('contact.messagePlaceholder')}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.6)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <FiSend className="text-lg" />
                {t('contact.submitButton')}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-gray-700 mb-4">{t('contact.followUs')}</h3>
          <div className="flex justify-center gap-4">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
              <motion.a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-indigo-600 transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <span className="sr-only">{social}</span>
                {/* In a real app, you would use the appropriate social media icon */}
                {social.charAt(0)}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}