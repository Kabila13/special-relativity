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
      <rect width="360" height="300" className="figure-bg" fill="#0a1d2b" />
      <line x1="30" y1="255" x2="330" y2="255" stroke="#7fa2ab" strokeWidth="1.4" />
      <line x1="70" y1="280" x2="70" y2="24" stroke="#7fa2ab" strokeWidth="1.4" />
      <text x="335" y="259" fill="#9fc3ca" fontSize="13">x</text>
      <text x="60" y="20" fill="#9fc3ca" fontSize="13">ct</text>

      <line x1="70" y1="255" x2="300" y2="60" stroke="#8ce5e4" strokeWidth="1.6" />
      <text x="288" y="72" fill="#8ce5e4" fontSize="12" fontStyle="italic">c</text>

      <line x1="70" y1="255" x2="230" y2="35" stroke="#e7e9d8" strokeWidth="1.3" />
      <text x="222" y="30" fill="#e7e9d8" fontSize="12">ct′</text>
      <line x1="20" y1="230" x2="300" y2="150" stroke="#e7e9d8" strokeWidth="1.3" />
      <text x="292" y="146" fill="#e7e9d8" fontSize="12">x′</text>

      <g transform="translate(190 128)">
        <rect x="-6" y="-6" width="12" height="12" fill="#e6503e" stroke="#ffcfbf" />
        <text x="10" y="-10" fill="#f8d1c9" fontSize="11">event E</text>
      </g>
    </svg>
  );
}
