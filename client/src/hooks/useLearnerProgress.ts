import { useEffect, useState } from "react";

export type LearnerProgress = {
  readingProgress: number;
  activeSection: string;
  answers: Record<string, string>;
  updatedAt: string;
};

const LEARNER_PROGRESS_KEY = "relativity-observatory-learner-progress-v1";

function loadLearnerProgress(): LearnerProgress | null {
  try {
    const rawProgress = localStorage.getItem(LEARNER_PROGRESS_KEY);
    if (!rawProgress) return null;
    const parsed = JSON.parse(rawProgress) as Partial<LearnerProgress>;
    if (typeof parsed.readingProgress !== "number" || typeof parsed.activeSection !== "string" || typeof parsed.answers !== "object") return null;
    return { readingProgress: parsed.readingProgress, activeSection: parsed.activeSection, answers: parsed.answers ?? {}, updatedAt: parsed.updatedAt ?? "" };
  } catch {
    return null;
  }
}

/**
 * Persists reading position, active section, and quiz answers to
 * localStorage, restores scroll position on mount, and exposes a reset.
 * Kept as its own hook so Home.tsx doesn't own the storage mechanics.
 */
export function useLearnerProgress(defaultSection: string) {
  const [savedLearnerProgress] = useState<LearnerProgress | null>(() => loadLearnerProgress());
  const [activeSection, setActiveSection] = useState(() => savedLearnerProgress?.activeSection ?? defaultSection);
  const [answers, setAnswers] = useState<Record<string, string>>(() => savedLearnerProgress?.answers ?? {});
  const [readingProgress, setReadingProgress] = useState(() => savedLearnerProgress?.readingProgress ?? 0);
  const [sessionStatus, setSessionStatus] = useState(() =>
    savedLearnerProgress && (savedLearnerProgress.readingProgress > 0 || Object.keys(savedLearnerProgress.answers).length > 0)
      ? "Previous learning state restored"
      : "Auto-save ready"
  );

  useEffect(() => {
    localStorage.setItem(LEARNER_PROGRESS_KEY, JSON.stringify({ readingProgress, activeSection, answers, updatedAt: new Date().toISOString() } satisfies LearnerProgress));
  }, [readingProgress, activeSection, answers]);

  useEffect(() => {
    if (!savedLearnerProgress || savedLearnerProgress.readingProgress <= 0) return;
    const restoreScroll = window.setTimeout(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.max(0, (maxScroll * savedLearnerProgress.readingProgress) / 100), behavior: "auto" });
    }, 80);
    return () => window.clearTimeout(restoreScroll);
  }, [savedLearnerProgress]);

  const resetLearnerSession = () => {
    setAnswers({});
    setReadingProgress(0);
    setActiveSection(defaultSection);
    localStorage.removeItem(LEARNER_PROGRESS_KEY);
    setSessionStatus("Learning record reset");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { activeSection, setActiveSection, answers, setAnswers, readingProgress, setReadingProgress, sessionStatus, setSessionStatus, resetLearnerSession };
}
