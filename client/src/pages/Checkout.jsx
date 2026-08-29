import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'cod'
  });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const { paymentMethod, ...shippingAddress } = form;
      const res = await api.post('/orders', { shippingAddress, paymentMethod });
      await refreshCart();
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="form-error">{error}</p>}
        <input name="line1" placeholder="Address line 1" value={form.line1} onChange={handleChange} required />
        <input name="line2" placeholder="Address line 2 (optional)" value={form.line2} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <input name="postalCode" placeholder="Postal code" value={form.postalCode} onChange={handleChange} required />
        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          <option value="cod">Cash on delivery</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>
        <p>Order total: &#8377;{subtotal.toLocaleString('en-IN')} + shipping/tax</p>
        <button type="submit" className="btn-primary" disabled={placing || cart.items.length === 0}>
          {placing ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
