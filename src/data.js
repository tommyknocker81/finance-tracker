export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const NOW = new Date(2026, 3, 25);
export const YEAR = 2026;

export const STATUS_CONFIG = {
  'Lead':           { hue: 220, prob: 10  },
  'Proposal sent':  { hue: 200, prob: 30  },
  'In negotiation': { hue: 40,  prob: 60  },
  'Won':            { hue: 145, prob: 100 },
  'Lost':           { hue: 10,  prob: 0   },
};
export const STATUSES = Object.keys(STATUS_CONFIG);

export const statusDot = s => `oklch(55% 0.14 ${STATUS_CONFIG[s]?.hue ?? 220})`;
export const statusBg  = s => `oklch(94% 0.05 ${STATUS_CONFIG[s]?.hue ?? 220})`;
export const statusFg  = s => `oklch(40% 0.14 ${STATUS_CONFIG[s]?.hue ?? 220})`;

export function uid() { return Math.random().toString(36).slice(2, 9); }

export const fmt = n =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

function mkSample() {
  return [
    {
      id: uid(), name: 'Branding Identity — Moira Studio', status: 'Won',
      probability: 100, client: 'Moira Studio', notes: '',
      invoices: [
        { id: uid(), name: 'Deposit',        amount: 2500, dueDate: '2026-04-01', paid: true  },
        { id: uid(), name: 'Final delivery', amount: 2500, dueDate: '2026-05-15', paid: false },
      ],
    },
    {
      id: uid(), name: 'E-commerce Redesign', status: 'In negotiation',
      probability: 65, client: 'Feldmann GmbH', notes: 'Waiting for final approval from board.',
      invoices: [
        { id: uid(), name: 'Phase 1 — Discovery', amount: 3200, dueDate: '2026-06-01', paid: false },
        { id: uid(), name: 'Phase 2 — Design',    amount: 4800, dueDate: '2026-08-01', paid: false },
      ],
    },
    {
      id: uid(), name: 'Mobile App MVP', status: 'Proposal sent',
      probability: 40, client: 'Volta Health', notes: '',
      invoices: [
        { id: uid(), name: 'Kickoff',       amount: 5000, dueDate: '2026-07-15', paid: false },
        { id: uid(), name: 'Beta delivery', amount: 5000, dueDate: '2026-09-30', paid: false },
        { id: uid(), name: 'Launch',        amount: 3000, dueDate: '2026-11-01', paid: false },
      ],
    },
    {
      id: uid(), name: 'Annual Report Design', status: 'Lead',
      probability: 20, client: 'Nordbank AG', notes: 'Intro call scheduled.',
      invoices: [
        { id: uid(), name: 'Full project', amount: 6000, dueDate: '2026-10-01', paid: false },
      ],
    },
    {
      id: uid(), name: 'Social Campaign Q2', status: 'Lost',
      probability: 0, client: 'BluePeak', notes: 'Went with another agency.',
      invoices: [
        { id: uid(), name: 'Campaign fee', amount: 2200, dueDate: '2026-05-01', paid: false },
      ],
    },
  ];
}

export const SAMPLE = mkSample();
