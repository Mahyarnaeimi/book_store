const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users/users.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// Addresses
router.get('/addresses', usersController.getAddresses);
router.post('/addresses', usersController.createAddress);
router.put('/addresses/:id', usersController.updateAddress);
router.delete('/addresses/:id', usersController.deleteAddress);
router.put('/addresses/:id/set-default', usersController.setDefaultAddress);

// Wishlist
router.get('/wishlist', usersController.getWishlist);
router.post('/wishlist/add/:productId', usersController.addToWishlist);
router.delete('/wishlist/remove/:productId', usersController.removeFromWishlist);

module.exports = router;
