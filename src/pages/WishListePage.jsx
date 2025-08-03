// src/pages/Wishlist.js
import { useContext, useState } from 'react';
import { WishlistContext } from '../context/Wishlistecontext';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiStar, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { Helmet } from 'react-helmet';

const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const baseurl = 'http://localhost:8000';
  const { removeFromWishlist } = useContext(WishlistContext);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    onAddToCart(product);
    addToCart(product);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={`${product.image}`}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              removeFromWishlist(product.id);
            }}
            className="p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 transition-colors"
            aria-label="Remove from wishlist"
          >
            <FiHeart className="text-lg fill-red-500 text-red-500" />
          </button>
          <button
            onClick={handleAddToCartClick}
            className="p-2 bg-white/90 rounded-full shadow-md hover:bg-indigo-50 transition-colors"
            aria-label="Add to cart"
          >
            <FiShoppingBag className="text-indigo-600" />
          </button>
        </div>

        {product.onSale && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            PROMO
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 font-sans group-hover:text-indigo-700 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="text-gray-700 ml-1 text-sm font-medium">{product.rating || '4.5'}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 font-light">
          {product.description || 'No description available'}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-gray-900">{product.price} DH</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through ml-2 text-sm">{product.originalPrice} DH</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            <Link to={`/AllProducts/product/${product.id}`} className="inline-flex items-center">
              Voir plus
            </Link>
          </motion.button>
        </div>

        {product.colors && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex space-x-2">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-8">
            <Link to="/" className="mr-4 text-indigo-600 hover:text-indigo-800 transition-colors">
              <FiArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 font-playfair">Votre Wishlist</h1>
            <span className="ml-auto bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
              {wishlist.length} {wishlist.length > 1 ? 'articles' : 'article'}
            </span>
          </div>
          
          {wishlist.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 font-playfair">Votre wishlist est vide</h2>
                <p className="text-gray-500 mb-6">Commencez à ajouter des produits que vous aimez</p>
                <Link 
                  to="/AllProducts" 
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  <FiShoppingBag className="mr-2" />
                  Parcourir les produits
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;