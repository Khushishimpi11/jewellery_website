import React, { useState } from 'react';
import './ContactInnerPage.css';

const ContactInnerPage = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

 const handleHomeNavigation = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contactInnerPage">
      {/* Banner Section */}
      <section className="contactBanner">
        <div className="bannerOverlay">
          <div className="bannerContent">
            <h1 className="bannerTitle">Get In Touch</h1>
             <div className="Contact-breadcrumb">
              <button 
                className="breadcrumb-home"
                onClick={handleHomeNavigation}
              >
                {/* <FontAwesomeIcon icon={faHome} style={{marginRight: '5px'}} /> */}
                Home
              </button>
              <span>›</span>
              Contact Us
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="contactContentSection">
        <div className="contactContainer">
          {/* Contact Information */}
          <div className="contactInfo">
            <h2 className="sectionTitle">Contact Information</h2>
            <p className="contactDescription">
              Visit our Rajlakshmi showroom or reach out to us through any of the following channels. 
              Our team of jewelry experts is ready to assist you with all your needs.
            </p>
            
            <div className="contactDetails">
              <div className="contactItem">
                <div className="contactIcon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contactText">
                  <h3>Our Rajlakshmi Showroom</h3>
                  <p>123 Jewelry Street<br />Mumbai, Maharashtra 400001</p>
                </div>
              </div>
              
              <div className="contactItem">
                <div className="contactIcon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contactText">
                  <h3>Phone Number</h3>
                  <p>+91 98765 43210<br />+91 98765 43211</p>
                </div>
              </div>
              
              <div className="contactItem">
                <div className="contactIcon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contactText">
                  <h3>Email Address</h3>
                  <p>info@rajlakshmijewelry.com<br />support@rajlakshmiejewelry.com</p>
                </div>
              </div>
              
              <div className="contactItem">
                <div className="contactIcon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contactText">
                  <h3>Working Hours</h3>
                  <p>Monday - Saturday: 10:00 AM - 8:00 PM<br />Sunday: 11:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="socialLinks">
              <a href="#" className="socialLink">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="socialLink">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="socialLink">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="socialLink">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contactFormContainer">
            <h2 className="sectionTitle">Send Us a Message</h2>
            <form className="contactForm" onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="name" className="formLabel">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="formControl"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="formGroup">
                <label htmlFor="email" className="formLabel">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="formControl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="formGroup">
                <label htmlFor="phone" className="formLabel">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="formControl"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="formGroup">
                <label htmlFor="subject" className="formLabel">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="formControl"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="formGroup">
                <label htmlFor="message" className="formLabel">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="formControl"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submitBtn">
                <span className="submitBtnText">Send Message</span>
                <span className="submitBtnArrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mapSection">
        <div className="mapContainer">
          <h2 className="sectionTitle">Find Our Store</h2>
          <div className="mapWrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.759919147926!2d72.82131431490057!3d19.05298868711159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c96c89f34f2d%3A0x6f4f191f2c88385!2sJewelry%20St%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1647856789012!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Exquisite Jewelry Store Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactInnerPage;