/* ─── Product Detail — Golden Luxury ───────────────── */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [tab, setTab] = useState('description');

  useEffect(() => {
    (async () => {
      try {
        const [pr, rv] = await Promise.all([api.get(`/api/products/${id}`), api.get(`/api/reviews/product/${id}`)]);
        setProduct(pr.data);
        setReviews(rv.data);
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  const handleAddToCart = () => { addToCart(product._id, qty); };
  const toggleWish = () => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id);
  const submitReview = async e => {
    e.preventDefault();
    try {
      await api.post('/api/reviews', { productId: product._id, ...reviewForm });
      const rv = await api.get(`/api/reviews/product/${id}`);
      setReviews(rv.data);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch {}
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3><Link to="/shop" className="btn btn-primary">Go to Shop</Link></div>;

  const wishlisted = isInWishlist(product._id);
  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images?.length ? product.images : ['https://via.placeholder.com/600x700?text=No+Image'];

  return (
    <div className="pd-page">
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </div>

      <div className="pd-main">
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={i === selectedImg ? 'active' : ''} onClick={() => setSelectedImg(i)} />
            ))}
          </div>
          <div className="pd-main-img">
            <img src={images[selectedImg]} alt={product.name} />
            {discount > 0 && <span className="pd-discount">-{discount}%</span>}
          </div>
        </div>

        <div className="pd-info">
          {product.brand && <p className="pd-brand">{product.brand}</p>}
          <h1>{product.name}</h1>
          <div className="pd-rating">
            {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
            <span>({product.numReviews || 0} reviews)</span>
          </div>
          <div className="pd-price-row">
            <span className="pd-price">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && <span className="pd-orig">₹{product.originalPrice?.toLocaleString()}</span>}
            {discount > 0 && <span className="pd-save">{discount}% off</span>}
          </div>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-stock">{product.stock > 0 ? <span className="in-stock">✓ In Stock ({product.stock})</span> : <span className="out-stock">✗ Out of Stock</span>}</div>

          <div className="pd-actions">
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock === 0}>Add to Cart</button>
            <button className={`pd-wish-btn ${wishlisted ? 'active' : ''}`} onClick={toggleWish}>{wishlisted ? '♥' : '♡'}</button>
          </div>

          {product.seller && (
            <div className="pd-seller">
              <span>Sold by: </span><strong>{product.seller.businessName || 'MyFashion Seller'}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="pd-tabs">
        <div className="tab-header">
          {['description', 'reviews'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t === 'description' ? 'Description' : `Reviews (${reviews.length})`}</button>
          ))}
        </div>
        <div className="tab-body">
          {tab === 'description' ? (
            <div className="pd-full-desc"><p>{product.description}</p></div>
          ) : (
            <div className="pd-reviews">
              <form className="review-form" onSubmit={submitReview}>
                <h4>Write a Review</h4>
                <div className="form-group">
                  <label>Rating</label>
                  <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: +e.target.value }))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title" />
                </div>
                <div className="form-group">
                  <label>Comment</label>
                  <textarea rows={3} value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} placeholder="Your review..." />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>

              <div className="reviews-list">
                {reviews.length === 0 ? <p className="no-reviews">No reviews yet. Be the first!</p> : reviews.map(r => (
                  <div className="review-card" key={r._id}>
                    <div className="review-top">
                      <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="review-author">{r.user?.name || 'User'}</span>
                    </div>
                    {r.title && <h5>{r.title}</h5>}
                    <p>{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
