import type { Frame } from "@/data/relativity-content";

type MinkowskiDiagramProps = { beta: number; eventX: number; eventTime: number; frame: Frame };

export default function MinkowskiDiagram({ beta, eventX, eventTime, frame }: MinkowskiDiagramProps) {
  const width = 700;
  const height = 470;
  const cx = 338;
  const cy = 330;
  const scale = 62;
  const px = cx + eventX * scale;
  const py = cy - eventTime * scale;
  const primeTTop = { x: cx + beta * 4.65 * scale, y: cy - 4.65 * scale };
  const primeXRight = { x: cx + 4.8 * scale, y: cy - beta * 4.8 * scale };
  const primeXLeft = { x: cx - 4.8 * scale, y: cy + beta * 4.8 * scale };
  const simultaneousLeftY = py + beta * (px - 42);
  const simultaneousRightY = py - beta * (658 - px);
  const spacecraftEnd = { x: cx + beta * 4.9 * scale, y: cy - 4.9 * scale };
  return (
    <svg className="minkowski-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Spacetime diagram in frame ${frame} for a relative speed of ${beta.toFixed(2)} c`}>
      <defs>
        <pattern id="spacetime-grid" width="31" height="31" patternUnits="userSpaceOnUse"><path d="M 31 0 L 0 0 0 31" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.18" /></pattern>
        <filter id="red-glow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width={width} height={height} fill="url(#spacetime-grid)" />
      <g className="grid-labels"><text x="51" y="357">−4</text><text x="175" y="357">−2</text><text x="454" y="357">2</text><text x="578" y="357">4</text><text x="312" y="274">1</text><text x="312" y="212">2</text><text x="312" y="150">3</text><text x="312" y="88">4</text></g>
      <g className="base-frame">
        <line x1="42" y1={cy} x2="658" y2={cy} className="axis-base" />
        <line x1={cx} y1="416" x2={cx} y2="42" className="axis-base" />
        <text x="663" y="350">x</text><text x="346" y="48">ct</text><text x="348" y="350" className="origin-label">O</text>
      </g>
      <g className="light-cone">
        <line x1={cx} y1={cy} x2="43" y2="35" /><line x1={cx} y1={cy} x2="633" y2="35" />
        <line x1={cx} y1={cy} x2="44" y2="416" /><line x1={cx} y1={cy} x2="633" y2="416" />
        <text x="72" y="62">c</text><text x="592" y="62">c</text>
      </g>
      <g className="prime-frame">
        <line x1={cx} y1={cy} x2={primeTTop.x} y2={primeTTop.y} />
        <line x1={primeXLeft.x} y1={primeXLeft.y} x2={primeXRight.x} y2={primeXRight.y} />
        <text x={primeTTop.x + 7} y={primeTTop.y + 3}>ct′</text><text x={primeXRight.x - 22} y={primeXRight.y - 8}>x′</text>
      </g>
      <g className="observer-lines">
        <line x1={cx} y1={cy} x2={spacecraftEnd.x} y2={spacecraftEnd.y} className="spacecraft-worldline" />
        <line x1="42" y1={simultaneousLeftY} x2="658" y2={simultaneousRightY} className="simultaneity-line" />
      </g>
      <g className="event-mark" transform={`translate(${px} ${py})`} filter="url(#red-glow)">
        <rect x="-7" y="-7" width="14" height="14" /><circle r="18" className="event-ring" />
      </g>
      <g className="event-label"><line x1={px + 14} y1={py - 14} x2={px + 54} y2={py - 39} /><text x={px + 59} y={py - 43}>EVENT E</text><text x={px + 59} y={py - 27}>({eventX.toFixed(1)}, {eventTime.toFixed(1)})</text></g>
      <g className="frame-tag"><rect x="47" y="43" width="86" height="27" /><text x="59" y="61">VIEW: {frame}</text></g>
    </svg>
  );
}
