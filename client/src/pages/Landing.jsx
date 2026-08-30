import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const NODES = [
  { id: 'electronics', label: 'ELECTRONICS', x: 24, y: 3 },
  { id: 'fashion', label: 'FASHION', x: 45.5, y: 18.5 },
  { id: 'beauty', label: 'BEAUTY', x: 37.4, y: 43.5 },
  { id: 'grocery', label: 'GROCERY', x: 10.6, y: 43.5 },
  { id: 'home', label: 'HOME & LIVING', x: 2.5, y: 18.5 }
];

const STAR_PATH =
  '24,3 29.8,17.6 45.5,18.5 33.2,28.4 37.4,43.5 24,34.8 10.6,43.5 14.8,28.4 2.5,18.5 18.2,17.6';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'That username and password did not match.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing">
      <section className="landing__hero">
        <Logo variant="light" size="lg" />

        <div className="constellation">
          <svg viewBox="0 0 48 48" className="constellation__lines" aria-hidden="true">
            <polygon points={STAR_PATH} className="constellation__polygon" />
          </svg>
          {NODES.map((node, i) => (
            <div
              key={node.id}
              className="constellation__node"
              style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${i * 0.15 + 0.3}s` }}
            >
              <span className="constellation__dot" />
              <span className="constellation__label">{node.label}</span>
            </div>
          ))}
        </div>

        <h1 className="landing__headline">
          One marketplace.
          <br />
          A thousand shelves.
        </h1>
        <p className="landing__subhead">
          Every category your day needs, brought under one roof — priced fairly, delivered reliably.
        </p>
        <Link to="/shop" className="landing__browse-link">
          Browse without logging in &rarr;
        </Link>
      </section>

      <section className="landing__auth">
        <div className="auth-card">
          <div className="auth-card__logo-mobile">
            <Logo variant="dark" size="md" />
          </div>
          <h2>Welcome back</h2>
          <p className="auth-card__sub">Log in to pick up your cart and orders.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="form-error">{error}</p>}

            <label className="auth-form__field">
              <span>Username</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-form__field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" className="auth-form__submit" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="auth-card__footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
