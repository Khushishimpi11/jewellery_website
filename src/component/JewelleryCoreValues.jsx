import React, { useState } from 'react';
import './JewelleryCoreValues.css';
import Earring from '../assets/earring.jpg';
import Ring from '../assets/ring.jpg';
import Bracelet from '../assets/bracelet.jpg';
import Pendant from '../assets/pendant.jpg';

const JewelleryCoreValues = ({ onCategorySelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const jewelleryItems = [
    {
      title: "Earrings",
      description: "Exquisite designs that frame your face with elegance and grace.",
      image: Earring,
      buttonText: "Shop Earrings"
    },
    {
      title: "Rings",
      description: "Symbols of love and commitment, crafted to perfection.",
      image: Ring,
      buttonText: "Shop Rings"
    },
    {
      title: "Bracelets",
      description: "Adorn your wrists with timeless beauty and sophistication.",
      image: Bracelet,
      buttonText: "Shop Bracelets"
    },
    {
      title: "Pendants",
      description: "Statement pieces that capture attention and tell your story.",
      image: Pendant,
      buttonText: "Shop Pendants"
    }
  ];

  // Button click handler
  const handleButtonClick = (categoryTitle, e) => {
    e.stopPropagation();
    if (onCategorySelect) {
      onCategorySelect(categoryTitle);
    }
  };

  return (
    <section className="jewellery-section">
      <div className="jewellery-container">
        {jewelleryItems.map((item, index) => (
          <img
            key={index}
            src={item.image}
            alt={item.title}
            className={`jewellery-background ${index === activeIndex ? 'active' : ''}`}
          />
        ))}

        <div className="jewellery-overlay">
          {jewelleryItems.map((item, index) => (
            <div
              key={index}
              className={`jewellery-part ${index === activeIndex ? 'active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="jewellery-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button 
                  className="jewellery-button"
                  onClick={(e) => handleButtonClick(item.title, e)}
                >
                  <span className="btn-text">{item.buttonText}</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              {index < jewelleryItems.length - 1 && <div className="jewellery-divider"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JewelleryCoreValues;