const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories/categories.controller');

router.get('/', categoriesController.getCategories);
router.get('/slug/:slug', categoriesController.getCategoryBySlug);
router.get('/:id', categoriesController.getCategoryById);
router.get('/:id/subcategories', categoriesController.getSubcategories);

module.exports = router;
