import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-col footer-col--brand">
          <span className="brand__name brand__name--light">Pulizia<em>FM</em></span>
          <p>Integrated facility management for commercial, residential, healthcare, and institutional spaces — one accountable team, trained and ISO 9001:2015 certified.</p>
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
          <a href="tel:+919958449002">+91-9958 449002</a>
          <a href="mailto:info@puliziafm.com">info@puliziafm.com</a>
          <span className="footer-address">Noida, Uttar Pradesh, India</span>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>&copy; {new Date().getFullYear()} Pulizia FM Services. All rights reserved.</span>
        <span>ISO 9001:2015 Certified</span>
      </div>
    </footer>
  );
}