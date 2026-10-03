import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import StatBlocks from '../components/StatBlocks.jsx';
import CtaBanner from '../components/CtaBanner.jsx';

const principles = [
  ['Accountability', 'One point of contact per site, with documented sign-off on every job — not verbal assurances.'],
  ['Training', 'Staff are trained and certified against our internal standards before deployment to any site.'],
  ['Safety First', 'Health and safety protocols are built into every service line, from chemical handling to site access.'],
];

export default function About() {
  usePageTitle('About Us');
  return (
    <>
      <PageHero title="About Pulizia FM Services" crumbs={[['About Us']]} />

      <section className="section">
        <div className="container about-split">
          <StatBlocks />
          <div className="about-split__text">
            <div className="section-eyebrow">Our Story</div>
            <h2 className="section-title">Built around one idea: one accountable team</h2>
            <p>Pulizia FM Services was founded in 2016 to solve a simple, recurring problem for facility managers: too many vendors, too little accountability. Instead of separate contracts for housekeeping, security, landscaping, and maintenance, we bring all of it under a single, ISO 9001:2015 certified operation.</p>
            <p>Today the company supports commercial offices, residential complexes, hospitals, hotels, schools, and universities across the National Capital Region, with a workforce of over 1,200 trained and uniformed staff.</p>
            <p>Every engagement starts with a site assessment, a documented scope of work, and a dedicated supervisor — so service levels are measurable, not just promised.</p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head section-head--center">
            <div className="section-eyebrow">What Guides Us</div>
            <h2 className="section-title">Our Operating Principles</h2>
          </div>
          <div className="services-grid">
            {principles.map(([title, desc]) => (
              <div className="ticket-card" key={title}>
                <div className="ticket-card__top">
                  <div className="ticket-card__icon">◆</div>
                  <h3 className="ticket-card__title">{title}</h3>
                  <p className="ticket-card__desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner title="Want to see us in action?" text="Get in touch and we'll walk you through a proposal for your site." button="Contact Us" />
    </>
  );
}