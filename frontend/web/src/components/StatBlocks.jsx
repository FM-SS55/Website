export default function StatBlocks({ items }) {
  const defaults = [['9', 'CORE SERVICES'], ['1', 'POINT OF CONTACT'], ['Trained', 'STAFF'], ['Written', 'SCOPE OF WORK']];
  return (
    <div className="about-split__visual">
      {(items || defaults).map(([value, label]) => (
        <div className="stat-block" key={label}><strong>{value}</strong><span>{label}</span></div>
      ))}
    </div>
  );
}