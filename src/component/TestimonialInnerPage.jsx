// TestimonialInnerPage.js - UPDATED FORM LAYOUT
import React, { useState } from "react";
import "./TestimonialInnerPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faStar, faHome, faTimes } from "@fortawesome/free-solid-svg-icons";

// Import your images - replace with your actual image paths
import customer1 from "../assets/bimg.jpg";
import customer2 from "../assets/bimg1.jpg";
import customer3 from "../assets/bimg2.jpg";
import customer4 from "../assets/bimg.jpg";
import customer5 from "../assets/bimg1.jpg";
import customer6 from "../assets/bimg2.jpg";

const testimonials = [
  {
    id: 1,
    name: "Charlotte",
    country: "France",
    text: "I absolutely adore my necklace! The craftsmanship is truly exquisite — every tiny detail reflects perfection. It feels so elegant and sophisticated to wear, adding a timeless charm to every outfit.",
    image: customer1,
  },
  {
    id: 2,
    name: "Sophia",
    country: "Italy",
    text: "The quality and shine are simply unmatched. This piece has quickly become my absolute favorite for both everyday wear and special occasions. The way it catches the light is mesmerizing.",
    image: customer2,
  },
  {
    id: 3,
    name: "Isabella",
    country: "Spain",
    text: "Beautiful, timeless, and luxurious — exactly what I was hoping for. The intricate detailing is stunning, and even the packaging made me feel like royalty. Highly recommend to anyone who appreciates true elegance.",
    image: customer3,
  },
  {
    id: 4,
    name: "Emma",
    country: "United Kingdom",
    text: "I've purchased multiple pieces from this collection and each one exceeds my expectations. The attention to detail is remarkable, and I always receive compliments whenever I wear them.",
    image: customer4,
  },
  {
    id: 5,
    name: "Olivia",
    country: "United States",
    text: "As someone who values quality and craftsmanship, I can confidently say these pieces are worth every penny. The materials feel premium and the designs are both classic and contemporary.",
    image: customer5,
  },
  {
    id: 6,
    name: "Amelia",
    country: "Germany",
    text: "The customer service was exceptional, and the jewelry arrived beautifully packaged. The piece itself is even more stunning in person than in the photos. I will definitely be purchasing again.",
    image: customer6,
  },
];

const TestimonialInnerPage = ({ onNavigateHome }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
    photo: null
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleHomeNavigation = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleShareStoryClick = () => {
    setShowReviewForm(true);
    // Scroll to form section
    setTimeout(() => {
      document.getElementById('review-form-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleCloseForm = () => {
    setShowReviewForm(false);
    setFormData({
      name: '',
      email: '',
      review: '',
      photo: null
    });
    setRating(0);
  };

  const handleRatingClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData(prev => ({
        ...prev,
        photo: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Review submitted:', { ...formData, rating });
    
    // Show success message
    setFormSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        review: '',
        photo: null
      });
      setRating(0);
      setShowReviewForm(false);
      setFormSubmitted(false);
    }, 3000);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'active' : ''}`}
        onClick={() => handleRatingClick(index)}
      >
        <FontAwesomeIcon icon={faStar} />
      </span>
    ));
  };

  return (
    <div className="testimonial-inner-page">
      {/* Banner Section - Updated to match About page style */}
      <section className="testimonial-banner">
        <div className="container">
          <div className="testimonial-banner-inner">
            <h1>Customer Testimonials</h1>
            <div className="testimonial-breadcrumb">
              <button 
                className="breadcrumb-home"
                onClick={handleHomeNavigation}
              >
                {/* <FontAwesomeIcon icon={faHome} style={{marginRight: '5px'}} /> */}
                Home
              </button>
              <span>›</span>
              Testimonials
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid Section */}
      <section className="testimonials-grid-section">
        <div className="section-heading">
          <p className="section-subtitle">CUSTOMER VOICES</p>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-description">
            We take pride in creating pieces that become cherished parts of our customers' lives. 
            Here are some of their experiences with our collection.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-user">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="user-avatar"
                />
                <div className="user-info">
                  <p className="user-name">{testimonial.name}</p>
                  <p className="user-location">{testimonial.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TestimonialInnerPage;