// Declarative config for the four CRUD screens (rendered by ResourcePage).
//   fields: type = text | textarea | number | date | checkbox ; half = share a row with the next field
const today = () => new Date().toISOString().slice(0, 10);

export const banners = {
  name: 'banners', title: 'Banners', singular: 'Banner',
  file: { field: 'image', urlKey: 'image_url', label: 'Banner Image' },
  fields: [
    { key: 'title', label: 'Title', required: true, half: true },
    { key: 'link_url', label: 'Link URL (optional)', half: true, placeholder: '/contact' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
    { key: 'sort_order', label: 'Sort Order', type: 'number', half: true, default: 0 },
    { key: 'is_active', label: 'Active (visible on homepage)', type: 'checkbox', half: true, default: true },
  ],
  columns: [
    { label: '', render: (r) => r.image_url && <img className="admin-thumb" src={r.image_url} alt="" /> },
    { label: 'Title', key: 'title' },
    { label: 'Order', key: 'sort_order' },
    { label: 'Status', badge: (r) => [r.is_active, 'Active', 'Inactive'] },
  ],
};

export const services = {
  name: 'services', title: 'Services', singular: 'Service', slugFrom: 'title',
  file: { field: 'image', urlKey: 'image_url', label: 'Image (optional)' },
  fields: [
    { key: 'title', label: 'Title', required: true, half: true },
    { key: 'slug', label: 'Slug (URL)', required: true, half: true },
    { key: 'icon', label: 'Icon name (optional)', half: true },
    { key: 'sort_order', label: 'Sort Order', type: 'number', half: true, default: 0 },
    { key: 'short_description', label: 'Short Description', type: 'textarea', rows: 2 },
    { key: 'full_description', label: 'Full Description', type: 'textarea', rows: 6 },
    { key: 'is_active', label: 'Active (visible on site)', type: 'checkbox', default: true },
  ],
  columns: [
    { label: 'Title', key: 'title' },
    { label: 'Slug', key: 'slug' },
    { label: 'Order', key: 'sort_order' },
    { label: 'Status', badge: (r) => [r.is_active, 'Active', 'Inactive'] },
  ],
  viewUrl: (r) => `/services/${r.slug}`,
};

export const clients = {
  name: 'clients', title: 'Clients', singular: 'Client',
  file: { field: 'logo', urlKey: 'logo_url', label: 'Logo (optional)' },
  fields: [
    { key: 'name', label: 'Client Name', required: true, half: true },
    { key: 'sort_order', label: 'Sort Order', type: 'number', half: true, default: 0 },
    { key: 'is_active', label: 'Active (visible on site)', type: 'checkbox', default: true },
  ],
  columns: [
    { label: 'Name', key: 'name' },
    { label: 'Order', key: 'sort_order' },
    { label: 'Status', badge: (r) => [r.is_active, 'Active', 'Inactive'] },
  ],
};

export const blog = {
  name: 'blog', title: 'Blog Posts', singular: 'Post', slugFrom: 'title',
  file: { field: 'image', urlKey: 'image_url', label: 'Featured Image (optional)' },
  fields: [
    { key: 'title', label: 'Title', required: true, half: true },
    { key: 'slug', label: 'Slug (URL)', required: true, half: true },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
    { key: 'body', label: 'Body', type: 'textarea', rows: 12 },
    { key: 'published_at', label: 'Published Date', type: 'date', half: true, default: today, from: (v) => (v ? new Date(v).toISOString().slice(0, 10) : today()) },
    { key: 'is_published', label: 'Published (visible on site)', type: 'checkbox', half: true, default: true },
  ],
  columns: [
    { label: 'Title', key: 'title' },
    { label: 'Published', render: (r) => new Date(r.published_at).toDateString() },
    { label: 'Status', badge: (r) => [r.is_published, 'Published', 'Draft'] },
  ],
  viewUrl: (r) => `/blog/${r.slug}`,
};