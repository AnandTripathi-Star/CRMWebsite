import { useEffect, useState } from 'react';
import api from '../../api/client';

const emptyForm = { name: '', slug: '', description: '', brand: '', category: '', price: '', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadProducts = () => api.get('/products', { params: { limit: 100 } }).then((res) => setProducts(res.data.products));

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      setForm(emptyForm);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create product');
    }
  };

  const handleDeactivate = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="page">
      <h1>Manage products</h1>

      <form onSubmit={handleSubmit} className="form form--grid">
        {error && <p className="form-error">{error}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="slug" placeholder="Slug (unique)" value={form.slug} onChange={handleChange} required />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">
          Add product
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>&#8377;{p.price.toLocaleString('en-IN')}</td>
              <td>{p.stock}</td>
              <td>
                <button className="link-btn" onClick={() => handleDeactivate(p._id)}>
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
