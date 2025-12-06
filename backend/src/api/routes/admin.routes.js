const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/sales', adminController.getSalesReport);
router.get('/dashboard/recent-orders', adminController.getRecentOrders);

// Products
router.get('/products', adminController.getAdminProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.put('/products/:id/stock', adminController.updateProductStock);

// Categories
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Orders
router.get('/orders', adminController.getAdminOrders);
router.get('/orders/:id', adminController.getAdminOrderById);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/tracking', adminController.addTrackingCode);

// Users
router.get('/users', adminController.getAdminUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/role', adminController.updateUserRole);

// Coupons
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Sliders
router.get('/sliders', adminController.getSliders);
router.post('/sliders', adminController.createSlider);
router.put('/sliders/:id', adminController.updateSlider);
router.delete('/sliders/:id', adminController.deleteSlider);

module.exports = router;
