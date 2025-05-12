import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  
  en: {
    translation: {
      "Home": "Home",
      "Login": "Login",
      "Contact": "Contact",
      "Add product": "Add product",
      "Products": "Products",
      "Search products...": "Search products...",
      "Add New Product":"Add New Product",
      "Fill in the details for your new product":"Fill in the details for your new product",
      "Price (DH)":"Price (DH)",
      "Price (DH)":"Price (DH)",
      "Product Title":"Product Tilte",
      "Description":"Description",
      "Discover pieces that tell your story":"Discover pieces that tell your story",
      "Discover pieces that tell your story":"Discover pieces that tell your story",
      "Our Collection":"Our Collection",
       collection: {
      kobiyatTitle: "Traditional Kobiyat Collection",
      errorLoading: "Error loading products",
      emptyTitle: "No Kobiyat Items Found",
      emptyMessage: "We couldn't find any items in this collection",
      noDescription: "No description available",
      currency: "DH",
      addToCart: "Add to Cart"
    },
       contact: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you! Reach out for collaborations or just a friendly hello 👋",
      emailTitle: "Email Us",
      emailAction: "Write us an email",
      phoneTitle: "Call Us",
      phoneAction: "Call now",
      hoursTitle: "Working Hours",
      hoursWeekdays: "Monday - Friday: 9AM - 6PM",
      hoursWeekend: "Saturday: 10AM - 4PM",
      formTitle: "Send Us a Message",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your full name",
      emailLabel: "Your Email",
      emailPlaceholder: "Enter your email address",
      messageLabel: "Your Message",
      messagePlaceholder: "How can we help you?",
      submitButton: "Send Message"
    },
     home: {
      slides: [
        {
          title: "Summer Collection 2023",
          subtitle: "Discover the latest trends",
          cta: "Shop Now"
        },
        {
          title: "New Arrivals",
          subtitle: "Fresh styles for every occasion",
          cta: "Explore"
        },
        {
          title: "Exclusive Offers",
          subtitle: "Limited time discounts",
          cta: "Get Yours"
        }
      ],
      goToSlide: "Go to slide",
      categoriesTitle: "Shop by Category",
      shopNow: "Shop Now",
      newsletter: {
        title: "Stay Updated",
        subtitle: "Subscribe to our newsletter for exclusive offers, new arrivals, and style tips",
        placeholder: "Your email address",
        button: "Subscribe"
      }
    },
    footer: {
      brandName: "FORTIS",
      tagline: "Your destination for modern, stylish clothing and accessories",
      shop: "Shop",
      shopLinks: ["All Products", "New Arrivals", "Best Sellers", "Sale"],
      company: "Company",
      companyLinks: ["About Us", "Blog", "Careers", "Contact"],
      connect: "Connect",
      socialLinks: ["Facebook", "Instagram", "Twitter", "Pinterest"],
      copyright: "All rights reserved"
    },
     cart: {
      title: "Your Shopping Cart",
      reviewMessage: "Review your items before checkout",
      emptyState: {
        title: "Your cart is empty",
        subtitle: "Start shopping to add items to your cart",
        readyMessage: "Ready to fill me up?",
        continueShopping: "Continue Shopping"
      },
      removeItem: "Remove {{title}} from cart",
      noDescription: "No description available",
      decreaseQuantity: "Decrease quantity",
      increaseQuantity: "Increase quantity",
      currency: "DH",
      subtotal: "Subtotal",
      shippingNotice: "Shipping and taxes calculated at checkout",
      checkoutButton: "Proceed to Checkout",
      alerts: {
        emptyCart: "Your cart is empty!",
        orderSuccess: "Order sent successfully! ✅",
        orderError: "Failed to send order ❌"
      }
    },
    dashboard: 'Dashboard',
      orders: 'Orders',
      products: 'Products',
      storeSettings: 'Store Settings',
      logout: 'Logout',
      orderManagement: 'Order Management',
      searchOrders: 'Search orders...',
      noOrdersFound: 'No orders found matching your search criteria.',
      invoice: 'INVOICE',
      customerInformation: 'Customer Information',
      orderItems: 'Order Items',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      paymentInformation: 'Payment Information',
      method: 'Method',
      status: 'Status',
      transactionId: 'Transaction ID',
      printInvoice: 'Print Invoice',
      close: 'Close',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      date: 'Date',
    },
    
  },
  fr: {
    translation: {
      "Home": "Accueil",
      "Login": "Connexion",
      "Contact": "Contact",
      "Add product": "Ajouter un produit",
      "Products": "Produits",
      "Add New Product":"Ajouter nouveau Produit",
      "Search products...": "Rechercher des produits...",
      "Fill in the details for your new product":"Remplissez les détails de votre nouveau produit",
      "Price (DH)":"Prix (DHs)",
      "Product Title":"titre de produit",
      "Description":"Description",
      "Discover pieces that tell your story":"Découvrez des pièces qui racontent votre histoire",
      "Our Collection":"Nos Collections",
      "New Arrivals":"Nouveautées",
      collection: {
      kobiyatTitle: "Collection Traditionnelle de Kobiyat",
      errorLoading: "Erreur lors du chargement des produits",
      emptyTitle: "Aucun article Kobiyat trouvé",
      emptyMessage: "Nous n'avons trouvé aucun article dans cette collection",
      noDescription: "Aucune description disponible",
      currency: "DH",
      addToCart: "Ajouter au panier"
    },
      contact: {
      title: "Contactez-nous",
      subtitle: "Nous serions ravis d'avoir de vos nouvelles ! Contactez-nous pour des collaborations ou juste pour dire bonjour 👋",
      emailTitle: "Envoyez-nous un email",
      emailAction: "Écrivez-nous",
      phoneTitle: "Appelez-nous",
      phoneAction: "Appeler maintenant",
      hoursTitle: "Heures d'ouverture",
      hoursWeekdays: "Lundi - Vendredi: 9h - 18h",
      hoursWeekend: "Samedi: 10h - 16h",
      formTitle: "Envoyez-nous un message",
      nameLabel: "Votre nom",
      namePlaceholder: "Entrez votre nom complet",
      emailLabel: "Votre email",
      emailPlaceholder: "Entrez votre adresse email",
      messageLabel: "Votre message",
      messagePlaceholder: "Comment pouvons-nous vous aider?",
      submitButton: "Envoyer le message"
    },
    home: {
      slides: [
        {
          title: "Collection d'été 2023",
          subtitle: "Découvrez les dernières tendances",
          cta: "Acheter maintenant"
        },
        {
          title: "Nouveautés",
          subtitle: "Des styles frais pour chaque occasion",
          cta: "Explorer"
        },
        {
          title: "Offres exclusives",
          subtitle: "Remises limitées dans le temps",
          cta: "Obtenez le vôtre"
        }
      ],
      goToSlide: "Aller à la diapositive",
      categoriesTitle: "Acheter par catégorie",
      shopNow: "Acheter maintenant",
      newsletter: {
        title: "Restez informé",
        subtitle: "Abonnez-vous à notre newsletter pour des offres exclusives, des nouveautés et des conseils de style",
        placeholder: "Votre adresse email",
        button: "S'abonner"
      }
    },
    footer: {
      brandName: "FORTIS",
      tagline: "Votre destination pour des vêtements et accessoires modernes et élégants",
      shop: "Boutique",
      shopLinks: ["Tous les produits", "Nouveautés", "Meilleures ventes", "Soldes"],
      company: "Entreprise",
      companyLinks: ["À propos", "Blog", "Carrières", "Contact"],
      connect: "Connecter",
      socialLinks: ["Facebook", "Instagram", "Twitter", "Pinterest"],
      copyright: "Tous droits réservés"
    },
    cart: {
      title: "Votre Panier",
      reviewMessage: "Vérifiez vos articles avant de passer à la caisse",
      emptyState: {
        title: "Votre panier est vide",
        subtitle: "Commencez vos achats pour ajouter des articles",
        readyMessage: "Prêt à me remplir?",
        continueShopping: "Continuer vos achats"
      },
      removeItem: "Supprimer {{title}} du panier",
      noDescription: "Aucune description disponible",
      decreaseQuantity: "Diminuer la quantité",
      increaseQuantity: "Augmenter la quantité",
      currency: "DH",
      subtotal: "Sous-total",
      shippingNotice: "Frais de livraison et taxes calculés à la caisse",
      checkoutButton: "Passer à la caisse",
      alerts: {
        emptyCart: "Votre panier est vide!",
        orderSuccess: "Commande envoyée avec succès! ✅",
        orderError: "Échec de l'envoi de la commande ❌"
      }
    },
    dashboard: 'Tableau de bord',
      orders: 'Commandes',
      products: 'Produits',
      storeSettings: 'Paramètres du magasin',
      logout: 'Déconnexion',
      orderManagement: 'Gestion des commandes',
      searchOrders: 'Rechercher des commandes...',
      noOrdersFound: 'Aucune commande trouvée correspondant à vos critères de recherche.',
      invoice: 'FACTURE',
      customerInformation: 'Informations client',
      orderItems: 'Articles commandés',
      product: 'Produit',
      price: 'Prix',
      quantity: 'Quantité',
      total: 'Total',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      tax: 'Taxe',
      paymentInformation: 'Informations de paiement',
      method: 'Méthode',
      status: 'Statut',
      transactionId: 'ID de transaction',
      printInvoice: 'Imprimer la facture',
      close: 'Fermer',
      name: 'Nom',
      phone: 'Téléphone',
      email: 'Email',
      address: 'Adresse',
      date: 'Date',
    }
  },
  ar: {
    translation: {
      "Home": "الرئيسية",
      "Login": "تسجيل الدخول",
      "Contact": "اتصل بنا",
      "Add product": "إضافة منتج",
      "Products": "المنتجات",
      "Add New Product":"إضافة منتج جديد",
      "Search products...": "ابحث عن المنتجات...",
      "Fill in the details for your new product":"املأ التفاصيل الخاصة بمنتجك الجديد",
      "Price (DH)":"الثمن (درهم)",
      "Product Title":" اسم المنتج",
      "Description":"التفاصيل",
      "Discover pieces that tell your story":"اكتشف قطعًا تروي قصتك",
      "Our Collection":"مجموعتنا",
      "New Arrivals":" الجديد",
      collection: {
      kobiyatTitle: "مجموعة القوبيات التقليدية",
      errorLoading: "خطأ في تحميل المنتجات",
      emptyTitle: "لا توجد عناصر قوبيات",
      emptyMessage: "لم نتمكن من العثور على أي عناصر في هذه المجموعة",
      noDescription: "لا يوجد وصف متاح",
      currency: "درهم",
      addToCart: "أضف إلى السلة"
    },
       contact: {
      title: "اتصل بنا",
      subtitle: "نحن نحب أن نسمع منك! تواصل معنا للتعاون أو فقط لتحية ودية 👋",
      emailTitle: "راسلنا عبر البريد",
      emailAction: "اكتب لنا بريدًا إلكترونيًا",
      phoneTitle: "اتصل بنا",
      phoneAction: "اتصل الآن",
      hoursTitle: "ساعات العمل",
      hoursWeekdays: "الإثنين - الجمعة: 9 صباحًا - 6 مساءً",
      hoursWeekend: "السبت: 10 صباحًا - 4 مساءً",
      formTitle: "أرسل لنا رسالة",
      nameLabel: "اسمك",
      namePlaceholder: "أدخل اسمك الكامل",
      emailLabel: "بريدك الإلكتروني",
      emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
      messageLabel: "رسالتك",
      messagePlaceholder: "كيف يمكننا مساعدتك؟",
      submitButton: "إرسال الرسالة"
    },
     home: {
      slides: [
        {
          title: "مجموعة الصيف 2023",
          subtitle: "اكتشف أحدث الصيحات",
          cta: "تسوق الآن"
        },
        {
          title: "وصل حديثاً",
          subtitle: "تصاميم جديدة لكل المناسبات",
          cta: "استكشف"
        },
        {
          title: "عروض حصرية",
          subtitle: "خصومات لفترة محدودة",
          cta: "احصل على منتجك"
        }
      ],
      goToSlide: "انتقل إلى الشريحة",
      categoriesTitle: "تسوق حسب الفئة",
      shopNow: "تسوق الآن",
      newsletter: {
        title: "ابق على اطلاع",
        subtitle: "اشترك في نشرتنا الإخبارية للحصول على عروض حصرية ووصول جديد ونصائح حول الأناقة",
        placeholder: "عنوان بريدك الإلكتروني",
        button: "اشتراك"
      }
    },
    footer: {
      brandName: "FORTIS",
      tagline: "وجهتك للملابس والإكسسوارات العصرية والأنيقة",
      shop: "تسوق",
      shopLinks: ["جميع المنتجات", "وصل حديثاً", "الأكثر مبيعاً", "تخفيضات"],
      company: "الشركة",
      companyLinks: ["معلومات عنا", "مدونة", "وظائف", "اتصل بنا"],
      connect: "تواصل معنا",
      socialLinks: ["فيسبوك", "إنستغرام", "تويتر", "بينتيريست"],
      copyright: "جميع الحقوق محفوظة"
    },
    cart: {
      title: "سلة التسوق الخاصة بك",
      reviewMessage: "راجع العناصر الخاصة بك قبل الدفع",
      emptyState: {
        title: "سلة التسوق فارغة",
        subtitle: "ابدأ التسوق لإضافة عناصر إلى سلة التسوق الخاصة بك",
        readyMessage: "مستعد لملئها؟",
        continueShopping: "مواصلة التسوق"
      },
      removeItem: "إزالة {{title}} من السلة",
      noDescription: "لا يوجد وصف متاح",
      decreaseQuantity: "تقليل الكمية",
      increaseQuantity: "زيادة الكمية",
      currency: "درهم",
      subtotal: "المجموع الفرعي",
      shippingNotice: "يتم حساب الشحن والضرائب عند الدفع",
      checkoutButton: "المتابعة إلى الدفع",
      alerts: {
        emptyCart: "سلة التسوق فارغة!",
        orderSuccess: "تم إرسال الطلب بنجاح! ✅",
        orderError: "فشل إرسال الطلب ❌"
      }
    },
     dashboard: 'لوحة التحكم',
      orders: 'الطلبات',
      products: 'المنتجات',
      storeSettings: 'إعدادات المتجر',
      logout: 'تسجيل الخروج',
      orderManagement: 'إدارة الطلبات',
      searchOrders: 'ابحث عن الطلبات...',
      noOrdersFound: 'لم يتم العثور على طلبات تطابق معايير البحث الخاصة بك.',
      invoice: 'فاتورة',
      customerInformation: 'معلومات العميل',
      orderItems: 'عناصر الطلب',
      product: 'المنتج',
      price: 'السعر',
      quantity: 'الكمية',
      total: 'المجموع',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      tax: 'الضريبة',
      paymentInformation: 'معلومات الدفع',
      method: 'طريقة',
      status: 'الحالة',
      transactionId: 'معرف المعاملة',
      printInvoice: 'طباعة الفاتورة',
      close: 'إغلاق',
      name: 'الاسم',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      date: 'التاريخ',
      
    }
  },
  
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;