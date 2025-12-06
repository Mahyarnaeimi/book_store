# Online Bookstore

A complete online bookstore project built with Node.js, Express, MySQL, React, and Tailwind CSS.

## Project Structure

```
book-shop/
├── backend/          # Node.js + Express + MySQL server
├── frontend/         # React App (customer store)
├── admin-panel/      # React App (admin panel)
└── database/         # Database scripts
```

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### 1. Create Database

First, run MySQL and create a database named `bookstore`:

```sql
CREATE DATABASE bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Setup Backend

```bash
cd backend
npm install

# Edit configuration file
# Open config/development.env and enter your database information

# Run Migration (create tables)
npm run migrate

# Run Seed (insert sample data)
npm run seed

# Start server
npm run dev
```

Server runs on port 5000: `http://localhost:5000`

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Store runs on port 3000: `http://localhost:3000`

### 4. Run Admin Panel

```bash
cd admin-panel
npm install
npm run dev
```

Admin panel runs on port 3001: `http://localhost:3001`

## Demo Accounts

### Admin
- **Email:** admin@bookstore.com
- **Password:** admin123

### Customer
- **Email:** ali@example.com
- **Password:** user123

## Configuration

Edit the `backend/config/development.env` file:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bookstore
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get user info

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Product details
- `GET /api/v1/products/featured` - Featured products
- `GET /api/v1/products/bestsellers` - Bestsellers

### Categories
- `GET /api/v1/categories` - List categories

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/add` - Add to cart
- `PUT /api/v1/cart/update` - Update cart
- `DELETE /api/v1/cart/remove/:id` - Remove item

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders

### Admin
- `GET /api/v1/admin/dashboard/stats` - Dashboard stats
- `GET /api/v1/admin/products` - Manage products
- `GET /api/v1/admin/orders` - Manage orders
- `GET /api/v1/admin/users` - Manage users

## Security Features

- Helmet.js - Security Headers
- Rate Limiting
- CORS Protection
- JWT Authentication
- Password Hashing (bcrypt)
- Input Validation (Joi)
- SQL Injection Prevention (Knex.js)

## UI/UX Features

- Responsive Design
- Dark/Light Mode
- Loading Skeletons
- Toast Notifications

## Sample Data

After running `npm run seed`, the following data will be created:

- 10 sample books
- 8 main categories + subcategories
- 10 authors
- 8 publishers
- 3 discount codes
- 3 sliders
- 4 users

## Development

```bash
# Run backend and frontend simultaneously
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# Terminal 3:
cd admin-panel && npm run dev
```

## License

MIT License
