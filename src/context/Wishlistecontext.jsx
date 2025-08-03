// src/context/WishlistContext.jsx
import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // 1. Charger depuis localStorage au démarrage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : []; // Si rien, retourne tableau vide
  });

  // 2. Sauvegarder automatiquement quand la wishlist change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      // Vérifier si le produit existe déjà
      if (!prev.some((item) => item.id === product.id)) {
        return [...prev, product];
      }
      return prev; // Sinon, ne rien faire
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};