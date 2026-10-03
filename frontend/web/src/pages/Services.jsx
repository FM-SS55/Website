import { useFetch } from '@shared/hooks';
import { Loader } from '@shared/components';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import CtaBanner from '../components/CtaBanner.jsx';

export default function Services() {
  usePageTitle('Our Services');
  const { data: services, loading, error } = useFetch(api.services);
  return (
    <>
      <PageHero title="Facility Management Services" crumbs={[['Services']]} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-eyebrow">Full Service Line-Up</div>
            <h2 className="section-title">Everything your site needs, dispatched like a work order</h2>
            <p className="section-desc">Each line of service below can be engaged individually or bundled into a single integrated contract.</p>
          </div>
          {loading || error ? <Loader error={error} /> : services.length ? (
            <div className="services-grid">{services.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
          ) : <p className="section-desc">Services will be listed here shortly.</p>}
        </div>
      </section>
      <CtaBanner alt title="Not sure which services you need?" text="Send us your site details and we'll recommend a scope." button="Talk to Us" />
    </>
  );
}