const config = require('../../../config');

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `مسیر ${req.originalUrl} یافت نشد`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'خطای سرور';

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'این رکورد قبلا ثبت شده است';
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'رکورد مرتبط یافت نشد';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      error: err,
    }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
