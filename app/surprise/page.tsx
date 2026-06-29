"use client";

import { useState } from "react";
import Link from "next/link";
import { challenges, categories, DIFFICULTY_NAME } from "@/lib/challenges";
import { isPlayable } from "@/lib/playability";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";
import DifficultyMeter from "@/components/DifficultyMeter";
import type { ChallengeWithSlug } from "@/lib/types";

export default function SurprisePage() {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);

  const [diff, setDiff] = useState("");
  const [cat, setCat] = useState("");
  const [result, setResult] = useState<ChallengeWithSlug | null>(null);
  const [noMatch, setNoMatch] = useState(false);

  function spin() {
    // Always respects owned packs — never returns an unplayable challenge (§F9).
    let pool = challenges
      .filter((c) => isPlayable(c, owned))
      .filter((c) => !diff || c.difficulty === Number(diff))
      .filter((c) => !cat || c.category === cat);

    if (result && pool.length > 1) {
      pool = pool.filter((c) => c.id !== result.id);
    }
    if (pool.length === 0) {
      setResult(null);
      setNoMatch(true);
      return;
    }
    setNoMatch(false);
    setResult(pool[Math.floor(Math.random() * pool.length)]);
  }

  const diffChips: { value: string; label: string }[] = [
    { value: "", label: "Any" },
    ...[1, 2, 3, 4, 5].map((d) => ({ value: String(d), label: `${d} ${DIFFICULTY_NAME[d]}` })),
  ];

  return (
    <section className="section">
      <p className="eyebrow">🎲 Surprise Me</p>
      <h1 className="page">Hand me something cute to play</h1>
      <p className="sub">
        One tap, one random challenge you can actually play right now — it only ever
        picks ones your packs support. Narrow it first if you like! 💕
      </p>

      {hydrated && !packsSet && (
        <div className="nudge">
          ✦ You haven&apos;t set your packs, so Surprise Me only knows your base game.{" "}
          <a href="/packs">Set your packs</a> for the full pool.
        </div>
      )}

      <div className="chips">
        <span className="chiplabel">Difficulty</span>
        {diffChips.map((d) => (
          <button
            key={d.value}
            type="button"
            className={`chip${diff === d.value ? " on" : ""}`}
            aria-pressed={diff === d.value}
            onClick={() => setDiff(d.value)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="chips" style={{ marginTop: 10 }}>
        <span className="chiplabel">Category</span>
        <button
          type="button"
          className={`chip${cat === "" ? " on" : ""}`}
          aria-pressed={cat === ""}
          onClick={() => setCat("")}
        >
          Any category
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${cat === c ? " on" : ""}`}
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
          >
            {c.split(" ")[0]}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 24 }} className="btn-row">
        <button type="button" className="big-btn" onClick={spin} disabled={!hydrated}>
          🎲 Surprise Me
        </button>
        {(result || noMatch) && (
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              setResult(null);
              setNoMatch(false);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {noMatch && (
        <div className="empty" style={{ marginTop: 24 }}>
          No <b>playable</b> challenge matches those filters yet. Loosen them, or grab
          more packs over on <a href="/packs">My Packs</a>. 💖
        </div>
      )}

      {result && (
        <div className="result">
          <span
            style={{
              fontFamily: "var(--font-fredoka)",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: "var(--lav)",
            }}
          >
            {result.category}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-fredoka)",
              fontWeight: 700,
              fontSize: 28,
              margin: "6px 0 8px",
              color: "var(--ink)",
            }}
          >
            {result.title}
          </h2>
          <p style={{ color: "var(--muted)", margin: "0 0 14px", maxWidth: 560, fontWeight: 500 }}>
            {result.premise}
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <DifficultyMeter difficulty={result.difficulty} label={result.difficultyLabel} showLabel />
            <span className="pill">{result.length}</span>
            <span className="badge play">✨ Playable</span>
          </div>
          <div className="btn-row">
            <Link className="big-btn" href={`/challenge/${result.slug}`}>
              Open full challenge →
            </Link>
            <button type="button" className="ghost-btn" onClick={spin}>
              🎲 Spin again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
