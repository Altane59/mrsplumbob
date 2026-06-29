"use client";

import { useEffect, useRef, useState } from "react";
import { getChallengeById } from "@/lib/challenges";
import { useHydrated, useStore } from "@/lib/store";
import KofiButton from "./KofiButton";

/**
 * Gentle, non-blocking, dismissible nudge shown ONCE when a challenge becomes
 * fully complete (all milestones + objectives). It watches the store, so it
 * fires regardless of which page the final tick happened on. `supportPromptShown`
 * (persisted) guarantees it never repeats for a challenge, and the mount-time
 * baseline means already-complete challenges don't trigger it on page load.
 */
export default function SupportCompletionPrompt() {
  const hydrated = useHydrated();
  const progress = useStore((s) => s.progress);
  const objectives = useStore((s) => s.objectives);
  const shown = useStore((s) => s.supportPromptShown);
  const markShown = useStore((s) => s.markSupportPromptShown);

  const [visible, setVisible] = useState(false);
  const initialised = useRef(false);
  const prevComplete = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated) return;

    const complete = new Set<string>();
    const ids = new Set([...Object.keys(progress), ...Object.keys(objectives)]);
    for (const id of ids) {
      const c = getChallengeById(id);
      if (!c) continue;
      const total = c.milestones.length + (c.objectives?.length ?? 0);
      const done = (progress[id]?.length ?? 0) + (objectives[id]?.length ?? 0);
      if (total > 0 && done >= total) complete.add(id);
    }

    // First run after hydration: record the baseline, don't fire for anything
    // that was already complete before this session.
    if (!initialised.current) {
      initialised.current = true;
      prevComplete.current = complete;
      return;
    }

    for (const id of complete) {
      if (!prevComplete.current.has(id) && !shown.includes(id)) {
        markShown(id);
        setVisible(true);
        break;
      }
    }
    prevComplete.current = complete;
  }, [hydrated, progress, objectives, shown, markShown]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 60,
        maxWidth: 460,
        margin: "0 auto",
        background: "linear-gradient(135deg,#fff5fb,#f3ecff)",
        border: "2px solid var(--pink)",
        borderRadius: 22,
        padding: "14px 18px",
        boxShadow: "0 20px 50px -22px var(--shadow)",
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <p style={{ margin: 0, flex: 1, minWidth: 200, fontWeight: 600, fontSize: 14 }}>
        Nice work finishing! 🌿 If this site helped, you can support it ☕
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <KofiButton className="big-btn" style={{ fontSize: 15, padding: "10px 18px" }}>
          Support ☕
        </KofiButton>
        <button
          type="button"
          className="ghost-btn"
          aria-label="Dismiss"
          style={{ padding: "10px 14px", fontSize: 14 }}
          onClick={() => setVisible(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
