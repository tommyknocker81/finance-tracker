import Icon, { IC } from './Icon';
import Pill from './Pill';
import { fmt } from '../data';

export default function ProjectDetail({ project, onEdit, onDelete, onClose, onTogglePaid }) {
  const total    = project.invoices.reduce((s, i) => s + i.amount, 0);
  const paid     = project.invoices.filter(i => i.paid).reduce((s, i) => s + i.amount, 0);
  const weighted = total * project.probability / 100;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 900 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Scrim */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'oklch(16% 0.01 250 / 0.12)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 400, background: 'white',
        boxShadow: '-8px 0 32px oklch(16% 0.01 250 / 0.08)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.2s ease',
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:none}}`}</style>

        {/* Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid oklch(93% 0.006 250)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Pill status={project.status} />
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={onEdit}
                style={{ padding: 6, borderRadius: 6, color: 'oklch(55% 0.01 250)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Icon d={IC.edit} size={14} />
              </button>
              <button
                onClick={onClose}
                style={{ padding: 6, borderRadius: 6, color: 'oklch(55% 0.01 250)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Icon d={IC.close} size={14} />
              </button>
            </div>
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 800, marginTop: 10, lineHeight: 1.25, letterSpacing: '-0.02em' }}>{project.name}</h2>
          {project.client && <p style={{ fontSize: 12, color: 'oklch(55% 0.01 250)', marginTop: 4 }}>{project.client}</p>}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid oklch(93% 0.006 250)', paddingBottom: 20 }}>
            {[
              { label: 'Total value', val: fmt(total) },
              { label: 'Weighted',   val: fmt(weighted), accent: true },
              { label: 'Collected',  val: fmt(paid),     green: true  },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                <div style={{
                  fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em',
                  color: s.accent ? 'var(--accent)' : s.green ? 'oklch(38% 0.12 145)' : 'oklch(16% 0.01 250)',
                }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Probability bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'oklch(55% 0.01 250)' }}>Win probability</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{project.probability}%</span>
            </div>
            <div style={{ height: 3, background: 'oklch(92% 0.01 250)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${project.probability}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
          </div>

          {/* Notes */}
          {project.notes && (
            <p style={{ fontSize: 13, color: 'oklch(40% 0.01 250)', lineHeight: 1.55, borderLeft: '2px solid oklch(90% 0.01 250)', paddingLeft: 12 }}>
              {project.notes}
            </p>
          )}

          {/* Invoices */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(55% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Invoices</div>
            {project.invoices.map(inv => (
              <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid oklch(95% 0.005 250)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.name}</div>
                  {inv.dueDate && (
                    <div style={{ fontSize: 11, color: 'oklch(58% 0.01 250)', marginTop: 1 }}>
                      {new Date(inv.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{fmt(inv.amount)}</div>
                <button
                  onClick={() => onTogglePaid(project.id, inv.id)}
                  style={{
                    padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, flexShrink: 0,
                    background: inv.paid ? 'oklch(92% 0.07 145)' : 'oklch(94% 0.01 250)',
                    color:      inv.paid ? 'oklch(38% 0.14 145)' : 'oklch(52% 0.01 250)',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {inv.paid ? '✓ Paid' : 'Pending'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 28px', borderTop: '1px solid oklch(93% 0.006 250)' }}>
          <button
            onClick={onDelete}
            style={{ fontSize: 12, fontWeight: 600, color: 'oklch(52% 0.12 10)', display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Icon d={IC.trash} size={13} /> Delete project
          </button>
        </div>
      </div>
    </div>
  );
}
