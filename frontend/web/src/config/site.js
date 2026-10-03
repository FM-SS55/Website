// Single place for business details shown across the public site.
// Leave `phone` / `address` empty to hide them everywhere.
export const site = {
  name: 'Mandafia Services',
  domain: 'mandafiaservices.com',
  email: 'info@mandafiaservices.com',
  phone: '',          // e.g. '+91 98765 43210'
  address: '',        // e.g. 'City, State, Country'
};

export const phoneHref = (p) => `tel:${p.replace(/[^+\d]/g, '')}`;