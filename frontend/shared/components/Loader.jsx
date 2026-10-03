export default function Loader({ error }) {
  if (error) return <p style={{ padding: 24, color: '#8A2E2E' }}>{error.message}</p>;
  return <p style={{ padding: 24, color: '#5B6A62' }}>Loading…</p>;
}