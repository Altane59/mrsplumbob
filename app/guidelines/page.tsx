import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "The rules all community-submitted challenges must follow.",
};

export default function GuidelinesPage() {
  return (
    <section className="section prose">
      <p className="eyebrow">🎀 Community Guidelines</p>
      <h1 className="page">Community Guidelines</h1>
      <p>
        These guidelines apply to all community-submitted content (coming in a later
        phase) and to anything reported on the site. The Sims 4 has a wide, largely
        young audience, so content must be <strong>age-appropriate and safe</strong>.
      </p>

      <h2>Allowed</h2>
      <ul>
        <li>Original or properly-attributed Sims 4 <em>gameplay</em> challenges.</li>
        <li>Safe-for-work, respectful, clearly written and genuinely playable.</li>
      </ul>

      <h2>Not allowed</h2>
      <ul>
        <li>Sexual or NSFW content of any kind.</li>
        <li>
          <strong>
            Any content that sexualises minors or otherwise endangers children — zero
            tolerance.
          </strong>{" "}
          Such material is removed immediately and reported to the relevant
          authorities as required by law.
        </li>
        <li>Hateful, discriminatory, or harassing content; content targeting real people.</li>
        <li>Real-world harmful instructions.</li>
        <li>Plagiarism — posting others&apos; challenges without credit and a source link.</li>
        <li>Spam, advertising, or off-topic content.</li>
      </ul>

      <h2>Enforcement</h2>
      <p>
        All submissions will be reviewed before publishing, anyone can report
        published content, and repeat or severe violations lead to submission bans. A
        named Trust &amp; Safety owner is accountable for content safety, with a
        documented escalation procedure for the most serious cases.
      </p>
    </section>
  );
}
