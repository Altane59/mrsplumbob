"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { challenges, categories, getChallengeById } from "@/lib/challenges";
import { getDailyChallenge } from "@/lib/daily";
import { isPlayable, missingPacks } from "@/lib/playability";
import { packName } from "@/lib/packs";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeCard from "@/components/ChallengeCard";
import DifficultyMeter from "@/components/DifficultyMeter";
import type { ChallengeWithSlug } from "@/lib/types";

export default function HomePage() {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);
  const progress = useStore((s) => s.progress);

  // Daily pick is date-dependent — compute after mount to reflect "today".
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
          Every Sims 4 challenge, written clearly and filtered to the packs you
          actually own. Follow rules that are sweet and clear, track your milestones,
          and let Mrs Plumbob hand you something to play.{" "}
          {hydrated && packsSet
            ? `${playableCount} of ${challenges.length} challenges are ready for your packs right now! 💕`
            : "💕"}
        </p>
        <div className="btn-row">
          <Link className="big-btn" href="/surprise">
            🎲 Surprise Me
          </Link>
          <Link className="ghost-btn" href="/browse">
            Browse all challenges
          </Link>
          <Link className="ghost-btn" href="/packs">
            Set my packs
          </Link>
        </div>
      </section>

      {inProgress.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <p className="eyebrow">💗 Continue where you left off</p>
          <div className="grid">
            {inProgress.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: inProgress.length ? 0 : undefined }}>
        <p className="eyebrow">🌟 Daily Challenge</p>
        {daily ? (
          <Link
            href={`/challenge/${daily.slug}`}
            className="block"
            style={{ display: "block", textDecoration: "none" }}
          >
            <span className="cat" style={{ color: "var(--lav)" }}>
              {daily.category} · Today&apos;s pick
            </span>
            <h3
              style={{
                fontFamily: "var(--font-fredoka)",
                fontSize: 24,
                margin: "6px 0 8px",
                color: "var(--ink)",
              }}
            >
              {daily.title}
            </h3>
            <p style={{ color: "var(--muted)", margin: "0 0 12px", fontWeight: 500 }}>
              {daily.premise}
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <DifficultyMeter
                difficulty={daily.difficulty}
                label={daily.difficultyLabel}
                showLabel
              />
              <span className="pill">{daily.length}</span>
              {hydrated && packsSet ? (
                isPlayable(daily, owned) ? (
                  <span className="badge play">✨ Playable</span>
                ) : (
                  <span className="badge lock">
                    🔒 Needs: {missingPacks(daily, owned).map(packName).join(", ")}
                  </span>
                )
              ) : null}
            </div>
          </Link>
        ) : (
          <div className="block" aria-hidden="true" style={{ minHeight: 120 }} />
        )}
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <p className="eyebrow">🎀 Browse by category</p>
        <div className="tiles">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${encodeURIComponent(cat)}`}
              className="tile"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <p className="eyebrow">💖 A taste of the library</p>
        <ChallengeGrid challenges={challenges.slice(0, 6)} />
      </section>
    </>
  );
}
