const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();
router.use(protect, admin);

router.get('/summary', async (req, res, next) => {
  try {
    const [userCount, productCount, orderCount, revenueAgg] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);
    res.json({
      userCount,
      productCount,
      orderCount,
      totalRevenue: revenueAgg[0]?.total || 0
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
