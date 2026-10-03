import { Link } from 'react-router-dom';
import { useFetch } from '@shared/hooks';
import { formatDateTime, truncate } from '@shared/utils';
import { dashboardApi } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

const stats = [['banners', 'Banners'], ['services', 'Services'], ['clients', 'Clients'], ['posts', 'Blog Posts']];

export default function Dashboard() {
  const { data, loading, error } = useFetch(dashboardApi.get);
  if (loading) return <div className="admin-loading">Loading…</div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="admin-stats">
        {stats.map(([key, label]) => (
          <div className="admin-stat-card" key={key}><strong>{data.counts[key]}</strong><span>{label}</span></div>
        ))}
      </div>
      <div className="admin-panel">
        <h2>Recent Contact Messages</h2>
        {data.recentMessages.length ? (
          <>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Received</th></tr></thead>
              <tbody>
                {data.recentMessages.map((m) => (
                  <tr key={m.id}><td>{m.name}</td><td>{m.email}</td><td>{truncate(m.message)}</td><td>{formatDateTime(m.created_at)}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16 }}><Link to="/messages" className="btn-admin btn-admin-ghost">View All Messages</Link></div>
          </>
        ) : <p style={{ color: 'var(--muted)', fontSize: 14 }}>No messages yet.</p>}
      </div>
    </>
  );
}