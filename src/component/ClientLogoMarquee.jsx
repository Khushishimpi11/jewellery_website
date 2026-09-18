// ClientLogoMarquee.jsx
import React from 'react';
import './ClientLogoMarquee.css';

// Import your logo files from your project
import googleLogo from '../assets/logo1.svg';
import microsoftLogo from '../assets/logo2.svg';
import appleLogo from '../assets/logo3.svg';
import amazonLogo from '../assets/logo1.svg';
import facebookLogo from '../assets/logo2.svg';
import netflixLogo from '../assets/logo3.svg';
import spotifyLogo from '../assets/logo1.svg';
import adobeLogo from '../assets/logo2.svg';

const ClientLogoMarquee = () => {
  // Client logo data with imported logos
  const clientLogos = [
    { 
      id: 1, 
      name: "Google", 
      logo: googleLogo, 
     
    },
    { 
      id: 2, 
      name: "Microsoft", 
      logo: microsoftLogo, 
     
    },
    { 
      id: 3, 
      name: "Apple", 
      logo: appleLogo, 
     
    },
    { 
      id: 4, 
      name: "Amazon", 
      logo: amazonLogo, 
   
    },
    { 
      id: 5, 
      name: "Facebook", 
      logo: facebookLogo, 
      hoverColor: "#1877F2" 
    },
    { 
      id: 6, 
      name: "Netflix", 
      logo: netflixLogo, 
    
    },
    { 
      id: 7, 
      name: "Spotify", 
      logo: spotifyLogo, 
     
    },
    { 
      id: 8, 
      name: "Adobe", 
      logo: adobeLogo, 
   
    },
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <div className="logo-marquee-container">
      <div className="logo-marquee-track">
        {duplicatedLogos.map((logo, index) => (
          <div 
            key={`${logo.id}-${index}`}
            className="logo-item"
            style={{ '--hover-color': logo.hoverColor }}
          >
            <img 
              src={logo.logo} 
              alt={logo.name}
              className="logo-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLogoMarquee;