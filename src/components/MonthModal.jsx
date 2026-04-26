import Icon, { IC } from './Icon';
import Pill from './Pill';
import { fmt, YEAR } from '../data';

export default function MonthModal({ month, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'oklch(16% 0.01 250 / 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: 14, width: '100%', maxWidth: 560,
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px oklch(16% 0.01 250 / 0.14)',
        animation: 'fadeUp 0.18s ease',
      }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>

        {/* Header */}
        <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid oklch(93% 0.006 250)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>{month.label} {YEAR}</h2>
            <p style={{ fontSize: 12, color: 'oklch(58% 0.01 250)', marginTop: 3 }}>
              {month.invs.length} invoice{month.invs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Total</div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>{fmt(month.raw)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Weighted</div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--accent)' }}>{fmt(month.weighted)}</div>
            </div>
            <button
              onClick={onClose}
              style={{ color: 'oklch(60% 0.01 250)', display: 'flex', padding: 4, marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Icon d={IC.close} size={16} />
            </button>
          </div>
        </div>

        {/* Invoice list */}
        <div style={{ overflowY: 'auto' }}>
          {month.invs.map((inv, idx) => (
            <div
              key={inv.id}
              style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto auto',
                gap: 14, alignItems: 'center', padding: '14px 26px',
                borderBottom: idx < month.invs.length - 1 ? '1px solid oklch(95% 0.005 250)' : 'none',
              }}
            >
              <Pill status={inv.project.status} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.project.name}</div>
                <div style={{ fontSize: 11, color: 'oklch(58% 0.01 250)', marginTop: 2 }}>
                  {inv.name} · due {new Date(inv.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>{fmt(inv.amount)}</div>
                <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>
                  {fmt(inv.amount * inv.project.probability / 100)} weighted
                </div>
              </div>
              <span style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, flexShrink: 0,
                background: inv.paid ? 'oklch(92% 0.07 145)' : 'oklch(94% 0.01 250)',
                color:      inv.paid ? 'oklch(38% 0.14 145)' : 'oklch(52% 0.01 250)',
              }}>
                {inv.paid ? '✓ Paid' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
