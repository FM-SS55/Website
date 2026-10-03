import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Login() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (ready && user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">Mandafia<em>Services</em></div>
        <div className="admin-login__sub">Admin Panel Login</div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={onSubmit} className="admin-form">
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" required autoFocus value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={busy} className="btn-admin btn-admin-primary" style={{ justifyContent: 'center', padding: 12 }}>
            {busy ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}