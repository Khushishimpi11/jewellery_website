import React, { createContext, useState, useContext } from 'react';
import { useUser } from './UserContext';

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Get user context
  const { user, openLogin } = useUser();

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlist(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, { ...product }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Move item from wishlist to cart
  const moveToCart = (wishlistItem) => {
    const existingCartItem = cart.find(item => item.id === wishlistItem.id);
    
    if (existingCartItem) {
      updateCartQuantity(wishlistItem.id, existingCartItem.quantity + 1);
    } else {
      addToCart({ ...wishlistItem, quantity: 1 });
    }
    
    removeFromWishlist(wishlistItem.id);
  };

  // Slider toggle functions
  const toggleCartSlider = () => {
    setIsCartOpen(prev => !prev);
    if (isWishlistOpen) setIsWishlistOpen(false);
    setCheckoutError('');
  };

  const toggleWishlistSlider = () => {
    setIsWishlistOpen(prev => !prev);
    if (isCartOpen) setIsCartOpen(false);
  };

  const closeCartSlider = () => {
    setIsCartOpen(false);
    setCheckoutError('');
  };

  const closeWishlistSlider = () => {
    setIsWishlistOpen(false);
  };

  // Check if user can proceed to checkout
  const canProceedToCheckout = (onCheckout) => {
    if (!user) {
      setCheckoutError('Please login to proceed with checkout');
      openLogin();
      return false;
    }
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty');
      return false;
    }
    setCheckoutError('');
    if (onCheckout) {
      onCheckout();
    }
    return true;
  };

  // Clear checkout error
  const clearCheckoutError = () => {
    setCheckoutError('');
  };

  // Calculate totals
  const cartTotal = cart.reduce((total, item) => {
    const price = item.originalPrice || item.finalPrice || item.price || 0;
    return total + (price * item.quantity);
  }, 0);
  
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wishlistItemsCount = wishlist.length;

  const value = {
    // State
    wishlist,
    cart,
    isCartOpen,
    isWishlistOpen,
    checkoutError,
    
    // Wishlist functions
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    
    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    moveToCart,
    
    // Slider functions
    toggleCartSlider,
    toggleWishlistSlider,
    closeCartSlider,
    closeWishlistSlider,
    
    // Checkout functions
    canProceedToCheckout,
    clearCheckoutError,
    
    // Calculated values
    cartTotal,
    cartItemsCount,
    wishlistItemsCount
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export { CartWishlistContext };