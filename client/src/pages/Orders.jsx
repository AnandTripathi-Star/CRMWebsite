import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data.orders));
  }, []);

  return (
    <div className="page">
      <h1>Your orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <div className="order-list">
        {orders.map((o) => (
          <Link to={`/orders/${o._id}`} key={o._id} className="order-row">
            <span>#{o._id.slice(-6).toUpperCase()}</span>
            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
            <span className={`status status--${o.status}`}>{o.status}</span>
            <span>&#8377;{o.totalPrice.toLocaleString('en-IN')}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
