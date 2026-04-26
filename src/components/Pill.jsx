import { statusBg, statusDot, statusFg } from '../data';

export default function Pill({ status }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 600,
      padding: '2px 7px', borderRadius: 20,
      color: statusFg(status), background: statusBg(status),
    }}>
      <span style={{
        width: 4, height: 4, borderRadius: '50%',
        background: statusDot(status), flexShrink: 0,
      }} />
      {status}
    </span>
  );
}
