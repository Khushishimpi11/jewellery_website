import React, { useState, useEffect, useContext } from 'react';
import './ProductGallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import { productsData } from './productData'; // Import from productData

const ProductGallery = ({ onProductSelect }) => { // Add onProductSelect prop
  // Use products from productData and limit to 6 for this section
  const products = productsData.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Use context for cart and wishlist
  const { 
    wishlist, 
    cart, 
    addToWishlist, 
    removeFromWishlist, 
    addToCart, 
    toggleCartSlider
  } = useContext(CartWishlistContext);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate products per view based on screen size
  const getProductsPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4; // Desktop
  };

  const productsPerView = getProductsPerView();

  // Slide Controls
  const nextSlide = () => {
    if (isMobile) {
      setCurrentIndex((prevIndex) =>
        prevIndex >= products.length - 1 ? 0 : prevIndex + 1
      );
    } 
    else if (isTablet) {
      setCurrentIndex((prevIndex) =>
        prevIndex + 2 >= products.length ? 0 : prevIndex + 2
      );
    } 
    else {
      setCurrentIndex((prevIndex) =>
        prevIndex + productsPerView >= products.length ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    } 
    else if (isTablet) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 2 : prevIndex - 2
      );
    } 
    else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - productsPerView : prevIndex - 1
      );
    }
  };

  // Get visible products based on screen size
  const getVisibleProducts = () => {
    if (isMobile) {
      return [products[currentIndex]]; // Mobile = 1
    } 
    if (isTablet) {
      return products.slice(currentIndex, currentIndex + 2); // Tablet = 2
    }
    return products.slice(currentIndex, currentIndex + productsPerView); // Desktop = 4
  };

  const visibleProducts = getVisibleProducts();

  // Wishlist Toggle - Using context
  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        ...product,
        title: product.name || product.title
      });
    }
  };

  // Cart Toggle - Using context
  const toggleCart = (product) => {
    if (cart.some(item => item.id === product.id)) {
      // Remove from cart if needed
    } else {
      addToCart({
        ...product,
        title: product.name || product.title,
        originalPrice: product.price,
        quantity: 1
      });
    }
  };

  // Add to cart and open cart slider
  const addToCartAndOpen = (product) => {
    addToCart({
      ...product,
      title: product.name || product.title,
      originalPrice: product.price,
      quantity: 1
    });
    toggleCartSlider(); // Open cart slider
  };

  // View Details Handler - OPEN DETAIL PAGE
  const handleViewDetails = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Product Card Click Handler - OPEN DETAIL PAGE
  const handleProductClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Buy Now Handler - Add to cart and open cart
  const handleBuyNow = (product) => {
    addToCartAndOpen(product);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <div className="gallery">
      <div className="gallery__header">
        <h1 className="gallery__title">Your Style, Our Collection</h1>
        <p className="gallery__intro">
          Where modern artistry meets timeless beauty — jewelry that complements your charm and enhances your every look.
        </p>
      </div>

      <div className="gallery__slider">
        {/* Side arrows - only show on desktop */}
        {!isMobile && !isTablet && (
          <>
            <button className="slider__arrow slider__arrow--prev" onClick={prevSlide}>
              &#8249;
            </button>
            <button className="slider__arrow slider__arrow--next" onClick={nextSlide}>
              &#8250;
            </button>
          </>
        )}

        <div className="gallery__products">
          {visibleProducts.map((product) => (
            <div 
              key={product.id} 
              className="product"
              onClick={() => handleProductClick(product)} // Card click handler
              style={{ cursor: 'pointer' }}
            >
              <div className="product__image-container">
                <img
                  src={product.image}
                  alt={product.title || product.name}
                  className="product__image"
                />

                {/* Icons Container */}
                <div className="icons-container">
                  <button
                    className={`wishlist-icon ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      toggleWishlist(product);
                    }}
                    title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <FontAwesomeIcon
                      icon={isInWishlist(product.id) ? solidHeart : regularHeart}
                    />
                  </button>

                  <button
                    className={`bag-icon ${isInCart(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      toggleCart(product);
                    }}
                    title={isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </button>

                  <button
                    className="view-icon active" // Always active since it opens detail page
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleViewDetails(product);
                    }}
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <div className="product__hover-actions">
                  <button 
                    className="buy-now-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleBuyNow(product);
                    }}
                  >
                    <span className="btn-text">Buy Now</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>

              <div className="product__info">
                <p className="product__type">{product.types || product.type}</p>
                <h3 className="product__name">{product.title || product.name}</h3>
                <p className="product__price">₹{product.price?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom arrows - only show on mobile and tablet */}
        {(isMobile || isTablet) && (
          <div className="slider__arrows-bottom">
            <button className="slider__arrow slider__arrow--bottom slider__arrow--prev-bottom" onClick={prevSlide}>
              &#8249;
            </button>
            <button className="slider__arrow slider__arrow--bottom slider__arrow--next-bottom" onClick={nextSlide}>
              &#8250;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;