import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { search: search || undefined } })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <div className="catalog-toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <Link to={`/products/${p.slug}`} key={p._id} className="product-card">
              <div className="product-card__image">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <div className="placeholder" />}
              </div>
              <h3>{p.name}</h3>
              <p className="price">
                &#8377;{(p.discountPrice || p.price).toLocaleString('en-IN')}
                {p.discountPrice && <span className="price--strike">&#8377;{p.price.toLocaleString('en-IN')}</span>}
              </p>
              <p className="rating">&#9733; {p.averageRating || 'New'} ({p.numReviews})</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
