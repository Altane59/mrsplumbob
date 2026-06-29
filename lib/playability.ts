import type { Challenge } from "./types";
import { BASE_PACK_ID } from "./packs";

/**
 * The product's core rule (PRD §F2): a challenge is Playable only if the user
 * owns EVERY pack it requires. Recommended packs never affect playability.
 * The base game is always owned.
 */
export function isPlayable(challenge: Challenge, owned: Set<string>): boolean {
  return challenge.packsRequired.every(
    (p) => p === BASE_PACK_ID || owned.has(p),
  );
}

/** The required packs the user is missing (drives the Locked badge tooltip). */
export function missingPacks(challenge: Challenge, owned: Set<string>): string[] {
  return challenge.packsRequired.filter(
    (p) => p !== BASE_PACK_ID && !owned.has(p),
  );
}
