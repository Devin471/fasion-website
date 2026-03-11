/* ─── Wishlist — Golden Luxury ─────────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <h1>My <span className="gold">Wishlist</span> ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p>Save items you love for later</p>
          <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
