import { Link, useParams } from 'react-router-dom';
import { useFetch } from '@shared/hooks';
import { Loader } from '@shared/components';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import StatBlocks from '../components/StatBlocks.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import NotFound from './NotFound.jsx';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, loading, error } = useFetch(() => api.service(slug), [slug]);
  usePageTitle(service?.title);

  if (loading) return <Loader />;
  if (error) return error.status === 404 ? <NotFound /> : <Loader error={error} />;

  return (
    <>
      <PageHero title={service.title} crumbs={[['Services', '/services'], [service.title]]} />
      <section className="section">
        <div className="container about-split">
          <div className="about-split__text">
            <div className="section-eyebrow">Service Overview</div>
            <h2 className="section-title">{service.short_description}</h2>
            <p>{service.full_description}</p>
            <ul className="checklist">
              <li>Dedicated trained personnel assigned to your site</li>
              <li>Documented scope of work and service schedule</li>
              <li>Ongoing quality checks and supervisor oversight</li>
            </ul>
            <div style={{ marginTop: 26, display: 'flex', gap: 14 }}>
              <Link to="/contact" className="btn btn-dark">Request a Quote</Link>
              <Link to="/services" className="btn btn-outline" style={{ color: 'var(--ink)', borderColor: 'var(--ink)' }}>All Services</Link>
            </div>
          </div>
          <StatBlocks items={[['1', 'POINT OF CONTACT'], ['Trained', 'STAFF'], ['Written', 'SCOPE OF WORK'], ['Site', 'SUPERVISION']]} />
        </div>
      </section>
      <CtaBanner alt title={`Ready to get started with ${service.title}?`} text="Tell us about your site and timeline — we'll respond with a proposal." button="Contact Us" />
    </>
  );
}