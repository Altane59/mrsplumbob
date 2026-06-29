import type { Metadata } from "next";
import KofiButton from "@/components/KofiButton";

export const metadata: Metadata = {
  title: "Support Mrs Plumbob",
  description:
    "Mrs Plumbob Challenges is a free fan project. If it's helped you, you can chip in towards its running costs on Ko-fi.",
};

export default function SupportPage() {
  return (
    <section className="section prose">
      <p className="eyebrow">☕ Support</p>
      <h1 className="page">Support Mrs Plumbob ☕</h1>

      <p>{"Mrs Plumbob Challenges is free, and always will be. 💚"}</p>

      <p>
        {
          "This is a little fan project built by a Simmer, for Simmers — somewhere to find your next favourite Sims 4 challenge, written out clearly and filtered to the packs you actually own."
        }
      </p>

      <p>
        {
          "If the site's helped you, you're welcome to buy me a coffee. Donations go straight toward hosting costs and building new features — nothing more, and it's never expected. Every little bit genuinely means the world. ☕🌿"
        }
      </p>

      <div className="btn-row" style={{ margin: "8px 0 24px" }}>
        <KofiButton className="big-btn">Buy me a coffee on Ko-fi →</KofiButton>
      </div>

      <p style={{ color: "var(--muted2)", fontWeight: 600, fontSize: 13 }}>
        {
          "Mrs Plumbob Challenges is an unofficial fan project and is not affiliated with or endorsed by EA or Maxis."
        }
      </p>
    </section>
  );
}
