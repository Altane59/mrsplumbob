import Link from "next/link";
import KofiButton from "./KofiButton";
import { SUPPORT_LABEL } from "@/lib/config";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "30px 0 44px",
        color: "var(--muted2)",
        fontSize: 13,
        fontWeight: 600,
        borderTop: "2px solid var(--line)",
        marginTop: 20,
      }}
    >
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <KofiButton className="ghost-btn">{SUPPORT_LABEL}</KofiButton>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/about">About / Legal</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/guidelines">Community Guidelines</Link>
          <Link href="/support">Support</Link>
        </div>
        <p style={{ margin: 0, maxWidth: 720 }}>
          Mrs Plumbob Challenges is an <strong>unofficial fan project</strong> — not
          affiliated with, endorsed by, or sponsored by EA or Maxis. <em>The Sims</em>{" "}
          and the plumbob are trademarks of their respective owners. Made with 🎀 for
          the Sims 4 community.
        </p>
      </div>
    </footer>
  );
}
