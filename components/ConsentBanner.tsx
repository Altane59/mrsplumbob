"use client";

import { useHydrated, useStore } from "@/lib/store";

/**
 * Lightweight, dismissible consent notice (PRD §16/§21). No non-essential
 * analytics is wired in this build, so the choice gates nothing yet — it is
 * stored ready to gate analytics once they're added. Functional storage
 * (packs, progress) is essential and not covered by this opt-in.
 */
export default function ConsentBanner() {
  const hydrated = useHydrated();
  const consentChoice = useStore((s) => s.consentChoice);
  const setConsent = useStore((s) => s.setConsent);

  if (!hydrated || consentChoice !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and analytics consent"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 50,
        maxWidth: 720,
        margin: "0 auto",
        background: "var(--card)",
        border: "2px solid var(--pink)",
        borderRadius: 22,
        padding: "16px 20px",
        boxShadow: "0 20px 50px -22px var(--shadow)",
        display: "flex",
        gap: 14,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <p style={{ margin: 0, flex: 1, minWidth: 220, fontWeight: 600, fontSize: 14 }}>
        We keep your pack choices and progress in your browser so the site works.
        We&apos;d also like to count anonymous usage to improve things — only if you
        say yes. 💕
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="ghost-btn" onClick={() => setConsent("declined")}>
          No thanks
        </button>
        <button className="big-btn" style={{ fontSize: 16, padding: "12px 22px" }} onClick={() => setConsent("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
