import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.order));
  }, [id]);

  if (!order) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
      <p className={`status status--${order.status}`}>{order.status}</p>

      <h2>Items</h2>
      {order.items.map((item) => (
        <div key={item.product} className="order-item-row">
          <span>{item.name}</span>
          <span>
            {item.quantity} &times; &#8377;{item.price.toLocaleString('en-IN')}
          </span>
        </div>
      ))}

      <h2>Shipping address</h2>
      <p>
        {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
        {order.shippingAddress.postalCode}
      </p>

      <h2>Summary</h2>
      <p>Items: &#8377;{order.itemsPrice.toLocaleString('en-IN')}</p>
      <p>Shipping: &#8377;{order.shippingPrice.toLocaleString('en-IN')}</p>
      <p>Tax: &#8377;{order.taxPrice.toLocaleString('en-IN')}</p>
      <p>
        <strong>Total: &#8377;{order.totalPrice.toLocaleString('en-IN')}</strong>
      </p>
    </div>
  );
}
