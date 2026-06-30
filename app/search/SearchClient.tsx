"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { challenges } from "@/lib/challenges";
import ChallengeGrid from "@/components/ChallengeGrid";

export default function SearchClient() {
  const params = useSearchParams();
  // Seed from ?q= so the schema.org SearchAction (sitelinks search box) works.
  const [q, setQ] = useState(params.get("q") ?? "");

  const query = q.trim().toLowerCase();
  // Search ALWAYS returns every match, independent of playability (PRD §F5).
  // Locked results are still badged (by ChallengeCard), never hidden.
  const list = query
    ? challenges.filter((c) =>
        `${c.title} ${c.premise} ${c.type} ${c.category}`.toLowerCase().includes(query),
      )
    : [];

  return (
    <section className="section">
      <p className="eyebrow">🔍 Search</p>
      <h1 className="page">Find a challenge</h1>
      <p className="sub">
        Search by title, theme or type. You&apos;ll always see every match — even ones
        that need a pack you don&apos;t own (they&apos;re just badged Locked).
      </p>

      <div className="filters">
        <input
          autoFocus
          aria-label="Search challenges"
          placeholder="Try “vampire”, “legacy”, “off-grid”…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {query && <span className="count">{list.length} match{list.length === 1 ? "" : "es"} 🎀</span>}
      </div>

      {query ? (
        <>
          <h2 className="sr-only">Search results</h2>
          <ChallengeGrid challenges={list} empty={<>No challenges match “{q}”. Try another word. 💝</>} />
        </>
      ) : (
        <div className="empty">Type something above to search the library. ✨</div>
      )}
    </section>
  );
}
