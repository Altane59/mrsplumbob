# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Mrs Plumbob Challenges** — a Sims 4 challenge hub web app (domain `mrsplumbobchallenges.com`). A curated library of ~130 challenges, each written in one standard format and filtered to the game packs the player owns. Next.js 14 (App Router) + TypeScript, statically generated.

**`sir-plumbob-challenges-prd-v1.3.md` is the source of truth** for product behaviour (referred to as PRD §-numbers throughout the code's comments). `CLAUDE-CODE-PROMPT.md` is the original build brief. The MVP scope shipped is F0–F5 plus F9 (Surprise Me); accounts, community uploads, ratings, and aggregation are Phase 2/3 and deliberately not built.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build — also runs full type-check + lint (the CI gate)
npm start        # serve the production build (run build first)
npm run lint     # next lint only
```

There is **no test suite**. `npm run build` is the verification gate — it type-checks and lints the whole tree. Only one process can hold port 3000; kill stray `next start`/`next-server` processes before restarting (they otherwise serve stale prerenders).

## Theme is locked — do not "fix" it

The visual design intentionally **overrides PRD §15**. The brief locks the look to `plumbob-prototype.html`: a bright "girlie" theme (bubblegum pink `--pink`, lavender `--lav`, peach, cream background), Fredoka (headings/brand/buttons) + Quicksand (body) fonts, big rounded cards, soft pink shadows, and **plumbob diamonds (◆/◇, Sims-style, filled in plumbob-green `--plumbob`) as the difficulty unit** (`.pip` / `.pip.on` in `app/globals.css`). The green plumbob also survives as the small logo (`components/PlumbobLogo.tsx`). Do **not** revert to the dark teal theme or the Sora/Outfit/Space Mono fonts that PRD §15 describes. All design tokens live as CSS variables in `app/globals.css`; fonts are wired as `--font-fredoka` / `--font-quicksand` in `app/layout.tsx`. Copy is **British English** (colour, wardrobe, etc.).

Accessibility rule from the PRD: difficulty is **never** conveyed by the diamonds/colour alone — always paired with text (e.g. "Hard (3/5)"). See `components/DifficultyMeter.tsx`.

## Architecture

**Content is static, imported at build time.** `challenges.json` and `packs.json` (repo root) are the canonical data and are imported directly by `lib/challenges.ts` / `lib/packs.ts` — there is no database. (Supabase is a Phase-2 decision, not present.) `challenge/[slug]` pages are statically generated via `generateStaticParams`, giving clean SEO-friendly URLs and JSON-LD.

- **A challenge's `id` IS its route slug.** Ids in the data are already unique, URL-safe kebab strings. `lib/challenges.ts` sets `slug = c.id`, and progress is keyed by the same id — keep these three aligned. `slugify()` exists only for future free-text input.
- **Challenge data shape** lives in `lib/types.ts`. Most detail fields are optional and **rendered only when present** (e.g. `scoring` is string-or-null, `gettingStarted`/`cheats`/`strategyTips`/`allowed`/`notAllowed`/`objectives` may be empty, `baseGameVersion` may be empty/absent, `variations` can be a string OR array, `generationLadder` appears on only a few themed-legacy challenges and its rows have varying keys — `colour`/`veggie`/`career`/`aspiration` vs `heir`). The detail page (`app/challenge/[slug]/page.tsx`) gates every section accordingly — never assume a field is populated. `generationLadder` renders as a table (Gen · Colour/Veggie · Career · Aspiration · Notes).
- **`objectives` is a second checklist** that reuses `MilestoneTracker` via its `kind="objectives"` prop. Milestones and objectives are tracked in **separate** store maps (`progress` vs `objectives`) so they don't collide; both persist to localStorage identically.

**The pack-aware filter is the whole point** (PRD §F2). `lib/playability.ts` is the single source: a challenge is *Playable* only if the user owns **every** `packsRequired`; the base game is always owned; **recommended packs never affect playability**. Any UI that shows Playable/Locked must go through `isPlayable` / `missingPacks`.

**Two distinct pack states — don't collapse them:**
- *Packs unknown* (`packsSet === false`, the first-run default): the full library is shown with **neutral** badges (no Locked spam), Browse's "Only show playable" toggle is **OFF**, and a soft "set your packs" nudge appears. Never hard-gate.
- *Packs set* (including "base game only"): the toggle defaults **ON**.

This `packsSet` flag is the mechanism for that distinction. Setting "base game only" still sets `packsSet = true`.

**State: Zustand + localStorage** (`lib/store.ts`). Persists `ownedPacks` (excludes base — base is always owned implicitly), `packsSet`, `progress` (challengeId → completed milestone indices), `objectives` (same shape, for the objectives checklist), `started` (ids the user pressed "Start this challenge" on), and `consentChoice`.
- Because state is hydrated from localStorage, **any component reading owned packs or progress must guard with `useHydrated()`** and render a neutral/empty state until true, or you get SSR/client hydration mismatches. `useOwnedSet()` returns the owned set with base always included.
- Milestone/objective completion is keyed by array **index** (checklist items are plain strings and not user-edited). When persisting schema changes, keep `persist` `version: 1` and rely on the shallow merge to default new keys, so existing users' saved packs/progress aren't wiped.
- **"My Challenges"** (route still `/progress`, label changed) lists any challenge that's been started OR has milestone/objective progress; its progress bar combines both checklists. The detail page's `StartChallengeButton` (top and bottom) marks `started` and routes there.

**Server vs client split on the detail page:** the static challenge content (rules, setup, JSON-LD, metadata) is server-rendered for SEO. The two pieces that depend on owned packs — the playability banner and the required-pack ✓/✕ tags — are client islands in `app/challenge/[slug]/DetailPlayability.tsx` (`PlayabilityBanner`, `PacksBlock`). Keep pack-dependent UI in client islands so the rest can stay static.

**Daily challenge** (`lib/daily.ts`) is a deterministic date-based pick (no RNG, same for everyone per day) from a curated rotation of broadly-playable challenge **ids**. If you change the data, make sure `DAILY_ROTATION` still references ids that exist.

**Pages using `useSearchParams`** (e.g. `/browse`) must be wrapped in `<Suspense>` (see `app/browse/page.tsx` → `BrowseClient.tsx`) or the build fails.

**Support / donations** are a pure link-out to Ko-fi — no backend, no data. The URL is the single constant `KOFI_URL` in `lib/config.ts`; all links use `<KofiButton>` (always `target="_blank" rel="noopener noreferrer"`). Surfaces: the persistent footer button, the `/support` page, and `SupportCompletionPrompt` — a dismissible nudge shown **once** when a challenge becomes fully complete (tracked by the persisted `supportPromptShown` set; a mount-time baseline stops it firing for already-complete challenges on load). It's mounted only on the detail and My Challenges pages (the only places completion happens). Keep messaging to "support the running costs" — never sell anything EA-owned.

## Known tradeoff

Browse / Home / Search / Surprise / My Challenges are client components that import the full challenge detail array, so the entire dataset ships in their client bundle (~195 kB first load). Acceptable for the MVP. The intended optimisation is to feed the client a trimmed card-only index (title, premise, category, difficulty, packsRequired) and keep full detail server-side on `/challenge/[slug]`.
