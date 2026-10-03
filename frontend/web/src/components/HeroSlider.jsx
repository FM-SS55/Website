import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const fallback = [{ id: 'fallback', title: 'Facility Management You Can Rely On', subtitle: 'Housekeeping, security, landscaping and more — one accountable team.' }];
const tickets = [
  ['STEP 1', 'Assess', 'Site visit and documented scope of work'],
  ['STEP 2', 'Plan', 'Dedicated supervisor and service schedule'],
  ['STEP 3', 'Deliver', 'Tracked, signed-off service with regular reporting'],
];

export default function HeroSlider({ banners }) {
  const slides = banners && banners.length ? banners : fallback;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="hero">
      {slides.map((banner, i) => (
        <div key={banner.id} className={`hero__slide${i === current ? ' is-active' : ''}`}>
          <div className="hero__inner">
            <div>
              <div className="hero__eyebrow">Integrated Facility Management</div>
              <h1 className="hero__title">{banner.title}</h1>
              <p className="hero__subtitle">{banner.subtitle}</p>
              <div className="hero__actions">
                <Link to="/contact" className="btn btn-primary">Request a Quote</Link>
                <Link to="/services" className="btn btn-outline">Explore Services</Link>
              </div>
              <div className="hero__stats">
                <div className="hero__stat"><strong>9</strong><span>Core Services</span></div>
                <div className="hero__stat"><strong>1</strong><span>Accountable Team</span></div>
              </div>
            </div>
            <div className="ticket-stack">
              {tickets.map(([wo, status, text]) => (
                <div className="mini-ticket" key={wo}>
                  <div className="mini-ticket__head"><span>{wo}</span><span className="mini-ticket__status">{status}</span></div>
                  <div>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="hero__nav-dots">
          {slides.map((s, i) => (
            <button key={s.id} className={i === current ? 'is-active' : ''} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}
    </section>
  );
}