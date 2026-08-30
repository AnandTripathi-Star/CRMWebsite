const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    attributes: { type: Map, of: String },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

productSchema.methods.recalculateRating = function recalculateRating() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.numReviews = this.reviews.length;
  this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
};

module.exports = mongoose.model('Product', productSchema);
