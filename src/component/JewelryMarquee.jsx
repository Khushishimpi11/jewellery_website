  import React from "react";
  import { motion } from "framer-motion";
  import "./JewelryMarquee.css";

  const JewelryMarquee = () => {
    const marqueeItems = [
      "Shine with Elegance",
      "THE ICONIC COLLECTION", 
      "Glamour that Glows",
      "Grace in Gold",
      "COLOR IN YOUR LOOK"
    ];

    // Star separator animation variants
    const starVariants = {
      animate: {
        scale: [0.8, 1.4, 0.8], // chota -> bada -> chota
        rotate: [0, 180, 360], // rotate karta hua
        opacity: [0.6, 1, 0.6],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

    return (
      <div className="marquee-container">
        <div className="marquee-track">
          {/* Repeat content multiple times to create continuous flow */}
          {[...Array(3)].map((_, repeatIndex) => (
            <React.Fragment key={repeatIndex}>
              {marqueeItems.map((item, index) => (
                <span key={`${repeatIndex}-${index}`} className="marquee-item">
                  {item} 
                  <motion.span 
                    className="star-separator"
                    variants={starVariants}
                    animate="animate"
                  >
                    ✦
                  </motion.span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  export default JewelryMarquee;