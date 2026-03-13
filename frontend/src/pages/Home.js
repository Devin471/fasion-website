/* Home Page - Premium Fashion Layout */
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
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
          api.get('/products?featured=true&limit=8'),
          api.get('/categories'),
          api.get('/products?sort=newest&limit=8')
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
      <section className="hero">
        <span className="shape shape-star">✦</span>
        <span className="shape shape-circle"></span>
        <span className="shape shape-block"></span>
        <div className="hero-content reveal-item">
          <span className="hero-tag">Modern Fashion Story</span>
          <h1>Discover the new you</h1>
          <p>
            Curated runway-inspired styles in dark, beige, and coral tones.
            Premium fits, elegant textures, and everyday confidence.
          </p>
          <div className="hero-btns">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            <Link to="/shop?sort=newest" className="btn btn-outline">Explore Collection</Link>
          </div>
        </div>
        <div className="hero-gallery reveal-item">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
            alt="Fashion model wearing modern outfit"
            loading="eager"
          />
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"
            alt="Luxury fashion closeup"
            loading="lazy"
          />
        </div>
      </section>

      <section className="section brands-section reveal-item">
        <div className="section-header">
          <h2>Featured Brands</h2>
        </div>
        <div className="brand-strip">
          {['VOGUE.STUDIO', 'NOVA MODE', 'BEIGE LAB', 'CORAL EDIT', 'NOIR THREAD'].map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section reveal-item">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="cat-grid fashion-cats">
            {[
              { label: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80' },
              { label: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80' },
              { label: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=500&q=80' }
            ].map((c) => (
              <Link to={`/shop/${c.slug}`} key={c.label} className="cat-card">
                <img src={c.image} alt={c.label} loading="lazy" />
                <span>{c.label}</span>
                <small>Explore Styles</small>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="section reveal-item">
          <div className="section-header">
            <h2>Trending Picks</h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      <section className="promo-banner reveal-item">
        <div className="promo-content">
          <span className="promo-tag">Style Drop</span>
          <h2>New season silhouettes with signature coral accents</h2>
          <p>Save up to 50% on selected looks this week.</p>
          <Link to="/shop?sort=popular" className="btn btn-primary">Claim the Edit</Link>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="section reveal-item">
          <div className="section-header">
            <h2>Latest Arrivals</h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="product-grid">
            {latest.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      <section className="section tips-section reveal-item">
        <div className="section-header">
          <h2>Style Journal</h2>
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
          ].map((tip) => (
            <article className="tip-card" key={tip.title}>
              <img src={tip.image} alt={tip.title} loading="lazy" />
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section app-section reveal-item">
        <div className="app-promo card">
          <div>
            <span className="promo-tag">Mobile Experience</span>
            <h2>Shop the app. Swipe the look.</h2>
            <p>
              Get early access to drops, one-tap checkout, and curated style feeds.
            </p>
            <div className="hero-btns">
              <button className="btn btn-secondary" type="button">Google Play</button>
              <button className="btn btn-outline" type="button">App Store</button>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=850&q=80"
            alt="Fashion app showcase"
            loading="lazy"
          />
        </div>
      </section>

      <section className="section newsletter-section reveal-item">
        <div className="newsletter card">
          <h2>Get weekly style drops</h2>
          <p>Subscribe for limited discounts, trend edits, and insider collections.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <section className="features-row reveal-item">
        {[
          { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹999' },
          { icon: '🔒', title: 'Secure Payment', desc: 'Bank-grade encrypted checkout' },
          { icon: '↩️', title: 'Easy Returns', desc: 'Hassle-free 7-day return policy' },
          { icon: '💎', title: 'Premium Quality', desc: 'Verified sellers and curated products' }
        ].map((f, i) => (
          <div className="feature-card" key={i}>
            <span className="feature-icon">{f.icon}</span>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
