import React, { useState, useEffect } from "react";
import "./TestimonialSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

import jewelryImg from "../assets/tbanner.jpg";
import customer1 from "../assets/bimg.jpg";
import customer2 from "../assets/bimg1.jpg";
import customer3 from "../assets/bimg2.jpg";

const testimonials = [
  {
    id: 1,
    name: "Charlotte",
    country: "France",
    text: "I absolutely adore my necklace! The craftsmanship is truly exquisite — every tiny detail reflects perfection. It feels so elegant and sophisticated to wear, adding a timeless charm to every outfit. I've received countless compliments, and it makes me feel effortlessly graceful every time I wear it.",
    image: customer1,
  },
  {
    id: 2,
    name: "Sophia",
    country: "Italy",
    text: "The quality and shine are simply unmatched. This piece has quickly become my absolute favorite for both everyday wear and special occasions. The way it catches the light is mesmerizing, and I love how it elevates even the simplest look. Totally worth every penny — I feel like I'm wearing a piece of art.",
    image: customer2,
  },
  {
    id: 3,
    name: "Isabella",
    country: "Spain",
    text: "Beautiful, timeless, and luxurious — exactly what I was hoping for. The intricate detailing is stunning, and even the packaging made me feel like royalty. From the moment I opened the box to the first time I wore it, the experience felt so special. Highly recommend to anyone who appreciates true elegance and fine artistry.",
    image: customer3,
  },
];

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
  };

  const testimonial = testimonials[currentTestimonial];

  return (
    <section className="feedback-container">
      <div className="feedback-content">
        <p className="feedback-subheading">CUSTOMER VOICES</p>
        <h2 className="feedback-heading">Our Customers Speak For Us</h2>

        <div className="feedback-quote fade-in">
          <FontAwesomeIcon icon={faQuoteLeft} className="quote-symbol left" />
          <p className="feedback-text">{testimonial.text}</p>
          <FontAwesomeIcon icon={faQuoteRight} className="quote-symbol right" />
        </div>

        <div className="feedback-user">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="user-photo"
          />
          <p className="user-name">
            - {testimonial.name},{" "}
            <span className="user-location">{testimonial.country}</span>
          </p>
        </div>

        {/* Pagination */}
        <div className="feedback-navigation">
          <span className="nav-number">0{currentTestimonial + 1}</span>
          <div className="nav-dots">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentTestimonial ? "active-dot" : ""}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
          <span className="nav-number">03</span>
        </div>
      </div>

      <div className="feedback-image">
        <div className="image-container">
          <img src={jewelryImg} alt="Jewelry" className="jewelry-image" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;