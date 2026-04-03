import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, isAdmin, onDelete, onEdit }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isCustomer } = useAuth();

  const handleAddToCart = () => {
    if (!isCustomer) {
      navigate('/login');
      return;
    }
    addToCart(product._id, 1);
  };

  const handleClick = onAddToCart ? () => onAddToCart(product) : handleAddToCart;

  return (
    <div className="product-card">
      <img src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.designer_name && (
          <p className="product-designer">Designer: {product.designer_name}</p>
        )}
        <p className="product-category">{product.category?.name || product.category}</p>
        <p className="product-description">{product.description}</p>
        {product.designer_bio && (
          <p className="product-designer-bio">{product.designer_bio}</p>
        )}
        <p className="product-price">₹{product.price}</p>
        <p className="product-stock">Stock: {product.stock}</p>
        {!isAdmin ? (
          <button 
            className="product-button"
            onClick={handleClick}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        ) : (
          <div className="admin-actions">
            <button className="edit-btn" onClick={() => onEdit(product)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
