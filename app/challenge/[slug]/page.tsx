import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { challenges, getChallengeBySlug, difficultyName } from "@/lib/challenges";
import DifficultyMeter from "@/components/DifficultyMeter";
import DifficultyLegend from "@/components/DifficultyLegend";
import MilestoneTracker from "@/components/MilestoneTracker";
import { PlayabilityBanner, PacksBlock } from "./DetailPlayability";
import StartChallengeButton from "./StartChallengeButton";
import SupportCompletionPrompt from "@/components/SupportCompletionPrompt";

/** Variations may arrive as a string or a list — true when either has content. */
function variationsContent(v?: string | string[]): boolean {
  if (!v) return false;
  return Array.isArray(v) ? v.length > 0 : v.trim().length > 0;
}

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getChallengeBySlug(params.slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.premise,
    openGraph: { title: c.title, description: c.premise, type: "article" },
    alternates: { canonical: `/challenge/${c.slug}` },
  };
}

export default function ChallengeDetailPage({ params }: { params: { slug: string } }) {
  const c = getChallengeBySlug(params.slug);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.title,
    description: c.premise,
    step: c.milestones.map((m, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: m,
    })),
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link className="back" href="/browse">
        ← Back to browse
      </Link>
      <p className="eyebrow">{c.category}</p>
      <h1 className="page">{c.title}</h1>
      <p className="sub" style={{ marginBottom: 14 }}>
        {c.premise}
      </p>

      <PlayabilityBanner challenge={c} />

      <div className="btn-row" style={{ margin: "12px 0 4px" }}>
        <StartChallengeButton challengeId={c.id} />
      </div>

      <div className="statblock">
        <div className="stat">
          <div className="k">Type</div>
          <div className="v">{c.type}</div>
        </div>
        <div className="stat">
          <div className="k">Difficulty</div>
          <div className="v">
            {c.difficultyLabel ?? difficultyName(c.difficulty)}{" "}
            <DifficultyMeter difficulty={c.difficulty} label={c.difficultyLabel} />
          </div>
        </div>
        <div className="stat">
          <div className="k">Length</div>
          <div className="v">{c.length}</div>
        </div>
        {c.bestFor && (
          <div className="stat">
            <div className="k">Best for</div>
            <div className="v">{c.bestFor}</div>
          </div>
        )}
      </div>

      <DifficultyLegend />

      {c.backstory && (
        <div className="block">
          <h2>📖 The story</h2>
          <p style={{ margin: 0 }}>{c.backstory}</p>
        </div>
      )}

      <div className="block">
        <h2>💝 The goal</h2>
        <p style={{ margin: 0 }}>{c.goal}</p>
      </div>

      {c.failConditions && (
        <div className="block">
          <h2>🚫 Fail conditions</h2>
          <p style={{ margin: 0 }}>{c.failConditions}</p>
        </div>
      )}

      <PacksBlock challenge={c} />

      <div className="block">
        <h2>🏡 Setup</h2>
        {c.setup.map((s, i) => (
          <div className="setup-line" key={i}>
            <span className="k">{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
      </div>

      {c.gettingStarted && c.gettingStarted.length > 0 && (
        <div className="block">
          <h2>🚀 Getting started</h2>
          <ul>
            {c.gettingStarted.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.cheats && c.cheats.length > 0 && (
        <div className="block">
          <h2>⌨️ Cheats to type</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {c.cheats.map((cheat, i) => (
              <code
                key={i}
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "var(--cream)",
                  border: "2px solid var(--line)",
                  borderRadius: 10,
                  padding: "6px 10px",
                  color: "var(--ink)",
                }}
              >
                {cheat}
              </code>
            ))}
          </div>
        </div>
      )}

      {c.generalRules.length > 0 && (
        <div className="block">
          <h2>📋 General rules</h2>
          <ul>
            {c.generalRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.specificRules.length > 0 && (
        <div className="block">
          <h2>✨ Specific rules</h2>
          <ul>
            {c.specificRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.allowed && c.allowed.length > 0 && (
        <div className="block">
          <h2>✅ What you can do</h2>
          <ul>
            {c.allowed.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.notAllowed && c.notAllowed.length > 0 && (
        <div className="block">
          <h2>⛔ What you can&apos;t do</h2>
          <ul>
            {c.notAllowed.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.objectives && c.objectives.length > 0 && (
        <MilestoneTracker
          challengeId={c.id}
          items={c.objectives}
          kind="objectives"
          title="🎯 Objectives — complete the checklist"
        />
      )}

      {c.baseGameVersion && c.baseGameVersion.trim().length > 0 && (
        <div
          className="block"
          style={{ background: "linear-gradient(135deg,#fff5fb,#f3ecff)" }}
        >
          <h2>🎮 If you don&apos;t own the packs</h2>
          <p style={{ margin: 0 }}>{c.baseGameVersion}</p>
        </div>
      )}

      {c.generationLadder && c.generationLadder.length > 0 && (
        <div className="block">
          <h2>👑 Generation ladder</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="ladder">
              <thead>
                <tr>
                  <th>Gen</th>
                  <th>Colour / Veggie</th>
                  <th>Career</th>
                  <th>Aspiration</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {c.generationLadder.map((e, i) => (
                  <tr key={i}>
                    <td>{e.gen}</td>
                    <td>{[e.colour, e.veggie, e.heir].filter(Boolean).join(" · ") || "—"}</td>
                    <td>{e.career || "—"}</td>
                    <td>{e.aspiration || "—"}</td>
                    <td>{e.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {c.strategyTips && c.strategyTips.length > 0 && (
        <div className="block">
          <h2>💡 Strategy tips</h2>
          <ul>
            {c.strategyTips.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <MilestoneTracker
        challengeId={c.id}
        items={c.milestones}
        kind="milestones"
        title="💕 Milestones — track your progress"
      />

      {c.wantItHarder.length > 0 && (
        <div className="block">
          <h2>🔥 Want it harder?</h2>
          <ul>
            {c.wantItHarder.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.scoring && (
        <div className="block">
          <h2>🏆 Scoring</h2>
          <p style={{ margin: 0 }}>{c.scoring}</p>
        </div>
      )}

      {variationsContent(c.variations) && (
        <div className="block">
          <h2>🎭 Variations</h2>
          {Array.isArray(c.variations) ? (
            <ul>
              {c.variations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>{c.variations}</p>
          )}
        </div>
      )}

      <div className="btn-row" style={{ margin: "24px 0 4px" }}>
        <StartChallengeButton challengeId={c.id} />
      </div>

      <p className="credit">
        {c.credit} · Last tested: {c.lastTested}
      </p>

      <SupportCompletionPrompt />
    </section>
  );
}
