const { db } = require('../models/database.model');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...\n');

    // Users table
    console.log('Creating users table...');
    await db.schema.dropTableIfExists('coupon_usage');
    await db.schema.dropTableIfExists('reviews');
    await db.schema.dropTableIfExists('wishlist');
    await db.schema.dropTableIfExists('cart_items');
    await db.schema.dropTableIfExists('order_items');
    await db.schema.dropTableIfExists('payments');
    await db.schema.dropTableIfExists('orders');
    await db.schema.dropTableIfExists('coupons');
    await db.schema.dropTableIfExists('product_tags');
    await db.schema.dropTableIfExists('product_images');
    await db.schema.dropTableIfExists('products');
    await db.schema.dropTableIfExists('publishers');
    await db.schema.dropTableIfExists('authors');
    await db.schema.dropTableIfExists('categories');
    await db.schema.dropTableIfExists('sliders');
    await db.schema.dropTableIfExists('settings');
    await db.schema.dropTableIfExists('contact_messages');
    await db.schema.dropTableIfExists('user_addresses');
    await db.schema.dropTableIfExists('user_devices');
    await db.schema.dropTableIfExists('users');

    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('ugid', 36).unique().notNullable();
      table.string('email', 100).unique().notNullable();
      table.string('password_hash', 255);
      table.string('first_name', 50);
      table.string('last_name', 50);
      table.string('phone', 20);
      table.string('avatar_url', 255);
      table.enum('role', ['customer', 'admin', 'super_admin']).defaultTo('customer');
      table.boolean('is_active').defaultTo(true);
      table.boolean('email_verified').defaultTo(false);
      table.string('google_id', 100);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('✅ users table created');

    // User devices
    await db.schema.createTable('user_devices', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('device_id', 100);
      table.string('device_name', 100);
      table.string('device_type', 50);
      table.boolean('is_online').defaultTo(true);
      table.timestamp('last_active');
      table.string('fcm_token', 255);
    });
    console.log('✅ user_devices table created');

    // User addresses
    await db.schema.createTable('user_addresses', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('title', 50);
      table.string('full_name', 100);
      table.string('phone', 20);
      table.string('province', 50);
      table.string('city', 50);
      table.string('postal_code', 20);
      table.text('address');
      table.boolean('is_default').defaultTo(false);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ user_addresses table created');

    // Categories
    await db.schema.createTable('categories', (table) => {
      table.increments('id').primary();
      table.integer('parent_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
      table.string('name', 100).notNullable();
      table.string('name_en', 100);
      table.string('slug', 100).unique();
      table.text('description');
      table.string('image_url', 255);
      table.string('icon', 50);
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ categories table created');

    // Authors
    await db.schema.createTable('authors', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('name_en', 100);
      table.string('slug', 100).unique();
      table.text('bio');
      table.string('image_url', 255);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ authors table created');

    // Publishers
    await db.schema.createTable('publishers', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('name_en', 100);
      table.string('slug', 100).unique();
      table.string('logo_url', 255);
      table.string('website', 255);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ publishers table created');

    // Products
    await db.schema.createTable('products', (table) => {
      table.increments('id').primary();
      table.string('ugid', 36).unique().notNullable();
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
      table.integer('author_id').unsigned().references('id').inTable('authors').onDelete('SET NULL');
      table.integer('publisher_id').unsigned().references('id').inTable('publishers').onDelete('SET NULL');

      // Basic Info
      table.string('title', 255).notNullable();
      table.string('title_en', 255);
      table.string('slug', 255).unique();
      table.text('description');
      table.string('short_description', 500);

      // Book Specific
      table.string('isbn', 20);
      table.integer('pages');
      table.integer('publish_year');
      table.string('language', 20).defaultTo('فارسی');
      table.string('translator', 100);
      table.string('edition', 20);
      table.enum('format', ['hardcover', 'paperback', 'ebook']).defaultTo('paperback');

      // Pricing
      table.decimal('price', 12, 0).notNullable();
      table.decimal('compare_price', 12, 0);
      table.integer('discount_percent').defaultTo(0);

      // Inventory
      table.integer('stock').defaultTo(0);
      table.string('sku', 50).unique();
      table.integer('weight');

      // SEO
      table.string('meta_title', 255);
      table.string('meta_description', 500);

      // Flags
      table.boolean('is_active').defaultTo(true);
      table.boolean('is_featured').defaultTo(false);
      table.boolean('is_bestseller').defaultTo(false);

      // Stats
      table.integer('views_count').defaultTo(0);
      table.integer('sales_count').defaultTo(0);
      table.decimal('rating_avg', 2, 1).defaultTo(0);
      table.integer('rating_count').defaultTo(0);

      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('✅ products table created');

    // Product images
    await db.schema.createTable('product_images', (table) => {
      table.increments('id').primary();
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.string('image_url', 255);
      table.string('alt_text', 100);
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_primary').defaultTo(false);
    });
    console.log('✅ product_images table created');

    // Product tags
    await db.schema.createTable('product_tags', (table) => {
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.string('tag', 50);
      table.primary(['product_id', 'tag']);
    });
    console.log('✅ product_tags table created');

    // Cart items
    await db.schema.createTable('cart_items', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('session_id', 100);
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.integer('quantity').defaultTo(1);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ cart_items table created');

    // Wishlist
    await db.schema.createTable('wishlist', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.unique(['user_id', 'product_id']);
    });
    console.log('✅ wishlist table created');

    // Coupons
    await db.schema.createTable('coupons', (table) => {
      table.increments('id').primary();
      table.string('code', 50).unique().notNullable();
      table.enum('type', ['percentage', 'fixed']).notNullable();
      table.decimal('value', 12, 2).notNullable();
      table.decimal('min_purchase', 12, 0).defaultTo(0);
      table.decimal('max_discount', 12, 0);
      table.integer('usage_limit');
      table.integer('used_count').defaultTo(0);
      table.integer('per_user_limit').defaultTo(1);
      table.timestamp('start_date');
      table.timestamp('end_date');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ coupons table created');

    // Orders
    await db.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.string('order_number', 20).unique().notNullable();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');

      // Shipping Address
      table.string('shipping_name', 100);
      table.string('shipping_phone', 20);
      table.string('shipping_province', 50);
      table.string('shipping_city', 50);
      table.string('shipping_postal_code', 20);
      table.text('shipping_address');

      // Amounts
      table.decimal('subtotal', 12, 0).notNullable();
      table.decimal('shipping_cost', 12, 0).defaultTo(0);
      table.decimal('discount_amount', 12, 0).defaultTo(0);
      table.decimal('tax_amount', 12, 0).defaultTo(0);
      table.decimal('total_amount', 12, 0).notNullable();

      // Coupon
      table.integer('coupon_id').unsigned();
      table.string('coupon_code', 50);

      // Status
      table.enum('status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).defaultTo('pending');
      table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).defaultTo('pending');

      // Shipping
      table.string('shipping_method', 50);
      table.string('tracking_code', 100);
      table.timestamp('shipped_at');
      table.timestamp('delivered_at');

      // Notes
      table.text('customer_note');
      table.text('admin_note');

      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('✅ orders table created');

    // Order items
    await db.schema.createTable('order_items', (table) => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('SET NULL');
      table.string('product_title', 255);
      table.string('product_image', 255);
      table.decimal('price', 12, 0);
      table.integer('quantity');
      table.decimal('total', 12, 0);
    });
    console.log('✅ order_items table created');

    // Payments
    await db.schema.createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.enum('gateway', ['zarinpal', 'stripe', 'bank_transfer']).notNullable();
      table.decimal('amount', 12, 0).notNullable();
      table.string('currency', 3).defaultTo('IRR');
      table.string('authority', 100);
      table.string('ref_id', 100);
      table.string('transaction_id', 100);
      table.enum('status', ['pending', 'success', 'failed']).defaultTo('pending');
      table.json('gateway_response');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('verified_at');
    });
    console.log('✅ payments table created');

    // Reviews
    await db.schema.createTable('reviews', (table) => {
      table.increments('id').primary();
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('rating');
      table.string('title', 100);
      table.text('comment');
      table.text('pros');
      table.text('cons');
      table.boolean('is_verified_purchase').defaultTo(false);
      table.boolean('is_approved').defaultTo(false);
      table.integer('helpful_count').defaultTo(0);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ reviews table created');

    // Coupon usage
    await db.schema.createTable('coupon_usage', (table) => {
      table.increments('id').primary();
      table.integer('coupon_id').unsigned().references('id').inTable('coupons').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.timestamp('used_at').defaultTo(db.fn.now());
    });
    console.log('✅ coupon_usage table created');

    // Settings
    await db.schema.createTable('settings', (table) => {
      table.increments('id').primary();
      table.string('key_name', 100).unique();
      table.text('value');
      table.enum('type', ['string', 'number', 'boolean', 'json']).defaultTo('string');
      table.string('group_name', 50);
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('✅ settings table created');

    // Sliders
    await db.schema.createTable('sliders', (table) => {
      table.increments('id').primary();
      table.string('title', 100);
      table.string('subtitle', 200);
      table.string('image_url', 255);
      table.string('link', 255);
      table.string('button_text', 50);
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamp('start_date');
      table.timestamp('end_date');
    });
    console.log('✅ sliders table created');

    // Contact messages
    await db.schema.createTable('contact_messages', (table) => {
      table.increments('id').primary();
      table.string('name', 100);
      table.string('email', 100);
      table.string('phone', 20);
      table.string('subject', 200);
      table.text('message');
      table.boolean('is_read').defaultTo(false);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ contact_messages table created');

    console.log('\n✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
