import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import { productsData } from '../component/productData';
import './ProductPage.css';

const ProductPage = ({ onNavigateHome, onProductSelect, initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('default');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState({});
  
  const productsPerPage = 6;

  // Use imported products data
  const products = productsData;

  // Context use karein
  const { 
    wishlist, 
    cart, 
    addToWishlist, 
    removeFromWishlist, 
    addToCart, 
    toggleCartSlider,
    toggleWishlistSlider
  } = useContext(CartWishlistContext);

  // initialCategory change होने पर update करें
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1); // Reset to first page
  }, [initialCategory]);

  // Load selected sizes from localStorage on component mount
  useEffect(() => {
    const savedSizes = localStorage.getItem('selectedSizes');
    if (savedSizes) {
      setSelectedSizes(JSON.parse(savedSizes));
    }
  }, []);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'rings', name: 'Rings' },
    { id: 'earrings', name: 'Earrings' },
    { id: 'bracelets', name: 'Bracelets' },
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'pendants', name: 'Pendants' }
  ];

  const tags = [
    { id: 1, name: 'Premium' },
    { id: 2, name: 'New Arrival' },
    { id: 3, name: 'Best Seller' },
    { id: 4, name: 'Limited Edition' },
    { id: 5, name: 'Sale' },
    { id: 6, name: 'Handcrafted' }
  ];

  // IMPROVED: Helper function to check if product is a ring (exclude earrings)
  const isRingProduct = (product) => {
    if (!product || !product.type) return false;
    
    const type = product.type.toLowerCase().trim();
    
    // Exact matches for ring products ONLY (exclude earrings)
    const isRing = (
      type === 'ring' || 
      type === 'rings' ||
      type === 'rings, fashion' ||
      type.startsWith('rings,') ||
      type.startsWith('ring,') ||
      // Additional safety checks
      product.category === 'rings' ||
      (product.type && product.type.toLowerCase().includes('rings,')) ||
      (product.type && product.type.toLowerCase().includes(', rings'))
    );
    
    // Explicitly exclude earrings
    const isEarring = type.includes('earring') || type.includes('earrings');
    
    return isRing && !isEarring;
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return categoryMatch && priceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'name-a-z':
        return a.name.localeCompare(b.name);
      case 'name-z-a':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Format price for display in Indian Rupees
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate slider progress percentage
  const calculateProgress = (value, max) => {
    return (value / max) * 100;
  };

  // Wishlist Toggle - CONTEXT USE KAREIN
  const toggleWishlist = (e, product) => {
    e.stopPropagation();
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

  // Cart Toggle - CONTEXT USE KAREIN
  const toggleCart = (e, product) => {
    e.stopPropagation();
    
    // Check if it's a ring and size is not selected
    if (isRingProduct(product) && !selectedSizes[product.id]) {
      alert("Please choose a ring size before adding to cart");
      return;
    }

    if (cart.some(item => item.id === product.id)) {
      // Remove from cart logic agar chahiye toh
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

  // Add to cart and open cart slider
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

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // View Details Handler
  const handleViewDetails = (e, product) => {
    e.stopPropagation();
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Buy Now Handler - CONTEXT USE KAREIN
  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    
    // Check if it's a ring and size is not selected
    if (isRingProduct(product) && !selectedSizes[product.id]) {
      alert("Please choose a ring size before buying");
      return;
    }
    
    addToCartAndOpen(product);
  };

  // Handle product card click
  const handleProductClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Handle navigation in breadcrumb
  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
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

  // Generate page numbers for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(
      <button
        key={1}
        onClick={() => paginate(1)}
        className={`pageNumber ${currentPage === 1 ? 'active' : ''}`}
      >
        1
      </button>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push(<span key="ellipsis1" className="ellipsis">...</span>);
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`pageNumber ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push(<span key="ellipsis2" className="ellipsis">...</span>);
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`pageNumber ${currentPage === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }
    
    return pageNumbers;
  };

  return (
    <div className="productSection">
      {/* Banner Section */}
      <div className="bannerSection">
        <div className="bannerImageWrapper">
          <div className="bannerBackground"></div>
        </div>
        <div className="bannerOverlayContent">
          <div className="bannerTextContent">
            <h1 className="mainHeading">Jewelry Collection</h1>
            <div className="navigationBreadcrumb">
              <span onClick={handleHomeClick} style={{cursor: 'pointer'}}>Home</span>
              <span className="breadcrumbDivider">&gt;</span>
              <span className="breadcrumbCurrent">
                Shop {selectedCategory !== 'all' ? `- ${categories.find(cat => cat.id === selectedCategory)?.name}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mainLayout">
        {/* Left Sidebar - Filters */}
        <div className="filterPanel">
          <div className="filterSection">
            <h3 className="filterTitle">Product Type</h3>
            <div className="categoryList">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`categoryItem ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          <div className="filterSection">
            <h3 className="filterTitle">Tags</h3>
            <div className="tagList">
              {tags.map(tag => (
                <span key={tag.id} className="tagItem">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          <div className="filterSection">
            <h3 className="filterTitle">Filter by Price</h3>
            <div className="rangeSliderGroup">
              <div className="sliderWrapper">
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([priceRange[0], parseInt(e.target.value)]);
                    setCurrentPage(1);
                  }}
                  className="sliderInput"
                  style={{
                    background: `linear-gradient(to right, #6B7C61 0%, #6B7C61 ${calculateProgress(priceRange[1], 50000)}%, #ddd ${calculateProgress(priceRange[1], 50000)}%, #ddd 100%)`
                  }}
                />
              </div>
              <div className="rangeValueDisplay">
                <span className="rangeValueText">Price: {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          <button className="filterApplyButton">
            <span className="btn-text">Apply Filter</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Right Side - Products */}
        <div className="productsArea">
          <div className="productsHeader">
            <div className="productsCount">
              <span className="countText">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
                {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.name}`}
              </span>
            </div>
            <div className="viewOptions">
              <div className="viewToggle">
                <button 
                  className={`viewButton ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="1" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
                <button 
                  className={`viewButton ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="14" height="2" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="1" y="7" width="14" height="2" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="1" y="13" width="14" height="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
              <div className="sortContainer">
                <label htmlFor="sortSelect" className="sortLabel">Sort by:</label>
                <select 
                  id="sortSelect"
                  value={sortOption} 
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="sortSelect"
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="name-z-a">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="dividerLine"></div>

          <div className={viewMode === 'list' ? 'productsList' : 'productsGrid'}>
            {currentProducts.map(product => (
              <div 
                key={product.id} 
                className="productCard"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product)}
                style={{cursor: 'pointer'}}
              >
                {/* Image Container with Hover Effect */}
                <div className="imageWrapper">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={`productImg default-img ${hoveredProduct === product.id ? 'hidden' : 'visible'}`}
                  />
                  <img 
                    src={product.hoverImage} 
                    alt={product.name}
                    className={`productImg hover-img ${hoveredProduct === product.id ? 'visible' : 'hidden'}`}
                  />
                  
                  {/* Action Icons */}
                  <div className="actionIcons">
                    <button
                      className={`iconButton wishlistButton ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, product)}
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <FontAwesomeIcon
                        icon={isInWishlist(product.id) ? solidHeart : regularHeart}
                      />
                    </button>

                    <button
                      className={`iconButton cartButton ${isInCart(product.id) ? 'active' : ''}`}
                      onClick={(e) => toggleCart(e, product)}
                      title={isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>

                    <button
                      className="iconButton viewButton"
                      onClick={(e) => handleViewDetails(e, product)}
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>

                {/* Text Content Below Image */}
                <div className="productInfo">
                  <p className="productCategory">{product.type}</p>
                  <h3 className="productTitle">{product.name}</h3>
                  
                  {/* Weight for non-ring products */}
                  {!isRingProduct(product) && (
                    <p className="productSpecs">Weight: {product.weight}g</p>
                  )}
                  
                  {/* Size Selection for Rings - In one row with small font */}
                  {isRingProduct(product) && (
                    <div className="size-row-container">
                      <span className="size-label-text">Select Size:</span>
                      <div className="size-numbers-row">
                        {(product.sizes || ["10", "11", "12", "13", "14"]).map((size) => (
                          <button
                            key={size}
                            className={`size-number-btn ${selectedSizes[product.id] === size ? "active" : ""}`}
                            onClick={(e) => handleSizeSelect(e, product.id, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="productCost">{formatPrice(product.price)}</p>
                  <button 
                    className="purchaseButton"
                    onClick={(e) => handleBuyNow(e, product)}
                  >
                    <span className="btn-text">Buy Now</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="paginationContainer">
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="paginationArrow prev"
                >
                  &lt;
                </button>
                
                {renderPageNumbers()}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="paginationArrow next"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;