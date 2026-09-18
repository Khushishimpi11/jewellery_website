import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faHeart, 
  faShoppingBag, 
  faUser,
  faTimes,
  faChevronDown,
  faChevronUp,
  faShoppingCart,
  faTrash,
  faBars,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import { useUser } from './UserContext';
import './Navbar.css';

// Import your logo
import logo from '../assets/LOGO.PNG';

const Navbar = ({ currentPage, onNavigate, onCategorySelect, onShopNavigation, onCheckout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use context for cart and wishlist
  const { 
    wishlist, 
    cart, 
    isCartOpen, 
    isWishlistOpen,
    removeFromCart, 
    removeFromWishlist, 
    updateCartQuantity, 
    moveToCart,
    toggleCartSlider, 
    toggleWishlistSlider,
    closeCartSlider,
    closeWishlistSlider,
    cartTotal,
    cartItemsCount,
    wishlistItemsCount,
    checkoutError,
    canProceedToCheckout,
    clearCheckoutError
  } = useContext(CartWishlistContext);

  // Use user context
  const { user, logout, openLogin, openSignup } = useUser();

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const navMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // User menu toggle
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Toggle functions
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setActiveDropdown(null);
    }
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Search handlers
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      handleNavigation('products');
      closeSearch();
    }
  };

  const handleMobileSearch = (e) => {
    if (e.key === 'Enter' && mobileSearchQuery.trim()) {
      console.log('Searching for:', mobileSearchQuery);
      handleNavigation('products');
      closeMobileMenu();
      setMobileSearchQuery('');
    }
  };

  // Navigation handlers
  const handleNavigation = (page) => {
    onNavigate(page);
    closeMobileMenu();
    closeSearch();
    setIsUserMenuOpen(false);
  };

  const handleCollectionNavigation = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      handleNavigation('products');
    }
    closeMobileMenu();
  };

  const handleShopNavigation = () => {
    if (onShopNavigation) {
      onShopNavigation();
    } else {
      onNavigate('products');
    }
    closeMobileMenu();
  };

  // Handle checkout with login check
  const handleCheckout = () => {
    canProceedToCheckout(onCheckout);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    closeMobileMenu();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Effect for auto-focus
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMenuOpen && mobileSearchInputRef.current) {
      setTimeout(() => {
        mobileSearchInputRef.current.focus();
      }, 400);
    }
  }, [isMenuOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && 
          searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target)) {
        closeSearch();
      }
      
      if (activeDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      
      if (isUserMenuOpen && 
          userMenuRef.current && 
          !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      
      if (isMenuOpen && 
          navMenuRef.current && 
          !navMenuRef.current.contains(event.target) &&
          !event.target.closest('.navToggle')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isMenuOpen, activeDropdown, isUserMenuOpen]);

  // Keyboard navigation and escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (isSearchOpen) closeSearch();
        if (isMenuOpen) closeMobileMenu();
        if (isCartOpen) closeCartSlider();
        if (isWishlistOpen) closeWishlistSlider();
        if (isUserMenuOpen) setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen, isMenuOpen, isCartOpen, isWishlistOpen, isUserMenuOpen]);

  // Prevent body scroll when overlays are open
  useEffect(() => {
    if (isMenuOpen || isCartOpen || isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isCartOpen, isWishlistOpen]);

  return (
    <>
      <nav className="navBar">
        <div className="navContainer">
          {/* Logo */}
          <div className="navLogo">
            <button 
              className="logoLink" 
              onClick={() => handleNavigation('home')}
              aria-label="RajLaxmi Home"
            >
              <img 
                src={logo} 
                alt="RajLaxmi Diamonds & Jewellery" 
                className="logoImage"
              />
            </button>
          </div>

          {/* Navigation Menu */}
          <div 
            className={`navMenu ${isMenuOpen ? 'active' : ''}`}
            ref={navMenuRef}
          >
            {/* Mobile Search */}
            <div className="mobileSearch">
              <div className="mobileSearchContainer">
                <input 
                  ref={mobileSearchInputRef}
                  type="text" 
                  placeholder="Search jewelry..." 
                  className="mobileSearchInput"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyPress={handleMobileSearch}
                  aria-label="Search jewelry"
                />
                <button 
                  className="mobileSearchBtn" 
                  type="button"
                  onClick={() => mobileSearchQuery.trim() && handleMobileSearch({key: 'Enter'})}
                  aria-label="Search"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="navLinks">
              <button 
                className={`navLink ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigation('home')}
              >
                Home
              </button>
              
              <button 
                className={`navLink ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavigation('about')}
              >
                About
              </button>

              {/* Collections Dropdown */}
              <div 
                className={`navDropdown ${activeDropdown === 'collections' ? 'active' : ''}`}
                ref={dropdownRef}
              >
                <button 
                  className="navLink dropdownBtn" 
                  onClick={() => toggleDropdown('collections')}
                  aria-expanded={activeDropdown === 'collections'}
                >
                  Collections 
                  <FontAwesomeIcon 
                    icon={activeDropdown === 'collections' ? faChevronUp : faChevronDown} 
                    className="dropdownArrow" 
                  />
                </button>
                <div className="dropdownContent">
                  <button onClick={() => handleCollectionNavigation('All Products')}>
                    All Products
                  </button>
                  <button onClick={() => handleCollectionNavigation('rings')}>
                    Rings
                  </button>
                  <button onClick={() => handleCollectionNavigation('necklaces')}>
                    Necklaces
                  </button>
                  <button onClick={() => handleCollectionNavigation('earrings')}>
                    Earrings
                  </button>
                  <button onClick={() => handleCollectionNavigation('bracelets')}>
                    Bracelets
                  </button>
                  <button onClick={() => handleCollectionNavigation('pendants')}>
                    Pendants
                  </button>
                </div>
              </div>
              
              {/* Shop Link */}
              <button 
                className={`navLink ${currentPage === 'products' ? 'active' : ''}`}
                onClick={handleShopNavigation}
              >
                Shop
              </button>
              
              {/* Testimonials Link */}
              <button 
                className={`navLink ${currentPage === 'testimonials' ? 'active' : ''}`}
                onClick={() => handleNavigation('testimonials')}
              >
                Testimonials
              </button>
              
              <button 
                className={`navLink ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavigation('contact')}
              >
                Contact
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="navActions">
            {/* Desktop Search */}
            <div className="searchWrapper" ref={searchContainerRef}>
              <div className={`searchContainer ${isSearchOpen ? 'active' : ''}`}>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search jewelry..." 
                  className="searchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  aria-label="Search jewelry"
                />
                <button 
                  className="searchCloseBtn" 
                  onClick={closeSearch} 
                  type="button"
                  aria-label="Close search"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <button 
                className="searchToggleBtn" 
                onClick={toggleSearch}
                type="button"
                aria-label="Toggle search"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            
            {/* Action Buttons */}
            <button 
              className="actionBtn wishlistBtn" 
              onClick={toggleWishlistSlider}
              type="button"
              aria-label={`Wishlist items: ${wishlistItemsCount}`}
            >
              <FontAwesomeIcon icon={faHeart} />
              {wishlistItemsCount > 0 && (
                <span className="wishlistCount">{wishlistItemsCount}</span>
              )}
            </button>
            
            <button 
              className="actionBtn cartBtn" 
              onClick={toggleCartSlider}
              type="button"
              aria-label={`Cart items: ${cartItemsCount}`}
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              {cartItemsCount > 0 && (
                <span className="cartCount">{cartItemsCount}</span>
              )}
            </button>
            
            {/* User Account Button - Updated */}
            {user ? (
              <div className="userMenuContainer" ref={userMenuRef}>
                <button 
                  className="actionBtn userAvatarBtn" 
                  onClick={toggleUserMenu}
                  type="button"
                  aria-label="User menu"
                >
                  <span className="userAvatar">{getUserInitials()}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="userDropdown">
                    <div className="userInfo">
                      <div className="userName">{user.fullName}</div>
                      <div className="userEmail">{user.email}</div>
                    </div>
                    <button 
                      className="userMenuItem"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="actionBtn accountBtn" 
                onClick={openLogin}
                type="button"
                aria-label="Login"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <div className="navToggle" onClick={toggleMenu}>
              <button 
                className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login/Signup Modals */}
      <LoginModal />
      <SignupModal />

      {/* Cart Slider */}
      <div 
        className={`sliderOverlay ${isCartOpen ? 'active' : ''}`} 
        onClick={closeCartSlider}
        aria-hidden="true"
      ></div>
      <div 
        className={`cartSlider ${isCartOpen ? 'active' : ''}`}
        aria-hidden={!isCartOpen}
      >
        <div className="sliderHeader">
          <h2 className="sliderTitle">Your Cart ({cartItemsCount})</h2>
          <button 
            className="closeSlider" 
            onClick={closeCartSlider}
            aria-label="Close cart"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="sliderContent">
          {cart.length === 0 ? (
            <div className="emptyState">
              <FontAwesomeIcon icon={faShoppingCart} className="emptyIcon" />
              <h3>Shopping cart is empty!</h3>
              <p>Browse our collection and add items to your cart.</p>
              <button 
                className="continueShoppingBtn" 
                onClick={closeCartSlider}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cartItems">
              {cart.map(item => {
                const itemPrice = getItemPrice(item);
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={item.id} className="cartItem">
                    <div className="itemImage">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="itemDetails">
                      <div className="itemName">{item.title}</div>
                      
                      {/* Price Display Section */}
                      <div className="itemPriceDisplay">
                        <div className="pricePerItem">
                          ₹{itemPrice.toLocaleString()} each
                        </div>
                        <div className="itemTotalPrice">
                          ₹{itemTotal.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="cartItemControls">
                        <div className="itemQuantity">
                          <button 
                            className="quantityBtn" 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantityBtn" 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="cartRemoveBtn" 
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cartFooter">
            <div className="subtotal">
              <span>Subtotal:</span>
              <span className="subtotalPrice">₹{cartTotal.toLocaleString()}</span>
            </div>
            
            {/* Checkout Error Message */}
            {checkoutError && (
              <div className="checkoutErrorMessage">
                {checkoutError}
                {checkoutError === 'Please login to proceed with checkout' && (
                  <button 
                    className="loginFromCheckoutBtn"
                    onClick={() => {
                      closeCartSlider();
                      openLogin();
                    }}
                  >
                    Login Now
                  </button>
                )}
              </div>
            )}
            
            <button 
              className={`checkoutBtn ${!user ? 'checkoutDisabled' : ''}`}
              onClick={handleCheckout}
            >
              <span className="checkoutText">
                {user ? 'Proceed To Checkout' : 'Login to Checkout'}
              </span>
              <span className="checkoutArrow">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Slider */}
      <div 
        className={`sliderOverlay ${isWishlistOpen ? 'active' : ''}`} 
        onClick={closeWishlistSlider}
        aria-hidden="true"
      ></div>
      <div 
        className={`wishlistSlider ${isWishlistOpen ? 'active' : ''}`}
        aria-hidden={!isWishlistOpen}
      >
        <div className="sliderHeader">
          <h2 className="sliderTitle">Your Wishlist ({wishlistItemsCount})</h2>
          <button 
            className="closeSlider" 
            onClick={closeWishlistSlider}
            aria-label="Close wishlist"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="sliderContent">
          {wishlist.length === 0 ? (
            <div className="emptyState">
              <FontAwesomeIcon icon={faHeart} className="emptyIcon" />
              <h3>Your wishlist is empty!</h3>
              <p>Save your favorite items here for later.</p>
              <button 
                className="continueShoppingBtn" 
                onClick={closeWishlistSlider}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="wishlistItems">
              {wishlist.map(item => {
                const itemPrice = getItemPrice(item);
                
                return (
                  <div key={item.id} className="wishlistItem">
                    <div className="itemImage">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="itemDetails">
                      <div className="itemName">{item.title}</div>
                      <div className="itemPrice">₹{itemPrice.toLocaleString()}</div>
                      <div className="wishlistActions">
                        <button 
                          className="wishlistMoveToCart" 
                          onClick={() => moveToCart(item)}
                          aria-label={`Add ${item.title} to cart`}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                        </button>
                        <button 
                          className="wishlistRemoveBtn" 
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.title} from wishlist`}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Helper function to get item price with fallback
const getItemPrice = (item) => {
  return item.originalPrice || item.finalPrice || item.price || 0;
};

// Login Modal Component
const LoginModal = () => {
  const { isLoginOpen, closeModals, login, openSignup } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const handleSwitchToSignup = () => {
    closeModals();
    openSignup();
  };

  if (!isLoginOpen) return null;

  return (
    <div className="modalOverlay active" onClick={closeModals}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={closeModals}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2>Login to Your Account</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="submitBtn">Login</button>
        </form>
        
        <div className="modalFooter">
          <p>Don't have an account? 
            <button className="switchModalBtn" onClick={handleSwitchToSignup}>
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Signup Modal Component
const SignupModal = () => {
  const { isSignupOpen, closeModals, signup, openLogin } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const success = signup(formData.fullName, formData.email, formData.phone, formData.password);
    if (!success) {
      setError('An account with this email already exists');
    }
  };

  const handleSwitchToLogin = () => {
    closeModals();
    openLogin();
  };

  if (!isSignupOpen) return null;

  return (
    <div className="modalOverlay active" onClick={closeModals}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={closeModals}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2>Create Your Account</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="formGroup">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="formGroup">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min. 6 characters)"
              required
            />
          </div>
          
          <div className="formGroup">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button type="submit" className="submitBtn">Create Account</button>
        </form>
        
        <div className="modalFooter">
          <p>Already have an account? 
            <button className="switchModalBtn" onClick={handleSwitchToLogin}>
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;