# Relativity Observatory — status

## Structure, interactivity, and platform cleanup — done
- [x] Special Relativity Chapter 6 module (postulates, Lorentz transforms, velocity addition,
      relativity of simultaneity, spacetime diagrams, worked examples, diagnostic quiz).
- [x] Interactive reference-frame instrument (configurable v, event X, event t) with live γ,
      transformed coordinates, and timelike/spacelike/null interval classification.
- [x] Interactive Minkowski diagram: light cones, tilted S′ axes, worldlines.
- [x] Relativistic velocity-addition challenge with a light-speed guardrail, animated
      two-spacecraft flight strip, and classical-vs-relativistic comparison.
- [x] Two progressive-reveal worked examples (lightning-strike Lorentz transform;
      muon-decay time dilation / length contraction), both using the source's own numbers.
- [x] Six-question diagnostic quiz, grounded in the source's Check Yourself questions.
- [x] localStorage persistence of reading progress / section / quiz answers, with resume
      indicator and reset control; client-side PDF study summary export.
- [x] Codebase split into dedicated components (`components/relativity/*`) and a content
      data module (`data/relativity-content.ts`) instead of a single page file.
- [x] Removed platform-specific scaffolding: dead `Map.tsx` / `ManusDialog.tsx`, the
      Manus debug-collector and storage-proxy Vite plugins, the `__manus__` public folder,
      and the unresolved analytics placeholder script tag.
- [x] Replaced all `/manus-storage/...` image references (logo, hero art, Lorentz figure)
      with local SVG assets in `client/public/assets/`, verified with a served production
      build (`npm run build` + `node dist/index.js`) — all three return 200.
- [x] Pruned `package.json` to the ~17 dependencies actually imported anywhere (removed
      ~30 unused shadcn/Radix components and their packages, framer-motion, recharts,
      react-hook-form, embla-carousel, etc.). Verified with a clean `npm install`.
- [x] Fixed the mobile Minkowski-diagram overflow (`.minkowski-svg` now scales to
      `width:100%` below 760px instead of being clipped at a fixed 560px).
- [x] `tsc --noEmit` and `npm run build` both pass cleanly from a cold install.

## Remaining content-coverage gaps (tracked, not blocking)
- [ ] Build out the Galilean-transformation lead-in (ball-on-a-train velocity-addition
      narrative) as its own interactive section rather than a summary callout.
- [ ] Add the primed-axis scale-factor worked examples (6.12/6.13).
- [ ] Expand beyond two fully-derived worked examples toward the source's larger set.

## Deployment
- [ ] Deploy the production build and confirm the live HTTPS URL loads with no login,
      then link it and the repository in the final submission.
