import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        AnandTripathi-Star
      </Link>
      <div className="nav-links">
        <Link to="/cart">Cart ({itemCount})</Link>
        {user ? (
          <>
            <Link to="/orders">Orders</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button
              className="link-btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
