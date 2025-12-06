const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart/cart.controller');
const { optionalAuth, authenticate } = require('../middlewares/auth.middleware');

router.get('/', optionalAuth, cartController.getCart);
router.post('/add', optionalAuth, cartController.addToCart);
router.put('/update', optionalAuth, cartController.updateCartItem);
router.delete('/remove/:itemId', optionalAuth, cartController.removeFromCart);
router.delete('/clear', optionalAuth, cartController.clearCart);
router.post('/apply-coupon', authenticate, cartController.applyCoupon);

module.exports = router;
