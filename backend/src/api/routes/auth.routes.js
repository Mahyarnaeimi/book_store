const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} = require('../schemas/auth.schema');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, validate(updateProfileSchema), authController.updateMe);

module.exports = router;
