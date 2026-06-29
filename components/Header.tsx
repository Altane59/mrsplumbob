"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PlumbobLogo from "./PlumbobLogo";
import { packs } from "@/lib/packs";
import { useHydrated, useStore } from "@/lib/store";

const NAV = [
  { href: "/browse", label: "Browse" },
  { href: "/surprise", label: "Surprise Me" },
  { href: "/search", label: "Search" },
  { href: "/packs", label: "My Packs" },
  { href: "/progress", label: "My Challenges" },
];

export default function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const ownedPacks = useStore((s) => s.ownedPacks);
  const packsSet = useStore((s) => s.packsSet);

  // +1 for the always-owned base game once packs are set.
  const ownedCount = packsSet ? ownedPacks.length + 1 : 0;
  const total = packs.length;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(10px)",
        background:
          "linear-gradient(180deg, rgba(255,242,248,.95), rgba(255,242,248,.72))",
        borderBottom: "2px solid var(--line)",
      }}
    >
      <div className="wrap">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            minHeight: 68,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            aria-label="Mrs Plumbob Challenges — home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontFamily: "var(--font-fredoka)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            <PlumbobLogo />
            MrsPlumbobChallenges <span style={{ fontSize: 15 }}>💖</span>
          </Link>

          <nav
            aria-label="Primary"
            style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap", alignItems: "center" }}
          >
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="navlink"
                  style={{
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 600,
                    fontSize: 15,
                    padding: "9px 16px",
                    borderRadius: 999,
                    textDecoration: "none",
                    transition: ".15s",
                    color: active ? "#fff" : "var(--muted)",
                    background: active
                      ? "linear-gradient(135deg,var(--pink),var(--lav))"
                      : "transparent",
                    boxShadow: active ? "0 6px 16px -6px var(--shadow)" : "none",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/packs"
              className="pill"
              style={{ marginLeft: 6, textDecoration: "none" }}
              title="Packs you own"
              aria-label={
                hydrated && packsSet
                  ? `My packs: ${ownedCount} of ${total} owned`
                  : "Set the packs you own"
              }
            >
              <span aria-hidden="true">🎀</span>{" "}
              {hydrated && packsSet ? `${ownedCount} of ${total}` : `Set your`} packs
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
