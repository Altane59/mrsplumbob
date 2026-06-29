"use client";

import { useHydrated, useStore } from "@/lib/store";

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M2 6l3 3 5-6"
      stroke="#fff"
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Kind = "milestones" | "objectives";

/**
 * Interactive checklist + progress bar (PRD §F4). Drives both the milestone
 * tracker and the objectives checklist — completion is keyed by index and
 * persisted to localStorage via the store (no account required). `kind`
 * selects which store slice to read/write so the two checklists stay separate.
 */
export default function MilestoneTracker({
  challengeId,
  items,
  kind = "milestones",
  title,
}: {
  challengeId: string;
  items: string[];
  kind?: Kind;
  title?: string;
}) {
  const hydrated = useHydrated();
  // Both selectors run unconditionally (hooks rule); we pick by `kind`.
  const milestonesDone = useStore((s) => s.progress[challengeId]);
  const objectivesDone = useStore((s) => s.objectives[challengeId]);
  const toggleMilestone = useStore((s) => s.toggleMilestone);
  const toggleObjective = useStore((s) => s.toggleObjective);

  const isObjectives = kind === "objectives";
  const completed = isObjectives ? objectivesDone : milestonesDone;
  const toggle = isObjectives ? toggleObjective : toggleMilestone;
  const noun = isObjectives ? "objectives" : "milestones";
  const heading =
    title ?? (isObjectives ? "🎯 Objectives" : "💕 Milestones — track your progress");

  const done = new Set(hydrated ? completed ?? [] : []);
  const pct = items.length === 0 ? 0 : Math.round((done.size / items.length) * 100);

  return (
    <div className="block">
      <h4>{heading}</h4>

      <div
        className="progressbar"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${done.size} of ${items.length} ${noun} complete`}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <p style={{ margin: "0 0 8px", fontWeight: 700, color: "var(--lav)", fontSize: 13 }}>
        {done.size === items.length
          ? "Completed! 🎉"
          : `${done.size} of ${items.length} done · ${pct}%`}
      </p>

      {items.map((m, i) => {
        const isDone = done.has(i);
        return (
          <button
            key={i}
            type="button"
            className={`mile${isDone ? " done" : ""}`}
            role="checkbox"
            aria-checked={isDone}
            onClick={() => toggle(challengeId, i)}
          >
            <span className={`box${isDone ? " checked" : ""}`}>{isDone && <Check />}</span>
            <span className="lbl">{m}</span>
          </button>
        );
      })}
    </div>
  );
}
