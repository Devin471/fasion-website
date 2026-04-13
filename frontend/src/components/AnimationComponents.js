import { motion } from 'framer-motion';
import React from 'react';

/**
 * PageTransition - Wraps pages with entrance/exit animations
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInUp - Fade in and slide up animation
 */
export function FadeInUp({ children, delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn - Scale in animation
 */
export function ScaleIn({ children, delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideInLeft - Slide from left animation
 */
export function SlideInLeft({ children, delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideInRight - Slide from right animation
 */
export function SlideInRight({ children, delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - Container for staggered animations
 */
export function StaggerContainer({ children, delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - Item inside StaggerContainer
 */
export function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hover Scale - Scale on hover
 */
export function HoverScale({ children, scale = 1.05, duration = 0.3 }) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hover Lift - Lift and shadow on hover
 */
export function HoverLift({ children }) {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(31, 41, 55, 0.15)' }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollReveal - Reveal on scroll
 */
export function ScrollReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax - Parallax scroll effect
 */
export function Parallax({ children, offset = 50 }) {
  return (
    <motion.div
      style={{
        y: motion.useMotionValue(0),
      }}
      initial={{ y: 0 }}
      whileInView={{ y: offset }}
      viewport={{ once: false }}
      transition={{ type: 'spring', stiffness: 50, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedButton - Button with hover animations
 */
export function AnimatedButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.button>
  );
}
