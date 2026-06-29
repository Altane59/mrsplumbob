"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

function NavLinks({
  pathname,
  packsLabel,
  packsAria,
  onNavigate,
}: {
  pathname: string;
  packsLabel: string;
  packsAria: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`navlink${active ? " active" : ""}`}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
      <Link href="/packs" className="pill navpill" aria-label={packsAria} onClick={onNavigate}>
        <span aria-hidden="true">🎀</span> {packsLabel}
      </Link>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const ownedPacks = useStore((s) => s.ownedPacks);
  const packsSet = useStore((s) => s.packsSet);
  const [open, setOpen] = useState(false);

  const ownedCount = packsSet ? ownedPacks.length + 1 : 0;
  const total = packs.length;
  const set = hydrated && packsSet;
  const packsLabel = set ? `${ownedCount} of ${total} packs` : "Set your packs";
  const packsAria = set
    ? `My packs: ${ownedCount} of ${total} owned`
    : "Set the packs you own";
  const navProps = { pathname, packsLabel, packsAria };

  return (
    <header className="site-header">
      <div className="wrap">
        <div className="header-bar">
          <Link href="/" aria-label="Mrs Plumbob Challenges — home" className="brand">
            <PlumbobLogo />
            MrsPlumbobChallenges <span style={{ fontSize: 15 }}>💖</span>
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            <NavLinks {...navProps} />
          </nav>

          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav-toggle-bars" data-open={open} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav id="mobile-nav" className={`nav-mobile${open ? " open" : ""}`} aria-label="Primary">
          <NavLinks {...navProps} onNavigate={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
