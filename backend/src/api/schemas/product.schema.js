const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().min(2).max(255).required().messages({
    'any.required': 'عنوان محصول الزامی است',
  }),
  title_en: Joi.string().max(255).optional().allow(''),
  category_id: Joi.number().integer().optional(),
  author_id: Joi.number().integer().optional(),
  publisher_id: Joi.number().integer().optional(),
  description: Joi.string().optional().allow(''),
  short_description: Joi.string().max(500).optional().allow(''),
  isbn: Joi.string().max(20).optional().allow(''),
  pages: Joi.number().integer().min(1).optional(),
  publish_year: Joi.number().integer().min(1900).max(2100).optional(),
  language: Joi.string().max(20).default('فارسی'),
  translator: Joi.string().max(100).optional().allow(''),
  edition: Joi.string().max(20).optional().allow(''),
  format: Joi.string().valid('hardcover', 'paperback', 'ebook').default('paperback'),
  price: Joi.number().min(0).required().messages({
    'any.required': 'قیمت الزامی است',
  }),
  compare_price: Joi.number().min(0).optional(),
  discount_percent: Joi.number().min(0).max(100).default(0),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().max(50).optional().allow(''),
  weight: Joi.number().integer().min(0).optional(),
  meta_title: Joi.string().max(255).optional().allow(''),
  meta_description: Joi.string().max(500).optional().allow(''),
  is_active: Joi.boolean().default(true),
  is_featured: Joi.boolean().default(false),
  is_bestseller: Joi.boolean().default(false),
});

const updateProductSchema = createProductSchema.fork(
  ['title', 'price'],
  (schema) => schema.optional()
);

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  sort: Joi.string().valid('newest', 'oldest', 'price_asc', 'price_desc', 'bestseller', 'popular').default('newest'),
  category: Joi.number().integer().optional(),
  author: Joi.number().integer().optional(),
  publisher: Joi.number().integer().optional(),
  min_price: Joi.number().min(0).optional(),
  max_price: Joi.number().min(0).optional(),
  in_stock: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  bestseller: Joi.boolean().optional(),
  search: Joi.string().max(100).optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
};
