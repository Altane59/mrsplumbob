"use client";

import { challenges } from "@/lib/challenges";
import { isPlayable } from "@/lib/playability";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";
import PackGrid from "@/components/PackGrid";

export default function PacksPage() {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);
  const selectAllPacks = useStore((s) => s.selectAllPacks);
  const setBaseGameOnly = useStore((s) => s.setBaseGameOnly);

  const playable = challenges.filter((c) => isPlayable(c, owned)).length;

  return (
    <section className="section">
      <p className="eyebrow">🎀 My Packs</p>
      <h1 className="page">What do you own?</h1>
      <p className="sub">
        Toggle the packs you have. Everything else — Browse and Surprise Me — listens
        to this. (Base Game is always on!)
      </p>

      <div className="btn-row" style={{ marginBottom: 6 }}>
        <button type="button" className="ghost-btn" onClick={selectAllPacks}>
          Select all
        </button>
        <button type="button" className="ghost-btn" onClick={setBaseGameOnly}>
          Base game only
        </button>
      </div>

      <PackGrid />

      <p className="sub" style={{ marginTop: 24, color: "var(--lav)", fontWeight: 700 }}>
        {hydrated && packsSet
          ? `With these packs, ${playable} of ${challenges.length} challenges are playable. 💖`
          : "Set your packs to see how many challenges you can play. 💖"}
      </p>
    </section>
  );
}
