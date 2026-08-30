const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.product.toString() === productId);
    const requestedTotal = (existing?.quantity || 0) + Number(quantity);

    if (product.stock < requestedTotal) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    if (existing) {
      existing.quantity = requestedTotal;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.discountPrice || product.price,
        quantity
      });
    }
    await cart.save();
    res.status(201).json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
      if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
      item.quantity = quantity;
    }
    await cart.save();
    res.json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json({ cart });
  } catch (err) {
    next(err);
  }
};
