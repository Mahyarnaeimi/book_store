const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../../../../config');
const { db } = require('../../../models/database.model');

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'این ایمیل قبلا ثبت شده است',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [userId] = await db('users').insert({
      ugid: uuidv4(),
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role: 'customer',
      is_active: true,
      email_verified: false,
    });

    const user = await db('users')
      .select('id', 'ugid', 'email', 'first_name', 'last_name', 'phone', 'role')
      .where({ id: userId })
      .first();

    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'حساب کاربری شما غیرفعال شده است',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است',
      });
    }

    const token = generateToken(user.id);

    const userData = {
      id: user.id,
      ugid: user.ugid,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
    };

    res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'خروج موفقیت‌آمیز',
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await db('users')
      .select('id', 'ugid', 'email', 'first_name', 'last_name', 'phone', 'role', 'avatar_url', 'created_at')
      .where({ id: req.user.id })
      .first();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;

    await db('users')
      .where({ id: req.user.id })
      .update({
        first_name,
        last_name,
        phone,
        updated_at: db.fn.now(),
      });

    const user = await db('users')
      .select('id', 'ugid', 'email', 'first_name', 'last_name', 'phone', 'role', 'avatar_url')
      .where({ id: req.user.id })
      .first();

    res.json({
      success: true,
      message: 'پروفایل با موفقیت بروزرسانی شد',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.json({
        success: true,
        message: 'اگر ایمیل شما در سیستم موجود باشد، لینک بازنشانی ارسال می‌شود',
      });
    }

    res.json({
      success: true,
      message: 'لینک بازنشانی رمز عبور به ایمیل شما ارسال شد',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    res.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر یافت',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
};
