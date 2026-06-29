"use client";

import { BASE_PACK_ID, PACK_TYPE_ORDER, packsByType } from "@/lib/packs";
import { useHydrated, useStore } from "@/lib/store";

export default function PackGrid() {
  const hydrated = useHydrated();
  const ownedPacks = useStore((s) => s.ownedPacks);
  const togglePack = useStore((s) => s.togglePack);

  const groups = packsByType();
  const types = PACK_TYPE_ORDER.filter((t) => groups[t]).concat(
    Object.keys(groups).filter((t) => !PACK_TYPE_ORDER.includes(t)),
  );

  const owns = (id: string) => id === BASE_PACK_ID || ownedPacks.includes(id);

  return (
    <div>
      {types.map((type) => (
        <div key={type}>
          <h2
            style={{
              fontFamily: "var(--font-fredoka)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--lav)",
              margin: "24px 0 11px",
            }}
          >
            {type}
          </h2>
          <div className="packgrid">
            {groups[type].map((p) => {
              const base = p.id === BASE_PACK_ID;
              const on = hydrated && owns(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`packrow${on ? " on" : ""}${base ? " base" : ""}`}
                  aria-pressed={base ? undefined : on}
                  aria-label={`${p.name}${base ? " (always owned)" : on ? " — owned" : " — not owned"}`}
                  disabled={base}
                  onClick={() => !base && togglePack(p.id)}
                >
                  <span className={`switch${on ? " on" : ""}`} style={{ pointerEvents: "none" }} />
                  <span style={{ flex: 1 }}>
                    <span className="nm">{p.name}</span>
                    <br />
                    <span className="ty">{base ? "Always owned ♡" : p.type}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
