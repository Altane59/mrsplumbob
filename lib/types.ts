export type PackType = "Base" | "Expansion" | "Game Pack" | "Stuff Pack" | "Kit";

export interface Pack {
  id: string;
  name: string;
  type: PackType | string;
}

export interface SetupLine {
  label: string;
  value: string;
}

/**
 * A row in a legacy challenge's generation ladder. Shape varies by challenge
 * (e.g. Not So Berry uses colour/career/aspiration; others use heir), so every
 * field beyond `gen` is optional and rendered only when present.
 */
export interface GenerationLadderEntry {
  gen: string | number;
  colour?: string;
  veggie?: string;
  career?: string;
  aspiration?: string;
  heir?: string;
  notes?: string;
}

/**
 * The Challenge shape mirrors the seed `challenges.json`. Fields that the
 * §11 schema defines but the MVP seed omits (failConditions, scoring,
 * strategyTips, variations, types[], tags[]) are optional so the richer
 * data renders later with no code changes.
 */
export interface Challenge {
  id: string;
  title: string;
  category: string;
  type: string;
  difficulty: number; // 1-5
  difficultyLabel?: string;
  length: string;
  bestFor?: string;
  premise: string;
  backstory?: string;
  goal: string;
  packsRequired: string[];
  packsRecommended: string[];
  /** How to play without the recommended packs (may be empty/absent). */
  baseGameVersion?: string;
  gettingStarted?: string[];
  cheats?: string[];
  setup: SetupLine[];
  generalRules: string[];
  specificRules: string[];
  /** Permitted cheats / items / actions. */
  allowed?: string[];
  /** Explicit prohibitions. */
  notAllowed?: string[];
  strategyTips?: string[];
  scoring?: string | null;
  wantItHarder: string[];
  milestones: string[];
  /** Concrete, checkable completion checklist (tracked like milestones). */
  objectives?: string[];
  variations?: string | string[];
  generationLadder?: GenerationLadderEntry[];
  credit: string;
  lastTested: string;

  // Optional / future (§11) — rendered only when present.
  failConditions?: string;
}

/** Challenge with a build-time generated slug for clean URLs. */
export type ChallengeWithSlug = Challenge & { slug: string };
