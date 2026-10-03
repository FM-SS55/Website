import { Link } from 'react-router-dom';

export default function CtaBanner({ title, text, button, to = '/contact', alt = false }) {
  return (
    <section className={`section${alt ? ' section--alt' : ''}`}>
      <div className="container">
        <div className="cta-banner">
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <Link to={to} className="btn btn-dark">{button}</Link>
        </div>
      </div>
    </section>
  );
}