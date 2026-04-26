import { useState } from 'react';
import Icon, { IC } from './Icon';
import Pill from './Pill';
import { STATUSES, YEAR, fmt } from '../data';

function ProjectCard({ p, onClick }) {
  const total    = p.invoices.reduce((s, i) => s + i.amount, 0);
  const weighted = total * p.probability / 100;
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'oklch(78% 0.01 250)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'oklch(92% 0.007 250)'}
      style={{
        background: 'white', borderRadius: 10, padding: '16px 18px',
        border: '1px solid oklch(92% 0.007 250)', cursor: 'pointer',
        transition: 'border-color 0.15s',
        opacity: p.status === 'Lost' ? 0.45 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <Pill status={p.status} />
        <span style={{ fontSize: 10, color: 'oklch(62% 0.01 250)' }}>{p.invoices.length} inv.</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>{p.name}</div>
      {p.client && <div style={{ fontSize: 11, color: 'oklch(58% 0.01 250)', marginBottom: 12 }}>{p.client}</div>}
      <div style={{ borderTop: '1px solid oklch(94% 0.006 250)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>{fmt(total)}</div>
          <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600, marginTop: 1 }}>{fmt(weighted)} weighted</div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'oklch(72% 0.01 250)' }}>{p.probability}%</div>
      </div>
    </div>
  );
}

function ProjectRow({ p, onClick }) {
  const total = p.invoices.reduce((s, i) => s + i.amount, 0);
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.background = 'oklch(98.5% 0.004 240)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px 24px',
        gap: 12, alignItems: 'center', padding: '13px 0',
        borderBottom: '1px solid oklch(94% 0.006 250)',
        cursor: 'pointer', opacity: p.status === 'Lost' ? 0.45 : 1,
        transition: 'background 0.1s',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
        {p.client && <div style={{ fontSize: 11, color: 'oklch(58% 0.01 250)', marginTop: 1 }}>{p.client}</div>}
      </div>
      <div><Pill status={p.status} /></div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(total)}</div>
        <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>{fmt(total * p.probability / 100)}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'oklch(55% 0.01 250)' }}>{p.probability}%</div>
      <Icon d={IC.chevR} size={14} stroke="oklch(72% 0.01 250)" />
    </div>
  );
}

export default function Pipeline({ projects, onSelect, onNew }) {
  const [filter, setFilter] = useState('All');

  const active   = projects.filter(p => p.status !== 'Lost');
  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  const totalPipeline = active.reduce((s, p) => s + p.invoices.reduce((a, i) => a + i.amount, 0), 0);
  const totalWeighted = active.reduce((s, p) => s + p.invoices.reduce((a, i) => a + i.amount, 0) * p.probability / 100, 0);
  const totalWon      = projects.filter(p => p.status === 'Won').reduce((s, p) => s + p.invoices.reduce((a, i) => a + i.amount, 0), 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '40px 44px' }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Sales · {YEAR}
          </p>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: 'oklch(12% 0.01 250)' }}>
            Pipeline
          </h1>
        </div>
        <button
          onClick={onNew}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'oklch(16% 0.01 250)', color: 'white',
            border: 'none', cursor: 'pointer', transition: 'opacity 0.15s',
          }}
        >
          <Icon d={IC.plus} size={14} sw={2.5} stroke="white" />
          New project
        </button>
      </div>

      {/* Big stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        marginBottom: 36, paddingBottom: 32,
        borderBottom: '1px solid oklch(91% 0.007 250)',
      }}>
        {[
          { label: 'Pipeline value',    val: fmt(totalPipeline), sub: 'excl. lost' },
          { label: 'Weighted forecast', val: fmt(totalWeighted), sub: 'by probability', accent: true },
          { label: 'Won this year',     val: fmt(totalWon),      sub: 'confirmed',      green: true  },
        ].map(s => (
          <div key={s.label} style={{ paddingRight: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{
              fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
              color: s.accent ? 'var(--accent)' : s.green ? 'oklch(36% 0.12 145)' : 'oklch(12% 0.01 250)',
            }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'oklch(62% 0.01 250)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(f => {
          const count  = f === 'All' ? projects.length : projects.filter(p => p.status === f).length;
          const active = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: active ? 'oklch(16% 0.01 250)' : 'transparent',
                color:      active ? 'white' : 'oklch(50% 0.01 250)',
                border: `1px solid ${active ? 'transparent' : 'oklch(88% 0.008 250)'}`,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {f} <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* List header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px 24px',
        gap: 12, padding: '0 0 8px',
        borderBottom: '1px solid oklch(90% 0.007 250)',
      }}>
        {['Project', 'Status', 'Value', 'Prob.', ''].map(h => (
          <div key={h} style={{ fontSize: 10, fontWeight: 600, color: 'oklch(58% 0.01 250)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</div>
        ))}
      </div>

      {filtered.map(p => <ProjectRow key={p.id} p={p} onClick={() => onSelect(p)} />)}

      {filtered.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'oklch(65% 0.01 250)', fontSize: 13 }}>
          No projects — <button onClick={onNew} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>add one</button>
        </div>
      )}
    </div>
  );
}
