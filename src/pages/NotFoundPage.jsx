import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div className="not-found-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist or has been moved.</p>
      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/" style={{ marginRight: '1rem', color: '#007bff' }}>Go to Home Screen</Link>
        <Link to="/about" style={{ color: '#007bff' }}>Read About Us</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;