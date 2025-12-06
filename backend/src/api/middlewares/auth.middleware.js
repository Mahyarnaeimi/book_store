const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { db } = require('../../models/database.model');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'دسترسی غیرمجاز. لطفا وارد شوید.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await db('users')
      .where({ id: decoded.userId, is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'کاربر یافت نشد یا غیرفعال است.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'توکن منقضی شده است. لطفا مجددا وارد شوید.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'توکن نامعتبر است.',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);

      const user = await db('users')
        .where({ id: decoded.userId, is_active: true })
        .first();

      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'دسترسی غیرمجاز. نیاز به سطح دسترسی مدیر.',
    });
  }
  next();
};

const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'دسترسی غیرمجاز. نیاز به سطح دسترسی مدیر ارشد.',
    });
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  isAdmin,
  isSuperAdmin,
};
