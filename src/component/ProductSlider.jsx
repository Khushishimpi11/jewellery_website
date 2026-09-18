import React, { useState, useContext } from "react";
import "./ProductSlider.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingBag, faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import { productsData } from './productData'; // Import from productData

const ProductSlider = ({ onProductSelect }) => { // Add onProductSelect prop
  const backgroundImage = "https://wdtswarna.wpengine.com/wp-content/uploads/2024/10/product-slide-01-img-bg.jpg";

  // Use products from productData (last 4 products for this section)
  const products = productsData.slice(-4);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Context use karein
  const { 
    wishlist, 
    cart, 
    addToWishlist, 
    removeFromWishlist, 
    addToCart, 
    toggleCartSlider
  } = useContext(CartWishlistContext);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Wishlist Toggle
  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        ...product,
        title: product.name
      });
    }
  };

  // Cart Toggle
  const toggleCart = (product) => {
    if (cart.some(item => item.id === product.id)) {
      // Remove from cart if needed
    } else {
      addToCart({
        ...product,
        title: product.name,
        originalPrice: product.price,
        quantity: 1
      });
    }
  };

  // Add to cart and open cart slider
  const addToCartAndOpen = (product) => {
    addToCart({
      ...product,
      title: product.name,
      originalPrice: product.price,
      quantity: 1
    });
    toggleCartSlider();
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

  // Buy Now Handler
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

  const currentProduct = products[currentIndex];

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="product-slider">
      {/* Left Background Section */}
      <div className="product-slider__left" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="product-slider__overlay"></div>
        <div className="product-slider__background-content">
          <div className="product-slider__frame">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="product-slider__frame-image"
            />
          </div>
        </div>
      </div>

      {/* Right Product Section */}
      <div className="product-slider__right">
        <h2 className="product-slider__tagline">Jewels As Unique As You</h2>
        <h1 className="product-slider__title">Every Gem Tells A Story</h1>

        <div className="product-slider__container">
          <button className="product-slider__nav product-slider__nav--left" onClick={prevProduct}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div 
            className="product-card"
            onClick={() => handleProductClick(currentProduct)} // Card click handler
            style={{ cursor: 'pointer' }}
          >
            <div className="product-card__content">
              {/* Product Image Container */}
              <div className="product-card__image-wrapper">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="product-card__image"
                />

                {/* Icons Container */}
                <div className="product-card__actions">
                  <button
                    className={`product-card__action product-card__action--wishlist ${isInWishlist(currentProduct.id) ? 'product-card__action--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      toggleWishlist(currentProduct);
                    }}
                    title={isInWishlist(currentProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <FontAwesomeIcon
                      icon={isInWishlist(currentProduct.id) ? faHeart : farHeart}
                    />
                  </button>

                  <button
                    className={`product-card__action product-card__action--cart ${isInCart(currentProduct.id) ? 'product-card__action--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      toggleCart(currentProduct);
                    }}
                    title={isInCart(currentProduct.id) ? "Remove from Cart" : "Add to Cart"}
                  >
                    <FontAwesomeIcon icon={faShoppingBag} />
                  </button>

                  <button
                    className="product-card__action product-card__action--view view-active" // Always active
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleViewDetails(currentProduct);
                    }}
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <div className="product-card__buy-section">
                  <button 
                    className="product-card__buy-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleBuyNow(currentProduct);
                    }}
                  >
                    <span className="product-card__buy-text">Buy Now</span>
                    <span className="product-card__buy-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-card__info">
                <p className="product-card__type">{currentProduct.type}</p>
                <h3 className="product-card__name">{currentProduct.name}</h3>
                <p className="product-card__price">{formatPrice(currentProduct.price)}</p>
              </div>
            </div>
          </div>

          <button className="product-slider__nav product-slider__nav--right" onClick={nextProduct}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;