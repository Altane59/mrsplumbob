import { challenges, getChallengeById } from "./challenges";
import type { ChallengeWithSlug } from "./types";

/**
 * Curated rotation of broadly-playable picks for the Daily Challenge (PRD §F0).
 * Deliberately base-game-friendly so most visitors find the day's pick Playable;
 * if a visitor lacks a required pack it still shows with the normal Locked badge.
 */
const DAILY_ROTATION = [
  "rags-to-riches",
  "the-legacy-challenge",
  "the-immortal",
  "the-apocalypse-challenge",
  "black-widow",
  "the-20k-challenge",
  "jack-of-all-trades",
  "the-decades-challenge",
  "the-24-hour-challenge",
  "pack-legacy",
];

const pool: ChallengeWithSlug[] = DAILY_ROTATION.map((id) =>
  getChallengeById(id),
).filter((c): c is ChallengeWithSlug => Boolean(c));

/** Whole days since the Unix epoch — deterministic and the same for everyone. */
function dayNumber(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000);
}

/** The same challenge for everyone on a given calendar day (no RNG). */
export function getDailyChallenge(date: Date = new Date()): ChallengeWithSlug {
  const list = pool.length > 0 ? pool : challenges;
  return list[dayNumber(date) % list.length];
}
