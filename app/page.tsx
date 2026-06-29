"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { challenges, categories, getChallengeById } from "@/lib/challenges";
import { getDailyChallenge } from "@/lib/daily";
import { isPlayable } from "@/lib/playability";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeCard from "@/components/ChallengeCard";
import type { ChallengeWithSlug } from "@/lib/types";

export default function HomePage() {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);
  const progress = useStore((s) => s.progress);

  // Daily pick is date-dependent — compute after mount to reflect "today"
  // (deterministic per calendar day, see lib/daily.ts).
  const [daily, setDaily] = useState<ChallengeWithSlug | null>(null);
  useEffect(() => setDaily(getDailyChallenge(new Date())), []);

  const playableCount = challenges.filter((c) => isPlayable(c, owned)).length;

  const inProgress = hydrated
    ? Object.entries(progress)
        .map(([id, done]) => ({ c: getChallengeById(id), done }))
        .filter((x) => x.c && x.done.length < x.c.milestones.length)
        .map((x) => x.c as ChallengeWithSlug)
    : [];

  return (
    <>
      <section className="hero">
        <p className="eyebrow">✨ Sims 4 Challenge Hub</p>
        <h1 className="page big">
          Find your next
          <br />
          <span className="gradtext">challenge.</span>
        </h1>
        <p className="sub">
          <strong style={{ color: "var(--ink)" }}>
            {challenges.length} challenges
          </strong>
          , filtered to the packs you actually own — each written clearly, with
          milestones to track.{" "}
          {hydrated && packsSet
            ? `${playableCount} are ready for your packs right now! 💕`
            : "💕"}
        </p>
        <div className="btn-row">
          <Link className="big-btn" href="/surprise">
            <span aria-hidden="true">🎲 </span>Surprise Me
          </Link>
          <Link className="ghost-btn" href="/browse">
            Browse all challenges
          </Link>
          <Link className="ghost-btn" href="/packs">
            Set my packs
          </Link>
        </div>
      </section>

      {hydrated && !packsSet && (
        <div className="nudge" style={{ marginTop: 4 }}>
          👋 New here? Tell us which packs you own and we&apos;ll show exactly which
          challenges you can play. <Link href="/packs">Set your packs →</Link>
        </div>
      )}

      {inProgress.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="eyebrow">💗 Continue where you left off</h2>
          <div className="grid">
            {inProgress.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: inProgress.length ? 0 : undefined }}>
        <h2 className="eyebrow">🌟 Daily Challenge</h2>
        <p className="sub" style={{ marginBottom: 16 }}>
          One hand-picked challenge a day — the same for everyone, fresh tomorrow.
        </p>
        <div className="grid">
          {hydrated && daily ? (
            <ChallengeCard challenge={daily} />
          ) : (
            <div className="card" aria-hidden="true" style={{ opacity: 0.5 }}>
              <span className="cat">Today&apos;s pick</span>
              <p className="prem">Loading today&apos;s challenge…</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="eyebrow">🎀 Browse by category</h2>
        <nav aria-label="Browse challenges by category" className="tiles">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${encodeURIComponent(cat)}`}
              className="tile"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="eyebrow">💖 A taste of the library</h2>
        <ChallengeGrid challenges={challenges.slice(0, 6)} />
      </section>
    </>
  );
}
