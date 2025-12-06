const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const routes = require('./src/api/routes');
const { notFound, errorHandler } = require('./src/api/middlewares/error.middleware');
const { testConnection } = require('./src/models/database.model');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment.',
  },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/v1', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online Bookstore API',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`
    ================================================

       Server is running on port ${PORT}
       Online Bookstore API
       Environment: ${config.nodeEnv}

    ================================================
    `);
  });
};

startServer();

module.exports = app;
