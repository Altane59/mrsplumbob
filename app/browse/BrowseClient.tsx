"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { challenges, categories, lengths, DIFFICULTY_NAME } from "@/lib/challenges";
import { isPlayable } from "@/lib/playability";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";
import ChallengeGrid from "@/components/ChallengeGrid";
import DifficultyLegend from "@/components/DifficultyLegend";

export default function BrowseClient() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [difficulty, setDifficulty] = useState("");
  const [length, setLength] = useState("");
  const [onlyPlayable, setOnlyPlayable] = useState(false);

  // "Only show playable" defaults ON once packs are set, OFF while unknown
  // (PRD §F2). Auto-set once on hydration; the user can override afterwards.
  const autoSet = useRef(false);
  useEffect(() => {
    if (hydrated && !autoSet.current) {
      autoSet.current = true;
      setOnlyPlayable(packsSet);
    }
  }, [hydrated, packsSet]);

  const list = challenges.filter((c) => {
    if (category && c.category !== category) return false;
    if (difficulty && c.difficulty !== Number(difficulty)) return false;
    if (length && c.length !== length) return false;
    if (q) {
      const hay = `${c.title} ${c.premise} ${c.type} ${c.category}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    if (onlyPlayable && !isPlayable(c, owned)) return false;
    return true;
  });

  return (
    <section className="section">
      <p className="eyebrow">💖 Browse</p>
      <h1 className="page">The library</h1>
      <p className="sub">
        Locked challenges stay visible — you&apos;ll always see the cute stuff a pack
        would unlock.
      </p>

      {hydrated && !packsSet && (
        <div className="nudge">
          ✦ You haven&apos;t set your packs yet, so everything&apos;s shown.{" "}
          <a href="/packs">Set your packs</a> to filter to what you can actually play.
        </div>
      )}

      <div className="filters">
        <input
          aria-label="Search challenges"
          placeholder="Search challenges…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select aria-label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Any difficulty</option>
          {[1, 2, 3, 4, 5].map((d) => (
            <option key={d} value={d}>
              {d} — {DIFFICULTY_NAME[d]}
            </option>
          ))}
        </select>
        <select aria-label="Length" value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="">Any length</option>
          {lengths.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="toggle"
          aria-pressed={onlyPlayable}
          onClick={() => setOnlyPlayable((v) => !v)}
          disabled={!hydrated || !packsSet}
          title={!packsSet ? "Set your packs first" : undefined}
        >
          <span className={`switch${onlyPlayable ? " on" : ""}`} />
          Playable only
        </button>
        <span className="count">{list.length} shown 🎀</span>
      </div>

      <DifficultyLegend />

      <h2 className="sr-only">Challenges</h2>
      <ChallengeGrid
        challenges={list}
        empty={
          <>
            No challenges match those filters yet. Try loosening them, or turn off
            “Playable only”. 💝
          </>
        }
      />
    </section>
  );
}
