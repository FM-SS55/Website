import { useState } from 'react';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import { site, phoneHref } from '../config/site.js';

const empty = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  usePageTitle('Contact Us');
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ sent: false, error: null, busy: false });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ sent: false, error: null, busy: true });
    try {
      await api.sendContact(form);
      setForm(empty);
      setStatus({ sent: true, error: null, busy: false });
    } catch (err) {
      setStatus({ sent: false, error: err.message, busy: false });
    }
  }

  return (
    <>
      <PageHero title="Contact Us" crumbs={[['Contact Us']]} />
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div>
            <div className="section-eyebrow">Get In Touch</div>
            <h2 className="section-title">Let's talk about your site</h2>
            <p className="section-desc" style={{ marginBottom: 30 }}>Send us a few details and our team will get back to you, usually within one business day.</p>

            {status.sent && <div className="form-success">Thanks — your message has been received. We'll be in touch shortly.</div>}
            {status.error && <div className="form-error">{status.error}</div>}

            <form onSubmit={onSubmit} className="form-grid">
              <div className="form-field"><label htmlFor="name">Full Name</label><input id="name" required value={form.name} onChange={set('name')} /></div>
              <div className="form-field"><label htmlFor="email">Email Address</label><input id="email" type="email" required value={form.email} onChange={set('email')} /></div>
              <div className="form-field"><label htmlFor="phone">Phone Number</label><input id="phone" type="tel" value={form.phone} onChange={set('phone')} /></div>
              <div className="form-field"><label htmlFor="message">Message</label><textarea id="message" rows="5" required value={form.message} onChange={set('message')} /></div>
              <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }} disabled={status.busy}>
                {status.busy ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

          <div>
            <div className="section-eyebrow">Reach Us Directly</div>
            <h2 className="section-title">Contact Details</h2>
            <div style={{ marginTop: 20, display: 'grid', gap: 16, fontSize: 15 }}>
              {site.phone && <div><strong>Phone:</strong> <a href={phoneHref(site.phone)}>{site.phone}</a></div>}
              <div><strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a></div>
              {site.address && <div><strong>Location:</strong> {site.address}</div>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}