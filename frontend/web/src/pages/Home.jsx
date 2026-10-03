import { Link } from 'react-router-dom';
import { useFetch } from '@shared/hooks';
import { Loader } from '@shared/components';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import HeroSlider from '../components/HeroSlider.jsx';
import StatBlocks from '../components/StatBlocks.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import BlogCard from '../components/BlogCard.jsx';
import CtaBanner from '../components/CtaBanner.jsx';

export default function Home() {
  usePageTitle('');
  const { data, loading, error } = useFetch(api.home);
  if (loading || error) return <Loader error={error} />;
  const { banners, services, clients, latestPosts } = data;

  return (
    <>
      <HeroSlider banners={banners} />

      <section className="section">
        <div className="container about-split">
          <StatBlocks />
          <div className="about-split__text">
            <div className="section-eyebrow">Who We Are</div>
            <h2 className="section-title">A single accountable partner for every facility need</h2>
            <p>Mandafia Services brings housekeeping, security, landscaping, technical maintenance, and hospitality support under one roof, so facility managers deal with one team instead of a dozen vendors.</p>
            <p>Every team member is trained, uniformed, and supervised against documented service standards.</p>
            <ul className="checklist">
              <li>Dedicated site supervisors and quality audits</li>
              <li>Scalable staffing for commercial, healthcare, and residential sites</li>
              <li>Transparent reporting and rapid response times</li>
            </ul>
            <div style={{ marginTop: 26 }}><Link to="/about" className="btn btn-dark">More About Us</Link></div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title">Facility Management Services</h2>
            <p className="section-desc">Each service is run like a dispatched work order — scheduled, tracked, and signed off, not just "done."</p>
          </div>
          <div className="services-grid">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="section-eyebrow">Trusted By</div>
              <h2 className="section-title">Our Valued Clients</h2>
            </div>
            <div className="clients-strip">
              {clients.map((c) => <span className="client-chip" key={c.id}>{c.name}</span>)}
            </div>
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <div className="section-eyebrow">From the Blog</div>
              <h2 className="section-title">Insights on Facility Management</h2>
            </div>
            <div className="blog-grid">
              {latestPosts.map((p) => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBanner title="Need a facility management partner?" text="Tell us about your site and we'll put together a scoped proposal." button="Request a Quote" />
    </>
  );
}