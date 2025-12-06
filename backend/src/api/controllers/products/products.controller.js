const { v4: uuidv4 } = require('uuid');
const { db } = require('../../../models/database.model');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'newest',
      category,
      author,
      publisher,
      min_price,
      max_price,
      in_stock,
      featured,
      bestseller,
      search,
    } = req.query;

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
      .leftJoin('publishers as pub', 'p.publisher_id', 'pub.id')
      .where('p.is_active', true);

    if (category) query = query.where('p.category_id', category);
    if (author) query = query.where('p.author_id', author);
    if (publisher) query = query.where('p.publisher_id', publisher);
    if (min_price) query = query.where('p.price', '>=', min_price);
    if (max_price) query = query.where('p.price', '<=', max_price);
    if (in_stock) query = query.where('p.stock', '>', 0);
    if (featured) query = query.where('p.is_featured', true);
    if (bestseller) query = query.where('p.is_bestseller', true);
    if (search) {
      query = query.where((builder) => {
        builder
          .where('p.title', 'like', `%${search}%`)
          .orWhere('p.title_en', 'like', `%${search}%`)
          .orWhere('a.name', 'like', `%${search}%`);
      });
    }

    const sortOptions = {
      newest: ['p.created_at', 'desc'],
      oldest: ['p.created_at', 'asc'],
      price_asc: ['p.price', 'asc'],
      price_desc: ['p.price', 'desc'],
      bestseller: ['p.sales_count', 'desc'],
      popular: ['p.views_count', 'desc'],
    };

    const [sortColumn, sortOrder] = sortOptions[sort] || sortOptions.newest;
    query = query.orderBy(sortColumn, sortOrder);

    const countQuery = query.clone();
    const [{ count }] = await countQuery.count('* as count');
    const totalItems = parseInt(count);
    const totalPages = Math.ceil(totalItems / limit);

    const products = await query.limit(limit).offset(offset);

    const productIds = products.map((p) => p.id);
    const images = await db('product_images')
      .whereIn('product_id', productIds)
      .orderBy('sort_order');

    const productsWithImages = products.map((product) => ({
      ...product,
      images: images.filter((img) => img.product_id === product.id),
    }));

    res.json({
      success: true,
      data: {
        products: productsWithImages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'c.slug as category_slug',
        'a.name as author_name',
        'a.slug as author_slug',
        'a.bio as author_bio',
        'pub.name as publisher_name',
        'pub.slug as publisher_slug'
      )
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .leftJoin('publishers as pub', 'p.publisher_id', 'pub.id')
      .where('p.id', id)
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    await db('products').where({ id }).increment('views_count', 1);

    const images = await db('product_images')
      .where({ product_id: id })
      .orderBy('sort_order');

    const tags = await db('product_tags').where({ product_id: id }).pluck('tag');

    res.json({
      success: true,
      data: {
        ...product,
        images,
        tags,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'c.slug as category_slug',
        'a.name as author_name',
        'a.slug as author_slug',
        'a.bio as author_bio',
        'pub.name as publisher_name',
        'pub.slug as publisher_slug'
      )
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .leftJoin('publishers as pub', 'p.publisher_id', 'pub.id')
      .where('p.slug', slug)
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    await db('products').where({ id: product.id }).increment('views_count', 1);

    const images = await db('product_images')
      .where({ product_id: product.id })
      .orderBy('sort_order');

    const tags = await db('product_tags').where({ product_id: product.id }).pluck('tag');

    res.json({
      success: true,
      data: {
        ...product,
        images,
        tags,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'a.name as author_name'
      )
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .where('p.is_active', true)
      .where('p.is_featured', true)
      .orderBy('p.created_at', 'desc')
      .limit(limit);

    const productIds = products.map((p) => p.id);
    const images = await db('product_images')
      .whereIn('product_id', productIds)
      .where('is_primary', true);

    const productsWithImages = products.map((product) => ({
      ...product,
      primary_image: images.find((img) => img.product_id === product.id)?.image_url || null,
    }));

    res.json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    next(error);
  }
};

const getBestsellers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'a.name as author_name'
      )
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .where('p.is_active', true)
      .where('p.is_bestseller', true)
      .orderBy('p.sales_count', 'desc')
      .limit(limit);

    const productIds = products.map((p) => p.id);
    const images = await db('product_images')
      .whereIn('product_id', productIds)
      .where('is_primary', true);

    const productsWithImages = products.map((product) => ({
      ...product,
      primary_image: images.find((img) => img.product_id === product.id)?.image_url || null,
    }));

    res.json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    next(error);
  }
};

const getNewArrivals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'a.name as author_name'
      )
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('authors as a', 'p.author_id', 'a.id')
      .where('p.is_active', true)
      .orderBy('p.created_at', 'desc')
      .limit(limit);

    const productIds = products.map((p) => p.id);
    const images = await db('product_images')
      .whereIn('product_id', productIds)
      .where('is_primary', true);

    const productsWithImages = products.map((product) => ({
      ...product,
      primary_image: images.find((img) => img.product_id === product.id)?.image_url || null,
    }));

    res.json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    req.query.category = categoryId;
    return getProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    req.query.search = q;
    return getProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellers,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
};
