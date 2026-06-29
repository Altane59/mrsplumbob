import rawChallenges from "@/challenges.json";
import type { Challenge, ChallengeWithSlug } from "./types";

/** Turn a title into a clean, URL-safe slug (PRD §16: /challenge/rags-to-riches). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/§/g, "")
    .replace(/['’]/g, "")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * All challenges. Each challenge's `id` is already a clean, unique, URL-safe
 * kebab string, so it doubles as the route slug (and matches the key progress
 * is stored under). `slugify` remains available for any future free-text input.
 */
export const challenges: ChallengeWithSlug[] = (rawChallenges as Challenge[]).map(
  (c) => ({ ...c, slug: c.id }),
);

const bySlug = new Map(challenges.map((c) => [c.slug, c]));
const byId = new Map(challenges.map((c) => [c.id, c]));

export function getChallengeBySlug(slug: string): ChallengeWithSlug | undefined {
  return bySlug.get(slug);
}

export function getChallengeById(id: string): ChallengeWithSlug | undefined {
  return byId.get(id);
}

/** Distinct category list, in the canonical PRD order where possible. */
const CATEGORY_ORDER = [
  "Wealth & Progression",
  "Family & Generational",
  "Occult & Supernatural",
  "Survival & Hardship",
  "Villain & Dark Roleplay",
  "Build & Create-a-Sim",
  "Career & Skill",
  "Themed & Narrative",
  "Bite-Sized & Competitive",
  "Pack-Driven",
];

export const categories: string[] = CATEGORY_ORDER.filter((cat) =>
  challenges.some((c) => c.category === cat),
).concat(
  [...new Set(challenges.map((c) => c.category))].filter(
    (cat) => !CATEGORY_ORDER.includes(cat),
  ),
);

export const lengths: string[] = [...new Set(challenges.map((c) => c.length))];

export const DIFFICULTY_NAME: Record<number, string> = {
  1: "Casual",
  2: "Moderate",
  3: "Hard",
  4: "Brutal",
  5: "Extreme",
};

export function difficultyName(d: number): string {
  return DIFFICULTY_NAME[d] ?? `${d}/5`;
}
