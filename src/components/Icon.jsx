export const IC = {
  pipeline: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  forecast:  "M3 3v18h18M7 16l4-4 4 4 4-7",
  plus:      "M12 5v14M5 12h14",
  chevR:     "M9 18l6-6-6-6",
  trash:     "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  close:     "M18 6L6 18M6 6l12 12",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
};

export default function Icon({ d, size = 16, stroke = 'currentColor', fill = 'none', sw = 1.75 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill={fill} stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
