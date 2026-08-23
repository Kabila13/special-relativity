/**
 * Self-contained brand mark. Replaces an external /manus-storage/*.png reference
 * that does not exist in this repo and would 404 once deployed off the
 * authoring platform. Pure inline SVG: no network request, no missing asset.
 */
export default function ObservatoryMark({ size = 31 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="6" y1="16" x2="26" y2="6" stroke="#e6503e" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="26" cy="6" r="2.4" fill="#e6503e" />
      <circle cx="16" cy="16" r="3.2" fill="none" stroke="#8ce5e4" strokeWidth="1.4" />
    </svg>
  );
}
