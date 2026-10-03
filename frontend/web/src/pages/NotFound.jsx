import { Link } from 'react-router-dom';
import usePageTitle from '../utils/usePageTitle.js';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <section className="section" style={{ textAlign: 'center', padding: '130px 0' }}>
      <div className="container">
        <div className="section-eyebrow">404</div>
        <h1 className="section-title" style={{ fontSize: 44 }}>Page Not Found</h1>
        <p className="section-desc" style={{ margin: '0 auto 30px' }}>The page you're looking for doesn't exist or may have been moved.</p>
        <Link to="/" className="btn btn-dark">Back to Home</Link>
      </div>
    </section>
  );
}