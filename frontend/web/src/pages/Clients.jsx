import { useFetch } from '@shared/hooks';
import { Loader } from '@shared/components';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';

export default function Clients() {
  usePageTitle('Our Valued Clients');
  const { data: clients, loading, error } = useFetch(api.clients);
  return (
    <>
      <PageHero title="Our Valued Clients" crumbs={[['Our Valued Clients']]} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-eyebrow">Trusted By</div>
            <h2 className="section-title">Organizations we support across sectors</h2>
            <p className="section-desc">From corporate campuses to hospitals and educational institutions, our clients span every sector we serve.</p>
          </div>
          {loading || error ? <Loader error={error} /> : clients.length ? (
            <div className="clients-strip">{clients.map((c) => <span className="client-chip" key={c.id}>{c.name}</span>)}</div>
          ) : <p className="section-desc">Client list coming soon.</p>}
        </div>
      </section>
      <CtaBanner alt title="Join our client roster" text="Let's discuss a facility management plan for your site." button="Get in Touch" />
    </>
  );
}