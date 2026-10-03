import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const items = [
  ['dashboard', 'Dashboard'],
  ['banners', 'Banners'],
  ['services', 'Services'],
  ['clients', 'Clients'],
  ['blog', 'Blog Posts'],
  ['messages', 'Messages'],
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Mandafia<em>Services</em></div>
        <nav className="admin-nav">
          {items.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'is-active' : '')}>{label}</NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer">View Live Site ↗</a>
          <div><button onClick={async () => { await logout(); navigate('/login'); }}>Log Out</button></div>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}