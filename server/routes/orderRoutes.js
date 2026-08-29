const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  listAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/mine', getMyOrders);
router.get('/admin/all', admin, listAllOrders);
router.put('/:id/status', admin, updateOrderStatus);
router.get('/:id', getOrderById);

module.exports = router;
