import { Link } from 'react-router-dom';
import { site, phoneHref } from '../config/site.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-col footer-col--brand">
          <span className="brand__name brand__name--light">Mandafia<em>Services</em></span>
          <p>Integrated facility management for commercial, residential, healthcare, and institutional spaces — one accountable team.</p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/clients">Our Valued Clients</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <Link to="/services">All Services</Link>
          <Link to="/services/mechanized-housekeeping">Mechanized Housekeeping</Link>
          <Link to="/services/security-services">Security Services</Link>
          <Link to="/services/landscaping-gardening">Landscaping &amp; Gardening</Link>
        </div>
        <div className="footer-col">
          <h4>Get in Touch</h4>
          {site.phone && <a href={phoneHref(site.phone)}>{site.phone}</a>}
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {site.address && <span className="footer-address">{site.address}</span>}
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>&copy; {new Date().getFullYear()} Mandafia Services. All rights reserved.</span>
        <span>{site.domain}</span>
      </div>
    </footer>
  );
}