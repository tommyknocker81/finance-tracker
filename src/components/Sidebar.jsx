import Icon, { IC } from './Icon';
import { STATUSES, statusDot } from '../data';

const NAV = [
  { id: 'pipeline', label: 'Pipeline', icon: IC.pipeline },
  { id: 'forecast', label: 'Forecast', icon: IC.forecast  },
];

export default function Sidebar({ page, setPage, projects }) {
  return (
    <nav style={{
      width: 200, flexShrink: 0,
      background: 'white',
      borderRight: '1px solid oklch(92% 0.007 250)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 14px',
    }}>
      {/* Logo / brand */}
      <div style={{ paddingLeft: 8, marginBottom: 28 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: 'oklch(16% 0.01 250)', marginBottom: 16,
        }} />
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: 'oklch(20% 0.01 250)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Forecast</div>
      </div>

      {/* Nav items */}
      {NAV.map(n => (
        <button
          key={n.id}
          onClick={() => setPage(n.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 7,
            fontSize: 13, fontWeight: 500,
            background: page === n.id ? 'oklch(95% 0.008 250)' : 'transparent',
            color: page === n.id ? 'oklch(16% 0.01 250)' : 'oklch(52% 0.01 250)',
            marginBottom: 1, textAlign: 'left', width: '100%',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.1s',
          }}
        >
          <Icon
            d={n.icon} size={15} sw={1.5}
            stroke={page === n.id ? 'oklch(16% 0.01 250)' : 'oklch(60% 0.01 250)'}
          />
          {n.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Status counts */}
      <div style={{ padding: '12px 10px' }}>
        {STATUSES.map(s => {
          const count = projects.filter(p => p.status === s).length;
          if (!count) return null;
          return (
            <div key={s} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '3px 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: statusDot(s), display: 'inline-block',
                }} />
                <span style={{ fontSize: 11, color: 'oklch(48% 0.01 250)' }}>{s}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(40% 0.01 250)' }}>{count}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
