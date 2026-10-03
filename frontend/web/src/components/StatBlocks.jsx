export default function StatBlocks({ items }) {
  const defaults = [['2016', 'FOUNDED'], ['1,200+', 'STAFF STRENGTH'], ['9', 'CORE SERVICES'], ['ISO', '9001:2015']];
  return (
    <div className="about-split__visual">
      {(items || defaults).map(([value, label]) => (
        <div className="stat-block" key={label}><strong>{value}</strong><span>{label}</span></div>
      ))}
    </div>
  );
}