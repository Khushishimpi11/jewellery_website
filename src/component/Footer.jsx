import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./Footer.css";
import logo from "../assets/logo1.svg";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Logo */}
      <div className="footer-logo">
        <img src={logo} alt="Rajlakshmi Jewelers Logo" />
      </div>

      {/* Main Navigation Links */}
      <ul className="footer-nav">
        <li><a href="/">HOME</a></li>
        <li><a href="/about">ABOUT US</a></li>
         <li><a href="/Collection">COLLECTION</a></li>
        <li><a href="/engagement">ENGAGEMENT</a></li>
        <li><a href="/wedding">WEDDING</a></li>
        <li><a href="/contact">CONTACT</a></li>
      </ul>

      {/* Collections Navigation */}
      {/* <ul className="footer-nav collections-nav">
        <li><a href="/rings">RINGS</a></li>
        <li><a href="/necklaces">NECKLACES</a></li>
        <li><a href="/earrings">EARRINGS</a></li>
        <li><a href="/bracelets">BRACELETS</a></li>
        <li><a href="/new-arrivals">NEW ARRIVALS</a></li>
      </ul> */}

      {/* Contact Information */}
      <div className="footer-contact">
        <p>
          <FaMapMarkerAlt /> 
          Boulevard Towers by BramhaCorp, Office No 1002, Sadhu Vaswani Chowk, Camp, Pune, Maharashtra-411001
        </p>
        <p>
          <FaEnvelope /> 
         rajlakshmijewellery@gmail.com
        </p>
        <p>
          <FaPhoneAlt /> 
          +91 8999831559
        </p>
      </div>

      {/* Social Media */}
      <div className="footer-socials">
        <a href="#"><FaFacebookF /></a>
        <a href="#"><FaWhatsapp /></a>
        <a href="#"><FaInstagram /></a>
      </div>

      <hr className="footer-line" />

      <div className="footer-bottom">
        <p>© 2025 <span className="highlight">Rajlakshmi</span>. All Rights Reserved. | Designed by <span className="highlight">PTS</span></p>
      </div>
    </footer>
  );
};

export default Footer;