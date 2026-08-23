export type Frame = "S" | "S′";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { value: string; label: string }[];
  answer: string;
  explanation: string;
};

export type NavItem = { id: string; label: string; note: string };

export const navigation: NavItem[] = [
  { id: "postulates", label: "Set the reference frame", note: "Inertial frames" },
  { id: "lorentz", label: "Transform an event", note: "Lorentz coordinates" },
  { id: "velocity", label: "Add relativistic speeds", note: "Velocity addition" },
  { id: "simultaneity", label: "Question 'at the same time'", note: "Relativity of simultaneity" },
  { id: "spacetime", label: "Inspect spacetime", note: "Light cones & worldlines" },
  { id: "worked", label: "Audit two worked examples", note: "Lightning & muon decay" },
  { id: "check", label: "Check the model", note: "Source diagnostics" },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which observer measures the proper time interval between two events on a spacecraft's clock?",
    options: [
      { value: "a", label: "The observer for whom the two events occur at one spatial location: the spacecraft frame." },
      { value: "b", label: "Any distant observer, because time is universal." },
      { value: "c", label: "The observer moving fastest relative to Earth." },
    ],
    answer: "a",
    explanation: "A proper time interval is measured in the frame where the two events occur at the same point in space, so one clock can record the full interval.",
  },
  {
    id: "q2",
    prompt: "An event lies outside another event's light cone. Which conclusion follows?",
    options: [
      { value: "a", label: "A light signal can connect the events if enough time passes." },
      { value: "b", label: "The interval is spacelike, so no causal signal travelling at or below c can connect them." },
      { value: "c", label: "The interval must be timelike because the events are separated." },
    ],
    answer: "b",
    explanation: "Spacelike-separated events sit outside each other's light cones. Connecting them causally would require a faster-than-light signal.",
  },
  {
    id: "q3",
    prompt: "As the relative speed v becomes very small compared with c, what happens to the Lorentz factor γ?",
    options: [
      { value: "a", label: "It approaches zero." },
      { value: "b", label: "It approaches one, recovering the low-speed Galilean approximation." },
      { value: "c", label: "It becomes negative." },
    ],
    answer: "b",
    explanation: "For β = v/c close to zero, γ = 1/√(1−β²) is approximately 1. Relativistic transformations then approach their classical low-speed form.",
  },
  {
    id: "q4",
    prompt: "Source Check Yourself 1: a train moves with constant speed on a straight line. Is the train an inertial reference frame?",
    options: [
      { value: "a", label: "Yes — its axes and clocks are not accelerating." },
      { value: "b", label: "No — any frame that is moving cannot be inertial." },
      { value: "c", label: "Only if the train is at rest relative to the ground." },
    ],
    answer: "a",
    explanation: "An inertial frame only requires zero acceleration, not zero velocity. A train on a straight track at constant speed qualifies, the same way a skydiver at terminal velocity does but one still speeding up does not.",
  },
  {
    id: "q5",
    prompt: "Two lamps, equidistant from an observer M standing between them, are measured by M to switch on at the same time. A second observer N, at rest on the ground but not midway between the lamps, watches the same two switch-on events. Do the lamps switch on simultaneously for N?",
    options: [
      { value: "a", label: "Yes — if two events are simultaneous for one observer, they are simultaneous for every observer." },
      { value: "b", label: "Only if N and M are in relative motion." },
      { value: "c", label: "Not necessarily — N and M are both at rest, so they in fact agree here; simultaneity only breaks between frames in relative motion, not between two observers in the same frame." },
    ],
    answer: "c",
    explanation: "N and M are both at rest on the ground — the same frame — so they agree the lamps switch on together, even though N receives the two flashes of light at different times because N is not equidistant from the lamps. Relativity of simultaneity only appears when comparing frames that move relative to each other.",
  },
  {
    id: "q6",
    prompt: "A muon created 3.0 km up in the atmosphere has a proper lifetime of 2.2 μs and travels at 0.99c toward the ground. Classically it should decay after covering about 0.65 km. Muons are nevertheless detected at ground level. What resolves this in the ground frame, and what resolves it in the muon's own frame?",
    options: [
      { value: "a", label: "Ground frame: time dilation lengthens the muon's measured lifetime. Muon frame: the 3.0 km distance is length-contracted, so less distance needs to be crossed." },
      { value: "b", label: "Ground frame: the muon simply moves faster than 0.99c. Muon frame: its lifetime is longer than 2.2 μs." },
      { value: "c", label: "Both frames explain it the same way: the muon's rest-frame lifetime itself increases." },
    ],
    answer: "a",
    explanation: "This is the two-observer resolution from the source: the ground frame sees a dilated lifetime (γ × 2.2 μs ≈ 15.6 μs at 0.99c), while the muon's own frame sees an unchanged 2.2 μs lifetime but a length-contracted mountain (about 0.42 km instead of 3.0 km). Both give the same physical outcome — a muon that survives to reach the ground.",
  },
];

export function describeInterval(x: number, time: number) {
  const interval = x * x - time * time;
  if (Math.abs(interval) < 0.12) return { label: "Null / lightlike", detail: "The event lies on the light cone.", tone: "null" };
  if (interval < 0) return { label: "Timelike", detail: "A subluminal object could connect the origin to this event.", tone: "timelike" };
  return { label: "Spacelike", detail: "No causal signal travelling at or below c can connect the events.", tone: "spacelike" };
}
