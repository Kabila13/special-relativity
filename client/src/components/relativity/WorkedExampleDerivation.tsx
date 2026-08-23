import { useState, type ReactNode } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";

export type DerivationStep = { title: string; content: ReactNode };

type WorkedExampleDerivationProps = {
  eyebrow: string;
  heading: string;
  stamp: string;
  steps: DerivationStep[];
};

/**
 * Progressive step-reveal for a single worked example. Each derivation gets
 * its own local reveal state, so multiple worked examples can sit on a page
 * (e.g. 6.2, 6.5, 6.10) without a shared index colliding between them.
 */
export default function WorkedExampleDerivation({ eyebrow, heading, stamp, steps }: WorkedExampleDerivationProps) {
  const [revealedStep, setRevealedStep] = useState(-1);
  return (
    <article className="derivation-board">
      <div className="derivation-top">
        <div><span className="micro-label">{eyebrow}</span><h3>{heading}</h3></div>
        <span className="derivation-stamp">{stamp}</span>
      </div>
      <div className="derivation-steps">
        {steps.map((step, index) => (
          <div className={`derivation-step ${revealedStep >= index ? "revealed" : ""}`} key={step.title}>
            <button onClick={() => setRevealedStep(Math.max(revealedStep, index))} aria-expanded={revealedStep >= index}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{step.title}</b><ChevronRight size={17} />
            </button>
            {revealedStep >= index && <div className="derivation-content">{step.content}</div>}
          </div>
        ))}
      </div>
      <button className="derivation-reset" onClick={() => setRevealedStep(-1)}><RotateCcw size={14} /> Collapse derivation</button>
    </article>
  );
}
