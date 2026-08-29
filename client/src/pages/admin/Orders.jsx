import { useEffect, useState } from 'react';
import api from '../../api/client';

const STATUSES = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => api.get('/orders/admin/all').then((res) => setOrders(res.data.orders));

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="page">
      <h1>Manage orders</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>#{o._id.slice(-6).toUpperCase()}</td>
              <td>{o.user?.name}</td>
              <td>&#8377;{o.totalPrice.toLocaleString('en-IN')}</td>
              <td>
                <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
