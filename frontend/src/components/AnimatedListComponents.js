import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedProductGrid - Grid with staggered product animations
 */
export function AnimatedProductGrid({ products, renderProduct }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="product-grid"
    >
      {products.map((product, idx) => (
        <motion.div key={product._id} variants={itemVariants}>
          {renderProduct(product)}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * AnimatedSection - Section with reveal animation
 */
export function AnimatedSection({ children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, amount: 0.2 }}
      className="section"
    >
      {children}
    </motion.section>
  );
}

/**
 * AnimatedCard - Card with hover lift effect
 */
export function AnimatedCard({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedBrand Strip - Scrolling brand animation
 */
export function AnimatedBrandStrip({ brands }) {
  return (
    <motion.div
      className="brand-strip"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {brands.map((brand, idx) => (
        <motion.span
          key={brand}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: idx * 0.05 }}
          viewport={{ once: true }}
        >
          {brand}
        </motion.span>
      ))}
    </motion.div>
  );
}

/**
 * HeroContent - Animated hero section
 */
export function HeroContent({ tag, title, text, buttons }) {
  return (
    <motion.div
      className="hero-content"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.span
        className="hero-tag"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {tag}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {text}
      </motion.p>
      <motion.div
        className="hero-btns"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {buttons}
      </motion.div>
    </motion.div>
  );
}

/**
 * ScaledImage - Image with zoom on scroll
 */
export function ScaledImage({ src, alt, ...props }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      initial={{ scale: 0.95 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      {...props}
    />
  );
}
