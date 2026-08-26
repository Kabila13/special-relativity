/**
 * Static figure for the Lorentz-transformation section: unprimed axes (S),
 * tilted primed axes (S'), the invariant 45 degree light line, and one
 * marked event. Kept intentionally simpler than the live MinkowskiDiagram
 * instrument so the two are visually distinct (this one is not interactive).
 * Locally rendered so the figure never depends on an external image host.
 */
export default function LorentzFigure() {
  return (
    <svg viewBox="0 0 360 300" role="img" aria-label="Diagram of unprimed axes S, tilted primed axes S prime, the light line, and a marked event">
      <rect width="360" height="300" fill="#0a1d2b" />
      <line x1="30" y1="255" x2="330" y2="255" stroke="#7fa2ab" strokeWidth="1.4" />
      <line x1="70" y1="280" x2="70" y2="24" stroke="#7fa2ab" strokeWidth="1.4" />
      <text x="335" y="259" fill="#9fc3ca" fontSize="13">x</text>
      <text x="60" y="20" fill="#9fc3ca" fontSize="13">ct</text>

      {/* light cone — both legs, solid */}
      <line x1="70" y1="255" x2="300" y2="60" stroke="#8ce5e4" strokeWidth="1.6" />
      <line x1="70" y1="255" x2="10" y2="45" stroke="#8ce5e4" strokeWidth="1.6" />
      <text x="288" y="72" fill="#8ce5e4" fontSize="12" fontStyle="italic">c</text>
      <text x="4" y="58" fill="#8ce5e4" fontSize="12" fontStyle="italic">c</text>

      {/* primed axes — gold, fully opaque, distinct from background */}
      <line x1="70" y1="255" x2="230" y2="35" stroke="#e6bf6c" strokeWidth="1.6" />
      <text x="222" y="30" fill="#e6bf6c" fontSize="12" fontWeight="600">ct′</text>
      <line x1="20" y1="230" x2="300" y2="150" stroke="#e6bf6c" strokeWidth="1.6" />
      <text x="292" y="146" fill="#e6bf6c" fontSize="12" fontWeight="600">x′</text>

      <g transform="translate(190 128)">
        <circle r="14" fill="none" stroke="#e6503e" strokeWidth="1.2" opacity="0.55" />
        <rect x="-6" y="-6" width="12"
