/* Home Page - Premium Fashion Layout with Animations */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { AnimatedProductGrid, AnimatedSection, AnimatedCard, AnimatedBrandStrip, HeroContent, ScaledImage } from '../components/AnimatedListComponents';
import { FaStar, FaTags, FaFire, FaShoppingBag, FaFeather, FaPen } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fp, cp, lp] = await Promise.all([
          api.get('/api/products?featured=true&limit=8'),
          api.get('/api/categories'),
          api.get('/api/products?sort=newest&limit=8')
        ]);
        if (!cancelled) {
          setFeatured(fp.data.products || fp.data);
          setCategories(cp.data);
          setLatest(lp.data.products || lp.data);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="home premium-home">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span className="shape shape-star" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, repeatType: 'loop' }}>
          ✦
        </motion.span>
        <motion.span className="shape shape-circle" animate={{ y: [0, 20, -20, 0] }} transition={{ duration: 6, repeat: Infinity, repeatType: 'loop' }} />
        <motion.span className="shape shape-block" animate={{ x: [0, 15, -15, 0], y: [0, 10, -10, 0] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'loop' }} />
        
        <HeroContent
          tag="Modern Fashion Story"
          title="Discover the new you"
          text="Curated runway-inspired styles in dark, beige, and coral tones. Premium fits, elegant textures, and everyday confidence."
          buttons={
            <>
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <Link to="/shop?sort=newest" className="btn btn-outline">Explore Collection</Link>
            </>
          }
        />

        <motion.div
          className="hero-gallery"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ScaledImage
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
            alt="Fashion model wearing modern outfit"
            loading="eager"
          />
          <ScaledImage
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"
            alt="Luxury fashion closeup"
            loading="lazy"
          />
        </motion.div>
      </motion.section>

      {/* Brands Section */}
      <AnimatedSection>
        <div className="section-header">
          <h2><FaStar /> Featured Brands</h2>
        </div>
        <AnimatedBrandStrip brands={['VOGUE.STUDIO', 'NOVA MODE', 'BEIGE LAB', 'CORAL EDIT', 'NOIR THREAD']} />
      </AnimatedSection>

      {/* Categories Section */}
      {categories.length > 0 && (
        <AnimatedSection delay={0.1}>
          <div className="section-header">
            <h2><FaTags /> Shop by Category</h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="cat-grid fashion-cats">
            {[
              { label: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80' },
              { label: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80' },
              { label: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=500&q=80' }
            ].map((c, idx) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/shop/${c.slug}`} className="cat-card">
                  <ScaledImage src={c.image} alt={c.label} loading="lazy" />
                  <span>{c.label}</span>
                  <small>Explore Styles</small>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Trending Picks Section */}
      {featured.length > 0 && (
        <AnimatedSection delay={0.2}>
          <div className="section-header">
            <h2><FaFire /> Trending Picks</h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <AnimatedProductGrid
            products={featured}
            renderProduct={(product) => <ProductCard key={product._id} product={product} />}
          />
        </AnimatedSection>
      )}

      {/* Promo Banner */}
      <motion.section
        className="promo-banner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <motion.div className="promo-content" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <span className="promo-tag">Style Drop</span>
          <h2>New season silhouettes with signature coral accents</h2>
          <p>Save up to 50% on selected looks this week.</p>
          <Link to="/shop?sort=popular" className="btn btn-primary">Claim the Edit</Link>
        </motion.div>
      </motion.section>

      {/* Latest Arrivals */}
      {latest.length > 0 && (
        <AnimatedSection delay={0.1}>
          <div className="section-header">
            <h2><FaShoppingBag /> Latest Arrivals</h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <AnimatedProductGrid
            products={latest}
            renderProduct={(product) => <ProductCard key={product._id} product={product} />}
          />
        </AnimatedSection>
      )}

      {/* Style Journal */}
      <AnimatedSection delay={0.2}>
        <div className="section-header">
          <h2><FaPen /> Style Journal</h2>
        </div>
        <div className="tips-grid">
          {[
            {
              title: '5 ways to style oversized blazers',
              text: 'Layer smart neutrals with coral accents for a modern fashion-week look.',
              image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80'
            },
            {
              title: 'Monochrome fits that never fail',
              text: 'Build depth with texture: knits, satin, and minimal accessories.',
              image: 'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=700&q=80'
            },
            {
              title: 'Weekend capsule guide',
              text: 'The must-have silhouettes for coffee dates and evening edits.',
              image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=700&q=80'
            }
          ].map((tip, idx) => (
            <motion.article
              className="tip-card"
              key={tip.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ScaledImage src={tip.image} alt={tip.title} loading="lazy" />
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </AnimatedSection>

      {/* App Section */}
      <AnimatedCard className="section app-section">
        <div className="app-promo card">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <span className="promo-tag">Mobile Experience</span>
            <h2>Shop the app. Swipe the look.</h2>
            <p>Get early access to drops, one-tap checkout, and curated style feeds.</p>
            <div className="hero-btns">
              <button className="btn btn-secondary" type="button">Google Play</button>
              <button className="btn btn-outline" type="button">App Store</button>
            </div>
          </motion.div>
          <ScaledImage
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=850&q=80"
            alt="Fashion app showcase"
            loading="lazy"
          />
        </div>
      </AnimatedCard>

      {/* Newsletter */}
      <AnimatedCard className="section newsletter-section">
        <div className="newsletter card">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
            Get weekly style drops
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            Subscribe for limited discounts, trend edits, and insider collections.
          </motion.p>
          <motion.form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <input type="email" placeholder="Enter your email" required />
            <motion.button className="btn btn-primary" type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Subscribe
            </motion.button>
          </motion.form>
        </div>
      </AnimatedCard>

      {/* Features */}
      <motion.section
        className="features-row"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {[
          { icon: '✓', title: 'Free Returns', text: '14-day return policy' },
          { icon: '◇', title: 'Premium Quality', text: 'Curated and tested' },
          { icon: '→', title: 'Fast Shipping', text: 'Delivered in 2-5 days' },
          { icon: '★', title: 'Expert Service', text: '24/7 support available' }
        ].map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="feature"
          >
            <div className="feature-icon">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.text}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
