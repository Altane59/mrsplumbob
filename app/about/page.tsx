import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About / Legal",
  description: "About Mrs Plumbob Challenges — an unofficial Sims 4 fan project.",
};

export default function AboutPage() {
  return (
    <section className="section prose">
      <p className="eyebrow">💖 About</p>
      <h1 className="page">About Mrs Plumbob Challenges</h1>
      <p>
        Mrs Plumbob Challenges is a single, friendly home for Sims 4 challenges:
        every one written in the same clear format, and filtered to the packs you
        actually own so you never start something you can&apos;t finish.
      </p>

      <h2>Unofficial fan project</h2>
      <p>
        This site is <strong>not affiliated with, endorsed by, or sponsored by</strong>{" "}
        Electronic Arts or Maxis. <em>The Sims</em>, the plumbob, and all related
        marks are trademarks of their respective owners. We catalogue{" "}
        <em>gameplay</em> challenges only — we do not host or distribute mods, custom
        content, or game files.
      </p>

      <h2>Credit to creators</h2>
      <p>
        Many of these challenges are community classics. We attribute each to its
        original creator wherever known and link the source. If you created a
        challenge listed here and would like a correction, additional credit, or
        removal, please get in touch and we&apos;ll act promptly.
      </p>

      <h2>Accuracy</h2>
      <p>
        Each challenge carries a &ldquo;last tested&rdquo; game patch and date. Rules
        can drift as the game updates; if something looks out of date, let us know.
      </p>
    </section>
  );
}
