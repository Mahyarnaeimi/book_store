const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'ایمیل نامعتبر است',
      'any.required': 'ایمیل الزامی است',
    }),
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
      'any.required': 'رمز عبور الزامی است',
    }),
  first_name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'نام باید حداقل ۲ کاراکتر باشد',
      'any.required': 'نام الزامی است',
    }),
  last_name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'نام خانوادگی باید حداقل ۲ کاراکتر باشد',
      'any.required': 'نام خانوادگی الزامی است',
    }),
  phone: Joi.string()
    .pattern(/^09\d{9}$/)
    .optional()
    .messages({
      'string.pattern.base': 'شماره موبایل نامعتبر است',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'ایمیل نامعتبر است',
      'any.required': 'ایمیل الزامی است',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'رمز عبور الزامی است',
    }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'ایمیل نامعتبر است',
      'any.required': 'ایمیل الزامی است',
    }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'توکن الزامی است',
    }),
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
      'any.required': 'رمز عبور الزامی است',
    }),
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^09\d{9}$/).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
};
