import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart as solidHeart, 
  faShoppingCart, 
  faStar, 
  faChevronLeft, 
  faChevronRight, 
  faChevronDown, 
  faChevronUp,
  faShare,
  faTruck,
  faShieldAlt,
  faEye,
  faClock,
  faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import { useUser } from './UserContext';
import { getProductById, productsData } from '../component/productData';
import './ProductDetail.css';

const ProductDetail = ({ product, onBack, onNavigateHome, onProductSelect, onCheckout }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);

  const [expandedSections, setExpandedSections] = useState({
    additionalInfo: false,
    specifications: false,
    jewelleryCare: false,
    reviews: false
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });
  const [checkoutError, setCheckoutError] = useState('');

  // Use the passed product or get from data file
  const productData = product || getProductById(1);

  // Context use karein
  const { 
    wishlist, 
    cart, 
    addToWishlist, 
    removeFromWishlist, 
    addToCart, 
    toggleCartSlider
  } = useContext(CartWishlistContext);

  // Use user context
  const { user, openLogin } = useUser();

  // Simple price without weight adjustments
  const currentPrice = productData ? productData.price : 0;

  // Check if product is in wishlist
  const isInWishlist = wishlist.some(item => item.id === productData.id);
  
  // Check if product is in cart
  const isInCart = cart.some(item => item.id === productData.id);

  // IMPROVED: Exact ring type check
  const isRingProduct = () => {
    if (!productData || !productData.type) return false;
    
    const type = productData.type.toLowerCase().trim();
    
    // Exact matches for your product data
    return (
      type === 'ring' || 
      type === 'rings' ||
      type === 'rings, fashion' ||
      type.startsWith('rings,') ||
      type.startsWith('ring,') ||
      // Additional safety checks
      productData.category === 'rings' ||
      (productData.type && productData.type.toLowerCase().includes('rings,')) ||
      (productData.type && productData.type.toLowerCase().includes(', rings'))
    );
  };

  // Load available sizes when product changes - ONLY FOR RINGS
  useEffect(() => {
    if (isRingProduct() && productData) {
      console.log('Ring product detected:', productData.type);
      
      // Sirf productData.se hi size lena hai
      if (productData.sizes && Array.isArray(productData.sizes)) {
        setAvailableSizes(productData.sizes);
      } else {
        // Agar sizes nahi hai toh default sizes
        setAvailableSizes(["10", "11", "12", "13", "14"]);
      }
      
      // Load selected size from localStorage - YEH IMPORTANT HAI
      const savedSizes = localStorage.getItem('selectedSizes');
      if (savedSizes) {
        const sizes = JSON.parse(savedSizes);
        if (sizes[productData.id]) {
          setSelectedSize(sizes[productData.id]);
        } else {
          setSelectedSize(""); // Reset selected size when product changes
        }
      } else {
        setSelectedSize(""); // Reset selected size when product changes
      }
    } else {
      // Agar ring product nahi hai toh sizes clear karo
      setAvailableSizes([]);
      setSelectedSize("");
    }
  }, [productData]);

  // Handle size selection - TOGGLE FUNCTIONALITY (Click again to remove)
  const handleSizeSelect = (size) => {
    // Check if same size is already selected
    if (selectedSize === size) {
      // Remove the size - user clicked the same size again
      setSelectedSize("");
      
      // Remove from localStorage
      const savedSizes = localStorage.getItem('selectedSizes');
      const sizes = savedSizes ? JSON.parse(savedSizes) : {};
      const updatedSizes = { ...sizes };
      delete updatedSizes[productData.id];
      localStorage.setItem('selectedSizes', JSON.stringify(updatedSizes));
    } else {
      // Select new size
      setSelectedSize(size);
      
      // Save to localStorage
      const savedSizes = localStorage.getItem('selectedSizes');
      const sizes = savedSizes ? JSON.parse(savedSizes) : {};
      const updatedSizes = {
        ...sizes,
        [productData.id]: size
      };
      localStorage.setItem('selectedSizes', JSON.stringify(updatedSizes));
    }
  };

  if (!productData) {
    return (
      <div className="product-detail-section">
        <div className="product-detail-not-found">
          <p>Product not found.</p>
          <button className="product-detail-back-shop-btn" onClick={onBack}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely love this necklace! The quality is exceptional and it looks even better in person."
    },
    {
      id: 2,
      name: "Rahul Verma",
      rating: 4,
      date: "2024-01-10",
      comment: "Beautiful piece, but the delivery took longer than expected. Otherwise perfect!"
    }
  ];

  // Get related products (same category, excluding current product)
  const relatedProducts = productsData
    .filter(p => p.category === productData.category && p.id !== productData.id)
    .slice(0, 4);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productData.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productData.images.length - 1 ? 0 : prev + 1));
  };

  // Add to Cart Function
  const handleAddToCart = () => {
    // Check if it's a ring and size is not selected
    if (isRingProduct() && !selectedSize) {
      alert("Please choose a ring size");
      return;
    }

    const cartItem = {
      ...productData,
      title: productData.name,
      originalPrice: currentPrice,
      quantity: quantity,
      finalPrice: currentPrice,
      selectedSize: selectedSize
    };

    addToCart(cartItem);
  };

  // Cart Button Click Handler
  const handleCartButtonClick = () => {
    if (isInCart) {
      // If already in cart, open cart slider
      toggleCartSlider();
    } else {
      // If not in cart, add to cart
      handleAddToCart();
    }
  };

  // Checkout Handler - navigates to checkout page
  const handleCheckout = () => {
    // First check if user is logged in
    if (!user) {
      setCheckoutError('Please login to proceed with checkout');
      return;
    }

    // Check if it's a ring and size is not selected
    if (isRingProduct() && !selectedSize) {
      alert("Please choose a ring size before checkout");
      return;
    }

    // First add to cart if not already added
    if (!isInCart) {
      const cartItem = {
        ...productData,
        title: productData.name,
        originalPrice: currentPrice,
        quantity: quantity,
        finalPrice: currentPrice,
        selectedSize: selectedSize
      };
      addToCart(cartItem);
    }
    
    // Then navigate to checkout page
    if (onCheckout) {
      onCheckout();
    }
  };

  // Wishlist Toggle
  const handleAddToWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(productData.id);
    } else {
      addToWishlist({
        ...productData,
        title: productData.name,
        originalPrice: currentPrice
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productData.name,
        text: productData.description,
        url: window.location.href,
      })
      .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  // Related product click handler
  const handleRelatedProductClick = (relatedProduct) => {
    if (onProductSelect) {
      onProductSelect(relatedProduct);
      window.scrollTo(0, 0);
    }
  };

  // Related Product Wishlist
  const handleRelatedProductWishlist = (e, relatedProduct) => {
    e.stopPropagation();
    const isRelatedInWishlist = wishlist.some(item => item.id === relatedProduct.id);
    
    if (isRelatedInWishlist) {
      removeFromWishlist(relatedProduct.id);
    } else {
      addToWishlist({
        ...relatedProduct,
        title: relatedProduct.name,
        originalPrice: relatedProduct.price
      });
    }
  };

  // Related Product Add to Cart
  const handleRelatedProductAddToCart = (e, relatedProduct) => {
    e.stopPropagation();
    
    const isRelatedInCart = cart.some(item => item.id === relatedProduct.id);
    
    if (!isRelatedInCart) {
      addToCart({
        ...relatedProduct,
        title: relatedProduct.name,
        originalPrice: relatedProduct.price,
        quantity: 1,
        finalPrice: relatedProduct.price
      });
    }
  };

  // Related Product Buy Now - navigates to checkout
  const handleRelatedProductBuyNow = (e, relatedProduct) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      setCheckoutError('Please login to proceed with checkout');
      openLogin();
      return;
    }
    
    const isRelatedInCart = cart.some(item => item.id === relatedProduct.id);
    
    if (!isRelatedInCart) {
      addToCart({
        ...relatedProduct,
        title: relatedProduct.name,
        originalPrice: relatedProduct.price,
        quantity: 1,
        finalPrice: relatedProduct.price
      });
    }
    
    // Navigate to checkout page instead of opening cart slider
    if (onCheckout) {
      onCheckout();
    }
  };

  // Toggle sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your review!');
    setReviewForm({
      name: '',
      email: '',
      rating: 5,
      comment: ''
    });
    setShowReviewForm(false);
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="product-detail-star filled" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="product-detail-star empty" />);
    }

    return stars;
  };

  const renderReviewStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`review-star ${i <= rating ? 'filled' : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const renderRatingStars = (rating, onChange) => {
    return (
      <div className="rating-stars-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`rating-star ${star <= rating ? 'filled' : ''}`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Product specifications
  const getProductSpecifications = () => {
    const specs = [
      { label: "Metal Type", value: productData.metalType || "Gold 22 Ct" },
      { label: "Gross Weight (gm)", value: productData.grossWeight || (productData.weight + 0.2).toFixed(3) },
      { label: "Net Weight (gm)", value: productData.netWeight || productData.weight.toFixed(3) },
      { label: "HSN Code", value: productData.hsnCode || "711319" }
    ];

    // Add size specification for rings
    if (isRingProduct() && selectedSize) {
      specs.splice(3, 0, { label: "Size", value: selectedSize });
    } else {
      specs.splice(3, 0, { label: "Size", value: productData.size || "Standard" });
    }

    return specs;
  };

  // Check if related product is in wishlist
  const isRelatedInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Check if related product is in cart
  const isRelatedInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <div className="product-detail-section">
      {/* Banner Section */}
      <div className="product-detail-banner">
        <div className="product-detail-banner-image">
          <div className="product-detail-banner-bg"></div>
        </div>
        <div className="product-detail-banner-overlay">
          <div className="product-detail-banner-content">
            <h1 className="product-detail-main-heading">{productData.name}</h1>
            <div className="product-detail-breadcrumb">
              <span onClick={onNavigateHome} style={{cursor: 'pointer'}}>Home</span>
              <span className="breadcrumb-divider">&gt;</span>
              <span onClick={onBack} style={{cursor: 'pointer'}}>Shop</span>
              <span className="breadcrumb-divider">&gt;</span>
              <span className="breadcrumb-current">{productData.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-wrapper">
          {/* Image Gallery */}
          <div className="product-detail-gallery">
            <div className="product-detail-main-image">
              <img 
                src={productData.images[currentImageIndex]} 
                alt={productData.name}
                className="product-detail-image"
              />
              
              {productData.images.length > 1 && (
                <>
                  <button className="product-detail-nav-btn product-detail-prev-btn" onClick={handlePrevImage}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className="product-detail-nav-btn product-detail-next-btn" onClick={handleNextImage}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {productData.images.length > 1 && (
                <div className="product-detail-indicators">
                  {productData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`product-detail-indicator ${index === currentImageIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {productData.images.length > 1 && (
              <div className="product-detail-thumbnails">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`product-detail-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  >
                    <img src={image} alt={`${productData.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="product-detail-info">
            <div className="product-detail-header">
              <span className="product-detail-category">{productData.type}</span>

              <div className="product-detail-title-row">
                <h1 className="product-detail-title">{productData.name}</h1>

                <button 
                  className="product-detail-share-btn-fixed"
                  onClick={handleShare}
                  title="Share Product"
                >
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
              
              <div className="product-detail-rating">
                <div className="product-detail-stars">
                  {renderStars(productData.rating)}
                </div>
                <span className="product-detail-rating-text">({productData.rating}/5)</span>
              </div>
            </div>

            {/* Price and Product Code Section */}
            <div className="product-detail-price-code-section">
              <div className="product-detail-price-row">
                <span className="product-detail-price">{formatPrice(currentPrice)}</span>
              </div>
              
              <div className="product-detail-stock-weight-row">
                <span className="product-detail-weight">Weight: {productData.weight}g</span>
                <span className="product-detail-divider">|</span>
                <span className="product-detail-code">Product Code: {productData.code || 'SW001'}</span>
                <span className="product-detail-divider">|</span>
                <span className="product-detail-instock">In Stock</span>
              </div>
            </div>

            <div className="product-detail-description">
              <p>{productData.description}</p>
            </div>

            {/* Size Selection (Only for Exact Rings) */}
            {isRingProduct() && (
              <div className="product-detail-size-wrapper">
                <h3 className="product-detail-section-title">Select Ring Size</h3>
                <div className="size-box-container">
                  {availableSizes.map((size) => (
                    <div
                      key={size}
                      className={`size-box ${selectedSize === size ? "active" : ""}`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
                {selectedSize && (
                  <div className="selected-size-info">
                    Selected Size: <strong>{selectedSize}</strong> (Click again to remove)
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Add to Cart Section */}
            <div className="product-detail-quantity-section">
              <h3 className="product-detail-section-title">Quantity</h3>
              <div className="product-detail-quantity-row">
                <div className="product-detail-quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="product-detail-quantity-btn"
                  >
                    -
                  </button>
                  <span className="product-detail-quantity-divider">|</span>
                  <span className="product-detail-quantity-display">{quantity}</span>
                  <span className="product-detail-quantity-divider">|</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="product-detail-quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                {/* Add to Cart and Wishlist Buttons */}
                <div className="product-detail-cart-wishlist">
                  <button 
                    className={`product-detail-add-cart ${isInCart ? 'go-to-cart' : ''}`}
                    onClick={handleCartButtonClick}
                  >
                    {isInCart ? (
                      <>
                        <span className="cart-text">Go To Cart</span>
                        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                      </>
                    ) : (
                      <>
                        <span className="cart-text">Add To Cart</span>
                        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                      </>
                    )}
                  </button>

                  <button 
                    className={`product-detail-wishlist-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={handleAddToWishlist}
                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <FontAwesomeIcon icon={isInWishlist ? solidHeart : regularHeart} />
                  </button>
                </div>
              </div>
            </div>

            <div className="product-detail-shipping-info">
              <div className="product-detail-grid">
                <div className="product-detail-grid-item">
                  <FontAwesomeIcon icon={faTruck} />
                  <span>Free Delivery & Free Shipping</span>
                </div>
                <div className="product-detail-grid-item">
                  <FontAwesomeIcon icon={faClock} />
                  <span>Estimated Delivery: 3–5 Days</span>
                </div>
                <div className="product-detail-grid-item">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>Secure Online Payment</span>
                </div>
                <div className="product-detail-grid-item">
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                  <span>Return: 7 Days</span>
                </div>
              </div>
            </div>

            {/* Checkout Error Message */}
            {checkoutError && (
              <div className="product-detail-checkout-error">
                {checkoutError}
                {checkoutError === 'Please login to proceed with checkout' && (
                  <button 
                    className="product-detail-login-btn"
                    onClick={openLogin}
                  >
                    Login Now
                  </button>
                )}
              </div>
            )}

            {/* Checkout Button - navigates to checkout page */}
            <button 
              className={`product-detail-checkout-btn ${!user ? 'checkout-disabled' : ''}`}
              onClick={handleCheckout}
              disabled={isRingProduct() && !selectedSize}
            >
              <span>
                {!user 
                  ? 'Login to Checkout' 
                  : isRingProduct() && !selectedSize 
                    ? 'Select Size to Checkout' 
                    : 'Proceed to Checkout'
                }
              </span>
            </button>

            {/* Safe Checkout Guarantee */}
            <div className="safe-checkout-guarantee">
              <div className="safe-checkout-header">
                <FontAwesomeIcon icon={faShieldAlt} className="shield-icon" />
                <span>Guaranteed Safe Checkout</span>
              </div>
              <div className="payment-methods">
                <img src="https://5.imimg.com/data5/SELLER/Default/2023/9/348603242/KE/OR/XP/29083784/razorpay-software-500x500.png" alt="Razorpay" />
                <img src="https://images.seeklogo.com/logo-png/24/2/visa-logo-png_seeklogo-244624.png" alt="Visa" />
                <img src="https://cdn0.erstegroup.com/gemlip/v2/xd1Zy1eVnH5f8W2FBHhLVgMz3Kq/dam/rs/ebs/www_erstebank_rs/stanovnistvo/kartice/MasterCard/novi_logo3_MC.png.9f7b78e290199787.xywh.w3840w2560w1920w1280w1024w820w570w360w220w120w64_w1024.webp" alt="Mastercard" />
                <img src="https://w7.pngwing.com/pngs/1002/997/png-transparent-amex-payment-method-card-icon-thumbnail.png" alt="American Express" />
                <img src="https://woztell.com/wp-content/uploads/2025/05/woztell-extension-paypal-main.jpg" alt="PayPal" />
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Sections Below Image and Text */}
        <div className="product-detail-full-width-sections">
          {/* Additional Information Section */}
          <div className="product-detail-full-section">
            <button 
              className="product-detail-full-section-header"
              onClick={() => toggleSection('additionalInfo')}
            >
              <h2 className="product-detail-full-section-title">Additional Information</h2>
              <FontAwesomeIcon 
                icon={expandedSections.additionalInfo ? faChevronUp : faChevronDown} 
                className="section-toggle-icon"
              />
            </button>
            {expandedSections.additionalInfo && (
              <div className="product-detail-full-section-content">
                <div className="additional-info-content">
                  <p>{productData.fullDescription}</p>
                </div>
              </div>
            )}
          </div>

          {/* Specifications Section */}
          <div className="product-detail-full-section">
            <button 
              className="product-detail-full-section-header"
              onClick={() => toggleSection('specifications')}
            >
              <h2 className="product-detail-full-section-title">Specifications</h2>
              <FontAwesomeIcon 
                icon={expandedSections.specifications ? faChevronUp : faChevronDown} 
                className="section-toggle-icon"
              />
            </button>
            {expandedSections.specifications && (
              <div className="product-detail-full-section-content">
                <div className="specifications-table">
                  <table>
                    <tbody>
                      {getProductSpecifications().map((spec, index) => (
                        <tr key={index}>
                          <td className="spec-label">{spec.label}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Jewellery Care Section */}
          <div className="product-detail-full-section">
            <button 
              className="product-detail-full-section-header"
              onClick={() => toggleSection('jewelleryCare')}
            >
              <h2 className="product-detail-full-section-title">Jewellery Care</h2>
              <FontAwesomeIcon 
                icon={expandedSections.jewelleryCare ? faChevronUp : faChevronDown} 
                className="section-toggle-icon"
              />
            </button>
            {expandedSections.jewelleryCare && (
              <div className="product-detail-full-section-content">
                <div className="jewellery-care-list">
                  <ul>
                    <li>Handle jewellery with care.</li>
                    <li>Keep your jewellery dry and clean.</li>
                    <li>Always store your jewellery in ziplock bags to avoid oxidation of metal.</li>
                    <li>Don't wear jewellery in pool or at spa.</li>
                    <li>Don't put on lotion or perfume with your jewellery on.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="product-detail-full-section">
            <button 
              className="product-detail-full-section-header"
              onClick={() => toggleSection('reviews')}
            >
              <h2 className="product-detail-full-section-title">Customer Reviews ({reviews.length})</h2>
              <FontAwesomeIcon 
                icon={expandedSections.reviews ? faChevronUp : faChevronDown} 
                className="section-toggle-icon"
              />
            </button>
            {expandedSections.reviews && (
              <div className="product-detail-full-section-content">
                {/* Write Review Button */}
                <div className="write-review-section">
                  <button 
                    className="write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                  
                  {showReviewForm && (
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Your Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={reviewForm.name}
                            onChange={handleReviewInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={reviewForm.email}
                            onChange={handleReviewInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Rating *</label>
                        {renderRatingStars(reviewForm.rating, (rating) => 
                          setReviewForm(prev => ({ ...prev, rating }))
                        )}
                      </div>
                      <div className="form-group">
                        <label>Your Review *</label>
                        <textarea
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleReviewInputChange}
                          rows="4"
                          required
                        />
                      </div>
                      <button type="submit" className="submit-review-btn">
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>

                {/* Existing Reviews */}
                <div className="product-detail-reviews">
                  {reviews.map(review => (
                    <div key={review.id} className="product-detail-review">
                      <div className="product-detail-review-header">
                        <div className="product-detail-review-rating">
                          {renderReviewStars(review.rating)}
                        </div>
                        <span className="product-detail-review-date">{review.date}</span>
                      </div>
                      <h4 className="product-detail-review-author">{review.name}</h4>
                      <p className="product-detail-review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-wrapper">
            <h2 className="related-title">Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map(relatedProduct => (
                <div 
                  key={relatedProduct.id} 
                  className="related-card"
                  onClick={() => {
                    handleRelatedProductClick(relatedProduct);
                  }}
                >
                  <div className="related-img-box">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                    
                    <div className="related-hover-overlay">
                      <button 
                        className={`related-action-btn related-wishlist-btn ${isRelatedInWishlist(relatedProduct.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRelatedProductWishlist(e, relatedProduct);
                        }}
                      >
                        <FontAwesomeIcon icon={isRelatedInWishlist(relatedProduct.id) ? solidHeart : regularHeart} />
                      </button>
                      <button 
                        className="related-action-btn related-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRelatedProductAddToCart(e, relatedProduct);
                        }}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </button>
                      <button 
                        className="related-action-btn related-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRelatedProductClick(relatedProduct);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>

                  <div className="related-info">
                    <p className="related-category">{relatedProduct.type}</p>
                    <h3 className="related-name">{relatedProduct.name}</h3>
                    <p className="related-weight">Weight: {relatedProduct.weight}g</p>
                    <p className="related-price">{formatPrice(relatedProduct.price)}</p>
                    <button 
                      className={`related-buy-btn ${isRelatedInCart(relatedProduct.id) ? 'go-to-cart' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isRelatedInCart(relatedProduct.id)) {
                          toggleCartSlider();
                        } else {
                          handleRelatedProductBuyNow(e, relatedProduct);
                        }
                      }}
                    >
                      {isRelatedInCart(relatedProduct.id) ? 'GO TO CART →' : 'BUY NOW →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;