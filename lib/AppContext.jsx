import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [studioProduct, setStudioProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('lux_token');
      if (savedToken) {
        setToken(savedToken);
        fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) setUser(data.user);
            else {
              localStorage.removeItem('lux_token');
              setToken(null);
            }
          })
          .catch(() => {});
      }

      const savedCart = localStorage.getItem('lux_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('lux_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {}
  }, []);

  // Save cart
  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('lux_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (product, qty = 1) => {
    const existing = cart.find(item => item.productId === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.productId === product.id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      newCart = [
        ...cart,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          model3dId: product.model3d_id || product.model3dId || 'aurelius',
          qty: qty
        }
      ];
    }
    saveCart(newCart);
    setIsCartOpen(true);
  };

  const updateCartQty = (productId, delta) => {
    const newCart = cart
      .map(item => (item.productId === productId ? { ...item, qty: item.qty + delta } : item))
      .filter(item => item.qty > 0);
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter(item => item.productId !== productId));
  };

  // Wishlist
  const toggleWishlist = (productId) => {
    let next;
    if (wishlist.includes(productId)) {
      next = wishlist.filter(id => id !== productId);
    } else {
      next = [...wishlist, productId];
    }
    setWishlist(next);
    try {
      localStorage.setItem('lux_wishlist', JSON.stringify(next));
    } catch (e) {}

    // Sync with DB if user logged in
    if (token) {
      fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      }).catch(() => {});
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Auth methods
  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('lux_token', userToken);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lux_token');
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        handleLogin,
        handleLogout,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        isShowroomOpen,
        setIsShowroomOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        studioProduct,
        setStudioProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastOrder,
        setLastOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
