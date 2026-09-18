// AboutUsInnerPage.jsx
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import freeShipping from "../assets/free-delivery.png";
import discount from "../assets/gift.png";
import budget from "../assets/hand-shake.png";
import support from "../assets/investment.png";
import JewelryMarquee from '../component/JewelryMarquee';
import './AboutUsInnerPage.css';

const AboutUsInnerPage = ({ onNavigateToContact }) => {
  const [hoveredMember, setHoveredMember] = useState(null);

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Raj Sharma",
      position: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      name: "Laxmi Devi",
      position: "Creative Director",
      image: "https://wdtswarna.wpengine.com/wp-content/uploads/2024/10/Team-04.jpg"
    },
    {
      id: 3,
      name: "Amit Kumar",
      position: "Production Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      name: "Priya Singh",
      position: "Quality Assurance",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Features data
  const features = [
    {
      id: 1,
      icon: freeShipping,
      title: "Free Shipping",
      description: "Free shipping on all orders above ₹2000"
    },
    {
      id: 2,
      icon: discount,
      title: "Seasonal Discounts",
      description: "Special discounts during festive seasons"
    },
    {
      id: 3,
      icon: budget,
      title: "Budget Friendly",
      description: "Quality products at affordable prices"
    },
    {
      id: 4,
      icon: support,
      title: "Customer Support",
      description: "24/7 customer support for all your queries"
    }
  ];

  // Contact button click handler
  const handleContactClick = () => {
    if (onNavigateToContact) {
      onNavigateToContact();
    }
  };

  return (
    <div className="about-us-inner-page">
      {/* Banner Section */}
      <section className="about-banner">
        <div className="container">
          <div className="about-banner-inner">
            <h1>About Us</h1>
            <div className="about-breadcrumb">Home <span>›</span> About</div>
          </div>
        </div>
      </section>

      {/* Image & Text Section */}
      <section id="our-story" className="story-section">
        <div className="container">
          <div className="story-content">
            
            {/* Image */}
            <div className="story-image">
              <img 
                src="https://wdtswarna.wpengine.com/wp-content/uploads/2024/10/Model-Img-1.jpg" 
                alt="Rajlakshmi Jewellery"
              />
              <span className="image-overlay-border"></span>
            </div>

            {/* Text */}
            <div className="story-text">
              <h2>Rajlakshmi Jewellery</h2>
              <p className="slogan">Where Tradition Meets Timeless Elegance</p>

              <p>
                Welcome to <strong>Rajlakshmi </strong> — where tradition shines with modern elegance. 
                Rooted in legacy and driven by passion, we craft jewellery that reflects timeless beauty, 
                purity, and heritage.
              </p>

              <p>
                With years of dedication and experience, we have built a journey of trust, craftsmanship, 
                and excellence. Every piece we create celebrates our cultural roots and the grace of every woman.
              </p>

              <p>
                Our story began with a heartfelt vision — to preserve the artistry of our ancestors 
                and bring it forward in a refined, contemporary style.
              </p>

              <p>
                At Rajlakshmi La, jewellery isn't just an ornament — it's emotion, culture, 
                and a legacy to carry with pride.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-area">
        <div className="container">
          <div className="stats-wrapper">
            <div className="stat-box">
              <h3>50+</h3>
              <p>Years of Experience</p>
            </div>

            <div className="stat-box">
              <h3>1000+</h3>
              <p>Happy Customers</p>
            </div>

            <div className="stat-box">
              <h3>50+</h3>
              <p>Products</p>
            </div>

            <div className="stat-box">
              <h3>25+</h3>
              <p>Skilled Artisans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="container">
          <div className="video-content">
            
            <div className="video-container">
              <div className="video-placeholder">
                <img 
                  src="https://wdtswarna.wpengine.com/wp-content/uploads/2024/10/video-banner-img-1.jpg" 
                  alt="Rajlakshmi Jewellery Crafting"
                />
                
                {/* Play Button with SVG Circular Text */}
                <div className="play-button-wrapper">
                  <div className="circular-text-outer">
                    <svg className="circular-text-svg" viewBox="0 0 100 100" width="100" height="100">
                      <defs>
                        <path id="circle"
                          d="M 50, 50
                             m -40, 0
                             a 40,40 0 1,1 80,0
                             a 40,40 0 1,1 -80,0"
                        />
                      </defs>
                      <text>
                        <textPath xlinkHref="#circle" className="circular-text-path">
                          • PLAY VIDEO • WITH THE MEN'S AND HOLDING CENTER •
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <button className="play-button-center">
                    <div className="play-icon">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="video-text">
              <h2>Where Legacy Meets Luxury</h2>
              <p>
                At Rajlakshmi Jewellery, gold is not just a metal — it is a treasure of 
                emotions, traditions and grace passed through generations. Each masterpiece 
                reflects our dedication to purity, artistry and timeless beauty.
              </p>
              <p>
                From temple craftsmanship to modern designs, our jewellery celebrates culture, 
                devotion and elegance — a legacy crafted with love, worn with pride.
              </p>

              <div className="video-extra-text">
                <p className="signature-line">Rajlakshmi Jewellery — Crafting Heritage in Every Piece.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <JewelryMarquee/>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Rajlakshmi</h2>
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <img src={feature.icon} alt={feature.title} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div 
                key={member.id} 
                className="team-member"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className={`social-overlay ${hoveredMember === member.id ? 'active' : ''}`}>
                    <div className="social-icons">
                      <a href="#"><i className="fab fa-facebook-f"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                      <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner Section - Updated with onClick handler */}
      <section className="contact-banner-section">
        <div className="container">
          <div className="contact-banner-content">
            <div className="contact-overlay-text">
              <h2>Ready to Experience Rajlakshmi?</h2>
              <p>Get in touch with us for custom orders or any inquiries</p>
              <button 
                onClick={handleContactClick} 
                className="btn contact-btn"
              >
                <span className="btn-text">Contact Us</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsInnerPage;