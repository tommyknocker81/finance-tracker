import { useState } from 'react';
import Icon, { IC } from './Icon';
import { STATUS_CONFIG, STATUSES, uid, fmt } from '../data';
import { useIsMobile } from '../hooks/useIsMobile';

const INP = {
  width: '100%', padding: '8px 11px', borderRadius: 6,
  border: '1px solid oklch(88% 0.008 250)',
  background: 'oklch(99.5% 0.002 250)',
  fontSize: 13, color: 'oklch(16% 0.01 250)',
  fontFamily: 'inherit',
};

export default function ProjectModal({ project, onSave, onClose }) {
  const isNew = !project;
  const isMobile = useIsMobile();
  const [form, setForm] = useState(project
    ? { ...project, invoices: project.invoices.map(i => ({ ...i })) }
    : {
        id: uid(), name: '', client: '', status: 'Proposal sent',
        probability: 30, notes: '',
        invoices: [{ id: uid(), name: 'Invoice 1', amount: '', dueDate: '', paid: false }],
      }
  );

  const set    = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addInv = () => setForm(f => ({ ...f, invoices: [...f.invoices, { id: uid(), name: `Invoice ${f.invoices.length + 1}`, amount: '', dueDate: '', paid: false }] }));
  const updInv = (i, k, v) => setForm(f => { const inv = [...f.invoices]; inv[i] = { ...inv[i], [k]: v }; return { ...f, invoices: inv }; });
  const delInv = i => setForm(f => ({ ...f, invoices: f.invoices.filter((_, j) => j !== i) }));
  const total  = form.invoices.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);

  function save() {
    if (!form.name.trim()) return;
    onSave({ ...form, invoices: form.invoices.map(i => ({ ...i, amount: parseFloat(i.amount) || 0 })) });
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'oklch(16% 0.01 250 / 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: isMobile ? '16px 16px 0 0' : 12, width: '100%', maxWidth: isMobile ? '100%' : 540, maxHeight: isMobile ? '95vh' : '90vh', overflowY: 'auto', boxShadow: '0 20px 60px oklch(16% 0.01 250 / 0.15)', ...(isMobile && { position: 'fixed', bottom: 0, left: 0, right: 0, margin: 0 }) }}>

        {/* Header */}
        <div style={{ padding: '22px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>{isNew ? 'New project' : 'Edit project'}</h2>
          <button onClick={onClose} style={{ padding: 5, color: 'oklch(60% 0.01 250)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon d={IC.close} size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 13 }}>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(50% 0.01 250)' }}>Project name</span>
            <input style={INP} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Brand Identity" />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(50% 0.01 250)' }}>Client</span>
              <input style={INP} value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client name" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(50% 0.01 250)' }}>Status</span>
              <select
                style={{ ...INP, cursor: 'pointer' }}
                value={form.status}
                onChange={e => { set('status', e.target.value); set('probability', STATUS_CONFIG[e.target.value]?.prob ?? form.probability); }}
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(50% 0.01 250)' }}>
              Probability — <span style={{ color: 'var(--accent)' }}>{form.probability}%</span>
            </span>
            <input
              type="range" min={0} max={100} step={5}
              value={form.probability}
              onChange={e => set('probability', parseInt(e.target.value))}
              style={{ accentColor: 'var(--accent)' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(50% 0.01 250)' }}>Notes</span>
            <textarea
              style={{ ...INP, resize: 'vertical', minHeight: 52 }}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional"
            />
          </label>

          {/* Invoices */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(50% 0.01 250)' }}>Invoices</span>
              {total > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{fmt(total)} total</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {form.invoices.map((inv, idx) => (
                <div key={inv.id} style={{ background: 'oklch(98% 0.004 250)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      style={{ ...INP, background: 'white', flex: 1, fontSize: 12 }}
                      value={inv.name}
                      onChange={e => updInv(idx, 'name', e.target.value)}
                      placeholder="Milestone name"
                    />
                    <button
                      onClick={() => delInv(idx)}
                      style={{ color: 'oklch(65% 0.1 10)', padding: '0 4px', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Icon d={IC.trash} size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 6, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'oklch(55% 0.01 250)' }}>€</span>
                      <input
                        style={{ ...INP, background: 'white', paddingLeft: 20, fontSize: 12 }}
                        type="number" value={inv.amount}
                        onChange={e => updInv(idx, 'amount', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <input
                      style={{ ...INP, background: 'white', fontSize: 12 }}
                      type="date" value={inv.dueDate}
                      onChange={e => updInv(idx, 'dueDate', e.target.value)}
                    />
                    <button
                      onClick={() => updInv(idx, 'paid', !inv.paid)}
                      style={{
                        padding: '6px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: inv.paid ? 'oklch(91% 0.08 145)' : 'oklch(93% 0.01 250)',
                        color:      inv.paid ? 'oklch(38% 0.14 145)' : 'oklch(52% 0.01 250)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {inv.paid ? '✓ Paid' : 'Pending'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addInv}
              style={{
                marginTop: 6, width: '100%', padding: '8px', borderRadius: 6,
                border: '1px dashed oklch(84% 0.01 250)',
                color: 'oklch(55% 0.01 250)', fontSize: 12, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: 'none', cursor: 'pointer',
              }}
            >
              <Icon d={IC.plus} size={13} /> Add invoice
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 26px 22px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, background: 'oklch(94% 0.008 250)', color: 'oklch(35% 0.01 250)', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{ padding: '8px 20px', borderRadius: 7, fontSize: 13, fontWeight: 600, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
