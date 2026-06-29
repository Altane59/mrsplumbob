"use client";

import Link from "next/link";
import { getChallengeById } from "@/lib/challenges";
import { useHydrated, useStore } from "@/lib/store";
import MilestoneTracker from "@/components/MilestoneTracker";
import SupportCompletionPrompt from "@/components/SupportCompletionPrompt";
import type { ChallengeWithSlug } from "@/lib/types";

interface Row {
  c: ChallengeWithSlug;
  doneCount: number;
  total: number;
  complete: boolean;
}

export default function MyChallengesPage() {
  const hydrated = useHydrated();
  const progress = useStore((s) => s.progress);
  const objectives = useStore((s) => s.objectives);
  const started = useStore((s) => s.started);

  // A challenge belongs in "My Challenges" if it's been started or has any
  // milestone/objective progress. Progress combines both checklists.
  const ids = hydrated
    ? Array.from(
        new Set([...started, ...Object.keys(progress), ...Object.keys(objectives)]),
      )
    : [];

  const rows: Row[] = ids
    .map((id) => {
      const c = getChallengeById(id);
      if (!c) return null;
      const mTotal = c.milestones.length;
      const oTotal = c.objectives?.length ?? 0;
      const mDone = progress[id]?.length ?? 0;
      const oDone = objectives[id]?.length ?? 0;
      const total = mTotal + oTotal;
      const doneCount = mDone + oDone;
      return { c, doneCount, total, complete: total > 0 && doneCount >= total };
    })
    .filter((r): r is Row => r !== null);

  const inProgress = rows.filter((r) => !r.complete);
  const completed = rows.filter((r) => r.complete);

  return (
    <section className="section">
      <p className="eyebrow">💕 My Challenges</p>
      <h1 className="page">Your challenges</h1>
      <p className="sub">
        Tick off milestones and objectives right here — your progress saves to this
        device automatically.
      </p>

      {hydrated && rows.length === 0 && (
        <div className="empty">
          You haven&apos;t started anything yet! <a href="/browse">Browse the library</a>{" "}
          or hit <a href="/surprise">Surprise Me</a> to begin a challenge. 💝
        </div>
      )}

      {inProgress.length > 0 && (
        <>
          <h2 className="eyebrow" style={{ marginTop: 18 }}>
            In progress
          </h2>
          {inProgress.map((r) => (
            <ChallengeTracker key={r.c.id} row={r} />
          ))}
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="eyebrow" style={{ marginTop: 32 }}>
            🎉 Completed
          </h2>
          {completed.map((r) => (
            <ChallengeTracker key={r.c.id} row={r} />
          ))}
        </>
      )}

      <SupportCompletionPrompt />
    </section>
  );
}

/** One challenge entry with its milestone + objective trackers shown inline. */
function ChallengeTracker({ row }: { row: Row }) {
  const { c, doneCount, total, complete } = row;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const hasObjectives = (c.objectives?.length ?? 0) > 0;

  return (
    <div style={{ marginTop: 22 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "baseline",
          flexWrap: "wrap",
          marginBottom: 4,
        }}
      >
        <h3 style={{ fontFamily: "var(--font-fredoka)", fontSize: 19, margin: 0 }}>
          <Link href={`/challenge/${c.slug}`} style={{ color: "var(--ink)" }}>
            {c.title}
          </Link>
        </h3>
        <span style={{ fontWeight: 700, color: "var(--lav)", fontSize: 13 }}>
          {complete
            ? "Completed 🎉"
            : total === 0
              ? "Started"
              : `${doneCount} of ${total} · ${pct}%`}
        </span>
      </div>

      <MilestoneTracker
        challengeId={c.id}
        items={c.milestones}
        kind="milestones"
        title="💕 Milestones — track your progress"
        headingLevel={4}
      />

      {hasObjectives && (
        <MilestoneTracker
          challengeId={c.id}
          items={c.objectives as string[]}
          kind="objectives"
          title="🎯 Objectives — complete the checklist"
          headingLevel={4}
        />
      )}

      <Link href={`/challenge/${c.slug}`} style={{ fontWeight: 700, fontSize: 13 }}>
        Open full challenge →
      </Link>
    </div>
  );
}
