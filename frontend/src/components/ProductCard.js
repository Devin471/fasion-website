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

  const handleAddToCart = async () => {
    try {
      if (!isCustomer) {
        console.log('Not logged in, redirecting to login');
        navigate('/login');
        return;
      }
      if (!product._id) {
        console.error('Product ID missing:', product);
        return;
      }
      console.log('Adding to cart:', product._id);
      const result = await addToCart(product._id, 1);
      console.log('Add to cart result:', result);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!isCustomer) {
        console.log('Not logged in, redirecting to login');
        navigate('/login');
        return;
      }
      if (product.stock <= 0) {
        console.warn('Product out of stock');
        return;
      }
      if (!product._id) {
        console.error('Product ID missing:', product);
        return;
      }
      console.log('Buy now - adding to cart:', product._id);
      await addToCart(product._id, 1);
      console.log('Product added, navigating to checkout');
      setTimeout(() => navigate('/checkout'), 500);
    } catch (error) {
      console.error('Buy now error:', error);
    }
  };

  const handleClick = async () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      await handleAddToCart();
    }
  };

  const handleImageClick = () => {
    navigate(`/product/${product._id}`);
  };

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
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
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
          <motion.div
            className="product-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button
              type="button"
              className="product-button add-to-cart-btn"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(); }}
              disabled={product.stock === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>
            <motion.button
              type="button"
              className="product-button buy-now-btn"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBuyNow(); }}
              disabled={product.stock === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              Buy Now
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="admin-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              type="button"
              className="edit-btn"
              onClick={() => onEdit(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit
            </motion.button>
            <motion.button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(product._id)}
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
