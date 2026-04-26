import { useState } from 'react';
import { MONTHS, NOW, YEAR, fmt } from '../data';
import MonthModal from './MonthModal';

const BAR_HEIGHT = 200;

export default function Forecast({ projects, onEdit, isMobile }) {
  const [monthModal, setMonthModal] = useState(null);
  const [tooltip, setTooltip]       = useState(null);

  const active = projects.filter(p => p.status !== 'Lost');

  const months = MONTHS.map((label, mi) => {
    const invs = [];
    active.forEach(p =>
      p.invoices.forEach(inv => {
        if (!inv.dueDate) return;
        const d = new Date(inv.dueDate);
        if (d.getFullYear() === YEAR && d.getMonth() === mi) {
          invs.push({ ...inv, project: p });
        }
      })
    );
    return {
      label, idx: mi,
      raw:      invs.reduce((s, i) => s + i.amount, 0),
      weighted: invs.reduce((s, i) => s + i.amount * i.project.probability / 100, 0),
      invs,
    };
  });

  const maxVal = Math.max(...months.map(m => Math.max(m.raw, m.weighted)), 1);
  const totalW = months.reduce((s, m) => s + m.weighted, 0);
  const totalR = months.reduce((s, m) => s + m.raw, 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px' : '40px 44px' }}>

      {/* Title */}
      <div style={{ marginBottom: isMobile ? 20 : 36 }}>
        {!isMobile && <p style={{ fontSize: 11, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Revenue outlook · {YEAR}</p>}
        <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: 'oklch(12% 0.01 250)' }}>
          Forecast
        </h1>
      </div>

      {/* Big stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginBottom: isMobile ? 20 : 36, paddingBottom: isMobile ? 20 : 32, borderBottom: '1px solid oklch(91% 0.007 250)' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Weighted total</div>
          <div style={{ fontSize: isMobile ? 22 : 38, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)', lineHeight: 1 }}>{fmt(totalW)}</div>
          <div style={{ fontSize: 11, color: 'oklch(62% 0.01 250)', marginTop: 4 }}>probability-adjusted</div>
        </div>
        <div style={{ borderLeft: '1px solid oklch(91% 0.007 250)', paddingLeft: isMobile ? 16 : 40 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Best case</div>
          <div style={{ fontSize: isMobile ? 22 : 38, fontWeight: 800, letterSpacing: '-0.03em', color: 'oklch(12% 0.01 250)', lineHeight: 1 }}>{fmt(totalR)}</div>
          <div style={{ fontSize: 11, color: 'oklch(62% 0.01 250)', marginTop: 4 }}>all projects won</div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ marginBottom: 32, overflowX: isMobile ? 'auto' : 'visible' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'oklch(55% 0.01 250)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'oklch(88% 0.04 250)', display: 'inline-block' }} />
            Total value
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'oklch(55% 0.01 250)', marginLeft: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} />
            Weighted
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: BAR_HEIGHT + 28, minWidth: isMobile ? 600 : 'auto' }}>
          {months.map(m => {
            const isPast = m.idx < NOW.getMonth();
            const isCur  = m.idx === NOW.getMonth();
            const rH = (m.raw      / maxVal) * BAR_HEIGHT;
            const wH = (m.weighted / maxVal) * BAR_HEIGHT;

            const showTooltip = (type) => m.invs.length > 0 && setTooltip({ label: m.label, type });

            const Tooltip = ({ type, align }) => {
              const isWeighted = type === 'weighted';
              const label = isWeighted ? 'Weighted' : 'Total value';
              const total = isWeighted ? m.weighted : m.raw;
              return (
                <div style={{
                  position: 'absolute', bottom: '100%',
                  left: align === 'left' ? '0%' : 'auto',
                  right: align === 'right' ? '0%' : 'auto',
                  marginBottom: 8, background: 'oklch(16% 0.01 250)', color: 'white',
                  borderRadius: 8, padding: '8px 12px', zIndex: 100,
                  boxShadow: '0 4px 16px oklch(0% 0 0 / 20%)',
                  whiteSpace: 'nowrap', pointerEvents: 'none', minWidth: 150,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isWeighted ? 'var(--accent)' : 'oklch(78% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                    {label}
                  </div>
                  {m.invs.map(inv => (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 11, padding: '2px 0' }}>
                      <span style={{ color: 'oklch(78% 0.01 250)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{inv.project.name}</span>
                      <span style={{ fontWeight: 700 }}>{fmt(isWeighted ? inv.amount * inv.project.probability / 100 : inv.amount)}</span>
                    </div>
                  ))}
                  {m.invs.length > 1 && (
                    <div style={{ borderTop: '1px solid oklch(30% 0.01 250)', marginTop: 5, paddingTop: 5, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: 'oklch(78% 0.01 250)' }}>Total</span>
                      <span style={{ fontWeight: 700 }}>{fmt(total)}</span>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: '100%',
                    left: align === 'left' ? 20 : 'auto', right: align === 'right' ? 20 : 'auto',
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                    borderTop: '5px solid oklch(16% 0.01 250)',
                  }} />
                </div>
              );
            };

            return (
              <div
                key={m.label}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
              >
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: BAR_HEIGHT, gap: 2, justifyContent: 'center', position: 'relative' }}>
                  {/* Total bar */}
                  <div
                    style={{ width: '44%', height: rH || 0, position: 'relative',
                      background: isPast ? 'oklch(93% 0.007 250)' : tooltip?.label === m.label && tooltip?.type === 'raw' ? 'oklch(80% 0.04 250)' : 'oklch(88% 0.04 250)',
                      borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease, background 0.15s',
                      minHeight: m.raw > 0 ? 2 : 0, cursor: m.raw > 0 ? 'default' : 'default',
                    }}
                    onMouseEnter={() => showTooltip('raw')}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {tooltip?.label === m.label && tooltip?.type === 'raw' && <Tooltip type="raw" align="left" />}
                  </div>
                  {/* Weighted bar */}
                  <div
                    style={{ width: '44%', height: wH || 0, position: 'relative',
                      background: isPast ? 'oklch(74% 0.08 250)' : tooltip?.label === m.label && tooltip?.type === 'weighted' ? 'oklch(40% 0.18 250)' : 'var(--accent)',
                      borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease, background 0.15s',
                      minHeight: m.weighted > 0 ? 2 : 0,
                    }}
                    onMouseEnter={() => showTooltip('weighted')}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {tooltip?.label === m.label && tooltip?.type === 'weighted' && <Tooltip type="weighted" align="right" />}
                  </div>
                </div>

                <div style={{ fontSize: 10, fontWeight: isCur ? 700 : 500, color: isCur ? 'var(--accent)' : isPast ? 'oklch(72% 0.01 250)' : 'oklch(48% 0.01 250)', marginTop: 6 }}>
                  {m.label}
                </div>
                {isCur && <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)', marginTop: 2 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Month summary grid */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Month summary
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 1, background: 'oklch(91% 0.007 250)', borderRadius: 10, overflow: 'hidden' }}>
          {months.map((m, i) => (
            <div
              key={m.label}
              onClick={() => m.invs.length > 0 && setMonthModal(i)}
              onMouseEnter={e => { if (m.invs.length > 0) e.currentTarget.style.background = 'oklch(97.5% 0.008 250)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
              style={{
                background: 'white', padding: '14px 16px',
                opacity: m.idx < NOW.getMonth() ? 0.5 : 1,
                cursor: m.invs.length > 0 ? 'pointer' : 'default',
                transition: 'background 0.12s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(55% 0.01 250)' }}>{m.label}</div>
                {m.invs.length > 0 && <div style={{ fontSize: 10, color: 'oklch(68% 0.01 250)' }}>{m.invs.length} inv.</div>}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: m.raw === 0 ? 'oklch(78% 0.01 250)' : 'oklch(16% 0.01 250)' }}>
                {m.raw === 0 ? '—' : fmt(m.weighted)}
              </div>
              {m.raw > 0 && <div style={{ fontSize: 10, color: 'oklch(62% 0.01 250)', marginTop: 2 }}>of {fmt(m.raw)}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Month invoice modal */}
      {monthModal !== null && (
        <MonthModal
          month={months[monthModal]}
          onClose={() => setMonthModal(null)}
          onEdit={p => { setMonthModal(null); onEdit(p); }}
        />
      )}
    </div>
  );
}
