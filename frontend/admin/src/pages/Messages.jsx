import { useState } from 'react';
import { useFetch } from '@shared/hooks';
import { formatDateTime } from '@shared/utils';
import { messagesApi } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Messages() {
  const { data: messages, loading, error, reload } = useFetch(messagesApi.list);
  const [err, setErr] = useState(null);

  async function remove(id) {
    if (!window.confirm('Delete this message?')) return;
    try { await messagesApi.remove(id); reload(); } catch (e) { setErr(e.message); }
  }

  return (
    <>
      <PageHeader title="Contact Messages" />
      {(error || err) && <div className="alert alert-error">{err || error.message}</div>}
      <div className="admin-panel">
        {loading ? <div className="admin-loading">Loading…</div> : messages?.length ? (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Received</th><th /></tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td><a href={`mailto:${m.email}`}>{m.email}</a></td>
                  <td>{m.phone || '—'}</td>
                  <td style={{ maxWidth: 320, whiteSpace: 'pre-line' }}>{m.message}</td>
                  <td>{formatDateTime(m.created_at)}</td>
                  <td><div className="row-actions"><button className="danger" onClick={() => remove(m.id)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: 'var(--muted)', fontSize: 14 }}>No messages received yet.</p>}
      </div>
    </>
  );
}