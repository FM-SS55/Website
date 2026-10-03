import { useEffect, useMemo, useState } from 'react';
import { useFetch } from '@shared/hooks';
import { slugify } from '@shared/utils';
import { resourceApi } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

const initialValues = (config, row) => {
  const v = {};
  config.fields.forEach((f) => {
    const dflt = typeof f.default === 'function' ? f.default() : f.default;
    if (row) {
      const raw = row[f.key];
      v[f.key] = f.from ? f.from(raw) : f.type === 'checkbox' ? !!raw : raw ?? '';
    } else {
      v[f.key] = dflt ?? (f.type === 'checkbox' ? false : '');
    }
  });
  return v;
};

function Field({ f, value, onChange }) {
  const id = `f-${f.key}`;
  if (f.type === 'checkbox') {
    return (
      <div style={{ alignSelf: 'end' }}>
        <label className="admin-checkbox" htmlFor={id}>
          <input type="checkbox" id={id} checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}
        </label>
      </div>
    );
  }
  const common = { id, value, required: f.required, placeholder: f.placeholder, onChange: (e) => onChange(e.target.value) };
  return (
    <div>
      <label htmlFor={id}>{f.label}</label>
      {f.type === 'textarea' ? <textarea rows={f.rows || 3} {...common} /> : <input type={f.type || 'text'} {...common} />}
    </div>
  );
}

export default function ResourcePage({ config }) {
  const api = useMemo(() => resourceApi(config.name), [config.name]);
  const { data: rows, loading, error, reload } = useFetch(api.list, [config.name]);

  const [editing, setEditing] = useState(null); // row being edited, or null = adding
  const [values, setValues] = useState(() => initialValues(config, null));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok' | 'error', text }
  const [busy, setBusy] = useState(false);

  // reset form whenever the screen (resource) changes
  useEffect(() => { startAdd(); /* eslint-disable-next-line */ }, [config.name]);

  useEffect(() => {
    if (!file) { setPreview(null); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function startAdd() {
    setEditing(null); setValues(initialValues(config, null)); setFile(null); setSlugTouched(false); setMsg(null);
  }
  function startEdit(row) {
    setEditing(row); setValues(initialValues(config, row)); setFile(null); setSlugTouched(true); setMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setValue(key, val) {
    setValues((prev) => {
      const next = { ...prev, [key]: val };
      if (key === config.slugFrom && !editing && !slugTouched) next.slug = slugify(val);
      return next;
    });
    if (key === 'slug') setSlugTouched(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const form = new FormData();
    config.fields.forEach((f) => form.append(f.key, f.type === 'checkbox' ? String(!!values[f.key]) : values[f.key] ?? ''));
    if (file) form.append(config.file.field, file);
    try {
      if (editing) await api.update(editing.id, form); else await api.create(form);
      const okText = editing ? 'Changes saved.' : `${config.singular} added.`;
      startAdd();
      setMsg({ type: 'ok', text: okText });
      reload();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    try { await api.remove(row.id); if (editing?.id === row.id) startAdd(); reload(); } catch (err) { setMsg({ type: 'error', text: err.message }); }
  }

  // group fields into rows (half + half share a row)
  const layout = [];
  for (let i = 0; i < config.fields.length; i += 1) {
    const f = config.fields[i];
    const nxt = config.fields[i + 1];
    if (f.half && nxt && nxt.half) { layout.push([f, nxt]); i += 1; } else layout.push([f]);
  }

  const currentImg = preview || (editing && editing[config.file.urlKey]);

  return (
    <>
      <PageHeader title={config.title} />

      <div className="admin-panel">
        <h2>{editing ? `Edit ${config.singular}` : `Add New ${config.singular}`}</h2>
        {msg && <div className={`alert ${msg.type === 'ok' ? 'alert-ok' : 'alert-error'}`}>{msg.text}</div>}
        <form className="admin-form" onSubmit={onSubmit}>
          {layout.map((group) => {
            const fields = group.map((f) => <Field key={f.key} f={f} value={values[f.key]} onChange={(v) => setValue(f.key, v)} />);
            return group.length === 2 ? <div className="admin-form-row" key={group[0].key}>{fields}</div> : <div key={group[0].key}>{fields}</div>;
          })}

          <div>
            <label htmlFor="file">{config.file.label}</label>
            {currentImg && (
              <div className="current-image">
                <img src={currentImg} alt="" />
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{preview ? 'New image preview — not saved until you submit.' : 'Current image — upload a new one to replace it.'}</span>
              </div>
            )}
            <input type="file" id="file" accept="image/*" key={editing ? editing.id : 'new'} onChange={(e) => setFile(e.target.files[0] || null)} />
          </div>

          <div className="admin-form-actions">
            <button type="submit" disabled={busy} className="btn-admin btn-admin-primary">{busy ? 'Saving…' : editing ? 'Save Changes' : `Add ${config.singular}`}</button>
            {editing && <button type="button" className="btn-admin btn-admin-ghost" onClick={startAdd}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All {config.title}</h2>
        {loading ? <div className="admin-loading">Loading…</div> : error ? <div className="alert alert-error">{error.message}</div> : rows.length ? (
          <table className="admin-table">
            <thead><tr>{config.columns.map((c, i) => <th key={i}>{c.label}</th>)}<th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {config.columns.map((c, i) => {
                    if (c.badge) { const [on, yes, no] = c.badge(r); return <td key={i}><span className={`badge ${on ? 'badge--on' : 'badge--off'}`}>{on ? yes : no}</span></td>; }
                    return <td key={i}>{c.render ? c.render(r) : r[c.key]}</td>;
                  })}
                  <td>
                    <div className="row-actions">
                      {config.viewUrl && <a href={config.viewUrl(r)} target="_blank" rel="noreferrer">View</a>}
                      <button onClick={() => startEdit(r)}>Edit</button>
                      <button className="danger" onClick={() => onDelete(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: 'var(--muted)', fontSize: 14 }}>Nothing here yet — add one above.</p>}
      </div>
    </>
  );
}