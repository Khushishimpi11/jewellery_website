import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import { productsData } from './productData';
import './JewelryCollection.css';

const JewelryCollection = ({ onProductSelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  
  const { 
    wishlist, 
    cart, 
    addToWishlist, 
    removeFromWishlist, 
    addToCart, 
    toggleCartSlider
  } = useContext(CartWishlistContext);

  const jewelryProducts = productsData.slice(6, 14);

  // Load selected sizes from localStorage on component mount
  useEffect(() => {
    const savedSizes = localStorage.getItem('selectedSizes');
    if (savedSizes) {
      setSelectedSizes(JSON.parse(savedSizes));
    }
  }, []);

  // Helper function to check if product is a ring
  const isRingProduct = (product) => {
    if (!product || !product.type) return false;
    
    const type = product.type.toLowerCase().trim();
    
    const isRing = (
      type === 'ring' || 
      type === 'rings' ||
      type === 'rings, fashion' ||
      type.startsWith('rings,') ||
      type.startsWith('ring,') ||
      product.category === 'rings' ||
      (product.type && product.type.toLowerCase().includes('rings,')) ||
      (product.type && product.type.toLowerCase().includes(', rings'))
    );
    
    const isEarring = type.includes('earring') || type.includes('earrings');
    
    return isRing && !isEarring;
  };

  const getSlidesToShow = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  };

  const slidesToShow = getSlidesToShow();
  const totalSlides = Math.ceil(jewelryProducts.length / slidesToShow);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // Handle size selection - TOGGLE FUNCTIONALITY (Click again to remove)
  const handleSizeSelect = (e, productId, size) => {
    e.stopPropagation();
    
    // Check if same size is already selected
    if (selectedSizes[productId] === size) {
      // Remove the size - user clicked the same size again
      const updatedSizes = { ...selectedSizes };
      delete updatedSizes[productId];
      setSelectedSizes(updatedSizes);
      localStorage.setItem('selectedSizes', JSON.stringify(updatedSizes));
    } else {
      // Select new size
      const updatedSizes = {
        ...selectedSizes,
        [productId]: size
      };
      setSelectedSizes(updatedSizes);
      localStorage.setItem('selectedSizes', JSON.stringify(updatedSizes));
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        ...product,
        title: product.name,
        originalPrice: product.price
      });
    }
  };

  const toggleCart = (product) => {
    // Check if it's a ring and size is not selected
    if (isRingProduct(product) && !selectedSizes[product.id]) {
      alert("Please choose a ring size before adding to cart");
      return;
    }

    if (cart.some(item => item.id === product.id)) {
      // Remove from cart if needed
    } else {
      addToCart({
        ...product,
        title: product.name,
        originalPrice: product.price,
        quantity: 1,
        selectedSize: selectedSizes[product.id] || ''
      });
    }
  };

  const addToCartAndOpen = (product) => {
    // Check if it's a ring and size is not selected
    if (isRingProduct(product) && !selectedSizes[product.id]) {
      alert("Please choose a ring size before adding to cart");
      return;
    }

    addToCart({
      ...product,
      title: product.name,
      originalPrice: product.price,
      quantity: 1,
      selectedSize: selectedSizes[product.id] || ''
    });
    toggleCartSlider();
  };

  const handleViewDetails = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleProductClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleBuyNow = (product) => {
    // Check if it's a ring and size is not selected
    if (isRingProduct(product) && !selectedSizes[product.id]) {
      alert("Please choose a ring size before buying");
      return;
    }
    
    addToCartAndOpen(product);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const getVisibleProducts = () => {
    const startIndex = currentSlide * slidesToShow;
    return jewelryProducts.slice(startIndex, startIndex + slidesToShow);
  };

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="jewelry">
      <div className="jewelry__header">
        <h2 className="jewelry__title">Jewelry Collection</h2>
        <p className="jewelry__description">RajLaxmi Jewellery brings you a stunning range of ornaments that beautifully unite classic Indian artistry with modern sophistication.</p>
      </div>

      <div className="jewelry__slider">
        <button className="jewelry__slider-button jewelry__slider-button--prev" onClick={prevSlide}>‹</button>

        <div className="jewelry__slider-content">
          <div className="jewelry__products">
            {getVisibleProducts().map((product) => (
              <div 
                key={product.id} 
                className="jewelry__product"
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="jewelry__product-image-wrapper">
                  <img
                    src={hoveredProduct === product.id ? product.hoverImage : product.image}
                    alt={product.name}
                    className="jewelry__product-image"
                  />

                  <div className="jewelry__product-actions">
                    <button
                      className={`jewelry__action-button ${isInWishlist(product.id) ? 'jewelry__action-button--wishlist-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <FontAwesomeIcon
                        icon={isInWishlist(product.id) ? solidHeart : regularHeart}
                      />
                    </button>

                    <button 
                      className={`jewelry__action-button ${isInCart(product.id) ? 'jewelry__action-button--cart-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCart(product);
                      }}
                      title={isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    
                    <button 
                      className="jewelry__action-button jewelry__action-button--view"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(product);
                      }}
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>

                <div className="jewelry__product-info">
                  <p className="jewelry__product-type">{product.type}</p>
                  <h3 className="jewelry__product-name">{product.name}</h3>
                  
                  {/* Weight for non-ring products */}
                  {!isRingProduct(product) && (
                    <p className="jewelry__product-weight">Weight: {product.weight}g</p>
                  )}
                  
                  {/* Size Selection for Rings */}
                  {isRingProduct(product) && (
                    <div className="jewelry__size-row-container">
                      <span className="jewelry__size-label-text">Select Size:</span>
                      <div className="jewelry__size-numbers-row">
                        {(product.sizes || ["10", "11", "12", "13", "14"]).map((size) => (
                          <button
                            key={size}
                            className={`jewelry__size-number-btn ${selectedSizes[product.id] === size ? "jewelry__size-number-btn--active" : ""}`}
                            onClick={(e) => handleSizeSelect(e, product.id, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="jewelry__product-price">{formatPrice(product.price)}</p>
                  
                  <button 
                    className="jewelry__buy-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(product);
                    }}
                  >
                    <span className="jewelry__buy-button-text">Buy Now</span>
                    <span className="jewelry__buy-button-icon">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="jewelry__slider-button jewelry__slider-button--next" onClick={nextSlide}>›</button>
      </div>

      <div className="jewelry__mobile-controls">
        <button className="jewelry__mobile-button jewelry__mobile-button--prev" onClick={prevSlide}>‹</button>
        <span className="jewelry__slide-indicator">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button className="jewelry__mobile-button jewelry__mobile-button--next" onClick={nextSlide}>›</button>
      </div>
    </div>
  );
};

export default JewelryCollection;