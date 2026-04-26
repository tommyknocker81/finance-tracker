import Icon, { IC } from './Icon';
import { STATUSES, statusDot } from '../data';
import { supabase } from '../supabase';

const NAV = [
  { id: 'pipeline', label: 'Pipeline', icon: IC.pipeline },
  { id: 'forecast', label: 'Forecast', icon: IC.forecast  },
];

export default function Sidebar({ page, setPage, projects, isMobile }) {
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 800,
        background: 'white', borderTop: '1px solid oklch(92% 0.007 250)',
        display: 'flex', height: 60,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: page === n.id ? 'oklch(16% 0.01 250)' : 'oklch(58% 0.01 250)',
            }}
          >
            <Icon d={n.icon} size={20} sw={1.5} stroke={page === n.id ? 'oklch(16% 0.01 250)' : 'oklch(58% 0.01 250)'} />
            <span style={{ fontSize: 10, fontWeight: page === n.id ? 700 : 500 }}>{n.label}</span>
          </button>
        ))}
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(58% 0.01 250)',
          }}
        >
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={20} sw={1.5} stroke="oklch(58% 0.01 250)" />
          <span style={{ fontSize: 10, fontWeight: 500 }}>Sign out</span>
        </button>
      </nav>
    );
  }

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

      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '8px 10px', borderRadius: 7,
          fontSize: 13, fontWeight: 500, marginBottom: 8,
          background: 'transparent', color: 'oklch(52% 0.01 250)',
          border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
        }}
      >
        <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15} sw={1.5} stroke="oklch(60% 0.01 250)" />
        Sign out
      </button>

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
