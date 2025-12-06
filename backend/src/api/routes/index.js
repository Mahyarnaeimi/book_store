const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productsRoutes = require('./products.routes');
const categoriesRoutes = require('./categories.routes');
const cartRoutes = require('./cart.routes');
const ordersRoutes = require('./orders.routes');
const usersRoutes = require('./users.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
