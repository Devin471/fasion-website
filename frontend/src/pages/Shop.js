/* ─── Shop Page — Golden Luxury ────────────────────── */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Shop.css';

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
  });
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => { api.get('/api/categories').then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', page); params.set('limit', 12); params.set('sort', filters.sort);
        if (category) params.set('category', category);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.brand) params.set('brand', filters.brand);
        if (filters.size) params.set('size', filters.size);
        if (filters.color) params.set('color', filters.color);
        const { data } = await api.get(`/api/products?${params}`);
        setProducts(data.products || data);
        setTotal(data.total || 0);
      } catch {}
      setLoading(false);
    })();
  }, [category, page, filters]);

  const setPage = p => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); };

  return (
    <div className="shop-page">
      <aside className="shop-sidebar">
        <h3>Filters & Categories</h3>
        <div className="filter-group">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/shop" className={!category ? 'active' : ''}>All</Link></li>
            <li><Link to="/shop/women" className={category === 'women' ? 'active' : ''}>Women</Link></li>
            <li><Link to="/shop/men" className={category === 'men' ? 'active' : ''}>Men</Link></li>
            <li><Link to="/shop/kids" className={category === 'kids' ? 'active' : ''}>Kids</Link></li>
            {categories.map(c => (
              <li key={c._id}><Link to={`/shop/${c.slug}`} className={category === c.slug ? 'active' : ''}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input placeholder="Min" type="number" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
            <span>–</span>
            <input placeholder="Max" type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
          </div>
        </div>
        <div className="filter-group">
          <h4>Brand</h4>
          <input className="brand-input" placeholder="Search brand" value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} />
        </div>
        <div className="filter-group">
          <h4>Size</h4>
          <div className="chip-row">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                type="button"
                className={`filter-chip ${filters.size === size ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, size: f.size === size ? '' : size }))}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <h4>Color</h4>
          <div className="chip-row">
            {['Black', 'White', 'Beige', 'Blue', 'Red'].map((color) => (
              <button
                key={color}
                type="button"
                className={`filter-chip ${filters.color === color ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, color: f.color === color ? '' : color }))}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="shop-main">
        <div className="shop-topbar">
          <div>
            <h2>{category ? `${category[0].toUpperCase()}${category.slice(1)}` : 'All Products'}</h2>
            <p className="shop-count">{total} products found</p>
          </div>
          <div className="shop-sort">
            <label htmlFor="shop-sort">Sort by</label>
            <select id="shop-sort" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Popularity</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state"><h3>No products found</h3><p>Try adjusting your filters</p></div>
        ) : (
          <>
            <div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
            {total > 12 && (
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                <span>Page {page} of {Math.ceil(total / 12)}</span>
                <button disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
