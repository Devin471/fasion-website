import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
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
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="product-image-container"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'} 
          alt={product.name} 
          className="product-image"
        />
      </motion.div>
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
          <motion.button
            className="product-button"
            onClick={handleClick}
            disabled={product.stock === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        ) : (
          <motion.div
            className="admin-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              className="edit-btn"
              onClick={() => onEdit(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit
            </motion.button>
            <motion.button
              className="delete-btn"
              onClick={() => onDelete(product.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash /> Delete
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard;
