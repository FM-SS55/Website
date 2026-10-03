import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card__top">
        <div className="ticket-card__icon">●</div>
        <h3 className="ticket-card__title">{service.title}</h3>
        <p className="ticket-card__desc">{service.short_description}</p>
      </div>
      <div className="ticket-card__perforation" />
      <div className="ticket-card__bottom">
        <span className="ticket-card__tag">Service</span>
        <Link to={`/services/${service.slug}`} className="ticket-card__link">View Details →</Link>
      </div>
    </div>
  );
}