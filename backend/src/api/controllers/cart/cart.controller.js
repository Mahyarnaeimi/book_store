const { db } = require('../../../models/database.model');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    let query = db('cart_items as ci')
      .select(
        'ci.*',
        'p.title',
        'p.title_en',
        'p.slug',
        'p.price',
        'p.compare_price',
        'p.discount_percent',
        'p.stock',
        'a.name as author_name'
      )
      .leftJoin('products as p', 'ci.product_id', 'p.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id');

    if (userId) {
      query = query.where('ci.user_id', userId);
    } else if (sessionId) {
      query = query.where('ci.session_id', sessionId);
    } else {
      return res.json({
        success: true,
        data: {
          items: [],
          summary: {
            subtotal: 0,
            discount: 0,
            total: 0,
            item_count: 0,
          },
        },
      });
    }

    const items = await query;

    const productIds = items.map((i) => i.product_id);
    const images = await db('product_images')
      .whereIn('product_id', productIds)
      .where('is_primary', true);

    const itemsWithImages = items.map((item) => ({
      ...item,
      image_url: images.find((img) => img.product_id === item.product_id)?.image_url || null,
      line_total: item.price * item.quantity,
    }));

    const subtotal = itemsWithImages.reduce((sum, item) => sum + item.line_total, 0);
    const discount = itemsWithImages.reduce((sum, item) => {
      const originalPrice = item.compare_price || item.price;
      return sum + (originalPrice - item.price) * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        items: itemsWithImages,
        summary: {
          subtotal,
          discount,
          total: subtotal,
          item_count: items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'نیاز به شناسه نشست یا ورود به حساب کاربری',
      });
    }

    const product = await db('products')
      .where({ id: product_id, is_active: true })
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'موجودی کافی نیست',
      });
    }

    const existingItem = await db('cart_items')
      .where((builder) => {
        if (userId) builder.where('user_id', userId);
        else builder.where('session_id', sessionId);
      })
      .where('product_id', product_id)
      .first();

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'موجودی کافی نیست',
        });
      }

      await db('cart_items')
        .where({ id: existingItem.id })
        .update({ quantity: newQuantity });
    } else {
      await db('cart_items').insert({
        user_id: userId || null,
        session_id: userId ? null : sessionId,
        product_id,
        quantity,
      });
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (quantity < 1) {
      return removeFromCart(req, res, next);
    }

    const product = await db('products')
      .where({ id: product_id, is_active: true })
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'موجودی کافی نیست',
      });
    }

    await db('cart_items')
      .where((builder) => {
        if (userId) builder.where('user_id', userId);
        else builder.where('session_id', sessionId);
      })
      .where('product_id', product_id)
      .update({ quantity });

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    await db('cart_items')
      .where((builder) => {
        if (userId) builder.where('user_id', userId);
        else builder.where('session_id', sessionId);
      })
      .where('product_id', itemId)
      .delete();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    await db('cart_items')
      .where((builder) => {
        if (userId) builder.where('user_id', userId);
        else builder.where('session_id', sessionId);
      })
      .delete();

    res.json({
      success: true,
      message: 'سبد خرید خالی شد',
      data: {
        items: [],
        summary: {
          subtotal: 0,
          discount: 0,
          total: 0,
          item_count: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    const coupon = await db('coupons')
      .where({ code, is_active: true })
      .where('start_date', '<=', db.fn.now())
      .where('end_date', '>=', db.fn.now())
      .first();

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'کد تخفیف نامعتبر یا منقضی شده است',
      });
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'ظرفیت استفاده از این کد تخفیف تکمیل شده است',
      });
    }

    if (userId && coupon.per_user_limit) {
      const userUsage = await db('coupon_usage')
        .where({ coupon_id: coupon.id, user_id: userId })
        .count('id as count')
        .first();

      if (userUsage.count >= coupon.per_user_limit) {
        return res.status(400).json({
          success: false,
          message: 'شما قبلا از این کد تخفیف استفاده کرده‌اید',
        });
      }
    }

    res.json({
      success: true,
      message: 'کد تخفیف اعمال شد',
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          min_purchase: coupon.min_purchase,
          max_discount: coupon.max_discount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
};
