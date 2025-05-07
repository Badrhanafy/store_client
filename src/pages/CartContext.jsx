import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState({
    count: 0,
    items: []
  });

  // Initialize cart and set up cross-tab sync
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartState({
        items: cart,
        count: cart.reduce((total, item) => total + item.quantity, 0)
      });
    };

    loadCart();

    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Core cart update function
  const updateCart = (newCart) => {
    const count = newCart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartState({ items: newCart, count });
    window.dispatchEvent(new Event('storage'));
  };

  // Public cart methods
  const cartActions = {
    addToCart: (product) => {
      const existingItem = cartState.items.find(item => item.id === product.id);
      const updatedCart = existingItem
        ? cartState.items.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...cartState.items, { ...product, quantity: 1 }];
      updateCart(updatedCart);
    },
    removeFromCart: (productId) => {
      const updatedCart = cartState.items.filter(item => item.id !== productId);
      updateCart(updatedCart);
    },
    updateQuantity: (productId, newQuantity) => {
      if (newQuantity < 1) {
        cartActions.removeFromCart(productId);
        return;
      }
      const updatedCart = cartState.items.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCart);
    },
    clearCart: () => {
      updateCart([]);
    },
    getCartTotal: () => {
      return cartState.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0);
    },
    getCartItems: () => {
      return cartState.items;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartCount: cartState.count, 
      ...cartActions 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};