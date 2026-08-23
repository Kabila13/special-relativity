# Relativity Observatory — Interactive Physics Module

Relativity Observatory is an advanced, responsive interactive module that turns **Special Relativity** into a sequence of observer-led investigations. Rather than placing equations before interpretation, it gives a learner a live Minkowski diagram, selected events, paired frames S and S′, and direct controls for relative velocity and event coordinates.

## Learning scope and audience

The module is designed for **IB Diploma Physics students** studying special relativity (Chapter 6, *Physics for the IB Diploma*, K. A. Tsokos, 7th Edition). It covers: inertial reference frames, Einstein's two postulates, the Lorentz factor and transformations, relativistic velocity addition, relativity of simultaneity, spacetime diagrams (light cones, worldlines, spacelike/timelike/null intervals), and the muon-decay evidence for time dilation and length contraction. Each idea is paired with a reference-frame assumption, a diagrammatic representation, and a conceptual diagnostic.

## Technology and scientific model

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **KaTeX** through `react-katex`. The spacetime instrument is an inline SVG model using x–ct coordinates; both spatial and temporal axes use matching light-time scales (position is entered as `X = x/c` in light-microseconds, so a photon's worldline is exactly 45° regardless of the chosen units). The one-dimensional transformations are implemented as `x′ = γ(x − vt)` and `t′ = γ(t − vx/c²)`, with `γ = 1/√(1 − v²/c²)`. The diagram updates the S′ frame axes, selected event, and proper-versus-measured quantities live as the controls change.

## Content structure

1. **Reference frames & postulates** — inertial frames, the two postulates, γ.
2. **Lorentz transformations** — live event transform between S and S′, with the muon-decay evidence as a supporting aside.
3. **Addition of velocities** — interactive two-speed challenge with a light-speed guardrail, animated flight strip, and a classical-vs-relativistic comparison.
4. **Relativity of simultaneity** — the source's train/lamp example, with an explicit callout distinguishing "simultaneous emission" from "simultaneous arrival."
5. **Spacetime diagrams** — the Minkowski instrument: light cones, worldlines, and interval classification (timelike / spacelike / null).
6. **Worked examples** — two full progressive-reveal derivations: the lightning-strike Lorentz transform (Worked Example 6.2, exact source numbers) and the muon-decay time-dilation/length-contraction derivation (source numbers: 3.0 km, 0.99c, 2.2 μs).
7. **Check the model** — six diagnostic questions, drawn from and cross-referenced against the source's own Check Yourself questions (inertial frames, proper time, causal intervals, γ at low speed, simultaneity between co-located observers, and the two-frame muon-decay resolution).

Reading progress, the active section, and quiz answers persist to `localStorage` and can be resumed or reset; a client-side PDF export summarizes the session.

## UX and UI rationale

The visual system follows an **Observatory Ledger** concept. Low-glare midnight fields support extended night study, while the Day Sheet toggle offers a lighter alternative and retains the student's preference. Cyan represents invariant light structure, event red identifies the selected event and causal pivot, and muted gold marks proper quantities. The desktop control rail is mirrored by a mobile lesson map, and the spacetime instrument scales down (rather than clipping) below a 760px viewport, keeping the chapter fully navigable at 375px.

## Project structure

```
client/src/
  pages/Home.tsx                    orchestration + layout only
  components/relativity/            MinkowskiDiagram, VelocityFlightStrip,
                                     WorkedExampleDerivation, QuizSection,
                                     LorentzFigure, ObservatoryMark
  components/ui/                    the 5 shadcn primitives actually in use
                                     (button, card, dialog, sonner, tooltip)
  data/relativity-content.ts        navigation, quiz bank, interval classifier
  hooks/useLearnerProgress.ts       localStorage persistence
  lib/export-summary.ts             client-side PDF export (jsPDF)
public/assets/                      local SVG logo, hero art, and Lorentz figure
                                     (no external or platform-specific image hosts)
```

## Local development

```bash
npm install
npm run dev
```

```bash
npm run check   # tsc --noEmit
npm run build   # vite build (client) + esbuild (server) -> dist/
npm start        # serve the production build
```

## Known limitations

- Two of the source chapter's 16 worked examples are covered in depth (6.2 and the muon-decay derivation); the remainder are summarized in prose rather than fully derived.
- The diagnostic quiz has 6 questions; the source chapter's combined Check Yourself / Test Your Understanding sets are considerably larger.
- The primed-axis scale-factor examples (6.12/6.13) and the full Galilean-transformation lead-in (the ball-on-a-train velocity-addition narrative that motivates the postulates) are summarized rather than built out as their own interactive sections.

## Supporting references

1. [Monash University — Time Dilation and Length Contraction](https://www.monash.edu/student-academic-success/physics/relativity/time-dilation-and-length-contraction)
2. [Physics LibreTexts — Lorentz transformations and space-time](https://phys.libretexts.org/Bookshelves/University_Physics/Book%3A_Introductory_Physics_-_Building_Models_to_Describe_Our_World_(Martin_Neary_Rinaldo_and_Woodman)/24%3A_The_Theory_of_Special_Relativity/24.06%3A_Lorentz_transformations_and_space-time)
