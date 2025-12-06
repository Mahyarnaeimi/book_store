const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders/orders.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate, validateQuery } = require('../middlewares/validate.middleware');
const { createOrderSchema, orderQuerySchema } = require('../schemas/order.schema');

router.use(authenticate);

router.post('/', validate(createOrderSchema), ordersController.createOrder);
router.get('/', validateQuery(orderQuerySchema), ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);
router.get('/:id/track', ordersController.trackOrder);
router.post('/:id/cancel', ordersController.cancelOrder);

module.exports = router;
