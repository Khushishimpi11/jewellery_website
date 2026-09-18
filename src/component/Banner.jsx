import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Banner.css';

// Import all your images
// Left side images for different sliders
import springCollection from '../assets/slider1.jpg';
import summerVibes from '../assets/slider2.jpg';
import autumnStyles from '../assets/slider3.jpg';
import winterFashion from '../assets/slider4.jpg';

// Additional left side images for other sliders
import slide2_img1 from '../assets/slider5.jpg';
import slide2_img2 from '../assets/slider6.jpg';
import slide2_img3 from '../assets/slider7.jpg';
import slide2_img4 from '../assets/slider8.jpg';

import slide3_img1 from '../assets/slider9.jpg';
import slide3_img2 from '../assets/slider10.jpg';
import slide3_img3 from '../assets/slider5.jpg';
import slide3_img4 from '../assets/slider7.jpg';

// Big images for each slider
import premiumCollection1 from '../assets/banner.jpg';
import premiumCollection2 from '../assets/banner2.jpg';
import premiumCollection3 from '../assets/banner3.jpg';

// Look 1 images for each slider
import look1_slide1 from '../assets/bring2.png';
import look1_slide2 from '../assets/bring1.png';
import look1_slide3 from '../assets/bring3.png';

// Look 2 images for each slider
import look2_slide1 from '../assets/bimg.jpg';
import look2_slide2 from '../assets/bimg1.jpg';
import look2_slide3 from '../assets/bimg2.jpg';

const Banner = ({ onNavigateToProducts, onProductSelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);

  // Updated slides data with completely different images for each slide
  const slides = [
    {
      id: 1,
      label: "FASHION",
      title: "GLAMOROUS LIFE",
      subtitle: "Redefining Elegance With Unique Charms",
      description: "Vestibulum augue nibh, elementum eget ante nec, consectetur viverra leo. Curabitur sit amet dignissim erat. Aenean fringilla pretium elit, et eleifend orci cursus.",
      buttonText: "Know More",
      number: "01",
      lineText: "Elegance",
      leftImages: [springCollection, summerVibes, autumnStyles, winterFashion],
      bigImage: premiumCollection1,
      bottomImages: [look1_slide1, look2_slide1]
    },
    {
      id: 2,
      label: "STYLE",
      title: "MODERN STYLE",
      subtitle: "Contemporary Designs For Today",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Discover More",
      number: "02",
      lineText: "Style",
      leftImages: [slide2_img1, slide2_img2, slide2_img3, slide2_img4],
      bigImage: premiumCollection2,
      bottomImages: [look1_slide2, look2_slide2]
    },
    {
      id: 3,
      label: "TREND",
      title: "TIMELESS BEAUTY",
      subtitle: "Classic Designs That Endure",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      buttonText: "Explore Now",
      number: "03",
      lineText: "Beauty",
      leftImages: [slide3_img1, slide3_img2, slide3_img3, slide3_img4],
      bigImage: premiumCollection3,
      bottomImages: [look1_slide3, look2_slide3]
    }
  ];

  // Mouse move handler for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        setMousePosition({ x, y });
      }
    };

    const bannerElement = bannerRef.current;
    if (bannerElement) {
      bannerElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (bannerElement) {
        bannerElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNumberClick = (index) => {
    setCurrentSlide(index);
  };

  // Handle Explore Now button click
  const handleExploreClick = () => {
    if (onNavigateToProducts) {
      onNavigateToProducts();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="banner-container" ref={bannerRef}>
      <div className="banner-content">
        {/* Left side - 30% width with 4 small images stacked vertically */}
        <div className="left-section">
          <div className="vertical-images">
            <AnimatePresence mode="wait">
              {currentSlideData.leftImages.map((image, index) => (
                <motion.div
                  key={`${currentSlide}-${index}`}
                  className="vertical-img"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Removed the img-label div to remove text overlay */}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Right side - 70% width with main content */}
        <div className="right-section">
          {/* Big overlay image */}
          <div className="big-image-overlay">
            <motion.div 
              className="big-image"
              key={`big-image-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{
                backgroundImage: `url(${currentSlideData.bigImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Big image text removed as per requirement */}
            </motion.div>
          </div>
          
          {/* Text content */}
          <div className="text-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* New label above title */}
                <div className="title-label">
                  {currentSlideData.label}
                </div>
                
                <h1>{currentSlideData.title}</h1>
                <h2>{currentSlideData.subtitle}</h2>
                <p>{currentSlideData.description}</p>
                
                {/* Updated button with arrow - Now clickable */}
                <button className="curve-button" onClick={handleExploreClick}>
                  <span className="btn-text">Explore Now</span>
                  <span className="btn-arrow">→</span>
                </button>
                
                {/* Bottom images with mouse movement effect */}
                <div className="button-bottom-images">
                  <motion.div 
                    className="bottom-img look1-img"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      x: mousePosition.x * 15, // Move horizontally based on mouse
                      y: mousePosition.y * 8   // Move vertically based on mouse
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      mass: 0.5
                    }}
                    style={{
                      backgroundImage: `url(${currentSlideData.bottomImages[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Bottom image label removed */}
                  </motion.div>
                  
                  <motion.div 
                    className="bottom-img look2-img"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      x: mousePosition.x * -12, // Move in opposite direction
                      y: mousePosition.y * -6   // Move in opposite direction
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      mass: 0.5
                    }}
                    style={{
                      backgroundImage: `url(${currentSlideData.bottomImages[1]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Bottom image label removed */}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Number navigation positioned below big image */}
          <div className="number-navigation">
            <div className="numbers">
              {slides.map((slide, index) => (
                <motion.div 
                  key={slide.id}
                  className={`number ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => handleNumberClick(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slide.number}
                </motion.div>
              ))}
            </div>
            <div className="line-container">
              <div className="line"></div>
              <div className="line-text">{currentSlideData.lineText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;