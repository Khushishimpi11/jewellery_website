import React from "react";
import { motion } from "framer-motion";
import "./LuxuryMarquee.css";

const LuxuryMarquee = () => {
  const items = [
    "Charm Bracelets",
    "Necklaces",
    "Earrings",
    "Wedding Bands",
    "Rings",
    "Anklets",
  ];

  const starVariants = {
    animate: {
      scale: [0.8, 1.4, 0.8],
      rotate: [0, 180, 360],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="luxury-marquee">
      <div className="luxury-track">
        {[...Array(2)].map((_, i) => (
          <div className="luxury-group" key={i}>
            {items.map((item, index) => (
              <React.Fragment key={`${i}-${index}`}>
                <div className="luxury-item">
                  <span className="luxury-text">{item}</span>
                </div>
                {/* Always show star after each item, including the last one */}
                <motion.span
                  className="luxury-separator"
                  variants={starVariants}
                  animate="animate"
                >
                  ✦
                </motion.span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LuxuryMarquee;
