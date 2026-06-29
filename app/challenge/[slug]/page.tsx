import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { challenges, getChallengeBySlug, difficultyName } from "@/lib/challenges";
import DifficultyMeter from "@/components/DifficultyMeter";
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

      {c.backstory && (
        <div className="block">
          <h4>📖 The story</h4>
          <p style={{ margin: 0 }}>{c.backstory}</p>
        </div>
      )}

      <div className="block">
        <h4>💝 The goal</h4>
        <p style={{ margin: 0 }}>{c.goal}</p>
      </div>

      {c.failConditions && (
        <div className="block">
          <h4>🚫 Fail conditions</h4>
          <p style={{ margin: 0 }}>{c.failConditions}</p>
        </div>
      )}

      <PacksBlock challenge={c} />

      <div className="block">
        <h4>🏡 Setup</h4>
        {c.setup.map((s, i) => (
          <div className="setup-line" key={i}>
            <span className="k">{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
      </div>

      {c.gettingStarted && c.gettingStarted.length > 0 && (
        <div className="block">
          <h4>🚀 Getting started</h4>
          <ul>
            {c.gettingStarted.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.cheats && c.cheats.length > 0 && (
        <div className="block">
          <h4>⌨️ Cheats to type</h4>
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
          <h4>📋 General rules</h4>
          <ul>
            {c.generalRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.specificRules.length > 0 && (
        <div className="block">
          <h4>✨ Specific rules</h4>
          <ul>
            {c.specificRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.allowed && c.allowed.length > 0 && (
        <div className="block">
          <h4>✅ What you can do</h4>
          <ul>
            {c.allowed.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.notAllowed && c.notAllowed.length > 0 && (
        <div className="block">
          <h4>⛔ What you can&apos;t do</h4>
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
          <h4>🎮 If you don&apos;t own the packs</h4>
          <p style={{ margin: 0 }}>{c.baseGameVersion}</p>
        </div>
      )}

      {c.generationLadder && c.generationLadder.length > 0 && (
        <div className="block">
          <h4>👑 Generation ladder</h4>
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
          <h4>💡 Strategy tips</h4>
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
          <h4>🔥 Want it harder?</h4>
          <ul>
            {c.wantItHarder.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {c.scoring && (
        <div className="block">
          <h4>🏆 Scoring</h4>
          <p style={{ margin: 0 }}>{c.scoring}</p>
        </div>
      )}

      {variationsContent(c.variations) && (
        <div className="block">
          <h4>🎭 Variations</h4>
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
