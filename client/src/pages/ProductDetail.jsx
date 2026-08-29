import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => setProduct(res.data.product));
  }, [slug]);

  if (!product) return <div className="page">Loading...</div>;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await addItem(product._id, quantity);
    navigate('/cart');
  };

  return (
    <div className="page product-detail">
      <div className="product-detail__image">
        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <div className="placeholder large" />}
      </div>
      <div className="product-detail__info">
        <h1>{product.name}</h1>
        <p className="brand">{product.brand}</p>
        <p className="rating">&#9733; {product.averageRating || 'New'} ({product.numReviews} reviews)</p>
        <p className="price large">
          &#8377;{(product.discountPrice || product.price).toLocaleString('en-IN')}
          {product.discountPrice && <span className="price--strike">&#8377;{product.price.toLocaleString('en-IN')}</span>}
        </p>
        <p className="stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <p>{product.description}</p>

        <div className="add-to-cart-row">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button onClick={handleAddToCart} disabled={product.stock === 0}>
            Add to cart
          </button>
        </div>

        <section className="reviews">
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <p>No reviews yet.</p>}
          {product.reviews.map((r) => (
            <div key={r._id} className="review">
              <strong>{r.name}</strong> &#9733; {r.rating}
              <p>{r.comment}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
