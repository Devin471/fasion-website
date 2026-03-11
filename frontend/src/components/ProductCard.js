/* ─── Product Card — Golden Luxury ─────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);
  const img = product.images?.[0] || 'https://via.placeholder.com/300x380?text=No+Image';
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="pc-img-wrap">
        <Link to={`/product/${product._id}`}>
          <img src={img} alt={product.name} loading="lazy" />
        </Link>
        {discount > 0 && <span className="pc-badge">-{discount}%</span>}
        <button className={`pc-wish ${wishlisted ? 'active' : ''}`}
          onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)}>
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>
      <div className="pc-body">
        <Link to={`/product/${product._id}`} className="pc-name">{product.name}</Link>
        {product.brand && <p className="pc-brand">{product.brand}</p>}
        <div className="pc-price-row">
          <span className="pc-price">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="pc-original">₹{product.originalPrice?.toLocaleString()}</span>
          )}
        </div>
        <div className="pc-rating">
          {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
          <span className="pc-reviews">({product.numReviews || 0})</span>
        </div>
        <button className="pc-add-btn" onClick={() => addToCart(product._id)}>Add to Cart</button>
      </div>
    </div>
  );
}
