import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Services from '../pages/Services.jsx';
import ServiceDetail from '../pages/ServiceDetail.jsx';
import Clients from '../pages/Clients.jsx';
import Blog from '../pages/Blog.jsx';
import BlogPost from '../pages/BlogPost.jsx';
import Contact from '../pages/Contact.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="clients" element={<Clients />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}