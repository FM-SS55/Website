import { Link } from 'react-router-dom';

// crumbs: [[label, to?], ...] after "Home"
export default function PageHero({ title, crumbs = [], children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/" style={{ color: 'inherit' }}>Home</Link>
          {crumbs.map(([label, to]) => (
            <span key={label}> / {to ? <Link to={to} style={{ color: 'inherit' }}>{label}</Link> : label}</span>
          ))}
        </div>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}