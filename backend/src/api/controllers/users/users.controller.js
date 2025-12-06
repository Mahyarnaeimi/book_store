const { db } = require('../../../models/database.model');

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await db('user_addresses')
      .where({ user_id: req.user.id })
      .orderBy('is_default', 'desc')
      .orderBy('created_at', 'desc');

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const { title, full_name, phone, province, city, postal_code, address, is_default } = req.body;

    if (is_default) {
      await db('user_addresses')
        .where({ user_id: req.user.id })
        .update({ is_default: false });
    }

    const [addressId] = await db('user_addresses').insert({
      user_id: req.user.id,
      title,
      full_name,
      phone,
      province,
      city,
      postal_code,
      address,
      is_default: is_default || false,
    });

    const newAddress = await db('user_addresses').where({ id: addressId }).first();

    res.status(201).json({
      success: true,
      message: 'آدرس اضافه شد',
      data: newAddress,
    });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, full_name, phone, province, city, postal_code, address } = req.body;

    const existingAddress = await db('user_addresses')
      .where({ id, user_id: req.user.id })
      .first();

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'آدرس یافت نشد',
      });
    }

    await db('user_addresses')
      .where({ id })
      .update({
        title,
        full_name,
        phone,
        province,
        city,
        postal_code,
        address,
      });

    const updatedAddress = await db('user_addresses').where({ id }).first();

    res.json({
      success: true,
      message: 'آدرس بروزرسانی شد',
      data: updatedAddress,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingAddress = await db('user_addresses')
      .where({ id, user_id: req.user.id })
      .first();

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'آدرس یافت نشد',
      });
    }

    await db('user_addresses').where({ id }).delete();

    res.json({
      success: true,
      message: 'آدرس حذف شد',
    });
  } catch (error) {
    next(error);
  }
};

const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingAddress = await db('user_addresses')
      .where({ id, user_id: req.user.id })
      .first();

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'آدرس یافت نشد',
      });
    }

    await db('user_addresses')
      .where({ user_id: req.user.id })
      .update({ is_default: false });

    await db('user_addresses')
      .where({ id })
      .update({ is_default: true });

    res.json({
      success: true,
      message: 'آدرس پیش‌فرض تنظیم شد',
    });
  } catch (error) {
    next(error);
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const items = await db('wishlist as w')
      .select(
        'w.*',
        'p.title',
        'p.title_en',
        'p.slug',
        'p.price',
        'p.compare_price',
        'p.discount_percent',
        'p.stock',
        'a.name as author_name'
      )
      .leftJoin('products as p', 'w.product_id', 'p.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .where('w.user_id', req.user.id)
      .orderBy('w.created_at', 'desc');

    const productIds = items.map((i) => i.product_id);
    const images = await db('product_images')
      .whereIn('product_id', productIds)
      .where('is_primary', true);

    const itemsWithImages = items.map((item) => ({
      ...item,
      image_url: images.find((img) => img.product_id === item.product_id)?.image_url || null,
    }));

    res.json({
      success: true,
      data: itemsWithImages,
    });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await db('products')
      .where({ id: productId, is_active: true })
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    const existing = await db('wishlist')
      .where({ user_id: req.user.id, product_id: productId })
      .first();

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'این محصول قبلا به علاقه‌مندی‌ها اضافه شده است',
      });
    }

    await db('wishlist').insert({
      user_id: req.user.id,
      product_id: productId,
    });

    res.status(201).json({
      success: true,
      message: 'به علاقه‌مندی‌ها اضافه شد',
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    await db('wishlist')
      .where({ user_id: req.user.id, product_id: productId })
      .delete();

    res.json({
      success: true,
      message: 'از علاقه‌مندی‌ها حذف شد',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
