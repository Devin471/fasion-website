/* ═══════════════════════════════════════════════════════
   Seed Script — Populates MongoDB with demo data
   Run: node seed.js
   ═══════════════════════════════════════════════════════ */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User     = require('./models/User');
const Seller   = require('./models/Seller');
const Admin    = require('./models/Admin');
const Category = require('./models/Category');
const Product  = require('./models/Product');

async function seed() {
  await connectDB();
  console.log('🧹 Clearing collections...');
  await Promise.all([User.deleteMany(), Seller.deleteMany(), Admin.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

  /* ── Admin ── */
  const admin = await Admin.create({ name: 'Admin', email: 'devintyai471@gmail.com', password: 'Terabaapadmin@471' });
  console.log('✅ Admin created');

  /* ── Customer ── */
  const customer = await User.create({ name: 'John Customer', email: 'customer@test.com', password: 'customer123', phone: '9876543210' });
  console.log('✅ Customer created');

  /* ── Sellers ── */
  const seller1 = await Seller.create({ name: 'Ravi Fashion', email: 'seller1@test.com', password: 'seller123', businessName: 'Ravi Fashion House', description: 'Premium fashion clothing', phone: '9111111111', status: 'approved' });
  const seller2 = await Seller.create({ name: 'Style Studio', email: 'seller2@test.com', password: 'seller123', businessName: 'Style Studio India', description: 'Trendy western wear', phone: '9222222222', status: 'approved' });
  const seller3 = await Seller.create({ name: 'Ethnic Elegance', email: 'seller3@test.com', password: 'seller123', businessName: 'Ethnic Elegance', description: 'Traditional Indian wear', phone: '9333333333', status: 'pending' });
  console.log('✅ Sellers created');

  /* ── Categories ── */
  const cats = await Category.insertMany([
    { name: 'Men\'s Fashion',    slug: 'mens-fashion',    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400' },
    { name: 'Women\'s Fashion',  slug: 'womens-fashion',  image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400' },
    { name: 'Kids Wear',         slug: 'kids-wear',       image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400' },
    { name: 'Footwear',          slug: 'footwear',        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Accessories',       slug: 'accessories',     image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=400' },
    { name: 'Winter Collection', slug: 'winter',          image: 'https://images.unsplash.com/photo-1544923246-77307dd270b3?w=400' },
    { name: 'Ethnic Wear',       slug: 'ethnic-wear',     image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
    { name: 'Sports & Active',   slug: 'sports-active',   image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }
  ]);
  console.log('✅ Categories created');

  /* ── Products ── */
  const products = [
    { name: 'Classic Fit Oxford Shirt', slug: 'classic-fit-oxford-shirt', description: 'Premium cotton oxford shirt with a timeless fit. Perfect for both casual and semi-formal occasions.', price: 1, originalPrice: 2499, discount: 99, category: cats[0]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'], brand: 'Raymond', stock: 50, rating: 4.5, numReviews: 23, sizes: ['S','M','L','XL'], colors: ['White','Blue','Pink'], isFeatured: true },
    { name: 'Slim Fit Chino Trousers', slug: 'slim-fit-chino-trousers', description: 'Comfortable slim-fit chinos with stretch fabric.', price: 999, originalPrice: 1999, discount: 50, category: cats[0]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'], brand: 'Allen Solly', stock: 40, rating: 4.2, numReviews: 15, sizes: ['30','32','34','36'], colors: ['Beige','Navy','Black'], isFeatured: true },
    { name: 'Floral Print Maxi Dress', slug: 'floral-print-maxi-dress', description: 'Elegant floral maxi dress in flowing fabric. Ideal for summer outings.', price: 1799, originalPrice: 3299, discount: 45, category: cats[1]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'], brand: 'W', stock: 30, rating: 4.7, numReviews: 31, sizes: ['XS','S','M','L'], colors: ['Floral Blue','Floral Red'], isFeatured: true },
    { name: 'Embroidered Anarkali Suit', slug: 'embroidered-anarkali-suit', description: 'Gorgeously embroidered anarkali with dupatta.', price: 3499, originalPrice: 5999, discount: 42, category: cats[6]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'], brand: 'BIBA', stock: 20, rating: 4.8, numReviews: 44, sizes: ['S','M','L','XL'], colors: ['Maroon','Navy'], isFeatured: true },
    { name: 'Kids Rainbow T-Shirt Set', slug: 'kids-rainbow-tshirt', description: 'Colorful cotton t-shirt pack for kids.', price: 599, originalPrice: 999, discount: 40, category: cats[2]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500'], brand: 'Max Kids', stock: 60, rating: 4.3, numReviews: 12, sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'], colors: ['Multi'] },
    { name: 'Running Sport Shoes', slug: 'running-sport-shoes', description: 'Lightweight running shoes with memory foam insole.', price: 2499, originalPrice: 4499, discount: 44, category: cats[3]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], brand: 'Nike', stock: 35, rating: 4.6, numReviews: 56, sizes: ['7','8','9','10','11'], colors: ['Red/Black','Blue/White'], isFeatured: true },
    { name: 'Leather Crossbody Bag', slug: 'leather-crossbody-bag', description: 'Genuine leather crossbody bag with adjustable strap.', price: 1899, originalPrice: 3499, discount: 46, category: cats[4]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=500'], brand: 'Hidesign', stock: 25, rating: 4.4, numReviews: 18, sizes: ['One Size'], colors: ['Brown','Black','Tan'] },
    { name: 'Wool Blend Winter Jacket', slug: 'wool-blend-winter-jacket', description: 'Warm wool blend jacket perfect for winter.', price: 3999, originalPrice: 6999, discount: 43, category: cats[5]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1544923246-77307dd270b3?w=500'], brand: 'Woodland', stock: 15, rating: 4.5, numReviews: 22, sizes: ['M','L','XL','XXL'], colors: ['Charcoal','Navy'] },
    { name: 'Yoga Performance Tights', slug: 'yoga-performance-tights', description: 'High-waist yoga tights with moisture-wicking fabric.', price: 899, originalPrice: 1699, discount: 47, category: cats[7]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'], brand: 'HRX', stock: 45, rating: 4.1, numReviews: 9, sizes: ['XS','S','M','L'], colors: ['Black','Navy','Teal'] },
    { name: 'Designer Silk Saree', slug: 'designer-silk-saree', description: 'Pure silk saree with golden zari border.', price: 5999, originalPrice: 9999, discount: 40, category: cats[6]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'], brand: 'FabIndia', stock: 10, rating: 4.9, numReviews: 67, sizes: ['Free Size'], colors: ['Red/Gold','Blue/Gold'], isFeatured: true },
    { name: 'Printed Casual Shirt', slug: 'printed-casual-shirt', description: 'Trendy printed shirt for casual days.', price: 799, originalPrice: 1499, discount: 47, category: cats[0]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'], brand: 'USPA', stock: 55, rating: 4.0, numReviews: 8, sizes: ['S','M','L','XL'], colors: ['Print A','Print B'] },
    { name: 'Knee-Length Formal Dress', slug: 'knee-length-formal-dress', description: 'Elegant formal dress suitable for office and events.', price: 2299, originalPrice: 3999, discount: 42, category: cats[1]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'], brand: 'Vero Moda', stock: 22, rating: 4.3, numReviews: 14, sizes: ['XS','S','M','L'], colors: ['Black','Wine'] },
    { name: 'Kids Denim Jacket', slug: 'kids-denim-jacket', description: 'Cute denim jacket for kids, perfect for layering.', price: 899, originalPrice: 1599, discount: 44, category: cats[2]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500'], brand: 'UCB Kids', stock: 35, rating: 4.5, numReviews: 11, sizes: ['3-4Y','5-6Y','7-8Y'], colors: ['Blue','Black'] },
    { name: 'Canvas Sneakers', slug: 'canvas-sneakers', description: 'Classic canvas sneakers for everyday style.', price: 1499, originalPrice: 2499, discount: 40, category: cats[3]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], brand: 'Converse', stock: 40, rating: 4.4, numReviews: 33, sizes: ['6','7','8','9','10'], colors: ['White','Black','Navy'] },
    { name: 'Aviator Sunglasses', slug: 'aviator-sunglasses', description: 'UV-protected aviator sunglasses with metal frame.', price: 699, originalPrice: 1299, discount: 46, category: cats[4]._id, seller: seller2._id, images: ['https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=500'], brand: 'Ray-Ban', stock: 50, rating: 4.6, numReviews: 28, sizes: ['One Size'], colors: ['Gold/Green','Silver/Blue'] },
    { name: 'Puffer Down Vest', slug: 'puffer-down-vest', description: 'Lightweight puffer vest for transitional weather.', price: 2499, originalPrice: 4499, discount: 44, category: cats[5]._id, seller: seller1._id, images: ['https://images.unsplash.com/photo-1544923246-77307dd270b3?w=500'], brand: 'Decathlon', stock: 18, rating: 4.2, numReviews: 7, sizes: ['S','M','L','XL'], colors: ['Red','Black','Olive'] }
  ];
  await Product.insertMany(products);
  console.log('✅ Products created');

  console.log('\n🎉 Seed complete! Credentials:');
  console.log('   Customer: customer@test.com / customer123');
  console.log('   Seller:   seller1@test.com  / seller123');
  console.log('   Admin:    devintyai471@gmail.com / Terabaapadmin@471\n');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
