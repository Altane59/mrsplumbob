import rawPacks from "@/packs.json";
import type { Pack } from "./types";

export const packs: Pack[] = rawPacks as Pack[];

const byId = new Map(packs.map((p) => [p.id, p]));

/** The base game is always owned and cannot be toggled off. */
export const BASE_PACK_ID = "base";

export function packName(id: string): string {
  return byId.get(id)?.name ?? id;
}

/** Packs grouped by type, preserving the catalogue order within each group. */
export function packsByType(): Record<string, Pack[]> {
  const groups: Record<string, Pack[]> = {};
  for (const p of packs) {
    (groups[p.type] ??= []).push(p);
  }
  return groups;
}

/** Order packs are presented in (Base first, then expansions → kits). */
export const PACK_TYPE_ORDER = [
  "Base",
  "Expansion",
  "Game Pack",
  "Stuff Pack",
  "Kit",
];
