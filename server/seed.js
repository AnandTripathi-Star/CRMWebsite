/**
 * Seeds the database with an admin account and a starter product catalog.
 *
 * Usage:
 *   cd server
 *   node seed.js
 *
 * Requires MONGO_URI to be set (via .env or environment). Safe to re-run —
 * it upserts by email/slug rather than duplicating records.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const ADMIN = {
  name: 'Admin',
  email: 'admin@anandtripathi-star.test',
  password: 'Admin@12345',
  role: 'admin'
};

const PRODUCTS = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    description: 'Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and quick charge.',
    brand: 'SonicWave',
    category: 'Electronics',
    price: 4999,
    discountPrice: 3799,
    stock: 45,
    images: []
  },
  {
    name: '65W GaN Fast Charger, Dual Port',
    slug: '65w-gan-fast-charger-dual-port',
    description: 'Compact GaN charger with one USB-C PD port and one USB-A port, safe for phones, tablets, and laptops.',
    brand: 'VoltEdge',
    category: 'Electronics',
    price: 1499,
    stock: 120,
    images: []
  },
  {
    name: "Men's Slim Fit Cotton Shirt",
    slug: 'mens-slim-fit-cotton-shirt',
    description: 'Breathable 100% cotton casual shirt, machine washable, available in classic solid colors.',
    brand: 'Urban Thread',
    category: 'Fashion',
    price: 1299,
    discountPrice: 899,
    stock: 80,
    images: []
  },
  {
    name: "Women's Ethnic Printed Kurta",
    slug: 'womens-ethnic-printed-kurta',
    description: 'Flowy rayon kurta with traditional block print, three-quarter sleeves, and a relaxed fit.',
    brand: 'Saffron Loom',
    category: 'Fashion',
    price: 1799,
    stock: 60,
    images: []
  },
  {
    name: 'Non-Stick Cookware Set, 5 Pieces',
    slug: 'non-stick-cookware-set-5-pieces',
    description: 'Induction-friendly non-stick cookware set including tawa, kadhai, and two saucepans with lids.',
    brand: 'HomeCraft',
    category: 'Home & Living',
    price: 2999,
    discountPrice: 2399,
    stock: 35,
    images: []
  },
  {
    name: 'Memory Foam Pillow, Set of 2',
    slug: 'memory-foam-pillow-set-of-2',
    description: 'Orthopedic cervical support pillows with breathable cover, helps relieve neck and shoulder pain.',
    brand: 'RestWell',
    category: 'Home & Living',
    price: 1599,
    stock: 70,
    images: []
  },
  {
    name: 'Assorted Dry Fruits Combo, 1kg',
    slug: 'assorted-dry-fruits-combo-1kg',
    description: 'Premium almonds, cashews, raisins, and pistachios, vacuum-sealed for freshness.',
    brand: 'Farm Fresh',
    category: 'Grocery',
    price: 899,
    stock: 150,
    images: []
  },
  {
    name: 'Cold-Pressed Groundnut Oil, 1L',
    slug: 'cold-pressed-groundnut-oil-1l',
    description: 'Chemical-free, cold-pressed groundnut oil retaining natural nutrients and flavor.',
    brand: 'Farm Fresh',
    category: 'Grocery',
    price: 349,
    stock: 200,
    images: []
  },
  {
    name: 'Vitamin C Brightening Face Serum',
    slug: 'vitamin-c-brightening-face-serum',
    description: '20% Vitamin C serum with hyaluronic acid, helps even skin tone and reduce dark spots.',
    brand: 'GlowLab',
    category: 'Beauty',
    price: 799,
    discountPrice: 599,
    stock: 90,
    images: []
  },
  {
    name: 'Herbal Shampoo & Conditioner Combo',
    slug: 'herbal-shampoo-conditioner-combo',
    description: 'Sulfate-free herbal hair care combo for daily use, suitable for color-treated hair.',
    brand: 'GlowLab',
    category: 'Beauty',
    price: 649,
    stock: 110,
    images: []
  }
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env and configure it first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding.');

  const existingAdmin = await User.findOne({ email: ADMIN.email });
  if (existingAdmin) {
    console.log(`Admin already exists: ${ADMIN.email}`);
  } else {
    await User.create(ADMIN);
    console.log(`Created admin: ${ADMIN.email} / ${ADMIN.password}`);
  }

  let created = 0;
  let skipped = 0;
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ slug: p.slug });
    if (exists) {
      skipped += 1;
      continue;
    }
    await Product.create(p);
    created += 1;
  }
  console.log(`Products: ${created} created, ${skipped} already existed.`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
