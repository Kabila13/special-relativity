/**
 * Relativity Observatory: an advanced low-glare scientific console.
 * Geometry comes first: every equation is paired with a frame, event, or invariant diagram.
 *
 * This page owns layout, state, and orchestration. Section-specific rendering,
 * the SVG instrument, the animation strip, the derivation stepper, and the
 * quiz bank each live in their own module under components/relativity.
 */
import { useEffect, useMemo, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  FileDown,
  Lightbulb,
  Menu,
  Moon,
  Orbit,
  Rocket,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Sun,
  Telescope,
  Trash2,
  Zap,
} from "lucide-react";

import { navigation, quizQuestions, describeInterval, type Frame } from "@/data/relativity-content";
import { useLearnerProgress } from "@/hooks/useLearnerProgress";
import { exportStudySummary } from "@/lib/export-summary";
import MinkowskiDiagram from "@/components/relativity/MinkowskiDiagram";
import VelocityFlightStrip from "@/components/relativity/VelocityFlightStrip";
import WorkedExampleDerivation from "@/components/relativity/WorkedExampleDerivation";
import QuizSection from "@/components/relativity/QuizSection";
import ObservatoryMark from "@/components/relativity/ObservatoryMark";
import LorentzFigure from "@/components/relativity/LorentzFigure";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const {
    activeSection,
    setActiveSection,
    answers,
    setAnswers,
    readingProgress,
    setReadingProgress,
    sessionStatus,
    resetLearnerSession,
  } = useLearnerProgress("postulates");

  const [railOpen, setRailOpen] = useState(false);
  const [isLight, setIsLight] = useState(() => localStorage.getItem("relativity-observatory-theme") === "light");
  const [beta, setBeta] = useState(0.6);
  const [eventX, setEventX] = useState(2.0);
  const [eventTime, setEventTime] = useState(4.0);
  const [frameSpeed, setFrameSpeed] = useState(0.8);
  const [objectSpeed, setObjectSpeed] = useState(0.5);
  const [frame, setFrame] = useState<Frame>("S");
  const [shareStatus, setShareStatus] = useState("");
  const [exportStatus, setExportStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("relativity-observatory-theme", isLight ? "light" : "night");
  }, [isLight]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = documentHeight > 0 ? Math.round(Math.min(100, Math.max(0, (window.scrollY / documentHeight) * 100))) : 0;
      setReadingProgress(nextProgress);
      const currentSection = navigation
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => Boolean(element))
        .filter((element) => element.getBoundingClientRect().top <= window.innerHeight * 0.42)
        .at(-1)?.id;
      if (currentSection) setActiveSection((current) => (current === currentSection ? current : currentSection));
    };
    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", updateReadingProgress);
    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
      window.removeEventListener("resize", updateReadingProgress);
    };
  }, [setActiveSection, setReadingProgress]);

  const model = useMemo(() => {
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    const properTime = 10;
    const properLength = 120;
    const xPrime = gamma * (eventX - beta * eventTime);
    const tPrime = gamma * (eventTime - beta * eventX);
    return {
      gamma,
      xPrime,
      tPrime,
      dilatedTime: gamma * properTime,
      contractedLength: properLength / gamma,
      intervalKind: describeInterval(eventX, eventTime),
    };
  }, [beta, eventX, eventTime]);

  const velocityModel = useMemo(() => {
    const combined = (objectSpeed + frameSpeed) / (1 + objectSpeed * frameSpeed);
    const classical = objectSpeed + frameSpeed;
    const lightCase = Math.abs(objectSpeed - 1) < 0.001;
    const comparison = Math.abs(classical) > 1 ? "overestimates" : Math.abs(combined) > Math.abs(classical) ? "underestimates" : "matches the low-speed limit";
    return { combined, classical, staysAtOrBelowLight: Math.abs(combined) <= 1.0000001, lightCase, comparison };
  }, [frameSpeed, objectSpeed]);

  const completed = quizQuestions.filter((item) => answers[item.id] === item.answer).length;
  const chooseNav = (id: string) => {
    setActiveSection(id);
    setRailOpen(false);
    scrollToSection(id);
  };
  const resetObservatory = () => { setBeta(0.6); setEventX(2); setEventTime(4); setFrame("S"); };
  const resetVelocityChallenge = () => { setFrameSpeed(0.8); setObjectSpeed(0.5); };

  const shareVelocityResult = async () => {
    const relativitySpeed = `${velocityModel.combined >= 0 ? "+" : ""}${velocityModel.combined.toFixed(3)}c`;
    const classicalSpeed = `${velocityModel.classical >= 0 ? "+" : ""}${velocityModel.classical.toFixed(2)}c`;
    const resultText = `Relativity Observatory challenge: with v = ${frameSpeed >= 0 ? "+" : ""}${frameSpeed.toFixed(2)}c and u′ = ${objectSpeed >= 0 ? "+" : ""}${objectSpeed.toFixed(2)}c, relativistic velocity addition gives u = ${relativitySpeed}. The Galilean sum is ${classicalSpeed}.`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Relativity Observatory — Velocity Addition", text: resultText, url: shareUrl });
        setShareStatus("Shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    const sharePayload = `${resultText}\n${shareUrl}`;
    const legacyCopy = () => {
      const copyField = document.createElement("textarea");
      copyField.value = sharePayload;
      copyField.setAttribute("readonly", "");
      copyField.style.position = "fixed";
      copyField.style.opacity = "0";
      document.body.appendChild(copyField);
      copyField.select();
      const copied = document.execCommand("copy");
      copyField.remove();
      return copied;
    };
    const clipboardCopy = navigator.clipboard?.writeText
      ? await Promise.race<boolean>([
          navigator.clipboard.writeText(sharePayload).then(() => true).catch(() => false),
          new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 450)),
        ])
      : false;
    setShareStatus(clipboardCopy || legacyCopy() ? "Copied result" : "Copy unavailable");
  };

  const handleExportSummary = () => {
    exportStudySummary({
      readingProgress,
      correctAnswers: completed,
      totalQuestions: quizQuestions.length,
      frameSpeed,
      objectSpeed,
      relativisticSpeed: velocityModel.combined,
      classicalSpeed: velocityModel.classical,
    });
    setExportStatus("PDF downloaded");
  };

  return (
    <div className={`relativity-app ${isLight ? "is-light" : ""}`}>
      <header className="relativity-topbar">
        <a className="observatory-brand" href="#top" aria-label="Relativity Observatory home">
          <ObservatoryMark />
          <span>RELATIVITY <b>OBSERVATORY</b></span>
        </a>
        <div className="observatory-progress" aria-label={`Chapter 6 reading progress: ${readingProgress}%`}>
          <span>CH. 06</span>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={readingProgress}><i style={{ width: `${readingProgress}%` }} /></div>
          <b>{readingProgress}%</b>
        </div>
        <div className="top-controls">
          <button className="mode-toggle" onClick={() => setIsLight((current) => !current)} aria-pressed={isLight}>
            {isLight ? <Moon size={15} /> : <Sun size={15} />}<span>{isLight ? "Night field" : "Day sheet"}</span>
          </button>
          <button className="relativity-mobile-menu" aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}>
            <Menu size={19} /><span>Map</span>
          </button>
        </div>
      </header>

      <div className="relativity-frame" id="top">
        <aside className={`observatory-rail ${railOpen ? "is-open" : ""}`} aria-label="Relativity lesson navigation">
          <div className="rail-heading">
            <span className="eyebrow">PHYSICS FOR THE IB DIPLOMA</span>
            <h2>06<br />Special<br />Relativity</h2>
            <p>Change the observer. Keep the laws.</p>
          </div>
          <nav>
            {navigation.map((item, index) => (
              <button className={`obs-nav-link ${activeSection === item.id ? "active" : ""}`} onClick={() => chooseNav(item.id)} key={item.id}>
                <span>0{index + 1}</span>
                <div><b>{item.label}</b><small>{item.note}</small></div>
                {activeSection === item.id && <ArrowRight size={15} />}
              </button>
            ))}
          </nav>
          <div className="rail-signal">
            <div className="cone-glyph"><i /><i /></div>
            <p><b>Invariant signal</b><br />Every inertial observer measures light in vacuum at c.</p>
          </div>
        </aside>

        <main className="relativity-main">
          <section className="relativity-hero">
            <div className="relativity-hero-art" />
            <div className="hero-copy-relativity">
              <div className="hero-kicker"><span /> CHAPTER 6 · RELATIVITY</div>
              <h1>Hold light constant.<br /><em>Let space and time respond.</em></h1>
              <p>Follow the chapter's route from reference frames and Lorentz transformations to velocity addition, relativistic effects, and spacetime diagrams.</p>
              <div className="hero-action-row">
                <button className="signal-button" onClick={() => chooseNav("spacetime")}>Open spacetime instrument <ArrowRight size={17} /></button>
                <button className="quiet-button" onClick={() => chooseNav("velocity")}><Zap size={14} /> Add two velocities</button>
              </div>
            </div>
            <aside className="hero-brief">
              <span>GUIDING QUESTION</span>
              <p>What are the consequences of the constancy of the speed of light on our understanding of space and time?</p>
              <div><i /> LIGHT IN VACUUM: c</div>
            </aside>
          </section>

          <section className="relativity-section foundations-section" id="postulates">
            <div className="section-tag"><span>01</span><p>REFERENCE FRAMES</p></div>
            <div className="relativity-heading split">
              <h2>Start with a reference frame: co-ordinate axes and clocks.</h2>
              <p>A reference frame records the time and position of events. When its axes and clocks are not accelerating, it is an <b>inertial reference frame</b>.</p>
            </div>
            <div className="postulate-deck">
              <article>
                <span className="postulate-number">I</span>
                <div><span className="micro-label">RELATIVITY PRINCIPLE</span><h3>The laws of physics take the same form in all inertial frames.</h3><p>No experiment performed wholly inside one inertial frame can reveal absolute uniform motion.</p></div>
              </article>
              <article>
                <span className="postulate-number">II</span>
                <div><span className="micro-label">LIGHT POSTULATE</span><h3>Light in vacuum has the same speed, c, for every inertial observer.</h3><p>To preserve this result, measurements of time and distance must depend on the frame.</p></div>
              </article>
            </div>
            <div className="invariant-band">
              <div><span className="micro-label">THE CONVERSION FACTOR</span><BlockMath math="\gamma = \frac{1}{\sqrt{1-\beta^2}},\qquad \beta=\frac{v}{c}" /></div>
              <p>At low relative speed, <InlineMath math="\gamma\approx1" />. As <InlineMath math="v" /> approaches <InlineMath math="c" />, the difference between classical and relativistic predictions becomes decisive.</p>
              <span className="gamma-readout"><b>{model.gamma.toFixed(3)}</b> CURRENT γ</span>
            </div>
            <aside className="misconception-callout">
              <Lightbulb size={18} />
              <div><span className="micro-label">SOURCE CHECK</span><p><b>Galilean coordinates are a low-speed approximation.</b> At speeds much smaller than c, <InlineMath math="\gamma\approx1" /> and the Lorentz equations reduce to the Galilean form. Near c, the classical assumptions fail.</p></div>
            </aside>
          </section>

          <section className="relativity-section transform-section" id="lorentz">
            <div className="section-tag"><span>02</span><p>LORENTZ TRANSFORMATIONS</p></div>
            <div className="relativity-heading">
              <h2>The same event has coordinates in every frame.</h2>
              <p>Frame <b>S′</b> moves at constant velocity <InlineMath math="v" /> in the +x direction relative to frame <b>S</b>. The transformations relate the position and time assigned to one event by the two inertial observers.</p>
            </div>
            <div className="transform-grid">
              <div className="transform-formulas">
                <article><span className="frame-tab">SPACE</span><BlockMath math="x′=\gamma(x-vt)" /><p>The transformed position depends on the frame velocity and the time assigned to the event.</p></article>
                <article><span className="frame-tab">TIME</span><BlockMath math="t′=\gamma\left(t-\frac{vx}{c^2}\right)" /><p>Events at different x positions need not remain simultaneous after the frame changes.</p></article>
              </div>
              <figure className="spacetime-figure">
                <LorentzFigure />
                <figcaption><span>FIG. 1</span> The axes are not decoration: a change in observer changes the coordinate grid used to describe the same event.</figcaption>
              </figure>
            </div>
            <div className="event-strip">
              <div><span className="micro-label">LIVE EVENT READOUT</span><h3>Event E in frame {frame}</h3><p>The source treats an event as a time-and-position record. This visual uses light-microseconds for position, <InlineMath math="X=x/c" />, so x and ct share a scale.</p></div>
              <div className="event-data">
                <span><b>{eventX.toFixed(1)}</b> X (light-μs)</span>
                <span><b>{eventTime.toFixed(1)}</b> t (μs)</span>
                <span><b>{model.xPrime.toFixed(2)}</b> X′ (light-μs)</span>
                <span><b>{model.tPrime.toFixed(2)}</b> t′ (μs)</span>
              </div>
            </div>
            <aside className="muon-evidence">
              <Rocket size={19} />
              <div><span className="micro-label">EVIDENCE FROM MUON DECAY</span><p>A muon's 2.2 μs rest-frame lifetime is too short to cross a 3.0 km mountain at 0.99c classically. In the ground frame, time dilation gives a longer measured lifetime; in the muon frame, the mountain is length-contracted.</p></div>
            </aside>
          </section>

          <section className="relativity-section velocity-section" id="velocity">
            <div className="section-tag"><span>03</span><p>ADDITION OF VELOCITIES</p></div>
            <div className="relativity-heading split">
              <h2>Add speeds without breaking the light limit.</h2>
              <p>Let S′ move at speed <InlineMath math="v" /> relative to S. If an object has speed <InlineMath math="u′" /> in S′, observers in S measure <InlineMath math="u" />—not the Galilean sum at relativistic speeds.</p>
            </div>
            <div className="velocity-challenge">
              <aside className="velocity-controls">
                <div className="control-lead"><SlidersHorizontal size={17} /><div><span className="micro-label">CHALLENGE CONTROLS</span><p>Keep the sign: forward is positive.</p></div></div>
                <label htmlFor="frame-speed">Frame speed, v <output aria-live="polite">{frameSpeed >= 0 ? "+" : ""}{frameSpeed.toFixed(2)} c</output></label>
                <input id="frame-speed" type="range" min="-0.95" max="0.95" step="0.01" value={frameSpeed} onChange={(event) => setFrameSpeed(Number(event.target.value))} />
                <div className="range-ends"><span>−0.95 c</span><span>+0.95 c</span></div>
                <label htmlFor="object-speed">Object speed in S′, u′ <output aria-live="polite">{objectSpeed >= 0 ? "+" : ""}{objectSpeed.toFixed(2)} c</output></label>
                <input id="object-speed" type="range" min="-0.95" max="1" step="0.01" value={objectSpeed} onChange={(event) => setObjectSpeed(Number(event.target.value))} />
                <div className="range-ends"><span>−0.95 c</span><span>+c</span></div>
                <div className="preset-row velocity-presets">
                  <span>TEXTBOOK CASES</span>
                  <div>
                    <button onClick={() => { setFrameSpeed(.8); setObjectSpeed(.5); }}>Missile</button>
                    <button onClick={() => { setFrameSpeed(.9); setObjectSpeed(1); }}>Light beam</button>
                    <button onClick={() => { setFrameSpeed(-.8); setObjectSpeed(.9); }}>Two rockets</button>
                  </div>
                </div>
                <button className="instrument-reset" onClick={resetVelocityChallenge}><RotateCcw size={14} /> Reset to missile case</button>
              </aside>
              <div className="velocity-result">
                <div className="formula-badge">FROM S′ TO S</div>
                <BlockMath math="u=\frac{u′+v}{1+\frac{u′v}{c^2}}" />
                <p>For the selected speeds, the relativistic denominator prevents a material object from exceeding c.</p>
                <div className="speed-comparison">
                  <div><span>RELATIVISTIC u</span><strong>{velocityModel.combined >= 0 ? "+" : ""}{velocityModel.combined.toFixed(3)} c</strong><small>{velocityModel.staysAtOrBelowLight ? (velocityModel.lightCase ? "exactly c for a light beam" : "below the light limit") : "check input"}</small></div>
                  <div><span>GALILEAN u′ + v</span><strong className={Math.abs(velocityModel.classical) > 1 ? "warning" : ""}>{velocityModel.classical >= 0 ? "+" : ""}{velocityModel.classical.toFixed(2)} c</strong><small>{Math.abs(velocityModel.classical) > 1 ? "would be impossible" : velocityModel.comparison}</small></div>
                </div>
                <button className="share-result" onClick={shareVelocityResult} aria-live="polite"><Share2 size={15} /> {shareStatus || "Share this result"}</button>
              </div>
              <aside className="velocity-insight">
                <span className="micro-label">READ THE RESULT</span>
                <h3>{velocityModel.lightCase ? "Light remains c." : `Classical addition ${velocityModel.comparison}.`}</h3>
                <p>{velocityModel.lightCase ? "Substituting u′ = c gives u = c for every allowed v, matching the second postulate." : velocityModel.comparison === "underestimates" ? "With opposite directions, the signed Galilean sum can be smaller than the relativistic result. Keep the frame convention and the sign visible." : "The source's 0.80c rocket and 0.50c missile give 0.93c, whereas a Galilean sum would incorrectly give 1.30c."}</p>
                <div><i /> c is never crossed</div>
              </aside>
            </div>
            <VelocityFlightStrip frameSpeed={frameSpeed} objectSpeed={objectSpeed} combinedSpeed={velocityModel.combined} />
          </section>

          <section className="relativity-section foundations-section" id="simultaneity">
            <div className="section-tag"><span>04</span><p>RELATIVITY OF SIMULTANEITY</p></div>
            <div className="relativity-heading split">
              <h2>"At the same time" depends on who is asking.</h2>
              <p>If <InlineMath math="\Delta t' = 0" /> for two events in S′, the Lorentz equations give <InlineMath math="\Delta t = \gamma\frac{v}{c^2}\Delta x'" /> in S. Unless the events also share a position, that time gap is not zero.</p>
            </div>
            <div className="postulate-deck">
              <article>
                <span className="postulate-number">A</span>
                <div>
                  <span className="micro-label">SAME PLACE, SAME TIME</span>
                  <h3>Co-located simultaneous events stay simultaneous.</h3>
                  <p>If two events are simultaneous for one observer <b>and</b> occur at the same point in space, every other inertial observer agrees they are simultaneous too.</p>
                </div>
              </article>
              <article>
                <span className="postulate-number">B</span>
                <div>
                  <span className="micro-label">DIFFERENT PLACE, SAME TIME — FOR ONE OBSERVER</span>
                  <h3>Separated simultaneous events do not stay simultaneous.</h3>
                  <p>The source's train example: light leaves both ends of a moving carriage together, as far as a rider T at the midpoint is concerned. A ground observer G — for whom T is moving toward one signal and away from the other — measures the two emissions as happening at different times.</p>
                </div>
              </article>
            </div>
            <aside className="misconception-callout">
              <Lightbulb size={18} />
              <div>
                <span className="micro-label">COMMON MIX-UP</span>
                <p><b>This is not a statement about when light arrives.</b> The arrival of both signals at T's eye is simultaneous for T <em>and</em> happens at the same point in space (T's location), so G agrees on that arrival too. It is the two distant emission events — not the shared arrival — whose order depends on the observer.</p>
              </div>
            </aside>
          </section>

          <section className="relativity-section instrument-section" id="spacetime">
            <div className="section-tag dark-tag"><span>05</span><p>SPACETIME DIAGRAMS</p></div>
            <div className="instrument-heading">
              <div><h2>Move the observer.<br /><em>Watch the coordinates tilt.</em></h2><p>Plot ct vertically rather than time: both axes then have units of length. A photon's worldline stays at 45°, while material worldlines remain inside the light cone.</p></div>
              <div className="frame-switch" role="group" aria-label="Active reference-frame emphasis">
                <button className={frame === "S" ? "active" : ""} onClick={() => setFrame("S")}>Frame S</button>
                <button className={frame === "S′" ? "active" : ""} onClick={() => setFrame("S′")}>Frame S′</button>
              </div>
            </div>
            <div className="instrument-console">
              <aside className="instrument-controls">
                <div className="control-lead"><SlidersHorizontal size={17} /><div><span className="micro-label">CONTROL DECK</span><p>Alter one assumption at a time.</p></div></div>
                <label htmlFor="beta">Relative speed, β = v/c <output aria-live="polite">{beta.toFixed(2)} c</output></label>
                <input id="beta" type="range" min="0.05" max="0.95" step="0.01" value={beta} onChange={(event) => setBeta(Number(event.target.value))} />
                <div className="range-ends"><span>0.05 c</span><span>0.95 c</span></div>
                <label htmlFor="event-x">Event position, X = x/c <output aria-live="polite">{eventX.toFixed(1)} light-μs</output></label>
                <input id="event-x" type="range" min="-3.5" max="3.5" step="0.1" value={eventX} onChange={(event) => setEventX(Number(event.target.value))} />
                <div className="range-ends"><span>−3.5</span><span>+3.5</span></div>
                <label htmlFor="event-t">Event time, t <output aria-live="polite">{eventTime.toFixed(1)} μs</output></label>
                <input id="event-t" type="range" min="0.8" max="4.5" step="0.1" value={eventTime} onChange={(event) => setEventTime(Number(event.target.value))} />
                <div className="range-ends"><span>0.8 μs</span><span>4.5 μs</span></div>
                <div className="preset-row">
                  <span>SCENARIOS</span>
                  <div>
                    <button onClick={() => { setBeta(.3); setEventX(1.2); setEventTime(3.4); }}>Low β</button>
                    <button onClick={() => { setBeta(.6); setEventX(2); setEventTime(4); }}>Probe</button>
                    <button onClick={() => { setBeta(.88); setEventX(3); setEventTime(3.1); }}>Near c</button>
                  </div>
                </div>
                <button className="instrument-reset" onClick={resetObservatory}><RotateCcw size={14} /> Reset instrument</button>
                <div className="instrument-note"><CircleHelp size={15} /><p>A photon is at 45° because x and ct are both plotted as lengths.</p></div>
              </aside>
              <div className="spacetime-viewport">
                <div className="viewport-title"><span><Orbit size={15} /> LIVE MINKOWSKI VIEWPORT</span><p>Coordinates in light-μs / μs</p></div>
                <MinkowskiDiagram beta={beta} eventX={eventX} eventTime={eventTime} frame={frame} />
                <div className="viewport-legend">
                  <span><i className="legend-cyan" /> light cone — invariant c</span>
                  <span><i className="legend-red" /> selected event E</span>
                  <span><i className="legend-white" /> S′ frame / simultaneity</span>
                </div>
              </div>
              <aside className="instrument-results" aria-live="polite">
                <div className="result-card gamma"><span>GAMMA FACTOR</span><strong>{model.gamma.toFixed(3)}</strong><p><InlineMath math="\gamma=1/\sqrt{1-\beta^2}" /></p></div>
                <div className="result-card"><span>TIME INTERVAL</span><strong>{model.dilatedTime.toFixed(2)} μs</strong><p>from a 10.00 μs proper time interval</p></div>
                <div className="result-card"><span>LENGTH IN S</span><strong>{model.contractedLength.toFixed(1)} m</strong><p>from a 120.0 m proper length</p></div>
                <div className={`interval-card ${model.intervalKind.tone}`}><span>EVENT SEPARATION</span><b>{model.intervalKind.label}</b><p>{model.intervalKind.detail}</p></div>
              </aside>
            </div>
          </section>

          <section className="relativity-section worked-section" id="worked">
            <div className="section-tag"><span>06</span><p>WORKED EXAMPLES</p></div>
            <div className="relativity-heading split">
              <h2>Two source examples, worked step by step.</h2>
              <p>First, a single event transformed between two inertial frames. Second, the muon-decay evidence for time dilation — resolved from both the ground frame and the muon's own frame.</p>
            </div>
            <WorkedExampleDerivation
              eyebrow="SOURCE-ALIGNED EVENT TRANSFORM"
              heading="Report the lightning event in the rocket frame."
              stamp="LIGHTNING · S → S′"
              steps={[
                { title: "Find the gamma factor", content: <p>For <InlineMath math="v=0.80c" />, <InlineMath math="\gamma=1/\sqrt{1-0.80^2}=5/3" />.</p> },
                { title: "Transform the spatial coordinate", content: <><BlockMath math="x′=\frac{5}{3}\left(3500-0.80c\times5.0\right)" /><p className="derived-result"><InlineMath math="\boxed{x′=-2.0\times10^9\ \mathrm{m}}" /></p></> },
                { title: "Transform the time coordinate", content: <><BlockMath math="t′=\frac{5}{3}\left(5.0-\frac{0.80c\times3500}{c^2}\right)" /><p className="derived-result"><InlineMath math="\boxed{t′=8.3\ \mathrm{s}}" /></p></> },
                { title: "State the invariant conclusion", content: <p>The ground and rocket observers disagree on the co-ordinates of the lightning strike, but both descriptions are valid. The spacetime interval <InlineMath math="(c\Delta t)^2-(\Delta x)^2" /> has the same value in both inertial frames.</p> },
              ]}
            />
            <WorkedExampleDerivation
              eyebrow="SOURCE-ALIGNED TIME DILATION"
              heading="Show that a muon created 3.0 km up survives to reach the ground."
              stamp="MUON DECAY · TWO FRAMES"
              steps={[
                { title: "Try the classical, non-relativistic distance", content: <><p>A muon's rest-frame lifetime is <InlineMath math="\tau=2.2\times10^{-6}\ \mathrm{s}" />. Travelling at <InlineMath math="0.99c" /> for exactly one lifetime covers:</p><BlockMath math="0.99\times(3.0\times10^{8})\times(2.2\times10^{-6})=0.653\ \mathrm{km}" /><p className="derived-result">Far short of the 3.0 km mountain — classically, no muon should reach the ground.</p></> },
                { title: "Resolve it in the ground frame: time dilation", content: <><BlockMath math="\Delta t=\gamma\times\tau=\frac{2.2\times10^{-6}}{\sqrt{1-0.99^2}}" /><p className="derived-result"><InlineMath math="\boxed{\Delta t \approx 1.56\times10^{-5}\ \mathrm{s}}" /></p><p>At <InlineMath math="0.99c" />, that dilated lifetime carries the muon <InlineMath math="4.63\ \mathrm{km}" /> — past the 3.0 km mountain before it decays.</p></> },
                { title: "Resolve it in the muon's frame: length contraction", content: <><BlockMath math="L=\frac{L_0}{\gamma}=3.0\times\sqrt{1-0.99^2}" /><p className="derived-result"><InlineMath math="\boxed{L\approx0.42\ \mathrm{km}}" /></p><p>The muon's own clock still reads only <InlineMath math="2.2\ \mu\mathrm{s}" /> — but the mountain rushing toward it is length-contracted to 0.42 km, well within reach.</p></> },
                { title: "State the invariant conclusion", content: <p>Two completely different mechanisms — time dilation for the ground observer, length contraction for the muon — describe the same physical outcome: muons, not just electrons, are detected at the surface. Muon decay is direct evidence for time dilation and, through this reasoning, indirect evidence for length contraction.</p> },
              ]}
            />
          </section>

          <section className="relativity-section check-section-relativity" id="check">
            <div className="section-tag dark-tag"><span>07</span><p>CHECK THE MODEL</p></div>
            <div className="check-heading-relativity">
              <div><h2>State the observer.<br /><em>Then make the claim.</em></h2></div>
              <p>These checks target the conceptual moves that formula substitution alone can hide: proper measurements, causality, and the low-speed limit.</p>
            </div>
            <QuizSection questions={quizQuestions} answers={answers} onAnswer={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))} />
            <div className="study-record">
              <div><span className="micro-label">SAVED LEARNING RECORD</span><h3>{sessionStatus}</h3><p>Reading position {readingProgress}% · Diagnostic score {completed}/{quizQuestions.length}. Your progress and answers are stored in this browser so you can resume later.</p></div>
              <div className="study-record-actions">
                <button className="export-summary" onClick={handleExportSummary}><FileDown size={16} /> {exportStatus || "Download study PDF"}</button>
                <button className="clear-session" onClick={resetLearnerSession}><Trash2 size={15} /> Reset saved record</button>
              </div>
            </div>
            <div className="mission-complete">
              <div>
                <span className="micro-label">OBSERVATORY STATUS</span>
                <h3>{Object.keys(answers).length ? `${completed} of ${quizQuestions.length} conceptual checks resolved.` : "The diagnostic is ready."}</h3>
                <p>{Object.keys(answers).length === quizQuestions.length ? "Return to the viewport and test a parameter that changes your answer. The geometry should support the explanation." : "Complete each check, then return to the viewport with a sharper question about what the observer measures."}</p>
              </div>
              <button className="signal-button compact" onClick={() => { setAnswers({}); chooseNav("spacetime"); }}><Telescope size={16} /> Return to instrument</button>
            </div>
          </section>
          <footer className="relativity-footer">
            <span>RELATIVITY OBSERVATORY · CHAPTER 06</span>
            <span>Lesson structure and worked example aligned to Chapter 6, Physics for the IB Diploma.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
