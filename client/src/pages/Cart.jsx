import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateItem, removeItem, subtotal } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <h1>Your cart is empty</h1>
        <Link to="/shop">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cart.items.map((item) => (
          <div className="cart-row" key={item.product}>
            {item.image ? <img src={item.image} alt={item.name} /> : <div className="placeholder small" />}
            <div className="cart-row__info">
              <h3>{item.name}</h3>
              <p>&#8377;{item.price.toLocaleString('en-IN')}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(item.product, Number(e.target.value))}
            />
            <button className="link-btn" onClick={() => removeItem(item.product)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Subtotal: &#8377;{subtotal.toLocaleString('en-IN')}</p>
        <Link to="/checkout" className="btn-primary">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
