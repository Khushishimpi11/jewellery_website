import React from 'react';
import './AboutUs.css';

const AboutUs = ({ onNavigateToAbout, onNavigateToProducts }) => {

  // Handle Shop Now button click
  const handleShopNowClick = () => {
    if (onNavigateToProducts) {
      onNavigateToProducts();
    }
  };

  return (
    <div className="about-us-container">
      <div className="about-us-content">
        {/* Left Side - Image with Inner Border */}
        <div className="image-section">
          <div className="image-wrapper">
            <div className="image-border">
              <img 
                src="https://wdtswarna.wpengine.com/wp-content/uploads/2024/10/Model-Img-1.jpg" 
                alt="Raj Lashmi La" 
                className="about-image"
              />
              {/* Shine Effect Overlay */}
              <div className="shine-effect"></div>
              {/* White Overlay from Bottom */}
              <div className="image-overlay"></div>
            </div>
            {/* Circular Know More Button */}
            <div className="circle-know-more" onClick={onNavigateToAbout} style={{cursor:"pointer"}}>
              <div className="circle-text">
                <span className="embrace-text">Embrace Your</span>
                <span className="know-more-text">KNOW MORE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="text-section">
          <div className="text-intro">
            <h2>Rajlakshmi – A Legacy of Excellence</h2>
            <div className="slogan">
              "Elegance in Every Thread, Tradition in Every Design"
            </div>
            <p>
              Welcome to RajLakshmi , where tradition meets elegance. 
              We are dedicated to providing the finest quality products 
              that reflect our rich heritage and commitment to excellence. 
              With years of experience and passion, we bring you the best 
              in class offerings that celebrate our cultural roots.
            </p>
            <p>
              Our journey began with a simple vision - to bring authentic, 
              high-quality products to our valued customers while preserving 
              the traditional craftsmanship that defines our identity.
            </p>
          </div>

          {/* Statistics Section */}
          <div className="stats-section">
            <div className="stat-item">
              <h3>50+</h3>
              <p>Years of Experience</p>
            </div>
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Products</p>
            </div>
          </div>

          {/* Shop Now Button - Now clickable */}
          <button className="shop-now-btn" onClick={handleShopNowClick}>
            <span className="btn-text">Shop Now</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;