/* ─── Search Results — Golden Luxury ───────────────── */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setProducts([]); setLoading(false); return; }
    (async () => {
      setLoading(true);
      try { const { data } = await api.get(`/products?search=${encodeURIComponent(q)}`); setProducts(data.products || data); }
      catch {}
      setLoading(false);
    })();
  }, [q]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Search results for "<span className="gold">{q}</span>"</h2>
        <p>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      </div>
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>Try different keywords or browse our shop</p>
          <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
        </div>
      ) : (
        <div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
      )}
    </div>
  );
}
