import { useState } from 'react';
import { MONTHS, NOW, YEAR, fmt } from '../data';
import MonthModal from './MonthModal';

const BAR_HEIGHT = 200;

export default function Forecast({ projects, onEdit }) {
  const [monthModal, setMonthModal] = useState(null);

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
    <div style={{ flex: 1, overflowY: 'auto', padding: '40px 44px' }}>

      {/* Title */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Revenue outlook · {YEAR}
        </p>
        <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: 'oklch(12% 0.01 250)' }}>
          Forecast
        </h1>
      </div>

      {/* Big stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,auto) 1fr', marginBottom: 36, paddingBottom: 32, borderBottom: '1px solid oklch(91% 0.007 250)' }}>
        <div style={{ paddingRight: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Weighted total</div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)', lineHeight: 1 }}>{fmt(totalW)}</div>
          <div style={{ fontSize: 11, color: 'oklch(62% 0.01 250)', marginTop: 4 }}>probability-adjusted</div>
        </div>
        <div style={{ paddingRight: 40, borderLeft: '1px solid oklch(91% 0.007 250)', paddingLeft: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Best case</div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', color: 'oklch(12% 0.01 250)', lineHeight: 1 }}>{fmt(totalR)}</div>
          <div style={{ fontSize: 11, color: 'oklch(62% 0.01 250)', marginTop: 4 }}>all projects won</div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ marginBottom: 32 }}>
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

        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: BAR_HEIGHT + 28 }}>
          {months.map(m => {
            const isPast = m.idx < NOW.getMonth();
            const isCur  = m.idx === NOW.getMonth();
            const rH = (m.raw      / maxVal) * BAR_HEIGHT;
            const wH = (m.weighted / maxVal) * BAR_HEIGHT;

            return (
              <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* invisible spacer keeps label row aligned */}
                <div style={{ fontSize: 10, fontWeight: 700, color: 'transparent', marginBottom: 3 }}>·</div>

                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: BAR_HEIGHT, gap: 2, justifyContent: 'center' }}>
                  <div style={{
                    width: '44%', height: rH || 0,
                    background: isPast ? 'oklch(93% 0.007 250)' : 'oklch(88% 0.04 250)',
                    borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease',
                    minHeight: m.raw > 0 ? 2 : 0,
                  }} />
                  <div style={{
                    width: '44%', height: wH || 0,
                    background: isPast ? 'oklch(74% 0.08 250)' : 'var(--accent)',
                    borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease',
                    minHeight: m.weighted > 0 ? 2 : 0,
                  }} />
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
