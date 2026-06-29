# Sir Plumbob Challenges — Build Prompt for Claude Code

Put these files in one folder, open Claude Code in that folder, and paste the prompt below.

## Files to include in the folder
- `PRD.md`  ← rename from `sir-plumbob-challenges-prd-v1.3.md` (the spec / source of truth)
- `prototype.html`  ← rename from `plumbob-prototype.html` (the look + screen flow + Surprise Me behaviour)
- `challenges.json`  (seed challenge data)
- `packs.json`  (pack list for the filter)
- `template.md`  ← rename from `plumbob-challenge-template.md` (the data shape for a challenge)

---

## The prompt

You're building a web app called **Sir Plumbob Challenges** — a Sims 4 challenge hub.

`PRD.md` is the complete spec and the **source of truth**. Read it end to end first, then propose a build plan and folder structure before writing any code. Wait for my OK on the plan.

**Look & feel:** match `prototype.html` exactly — the bright, soft, "girlie" style (bubblegum pink + lavender + peach on a light background, the rounded Fredoka/Quicksand fonts, big rounded cards, hearts for the difficulty rating, soft pink shadows). The green plumbob stays only as the small logo. Do **not** revert to a dark or neutral theme.

**Stack:** use what the PRD's §17 "Stack Decision Gate" specifies (Next.js + Supabase).

**Scope — build only the MVP** (functional requirements F0–F5 in the PRD):
- F0 Home (include the simple Daily Challenge + a big "Surprise Me" entry)
- F1 My Packs (toggle which packs I own)
- F2 Browse with the **pack-aware filter**
- F3 Challenge detail page (render the full standardised format + a checkable milestone tracker)
- F4 Progress tracking
- F5 Search
- F9 **Surprise Me** — the random generator. One tap returns a random challenge that is **Playable** for the user (respects owned packs), with optional difficulty/category pre-filters and a "spin again". (It's prototyped in `prototype.html` — match that behaviour. Pull it into the MVP.)

**The pack filter is the centrepiece:** a challenge is **Playable** only if I own *every* one of its `packsRequired`; otherwise it's **Locked**. Never hide locked challenges — always show them with a Locked badge that names the missing packs. Recommended packs never affect playability.

**Data:** seed the database from `challenges.json` and `packs.json`. The schema is in the PRD (§11) and mirrored by `template.md`.

**Leave out for now** (they're Phase 2/3 in the PRD): accounts/sign-in, community uploads, ratings/favourites, and the aggregation features. Use simple in-app state where the MVP needs it.

**Quality bar:** responsive down to mobile, visible keyboard focus, respect reduced-motion.

Ask me before making any major decision the PRD doesn't cover.

---

## After the MVP works
- Add the rest of the 130 challenges (I have a full detailed book — `plumbob-challenge-book-detailed.md` — to convert into more `challenges.json` entries).
- Then Phase 2 from the PRD: accounts, then the upload form (its full field spec is in PRD §F7), then ratings/favourites.
