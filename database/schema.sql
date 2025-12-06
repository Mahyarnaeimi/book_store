-- ===================================================================
-- Online Bookstore
-- Database Schema for MySQL 8+
-- ===================================================================

CREATE DATABASE IF NOT EXISTS bookstore
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bookstore;

-- ===================================================================
-- USERS & AUTH
-- ===================================================================

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ugid VARCHAR(36) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(20),
  avatar_url VARCHAR(255),
  role ENUM('customer', 'admin', 'super_admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  google_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(50),
  full_name VARCHAR(100),
  phone VARCHAR(20),
  province VARCHAR(50),
  city VARCHAR(50),
  postal_code VARCHAR(20),
  address TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================================
-- PRODUCTS & CATEGORIES
-- ===================================================================

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NULL,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  image_url VARCHAR(255),
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE authors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  slug VARCHAR(100) UNIQUE,
  bio TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE publishers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  slug VARCHAR(100) UNIQUE,
  logo_url VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ugid VARCHAR(36) UNIQUE NOT NULL,
  category_id INT,
  author_id INT,
  publisher_id INT,

  -- Basic Info
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  short_description VARCHAR(500),

  -- Book Specific
  isbn VARCHAR(20),
  pages INT,
  publish_year INT,
  language VARCHAR(20) DEFAULT 'English',
  translator VARCHAR(100),
  edition VARCHAR(20),
  format ENUM('hardcover', 'paperback', 'ebook') DEFAULT 'paperback',

  -- Pricing
  price DECIMAL(12, 0) NOT NULL,
  compare_price DECIMAL(12, 0),
  discount_percent INT DEFAULT 0,

  -- Inventory
  stock INT DEFAULT 0,
  sku VARCHAR(50) UNIQUE,
  weight INT,

  -- SEO
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),

  -- Flags
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,

  -- Stats
  views_count INT DEFAULT 0,
  sales_count INT DEFAULT 0,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
  FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  image_url VARCHAR(255),
  alt_text VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_tags (
  product_id INT,
  tag VARCHAR(50),
  PRIMARY KEY (product_id, tag),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================================
-- CART & WISHLIST
-- ===================================================================

CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  session_id VARCHAR(100),
  product_id INT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  product_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================================
-- COUPONS
-- ===================================================================

CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  min_purchase DECIMAL(12, 0) DEFAULT 0,
  max_discount DECIMAL(12, 0),
  usage_limit INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================================
-- ORDERS & PAYMENTS
-- ===================================================================

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id INT,

  -- Shipping Address
  shipping_name VARCHAR(100),
  shipping_phone VARCHAR(20),
  shipping_province VARCHAR(50),
  shipping_city VARCHAR(50),
  shipping_postal_code VARCHAR(20),
  shipping_address TEXT,

  -- Amounts
  subtotal DECIMAL(12, 0) NOT NULL,
  shipping_cost DECIMAL(12, 0) DEFAULT 0,
  discount_amount DECIMAL(12, 0) DEFAULT 0,
  tax_amount DECIMAL(12, 0) DEFAULT 0,
  total_amount DECIMAL(12, 0) NOT NULL,

  -- Coupon
  coupon_id INT,
  coupon_code VARCHAR(50),

  -- Status
  status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',

  -- Shipping
  shipping_method VARCHAR(50),
  tracking_code VARCHAR(100),
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,

  -- Notes
  customer_note TEXT,
  admin_note TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  product_title VARCHAR(255),
  product_image VARCHAR(255),
  price DECIMAL(12, 0),
  quantity INT,
  total DECIMAL(12, 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  user_id INT,
  gateway ENUM('zarinpal', 'stripe', 'bank_transfer') NOT NULL,
  amount DECIMAL(12, 0) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  authority VARCHAR(100),
  ref_id VARCHAR(100),
  transaction_id VARCHAR(100),
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE coupon_usage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coupon_id INT,
  user_id INT,
  order_id INT,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================================
-- REVIEWS & RATINGS
-- ===================================================================

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  user_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  comment TEXT,
  pros TEXT,
  cons TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================================
-- SETTINGS & MISC
-- ===================================================================

CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE,
  value TEXT,
  type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  group_name VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE sliders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  subtitle VARCHAR(200),
  image_url VARCHAR(255),
  link VARCHAR(255),
  button_text VARCHAR(50),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP,
  end_date TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================================
-- INDEXES
-- ===================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_author ON products(author_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_bestseller ON products(is_bestseller);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);
