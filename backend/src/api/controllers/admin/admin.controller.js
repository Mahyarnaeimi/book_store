const { v4: uuidv4 } = require('uuid');
const { db } = require('../../../models/database.model');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalSales] = await db('orders')
      .where('payment_status', 'paid')
      .sum('total_amount as total');

    const [todaySales] = await db('orders')
      .where('payment_status', 'paid')
      .where('created_at', '>=', today)
      .sum('total_amount as total');

    const [totalOrders] = await db('orders').count('id as count');
    const [pendingOrders] = await db('orders').where('status', 'pending').count('id as count');
    const [totalUsers] = await db('users').where('role', 'customer').count('id as count');
    const [totalProducts] = await db('products').count('id as count');
    const [lowStockProducts] = await db('products').where('stock', '<', 10).count('id as count');

    res.json({
      success: true,
      data: {
        totalSales: totalSales.total || 0,
        todaySales: todaySales.total || 0,
        totalOrders: totalOrders.count,
        pendingOrders: pendingOrders.count,
        totalUsers: totalUsers.count,
        totalProducts: totalProducts.count,
        lowStockProducts: lowStockProducts.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSalesReport = async (req, res, next) => {
  try {
    const { period = '7days' } = req.query;

    let days = 7;
    if (period === '30days') days = 30;
    if (period === '90days') days = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await db('orders')
      .select(db.raw('DATE(created_at) as date'))
      .sum('total_amount as total')
      .count('id as orders')
      .where('payment_status', 'paid')
      .where('created_at', '>=', startDate)
      .groupByRaw('DATE(created_at)')
      .orderBy('date');

    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await db('orders as o')
      .select(
        'o.*',
        'u.first_name',
        'u.last_name',
        'u.email'
      )
      .leftJoin('users as u', 'o.user_id', 'u.id')
      .orderBy('o.created_at', 'desc')
      .limit(10);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Products Management
const getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'a.name as author_name',
        'pub.name as publisher_name'
      )
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .leftJoin('publishers as pub', 'p.publisher_id', 'pub.id');

    if (search) {
      query = query.where((builder) => {
        builder
          .where('p.title', 'like', `%${search}%`)
          .orWhere('p.sku', 'like', `%${search}%`);
      });
    }

    if (category) query = query.where('p.category_id', category);
    if (status === 'active') query = query.where('p.is_active', true);
    if (status === 'inactive') query = query.where('p.is_active', false);
    if (status === 'low_stock') query = query.where('p.stock', '<', 10);

    const [{ count }] = await query.clone().count('p.id as count');

    const products = await query
      .orderBy('p.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: parseInt(count),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const data = req.body;

    const slug = slugify(data.title) + '-' + Date.now().toString().slice(-4);

    const [productId] = await db('products').insert({
      ugid: uuidv4(),
      ...data,
      slug,
    });

    const product = await db('products').where({ id: productId }).first();

    res.status(201).json({
      success: true,
      message: 'محصول ایجاد شد',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await db('products').where({ id }).first();
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    await db('products')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });

    const product = await db('products').where({ id }).first();

    res.json({
      success: true,
      message: 'محصول بروزرسانی شد',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db('products').where({ id }).delete();

    res.json({
      success: true,
      message: 'محصول حذف شد',
    });
  } catch (error) {
    next(error);
  }
};

const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    await db('products')
      .where({ id })
      .update({ stock, updated_at: db.fn.now() });

    res.json({
      success: true,
      message: 'موجودی بروزرسانی شد',
    });
  } catch (error) {
    next(error);
  }
};

// Categories Management
const createCategory = async (req, res, next) => {
  try {
    const { name, name_en, parent_id, description, icon, sort_order } = req.body;

    const slug = slugify(name_en || name) + '-' + Date.now().toString().slice(-4);

    const [categoryId] = await db('categories').insert({
      name,
      name_en,
      slug,
      parent_id: parent_id || null,
      description,
      icon,
      sort_order: sort_order || 0,
      is_active: true,
    });

    const category = await db('categories').where({ id: categoryId }).first();

    res.status(201).json({
      success: true,
      message: 'دسته‌بندی ایجاد شد',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, name_en, parent_id, description, icon, sort_order, is_active } = req.body;

    await db('categories')
      .where({ id })
      .update({
        name,
        name_en,
        parent_id,
        description,
        icon,
        sort_order,
        is_active,
      });

    const category = await db('categories').where({ id }).first();

    res.json({
      success: true,
      message: 'دسته‌بندی بروزرسانی شد',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hasProducts = await db('products').where({ category_id: id }).first();
    if (hasProducts) {
      return res.status(400).json({
        success: false,
        message: 'این دسته‌بندی دارای محصول است و قابل حذف نیست',
      });
    }

    const hasChildren = await db('categories').where({ parent_id: id }).first();
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message: 'این دسته‌بندی دارای زیردسته است و قابل حذف نیست',
      });
    }

    await db('categories').where({ id }).delete();

    res.json({
      success: true,
      message: 'دسته‌بندی حذف شد',
    });
  } catch (error) {
    next(error);
  }
};

// Orders Management
const getAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, payment_status, from_date, to_date } = req.query;
    const offset = (page - 1) * limit;

    let query = db('orders as o')
      .select(
        'o.*',
        'u.first_name',
        'u.last_name',
        'u.email'
      )
      .leftJoin('users as u', 'o.user_id', 'u.id');

    if (status) query = query.where('o.status', status);
    if (payment_status) query = query.where('o.payment_status', payment_status);
    if (from_date) query = query.where('o.created_at', '>=', from_date);
    if (to_date) query = query.where('o.created_at', '<=', to_date);

    const [{ count }] = await query.clone().count('o.id as count');

    const orders = await query
      .orderBy('o.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: parseInt(count),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await db('orders as o')
      .select(
        'o.*',
        'u.first_name',
        'u.last_name',
        'u.email',
        'u.phone as user_phone'
      )
      .leftJoin('users as u', 'o.user_id', 'u.id')
      .where('o.id', id)
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;

    const updates = {
      status,
      updated_at: db.fn.now(),
    };

    if (admin_note) updates.admin_note = admin_note;
    if (status === 'shipped') updates.shipped_at = db.fn.now();
    if (status === 'delivered') updates.delivered_at = db.fn.now();

    await db('orders').where({ id }).update(updates);

    res.json({
      success: true,
      message: 'وضعیت سفارش بروزرسانی شد',
    });
  } catch (error) {
    next(error);
  }
};

const addTrackingCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tracking_code } = req.body;

    await db('orders')
      .where({ id })
      .update({
        tracking_code,
        updated_at: db.fn.now(),
      });

    res.json({
      success: true,
      message: 'کد پیگیری اضافه شد',
    });
  } catch (error) {
    next(error);
  }
};

// Users Management
const getAdminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;

    let query = db('users');

    if (search) {
      query = query.where((builder) => {
        builder
          .where('email', 'like', `%${search}%`)
          .orWhere('first_name', 'like', `%${search}%`)
          .orWhere('last_name', 'like', `%${search}%`);
      });
    }

    if (role) query = query.where('role', role);

    const [{ count }] = await query.clone().count('id as count');

    const users = await query
      .select('id', 'ugid', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: parseInt(count),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await db('users')
      .select('id', 'ugid', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'created_at')
      .where({ id })
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    const orders = await db('orders')
      .where({ user_id: id })
      .orderBy('created_at', 'desc')
      .limit(10);

    res.json({
      success: true,
      data: {
        ...user,
        recent_orders: orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await db('users').where({ id }).first();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    await db('users')
      .where({ id })
      .update({ is_active: !user.is_active });

    res.json({
      success: true,
      message: user.is_active ? 'کاربر مسدود شد' : 'کاربر فعال شد',
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await db('users').where({ id }).update({ role });

    res.json({
      success: true,
      message: 'نقش کاربر بروزرسانی شد',
    });
  } catch (error) {
    next(error);
  }
};

// Coupons
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await db('coupons').orderBy('created_at', 'desc');

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const data = req.body;

    const [couponId] = await db('coupons').insert(data);
    const coupon = await db('coupons').where({ id: couponId }).first();

    res.status(201).json({
      success: true,
      message: 'کد تخفیف ایجاد شد',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await db('coupons').where({ id }).update(data);
    const coupon = await db('coupons').where({ id }).first();

    res.json({
      success: true,
      message: 'کد تخفیف بروزرسانی شد',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db('coupons').where({ id }).delete();

    res.json({
      success: true,
      message: 'کد تخفیف حذف شد',
    });
  } catch (error) {
    next(error);
  }
};

// Sliders
const getSliders = async (req, res, next) => {
  try {
    const sliders = await db('sliders').orderBy('sort_order');

    res.json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    next(error);
  }
};

const createSlider = async (req, res, next) => {
  try {
    const data = req.body;

    const [sliderId] = await db('sliders').insert(data);
    const slider = await db('sliders').where({ id: sliderId }).first();

    res.status(201).json({
      success: true,
      message: 'اسلایدر ایجاد شد',
      data: slider,
    });
  } catch (error) {
    next(error);
  }
};

const updateSlider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await db('sliders').where({ id }).update(data);
    const slider = await db('sliders').where({ id }).first();

    res.json({
      success: true,
      message: 'اسلایدر بروزرسانی شد',
      data: slider,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSlider = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db('sliders').where({ id }).delete();

    res.json({
      success: true,
      message: 'اسلایدر حذف شد',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSalesReport,
  getRecentOrders,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  addTrackingCode,
  getAdminUsers,
  getUserById,
  blockUser,
  updateUserRole,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
};
