const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', listProducts);
router.get('/:slug', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
