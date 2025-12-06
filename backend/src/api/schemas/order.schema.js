const Joi = require('joi');

const createOrderSchema = Joi.object({
  address_id: Joi.number().integer().required().messages({
    'any.required': 'آدرس الزامی است',
  }),
  shipping_method: Joi.string().max(50).default('standard'),
  coupon_code: Joi.string().max(50).optional().allow(''),
  customer_note: Joi.string().max(500).optional().allow(''),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    .required()
    .messages({
      'any.required': 'وضعیت الزامی است',
    }),
  admin_note: Joi.string().max(500).optional().allow(''),
});

const addTrackingSchema = Joi.object({
  tracking_code: Joi.string().max(100).required().messages({
    'any.required': 'کد پیگیری الزامی است',
  }),
});

const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').optional(),
  payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional(),
  from_date: Joi.date().optional(),
  to_date: Joi.date().optional(),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  addTrackingSchema,
  orderQuerySchema,
};
