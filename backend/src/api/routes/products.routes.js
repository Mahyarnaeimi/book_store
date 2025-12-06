const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products/products.controller');
const { validateQuery } = require('../middlewares/validate.middleware');
const { productQuerySchema } = require('../schemas/product.schema');

router.get('/', validateQuery(productQuerySchema), productsController.getProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/bestsellers', productsController.getBestsellers);
router.get('/new-arrivals', productsController.getNewArrivals);
router.get('/search', productsController.searchProducts);
router.get('/category/:categoryId', productsController.getProductsByCategory);
router.get('/slug/:slug', productsController.getProductBySlug);
router.get('/:id', productsController.getProductById);

module.exports = router;
