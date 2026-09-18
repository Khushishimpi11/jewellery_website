import React from 'react';
import './JewelryBanners.css';

// Import your images (replace with your actual image paths)
import eleganceBg from '../assets/jbanner.jpg';
import storyBg from '../assets/jbanner2.jpg';

const JewelryBanners = ({ onNavigateToProducts }) => {

  // Handle Shop Now button click
  const handleShopNowClick = () => {
    if (onNavigateToProducts) {
      onNavigateToProducts();
    }
  };

  return (
    <div className="jewelry-showcase-wrapper">
      {/* Elegance Panel - With Overlay */}
      <div className="showcase-panel elegance-panel" style={{ backgroundImage: `url(${eleganceBg})` }}>
        <div className="panel-backdrop"></div>
        <div className="panel-content">
          <div className="panel-text elegance-text">
            <div className="panel-tag elegance-tag">Circle Of Elegance</div>
            <h1 className="panel-heading elegance-heading">Celebrate Life, One<br />Ring At A Time.</h1>
            <button className="collection-action-btn" onClick={handleShopNowClick}>
              <span className="action-btn-text">Shop Now</span>
              <span className="action-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Story Panel - Without Overlay */}
      <div className="showcase-panel story-panel" style={{ backgroundImage: `url(${storyBg})` }}>
        <div className="panel-content">
          <div className="panel-text story-text">
            <div className="panel-tag story-tag">Illuminate Your Look</div>
            <h1 className="panel-heading story-heading">Every Jewellery Has Its<br />Own Story</h1>
            <button className="collection-action-btn" onClick={handleShopNowClick}>
              <span className="action-btn-text">Shop Now</span>
              <span className="action-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryBanners;