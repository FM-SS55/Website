import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  if (!ready) return <div className="admin-loading">Loading…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}