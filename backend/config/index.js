const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production'
  ? 'production.env'
  : 'development.env';

dotenv.config({ path: path.join(__dirname, envFile) });

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'bookstore',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
    path: process.env.UPLOAD_PATH || './uploads',
  },
};
