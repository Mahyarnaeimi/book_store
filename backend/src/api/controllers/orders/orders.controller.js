const { db } = require('../../../models/database.model');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
};

const createOrder = async (req, res, next) => {
  try {
    const { address_id, shipping_method = 'standard', coupon_code, customer_note } = req.body;
    const userId = req.user.id;

    const address = await db('user_addresses')
      .where({ id: address_id, user_id: userId })
      .first();

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'آدرس یافت نشد',
      });
    }

    const cartItems = await db('cart_items as ci')
      .select('ci.*', 'p.title', 'p.price', 'p.stock')
      .leftJoin('products as p', 'ci.product_id', 'p.id')
      .where('ci.user_id', userId);

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'سبد خرید خالی است',
      });
    }

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `موجودی ${item.title} کافی نیست`,
        });
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping_cost = shipping_method === 'express' ? 50000 : 25000;
    let discount_amount = 0;
    let coupon = null;

    if (coupon_code) {
      coupon = await db('coupons')
        .where({ code: coupon_code, is_active: true })
        .where('start_date', '<=', db.fn.now())
        .where('end_date', '>=', db.fn.now())
        .first();

      if (coupon && subtotal >= coupon.min_purchase) {
        if (coupon.type === 'percentage') {
          discount_amount = Math.floor(subtotal * (coupon.value / 100));
          if (coupon.max_discount && discount_amount > coupon.max_discount) {
            discount_amount = coupon.max_discount;
          }
        } else {
          discount_amount = coupon.value;
        }
      }
    }

    const total_amount = subtotal + shipping_cost - discount_amount;

    const images = await db('product_images')
      .whereIn('product_id', cartItems.map((i) => i.product_id))
      .where('is_primary', true);

    const [orderId] = await db('orders').insert({
      order_number: generateOrderNumber(),
      user_id: userId,
      shipping_name: address.full_name,
      shipping_phone: address.phone,
      shipping_province: address.province,
      shipping_city: address.city,
      shipping_postal_code: address.postal_code,
      shipping_address: address.address,
      subtotal,
      shipping_cost,
      discount_amount,
      tax_amount: 0,
      total_amount,
      coupon_id: coupon?.id || null,
      coupon_code: coupon?.code || null,
      status: 'pending',
      payment_status: 'pending',
      shipping_method,
      customer_note,
    });

    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_title: item.title,
      product_image: images.find((img) => img.product_id === item.product_id)?.image_url || null,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    await db('order_items').insert(orderItems);

    for (const item of cartItems) {
      await db('products')
        .where({ id: item.product_id })
        .decrement('stock', item.quantity)
        .increment('sales_count', item.quantity);
    }

    await db('cart_items').where({ user_id: userId }).delete();

    if (coupon) {
      await db('coupons').where({ id: coupon.id }).increment('used_count', 1);
      await db('coupon_usage').insert({
        coupon_id: coupon.id,
        user_id: userId,
        order_id: orderId,
      });
    }

    const order = await db('orders').where({ id: orderId }).first();

    res.status(201).json({
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db('orders').where({ user_id: userId });

    if (status) {
      query = query.where({ status });
    }

    const [{ count }] = await query.clone().count('id as count');
    const totalItems = parseInt(count);
    const totalPages = Math.ceil(totalItems / limit);

    const orders = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems,
          totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await db('orders')
      .where({ id, user_id: userId })
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد',
      });
    }

    const items = await db('order_items').where({ order_id: id });

    res.json({
      success: true,
      data: {
        ...order,
        items,
      },
    });
  } catch (error) {
    next(error);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await db('orders')
      .select('id', 'order_number', 'status', 'payment_status', 'tracking_code', 'shipped_at', 'delivered_at', 'created_at')
      .where({ id, user_id: userId })
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await db('orders')
      .where({ id, user_id: userId })
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد',
      });
    }

    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'امکان لغو این سفارش وجود ندارد',
      });
    }

    const items = await db('order_items').where({ order_id: id });
    for (const item of items) {
      await db('products')
        .where({ id: item.product_id })
        .increment('stock', item.quantity)
        .decrement('sales_count', item.quantity);
    }

    await db('orders')
      .where({ id })
      .update({ status: 'cancelled', updated_at: db.fn.now() });

    res.json({
      success: true,
      message: 'سفارش لغو شد',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
};
