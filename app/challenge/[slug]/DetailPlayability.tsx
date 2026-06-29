"use client";

import type { Challenge } from "@/lib/types";
import { isPlayable, missingPacks } from "@/lib/playability";
import { packName, BASE_PACK_ID } from "@/lib/packs";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";

/** Playability banner + a soft "set your packs" nudge while packs are unknown. */
export function PlayabilityBanner({ challenge }: { challenge: Challenge }) {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);

  const playable = isPlayable(challenge, owned);
  const missing = missingPacks(challenge, owned);

  return (
    <>
      <div style={{ marginBottom: 6 }}>
        {!hydrated || !packsSet ? (
          <span className="badge neutral">✦ Set your packs to confirm this works for you</span>
        ) : playable ? (
          <span className="badge play">✨ Playable with your packs</span>
        ) : (
          <span className="badge lock">🔒 Needs: {missing.map(packName).join(", ")}</span>
        )}
      </div>

      {hydrated && !packsSet && (
        <div className="nudge" style={{ marginTop: 12 }}>
          ✦ <a href="/packs">Set your packs</a> and we&apos;ll confirm whether this one
          works for you before you start.
        </div>
      )}
    </>
  );
}

/** Required pack tags (✓/✕ vs owned) + recommended pack tags. */
export function PacksBlock({ challenge }: { challenge: Challenge }) {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);

  const baseOnly =
    challenge.packsRequired.length === 0 ||
    challenge.packsRequired.every((p) => p === BASE_PACK_ID);

  return (
    <div className="block">
      <h4>🎀 Packs required</h4>
      <div>
        {baseOnly ? (
          <span className="packtag owned">✓ Base game only</span>
        ) : (
          challenge.packsRequired.map((p) => {
            const has = !hydrated || !packsSet ? null : p === BASE_PACK_ID || owned.has(p);
            const cls = has === null ? "" : has ? "owned" : "missing";
            return (
              <span key={p} className={`packtag ${cls}`}>
                {has === null ? "" : has ? "✓ " : "✕ "}
                {packName(p)}
              </span>
            );
          })
        )}
      </div>

      <h4 style={{ marginTop: 16 }}>Packs recommended</h4>
      <div>
        {challenge.packsRecommended.length > 0 ? (
          challenge.packsRecommended.map((p) => (
            <span key={p} className="packtag">
              {packName(p)}
            </span>
          ))
        ) : (
          <span style={{ color: "var(--muted2)", fontSize: 13, fontWeight: 600 }}>None</span>
        )}
      </div>
    </div>
  );
}
