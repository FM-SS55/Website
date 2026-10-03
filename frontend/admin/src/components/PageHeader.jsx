export default function PageHeader({ title }) {
  return (
    <div className="admin-topline">
      <h1 className="admin-title">{title}</h1>
      <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">View Live Site ↗</a>
    </div>
  );
}