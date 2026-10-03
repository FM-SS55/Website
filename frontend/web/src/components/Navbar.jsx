import { useEffect, useState } from 'react';
import { site, phoneHref } from '../config/site.js';
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  ['/', 'Home', true],
  ['/about', 'About Us'],
  ['/services', 'Services'],
  ['/clients', 'Clients'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="topbar">
        <div className="topbar__inner">
          <div className="topbar__contact">
            {site.phone && <a href={phoneHref(site.phone)}>📞 {site.phone}</a>}
            <a href={`mailto:${site.email}`}>✉️ {site.email}</a>
          </div>
          <div className="topbar__meta">
            {site.address && <span>{site.address}</span>}
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark">MS</span>
            <span className="brand__name">Mandafia<em>Services</em></span>
          </Link>

          <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>

          <nav className={`main-nav${open ? ' is-open' : ''}`}>
            {links.map(([to, label, end]) => (
              <NavLink key={to} to={to} end={!!end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {label}
              </NavLink>
            ))}
            <Link to="/contact" className="nav-cta">Request a Quote</Link>
          </nav>
        </div>
      </header>
    </>
  );
}