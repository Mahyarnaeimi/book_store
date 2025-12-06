const { db } = require('../../../models/database.model');

const getCategories = async (req, res, next) => {
  try {
    const categories = await db('categories')
      .where('is_active', true)
      .orderBy('sort_order');

    const buildTree = (items, parentId = null) => {
      return items
        .filter((item) => item.parent_id === parentId)
        .map((item) => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };

    const tree = buildTree(categories);

    res.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await db('categories')
      .where({ id, is_active: true })
      .first();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'دسته‌بندی یافت نشد',
      });
    }

    const productCount = await db('products')
      .where({ category_id: id, is_active: true })
      .count('id as count')
      .first();

    res.json({
      success: true,
      data: {
        ...category,
        product_count: productCount.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSubcategories = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subcategories = await db('categories')
      .where({ parent_id: id, is_active: true })
      .orderBy('sort_order');

    res.json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await db('categories')
      .where({ slug, is_active: true })
      .first();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'دسته‌بندی یافت نشد',
      });
    }

    const subcategories = await db('categories')
      .where({ parent_id: category.id, is_active: true })
      .orderBy('sort_order');

    const productCount = await db('products')
      .where({ category_id: category.id, is_active: true })
      .count('id as count')
      .first();

    res.json({
      success: true,
      data: {
        ...category,
        subcategories,
        product_count: productCount.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getSubcategories,
  getCategoryBySlug,
};
