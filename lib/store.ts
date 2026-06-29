"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { BASE_PACK_ID, packs } from "./packs";

interface AppState {
  /** User-selected packs, excluding the always-owned base game. */
  ownedPacks: string[];
  /** False until the user has explicitly set packs ("packs unknown" state). */
  packsSet: boolean;
  /** challengeId -> completed milestone indices. */
  progress: Record<string, number[]>;
  /** challengeId -> completed objective indices (same persistence as milestones). */
  objectives: Record<string, number[]>;
  /** Challenge ids the user has explicitly started (drives "My Challenges"). */
  started: string[];
  /** Challenge ids whose post-completion support prompt has already shown (once only). */
  supportPromptShown: string[];
  /** Whether the user has dismissed/answered the consent notice. */
  consentChoice: "accepted" | "declined" | null;

  _hasHydrated: boolean;
  _setHasHydrated: (v: boolean) => void;

  togglePack: (id: string) => void;
  selectAllPacks: () => void;
  setBaseGameOnly: () => void;
  toggleMilestone: (challengeId: string, index: number) => void;
  toggleObjective: (challengeId: string, index: number) => void;
  startChallenge: (challengeId: string) => void;
  markSupportPromptShown: (challengeId: string) => void;
  resetChallenge: (challengeId: string) => void;
  setConsent: (choice: "accepted" | "declined") => void;
}

/** Add/remove an index from a challenge's checklist map (milestones or objectives). */
function toggleIndex(
  map: Record<string, number[]>,
  challengeId: string,
  index: number,
): Record<string, number[]> {
  const current = map[challengeId] ?? [];
  const next = current.includes(index)
    ? current.filter((i) => i !== index)
    : [...current, index];
  const out = { ...map };
  if (next.length === 0) delete out[challengeId];
  else out[challengeId] = next.sort((a, b) => a - b);
  return out;
}

const NON_BASE_PACK_IDS = packs
  .map((p) => p.id)
  .filter((id) => id !== BASE_PACK_ID);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ownedPacks: [],
      packsSet: false,
      progress: {},
      objectives: {},
      started: [],
      supportPromptShown: [],
      consentChoice: null,

      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),

      togglePack: (id) =>
        set((s) => {
          if (id === BASE_PACK_ID) return s;
          const has = s.ownedPacks.includes(id);
          return {
            packsSet: true,
            ownedPacks: has
              ? s.ownedPacks.filter((p) => p !== id)
              : [...s.ownedPacks, id],
          };
        }),

      selectAllPacks: () =>
        set({ ownedPacks: [...NON_BASE_PACK_IDS], packsSet: true }),

      setBaseGameOnly: () => set({ ownedPacks: [], packsSet: true }),

      toggleMilestone: (challengeId, index) =>
        set((s) => ({ progress: toggleIndex(s.progress, challengeId, index) })),

      toggleObjective: (challengeId, index) =>
        set((s) => ({ objectives: toggleIndex(s.objectives, challengeId, index) })),

      startChallenge: (challengeId) =>
        set((s) =>
          s.started.includes(challengeId)
            ? s
            : { started: [...s.started, challengeId] },
        ),

      markSupportPromptShown: (challengeId) =>
        set((s) =>
          s.supportPromptShown.includes(challengeId)
            ? s
            : { supportPromptShown: [...s.supportPromptShown, challengeId] },
        ),

      resetChallenge: (challengeId) =>
        set((s) => {
          const progress = { ...s.progress };
          const objectives = { ...s.objectives };
          delete progress[challengeId];
          delete objectives[challengeId];
          return {
            progress,
            objectives,
            started: s.started.filter((id) => id !== challengeId),
          };
        }),

      setConsent: (choice) => set({ consentChoice: choice }),
    }),
    {
      name: "plumbob-store",
      version: 1,
      partialize: (s) => ({
        ownedPacks: s.ownedPacks,
        packsSet: s.packsSet,
        progress: s.progress,
        objectives: s.objectives,
        started: s.started,
        supportPromptShown: s.supportPromptShown,
        consentChoice: s.consentChoice,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);

/** Owned packs as a Set, always including the base game. */
export function useOwnedSet(): Set<string> {
  const ownedPacks = useStore((s) => s.ownedPacks);
  return new Set([...ownedPacks, BASE_PACK_ID]);
}

/**
 * True once the persisted store has rehydrated from localStorage. Use to guard
 * pack/progress-dependent UI so server and first client render agree (no
 * hydration mismatch), then re-render with the real values.
 */
export function useHydrated(): boolean {
  const hasHydrated = useStore((s) => s._hasHydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && hasHydrated;
}
