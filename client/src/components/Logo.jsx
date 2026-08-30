export default function Logo({ variant = 'dark', size = 'md' }) {
  return (
    <div className={`logo logo--${variant} logo--${size}`}>
      <svg viewBox="0 0 48 48" className="logo__mark" aria-hidden="true">
        <polygon
          points="24,3 29.8,17.6 45.5,18.5 33.2,28.4 37.4,43.5 24,34.8 10.6,43.5 14.8,28.4 2.5,18.5 18.2,17.6"
          className="logo__star"
        />
      </svg>
      <span className="logo__word">
        Anand<strong>Tripathi</strong>
        <span className="logo__dash">-</span>
        Star
      </span>
    </div>
  );
}
