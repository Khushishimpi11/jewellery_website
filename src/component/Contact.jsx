import React from 'react';
import './Contact.css';

const Contact = ({ onNavigateToContact, isStandalone }) => {
  const handleContactClick = () => {
    if (onNavigateToContact) {
      onNavigateToContact();
    } else {
      // Fallback if prop is not provided
      alert('Contact us for exquisite jewelry collections!');
    }
  };

  // If it's a standalone contact page, don't show the redirect button
  if (isStandalone) {
    return null; // or return your contact inner page content here
  }

  return (
    <div className="contact-section">
      <div className="contact-overlay">
        <div className="contact-content">
          <h1 className="contact-title">Exquisite Jewelry Collection</h1>
          <p className="contact-subtitle">
            Discover the perfect blend of elegance and craftsmanship in every piece
          </p>
          <button className="contact-btn" onClick={handleContactClick}>
            <span className="contact-btn-text">Contact Us Today</span>
            <span className="contact-btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;