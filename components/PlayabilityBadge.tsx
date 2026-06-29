"use client";

import type { Challenge } from "@/lib/types";
import { isPlayable, missingPacks } from "@/lib/playability";
import { packName } from "@/lib/packs";
import { useHydrated, useOwnedSet, useStore } from "@/lib/store";

/**
 * Playability badge for a challenge. Before the user has set packs ("packs
 * unknown") we show a neutral badge rather than spamming Locked (PRD §F2).
 */
export default function PlayabilityBadge({ challenge }: { challenge: Challenge }) {
  const hydrated = useHydrated();
  const owned = useOwnedSet();
  const packsSet = useStore((s) => s.packsSet);

  // Until hydrated, or while packs are unknown, stay neutral.
  if (!hydrated || !packsSet) {
    return (
      <span className="badge neutral">✦ Set your packs to see if you can play</span>
    );
  }

  if (isPlayable(challenge, owned)) {
    return <span className="badge play">✨ Playable</span>;
  }

  const missing = missingPacks(challenge, owned).map(packName).join(", ");
  return (
    <span className="badge lock" title={`Needs: ${missing}`}>
      🔒 Locked
    </span>
  );
}
