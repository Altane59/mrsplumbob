import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Mrs Plumbob Challenges handles your data.",
};

export default function PrivacyPage() {
  return (
    <section className="section prose">
      <p className="eyebrow">🔒 Privacy</p>
      <h1 className="page">Privacy</h1>
      <p>
        We keep things minimal. Mrs Plumbob Challenges works without an account, and
        we don&apos;t collect personal information to use it.
      </p>

      <h2>What stays in your browser</h2>
      <p>
        Your selected packs and your challenge progress are stored locally in your
        own browser (localStorage). This is essential to how the site works — it is
        not tracking, and it never leaves your device. Clearing your browser storage
        will reset these.
      </p>

      <h2>Analytics &amp; consent</h2>
      <p>
        Any non-essential, anonymous usage analytics are only ever switched on if you
        explicitly accept them via the consent notice. You can decline, and the site
        works exactly the same. We do not sell data or build advertising profiles.
      </p>

      <h2>Accounts (coming later)</h2>
      <p>
        When optional accounts arrive, the only personal data we&apos;ll collect is
        what&apos;s needed to sign in (e.g. an email address), and you&apos;ll be able
        to export or delete your data.
      </p>
    </section>
  );
}
