/* ─── Home Page — Golden Luxury ────────────────────── */
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
    (async () => {
      try {
        const [fp, cp, lp] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/categories'),
          api.get('/products?sort=newest&limit=8')
        ]);
        setFeatured(fp.data.products || fp.data);
        setCategories(cp.data);
        setLatest(lp.data.products || lp.data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">✦ Premium Marketplace</span>
          <h1>Discover <span className="gold">Luxury</span> Products</h1>
          <p>Shop from thousands of verified sellers. Premium quality, unbeatable prices.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn btn-primary">Explore Shop</Link>
            <Link to="/seller/register" className="btn btn-outline">Start Selling</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow"></div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Shop by <span className="gold">Category</span></h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="cat-grid">
            {categories.map(c => (
              <Link to={`/shop/${c.slug}`} key={c._id} className="cat-card">
                <div className="cat-icon">{c.image ? <img src={c.image} alt={c.name} /> : '📦'}</div>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Featured <span className="gold">Products</span></h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <span className="promo-tag">Limited Offer</span>
          <h2>Up to <span className="gold">50% Off</span> on Premium Brands</h2>
          <p>Exclusive deals on luxury fashion, electronics and more.</p>
          <Link to="/shop" className="btn btn-primary">Shop Now</Link>
        </div>
      </section>

      {/* Latest */}
      {latest.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>New <span className="gold">Arrivals</span></h2>
            <Link to="/shop" className="see-all">View All →</Link>
          </div>
          <div className="product-grid">
            {latest.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="features-row">
        {[
          { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹999' },
          { icon: '🔒', title: 'Secure Payment', desc: '100% protected checkout' },
          { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
          { icon: '💎', title: 'Premium Quality', desc: 'Verified sellers only' },
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
