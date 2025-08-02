import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// This is a more powerful, reusable wrapper component.
// You can now pass props to customize the animation.
// Example: <AnimatedSection direction="left" delay={0.5}>...</AnimatedSection>
const AnimatedSection = ({ children, direction = 'up', duration = 0.5, delay = 0.25 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  // Define animation variants based on the 'direction' prop
  const slideVariants = {
    hidden: {
      opacity: 0,
      // Slide from left or right if specified
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      // Slide from up or down if specified
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <div ref={ref} className="relative overflow-hidden w-full">
      <motion.div
        variants={slideVariants}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedSection;
