import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Messages from '../pages/Messages.jsx';
import ResourcePage from '../pages/ResourcePage.jsx';
import { banners, services, clients, blog } from '../pages/resources.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="banners" element={<ResourcePage config={banners} />} />
          <Route path="services" element={<ResourcePage config={services} />} />
          <Route path="clients" element={<ResourcePage config={clients} />} />
          <Route path="blog" element={<ResourcePage config={blog} />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}