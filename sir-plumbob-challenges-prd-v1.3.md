# Product Requirements Document — Sir Plumbob Challenges

| | |
|:--|:--|
| **Product** | Sir Plumbob Challenges |
| **Domain** | sirplumbobchallenges.com *(TLD to confirm/register)* |
| **One-liner** | Every Sims 4 challenge, written clearly and filtered to the packs you actually own. |
| **Document owner** | *(you)* |
| **Version** | 1.3 (Build-ready — upload form fully specified) |
| **Last updated** | 21 June 2026 |
| **Status** | Ready for build (MVP); Phase-2 upload form spec complete |
| **Related artifacts** | Build guide; challenge template; category catalogue (130); standard & detailed challenge books; React prototype (`plumbob-challenge-hub.jsx`) |

---

## Changelog — v1.2 → v1.3 (third review responses)

- **Upload is now fully buildable:** F7 gains a complete **field-by-field submission form spec** — every template field mapped to a form control, with required/optional status and validation, a pack picker (pack IDs, not free text), controlled category/type/tag lists, system-generated milestone IDs, a sign-in requirement, and a pre-submit preview.
- **Daily Challenge phase fixed:** moved into **F0 (MVP)** as a simple curated daily rotation, so a P0 screen no longer depends on a P2 feature. **F9 is now just "Surprise Me."**
- **Clarified:** submissions are an on-site form mirroring the template — **text-only, not a file upload** (made explicit in F7).

---

## Changelog — v1.1 → v1.2 (responses to re-review)

The v1.1 re-review found no critical/blocking issues; these are the accepted refinements:

- **Generator repurposed (was redundant with Browse):** F9 is now **"Surprise Me" + Daily Challenge**, giving it a distinct job.
- **Home cold-start fixed:** added a `featured` flag to the schema; MVP "Popular" is hand-curated (§F0, §11).
- **Pack-honesty in the "packs unknown" state:** a soft "set your packs" nudge at Start (§F2/§F3).
- **Child-safety operationalised:** named **Trust & Safety owner** + escalation procedure (§14).
- **Phase-2 infra documented:** transactional **email** + **consent-management** dependencies named (§17); a `Notification` entity added (§11).
- **Deletion integrity:** `submittedBy` is set to a `"former-contributor"` sentinel on account deletion (§11).
- **Metrics blind spot:** an **essential, aggregate, non-PII** North Star counter that doesn't require consent (§5/§18).

---

## Changelog — v1.0 → v1.1

Every issue raised in the PRD review has been addressed:

- **🔴 Critical:** Added a **Stack Decision Gate** (§17) — the pack filter and SEO are now the explicit deciding factors for stack choice, resolving the "core filter may not work on the recommended no-code stack" risk and the SEO-vs-stack conflict.
- **🟠 High:** Added **F0 — Home** spec; fixed the **"Only show playable" default** (off until packs are set, §F2); fixed **Search** to always show matches and badge locked ones (§F5); added a full **Community & Content Guidelines** section incl. NSFW/child-safety (§14), referenced from submissions.
- **🟡 Medium:** Defined **category vs type vs tags** (§11); added a **guest→account merge-conflict rule** (§F6); defined **orphaned-progress** behaviour (§F4/§F7); set the **generator v1 to "select-and-tune"** (§F9).
- **🔵 Consistency:** Added **`bestFor`** to the schema; **resolved guest-progress storage** (client-side only, removed `localGuestId`); reconciled **SEO vs stack** via the decision gate.
- **⚪ Missing:** Added content guidelines (§14), **creator notifications** (§F7), and **challenge edit history/versioning** (§11).
- **💜 Business logic:** Defined **creator-account-deletion** handling of published challenges (§F6) and **consent-gated analytics** (§16, §18, §21).
- **🟤 Technical:** Documented the **pack-DB maintenance runbook** so it isn't one-person-dependent (§10).

---

## 1. TL;DR

Sir Plumbob Challenges is a website that solves one specific, well-evidenced problem: Sims 4 has hundreds of player-made "challenges" (structured ways to play, like Rags to Riches or the Legacy Challenge), but they're scattered across dozens of sites, inconsistently written, often outdated, and — worst of all — players can't easily tell which challenges work with the game packs they own.

We fix this with three things: **(1)** a single, curated library where every challenge is written in the same clear, standardised format; **(2)** a pack-aware filter so players see only what they can actually play; and **(3)** built-in progress tracking. Later phases add user accounts, community uploads, lightweight discovery (a "Surprise Me" pick and a daily challenge), and community difficulty ratings.

The MVP ships with **130 pre-written challenges** already in the standardised format, so the site is useful on day one with no community contributions required.

---

## 2. Problem & opportunity

The Sims 4 has no built-in end goal — challenges are how players give themselves one. Demand is large and durable, but the supply is a mess:

- Challenges live on SnootySims, MustHaveMods, Carl's Guide, Tumblr, itch.io, old EA forums and individual creator blogs, each with its own format and quality.
- Many are **outdated** (written for older patches), **vague** (no clear win condition or fail state), or **incomplete**.
- The single biggest pain point: a player who owns, say, 30 of the ~98 available packs has no quick way to know which challenges are compatible. They start a Legacy variant, hit a rule requiring a pack they don't own, and bounce.

The closest existing tools are **random task generators** (e.g. James Turner's Random Challenge Generator, which lets you disable unowned packs but only outputs random task lists, not curated coherent challenges) and scattered legacy-generators. **Nobody has built a curated, clearly-written, pack-aware challenge library.**

**The opportunity / our moat** is not technology — it's **curation plus a structured pack-capability database**. Anyone can host a list; the defensible value is (a) every challenge rewritten to one trustworthy standard, and (b) knowing exactly which packs each challenge needs so we can filter precisely.

---

## 3. Vision & product principles

**Vision:** Become the default first stop for any Sims 4 player asking "what should I actually *do* in this game?"

**Principles (in priority order):**
1. **Clarity over volume.** A challenge a player can follow without confusion beats ten vague ones. The standardised format is the product.
2. **Pack-honesty.** We never show a player a challenge as fully playable if they're missing a required pack. Required vs recommended is a hard distinction.
3. **Useful on arrival.** A first-time visitor with no account gets real value in under a minute.
4. **Credit the community.** Established challenges are attributed to their creators; the site is additive to the community, not extractive.
5. **Unofficial and respectful.** A fan project that clearly is not affiliated with EA/Maxis, and is safe and age-appropriate for the game's wide audience.

---

## 4. Goals & non-goals

**Goals (what success looks like):**
- A player can set their owned packs and immediately browse a filtered, trustworthy library.
- Every challenge follows the same format and reads clearly.
- Players can track progress through a challenge's milestones.
- The platform can grow via community submissions without losing quality (moderated).

**Non-goals (explicitly out of scope, with rationale):**
- **We are not a mod host.** We catalogue *gameplay* challenges, not downloadable mods/CC. (A challenge may *mention* a mod, but we don't distribute files.)
- **We are not a generic forum.** Discussion/social features are deferred indefinitely.
- **No native mobile app at launch.** A responsive website covers mobile.
- **No monetisation at MVP.** No ads, no paywall. Future monetisation (donations/Patreon, optional cosmetic accounts) is a later decision, deliberately deferred so it never compromises the "useful on arrival" principle.

---

## 5. Success metrics

**North Star metric:** *Challenges started per week* (a "start" = a player opens a challenge and engages its progress tracker).

> **Measurement note (consent):** because non-essential analytics are consent-gated (§16/§18), the North Star is *also* counted via an **essential, aggregate, non-PII counter** (a simple count of starts, no user identifier, no profiling) so the headline number isn't blinded by users who decline analytics. This counter is deliberately minimal to remain a legitimate essential measure, not a tracking backdoor.

**Supporting metrics:**

| Metric | What it tells us | MVP target (first 90 days) |
|:--|:--|:--|
| Pack-set rate | % of visitors who set their owned packs | ≥ 40% of returning visitors |
| Activation | % of new visitors who start ≥1 challenge | ≥ 20% |
| Playable-surface rate | Avg % of library shown as "Playable" after a user sets packs | Tracked (health of pack DB) |
| 7-day return rate | Stickiness | ≥ 15% |
| Challenge completion | % of started challenges marked complete | Tracked (baseline) |
| Submissions (Phase 2+) | Community uploads per week | ≥ 5/week after upload launch |

Per-feature metrics are listed under each feature in §8. **Note:** all non-essential analytics are gated behind user consent (§16, §18); reported rates are of consenting users.

---

## 6. Target users (personas)

**P1 — "The Bored Veteran" (primary).** Owns many packs, hundreds of hours played, base gameplay has gone stale. Wants direction and novelty. *Needs:* discovery, variety, difficulty signals.

**P2 — "The Selective Owner" (primary).** Owns some packs, not all. Repeatedly frustrated when challenges assume packs they don't have. *Needs:* the pack filter, the required/recommended distinction.

**P3 — "The Newcomer to Challenges."** Knows the game, new to structured play. Intimidated by vague, jargon-heavy rule sets. *Needs:* clear objectives, setup steps, milestones.

**P4 — "The Creator" (Phase 2).** Writes challenges, currently posts them to Tumblr/forums where they get lost. *Needs:* a proper home, attribution, an audience, a submission flow.

---

## 7. Key user journeys

1. **First visit → value.** Land on **Home** → browse featured challenges or set owned packs (skippable) → open a challenge → start tracking. *No account required.*
2. **Return visit.** Land on **Home** → packs remembered → "Continue where you left off" surfaces in-progress challenges → tick new milestones.
3. **Find something specific.** Search/filter by type (e.g. Legacy), difficulty, length, or pack → open → start.
4. **Creator submits (Phase 2).** Sign in → "Submit a challenge" form (mirrors the standardised format) → passes the content guidelines → enters moderation queue → approved → published with credit, submitter notified.

---

## 8. Functional requirements

Priorities: **P0** = MVP (must ship first), **P1** = Phase 2, **P2** = Phase 3. Priorities here are the single source of truth; the roadmap (§9) maps to them exactly. No P0 feature depends on a P1/P2 feature.

---

### F0 — Home / landing page · P0

**Description:** The site's entry point, serving both first-time visitors (convert to value fast) and returning users (resume quickly).

**User story:** *As a first-time visitor, I want to immediately understand what this site does and reach a challenge I can play within a click or two, without being forced to sign up or configure anything.*

**Requirements:**
- **Hero:** the value line ("Every Sims 4 challenge, written clearly and filtered to the packs you actually own") + a primary CTA to **Set your packs** (skippable) and a secondary CTA to **Browse all challenges**.
- **"Continue where you left off"** row — shows in-progress challenges (from F4). Hidden if none.
- **Featured / Popular** rows — driven by a `featured` curation flag on challenges (§11). Because there's no usage data at launch, **MVP "Popular" is hand-curated**; once usage accrues it can switch to genuine start/favourite counts (P1).
- **Daily Challenge** — one challenge highlighted per day, the same for everyone, as a shared talking point. MVP implementation is a **simple curated rotation** (a dated list of broadly-playable picks); no generation logic required. If the day's pick requires a pack the visitor lacks, it shows with the normal Locked badge rather than being hidden.
- **Quick category entry** — the 10 categories as tappable tiles.
- Clear navigation into Browse, My Packs, Search.

**States:**
- *First-time (no packs, no progress):* hero leads with the pack-set prompt, but the full library is one click away via "Browse all challenges" — never gated.
- *Returning (packs set, progress exists):* "Continue" row leads; hero de-emphasised.
- *Loading / error:* skeleton rows; if featured content fails, fall back to a static "Browse all" entry rather than a blank hero.

**Acceptance criteria:** From Home, a first-time visitor can reach and start a playable challenge in **≤ 2 clicks** without setting packs or creating an account.

**Analytics:** `home_viewed`, `home_set_packs_clicked`, `home_browse_clicked`, `continue_clicked`, `featured_clicked`, `daily_viewed`, `daily_started`.

---

### F1 — My Packs (pack selection) · P0

**Description:** Players select the packs they own from the full catalogue. This drives all filtering.

**User story:** *As a Selective Owner, I want to tell the site which packs I own so I only see challenges I can actually play.*

**Requirements:**
- Display all packs grouped by type: Expansion, Game, Stuff, Kit. (~98 packs as of Feb 2026; see §10 pack DB.)
- Toggle on/off per pack; "Select all", "Clear all", and "Base game only" shortcuts.
- Search/filter within the pack picker (the list is long).
- Persist selection **locally** (localStorage) for no-account users; sync to account when signed in (P1).
- A persistent, visible "X of N packs" indicator and an easy way to edit.

**States:**
- *Empty/first-run:* no packs set → the user is treated as **"packs unknown"** (not silently "base game only"); see F2 for how this affects filtering. A gentle prompt encourages setting packs.
- *Loading:* pack list loads from the data source with a skeleton.
- *Error:* if the pack list fails to load, show a retry; never block browsing (fall back to showing all challenges unfiltered with a notice).
- *Edge:* new packs added to the DB later appear as "unselected" by default and never silently change a user's owned set.

**Acceptance criteria:** Setting packs visibly changes which challenges are flagged Playable on the Browse screen within the same session, with no page reload required.

**Analytics:** `packs_set`, `pack_toggled`, `pack_shortcut_used`.

---

### F2 — Browse & pack-aware filtering · P0

**Description:** The core discovery screen — a grid of challenge cards with live playability badges and filters.

**User story:** *As a Bored Veteran, I want to browse and narrow down challenges so I can quickly find one that fits my mood and packs.*

**Requirements:**
- Card per challenge: title, short premise, category, difficulty (plumbob meter), length, and a **playability badge**.
- **Playability logic:** a challenge is **Playable** if the user's owned packs ⊇ its `packsRequired`. If any required pack is missing → **Locked**, with a tooltip listing exactly which pack(s) are missing. Recommended packs never affect playability (shown as an info chip only).
- **"Only show playable" toggle default (resolved):**
  - *Before the user has set any packs ("packs unknown"):* the toggle is **OFF**, and the **entire library is shown with neutral badges** (no false "Locked" spam). A prompt nudges the user to set packs to unlock filtering. **Pack-honesty safeguard:** in this state, opening or starting a challenge surfaces a one-time soft nudge ("Set your packs to confirm this works for you") so a newcomer isn't silently steered into a challenge that needs a pack they don't own. This is a nudge, never a hard gate.
  - *After the user has set packs (including "base game only"):* the toggle **defaults ON**.
- Filters: category, type, difficulty (1–5), length, required pack, and the "Only show playable" toggle above.
- Sort: newest, difficulty (asc/desc), and (P1) community rating.
- Responsive grid (desktop multi-column → single column on mobile).

**States:**
- *Empty (no results):* clear empty state with one-tap "clear filters" / "show locked too" — never a dead end.
- *Loading:* skeleton cards.
- *Error:* retry affordance; cached content if available.

**Acceptance criteria:** With "Only show playable" on, no card lists a required pack the user hasn't selected. Before packs are set, the full library is visible and nothing is shown as Locked.

**Analytics:** `browse_viewed`, `filter_applied`, `only_playable_toggled`, `card_clicked`.

> **Technical note:** the superset filter (owned ⊇ required) is the product's core differentiator and the hardest thing to implement on a no-code stack — see the Stack Decision Gate in §17.

---

### F3 — Challenge detail page (the standardised format) · P0

**Description:** The full challenge, rendered from structured data in the standardised format.

**User story:** *As a Newcomer, I want one clear page that tells me the goal, setup, rules and how to win, so I can start without confusion.*

**Requirements — the page renders these fields in order** (see schema in §11):
- Title, backstory/premise, stat block (type, difficulty plumbobs, length, "best for", packs required, packs recommended).
- Objective (measurable), fail conditions.
- Setup (lot, funds, aging, sims) + the exact cheats to type.
- General rules and Specific rules.
- Strategy tips.
- Scoring (optional, only if present).
- Want-it-harder variants.
- Milestones (drives F4).
- Variations.
- Credit & history; last-tested patch/date.
- Clear entry (from Home/Browse/search/Surprise Me/link) and exit (back to Browse, plus "next challenge" suggestions).

**States:**
- *Locked-but-viewable:* a user missing a required pack can still read the challenge, with a banner naming the missing pack(s) — we inform, we don't hard-gate reading.
- *Packs unknown:* if the user hasn't set their packs, the detail page shows a soft "Set your packs to confirm this works for you" prompt near the Start action (per F2's pack-honesty safeguard).
- *Loading / error:* skeleton; graceful error with retry.
- *Edge:* missing optional fields (e.g. no scoring) simply hide that section header.

**Acceptance criteria:** Every published challenge renders all required fields with no empty section headers; optional fields hide cleanly when absent.

**Analytics:** `challenge_viewed`, `wantitharder_expanded`, `next_challenge_clicked`.

---

### F4 — Progress tracking (milestones) · P0

**Description:** An interactive milestone checklist per challenge with a progress bar.

**User story:** *As any player, I want to tick off milestones and see my progress so I stay motivated across multiple sessions.*

**Requirements:**
- Each milestone is a checkbox; checking updates a progress bar (% complete).
- A challenge can be: Not started → In progress → Completed (all milestones) → optionally Abandoned.
- Progress persists **locally (localStorage)** for no-account users; syncs to account at P1.
- "Continue" surfacing on Home (F0) and a lightweight "My Progress" view.
- Optional per-challenge notes field (P1).
- Milestones carry stable IDs so checked items survive challenge edits (see §11 versioning).

**States:**
- *Empty:* "My Progress" with nothing started → encouraging empty state linking to Browse.
- *Challenge edited after start:* preserve checked items by milestone ID; show a subtle "this challenge was updated" note.
- *Challenge unpublished/removed/taken down while in progress (resolved):* the user's tracker is preserved in a **read-only "Archived"** state with a notice ("this challenge is no longer available"); it stops counting toward active stats but the user doesn't lose their record.
- *Data loss:* clearing local storage wipes guest progress — warn before destructive local actions and prompt account creation (P1) to avoid loss.

**Acceptance criteria:** Checking all milestones moves a challenge to Completed and reflects in My Progress without reload; a removed challenge moves a user's progress to Archived rather than deleting it.

**Analytics:** `challenge_started`, `milestone_checked`, `challenge_completed`, `challenge_abandoned`.

---

### F5 — Search · P0

**Description:** Keyword search across challenge titles, premises and tags.

**User story:** *As a player, I want to search for a specific challenge or theme and always see what exists, even if I'm missing a pack.*

**Requirements:**
- Debounced input; matches title/premise/type/category/tags.
- **Search always returns all matching challenges**, independent of the Browse "only show playable" toggle. Locked results are **badged** with the missing pack(s) — never hidden. (Searching "vampire" without the Vampires pack returns the vampire challenges, clearly marked as needing the pack.)
- Clear empty state when nothing matches.

**States:** loading spinner; empty ("no challenges match 'X'") with reset.

**Acceptance criteria:** Searching a known title returns it as the top result even when the user lacks its required pack (shown Locked, not hidden).

**Analytics:** `search_performed` (query length, result count).

---

### F6 — Accounts & profiles · P1

**Description:** Optional accounts that sync packs, progress and (later) submissions across devices.

**User story:** *As a returning player, I want my packs and progress to follow me across devices without losing my guest data.*

**Requirements:**
- Email/password and at least one social login.
- On sign-in, **merge** any local guest data (packs, progress) into the account; never silently discard it.
- **Merge-conflict rule (resolved):** when the guest and the account both have progress for the same challenge, keep the record with **more milestones completed**; on a tie, keep the **most recently updated**. Show a one-time "we merged your progress" confirmation.
- Profile: display name, owned packs, saved/favourite challenges, progress, submitted challenges.
- **Account deletion (resolved):** deleting an account removes the user's personal data (email, real display name) and their **drafts/in-review submissions**. **Published challenges they authored are retained but anonymised** — credited to "Former contributor" (or, for attributed classics, the cited original creator is preserved) — so other players' in-progress runs and the library's integrity are not broken.

**States:** auth errors (wrong password, email taken, network), email verification pending, password reset.

**Acceptance criteria:** A guest who sets packs and starts a challenge, then signs up, keeps that data; deleting a creator's account does not remove or break their already-published challenges for other users.

**Analytics:** `signup`, `login`, `guest_data_merged`, `account_deleted`.

---

### F7 — Submit / upload a challenge + moderation · P1

**Description:** A form mirroring the standardised format so creators can add challenges; all submissions are moderated against the community guidelines (§14) before publishing.

**User story:** *As a Creator, I want to submit my challenge in the site's format, know the rules it must meet, and be told when it's approved or why it was rejected.*

**Requirements:**
- **Sign-in required.** Only signed-in users can submit (the challenge is tied to their account via `submittedBy`). A signed-out user who clicks "Submit a challenge" is sent to sign-in/up first, then returned to the form.
- **On-site form, not a file upload.** Submission is the structured form below — there is **no document/file upload** (text-only, per §17). This is what lands the challenge straight into the standardised format and the pack filter.
- The form **mirrors the standardised template field-for-field** (see the field spec below), with per-field validation.
- A link to the **Community & Content Guidelines (§14)** is shown before and within the form; submissions are checked against them.
- **Live preview:** before submitting, the creator can preview their challenge rendered exactly as it will appear on a detail page (F3), to catch problems early and reduce moderation churn.
- **Attribution required:** the submitter marks the challenge as **Original** or **Adapted**; if Adapted, the original creator name and a source URL are required.
- Submissions enter a **moderation queue**; a moderator approves, requests edits, or rejects with a reason.
- **Creator notifications:** on approve / reject / edit-request, the submitter is notified (in-app, plus optional email), including the reason or requested changes.
- Profanity/spam filtering on free-text; per-user rate limits; draft saving; edit-after-rejection.
- A public **"Report"** action on every published challenge feeds the moderation queue; a removed challenge triggers the F4 Archived behaviour for affected users.

**Submission form — field spec.** Every field below maps to the §11 Challenge schema. "Req?" = required for a valid submission. System-set fields are filled automatically, never by the submitter.

| Field | Control | Req? | Validation / notes |
|:--|:--|:--|:--|
| Title | Single-line text | ✅ | 3–80 chars; `slug` auto-generated from it |
| Premise (one-line hook) | Single-line text | ✅ | ≤ 160 chars |
| Backstory | Multi-line text | — | ≤ 600 chars |
| Category | Multi-select from the **10 fixed categories** | ✅ (≥1) | Controlled list only; first selected = primary |
| Type | Multi-select from the **defined type list** | ✅ (≥1) | Controlled list (Rags to Riches, Legacy, Occult, …) |
| Tags | Chip multi-select from a **curated tag list** (+ "request new tag") | — | Controlled list; new tags go to moderators, not live instantly |
| Difficulty | 1–5 **plumbob** selector | ✅ | Integer 1–5 (author rating; community can adjust later, F8) |
| Length | Dropdown (enum) | ✅ | One of the §11 length enum values |
| Length detail | Single-line text | — | ≤ 40 chars; only shown when length needs it (e.g. "10 generations") |
| Best for | Single-line text | — | ≤ 120 chars |
| **Packs required** | **Pack picker** (multi-select by pack ID) + "Base game only" toggle | ✅ | Must be valid pack IDs from the pack DB — never free text. "Base game only" = empty set |
| Packs recommended | **Pack picker** (multi-select by pack ID) | — | Valid pack IDs; cannot duplicate a required pack |
| Objective | Multi-line text | ✅ | ≤ 300 chars; must state a measurable win condition |
| Fail conditions | Multi-line text | ✅ | ≤ 300 chars; "None" is an allowed value |
| Setup — Lot | Single-line text | ✅ | ≤ 120 chars |
| Setup — Funds | Single-line text | ✅ | ≤ 80 chars |
| Setup — Aging | Short text / dropdown | ✅ | ≤ 60 chars |
| Setup — Sims | Single-line text | ✅ | ≤ 120 chars |
| Setup — Cheats | Repeatable line items | — | Each ≤ 80 chars |
| Setup — Other | Multi-line text | — | ≤ 200 chars |
| General rules | Repeatable list items | — | Each ≤ 200 chars; ≤ 8 items (defaults can be offered) |
| Specific rules | Repeatable list items | ✅ (≥1) | 1–8 items; each ≤ 200 chars |
| Strategy tips | Repeatable list items | — | ≤ 6 items; each ≤ 200 chars |
| Scoring | Multi-line text | — | ≤ 300 chars |
| Want it harder | Repeatable list items | — (recommend ≥1) | ≤ 3 items; each ≤ 200 chars |
| Milestones | Repeatable text items | ✅ (3–8) | Each ≤ 120 chars; **the system assigns each a stable `id`** on submit so progress/versioning survive edits |
| Variations | Repeatable list items | — | Each ≤ 200 chars |
| Original or Adapted? | Toggle (Original / Adapted) | ✅ | Sets `credit.isOriginal` |
| Original creator | Single-line text | ✅ *if Adapted* | ≤ 80 chars |
| Source URL | URL field | ✅ *if Adapted* | Valid URL |
| Last tested — patch | Single-line text | ✅ | ≤ 20 chars (e.g. "1.108") |
| Last tested — date | Month/year picker | ✅ | Valid month/year |

**System-set (not on the form):** `id`, `slug`, `status` (→ `in-review` on submit), `submittedBy` (current user), `featured` (admin only), `version`, `community.*`, `createdAt`, `updatedAt`.

**States:** per-field validation errors; draft saved; preview; submission success ("in review"); rejection with reason; edit-requested; guideline-violation rejection; signed-out user redirected to sign-in.

**Acceptance criteria:** A signed-in user can complete the form using only controlled inputs for packs/category/type, preview the rendered challenge, and submit; the submission is stored as `in-review` with system-generated `slug` and milestone `id`s; nothing appears publicly until a moderator approves it; the submitter is notified on every status change.

**Analytics:** `submit_started`, `submit_previewed`, `challenge_submitted`, `submission_approved`, `submission_rejected`, `content_reported`, `submission_notification_sent`.

**Risk note:** moderation is a real operational cost — see §14 and §20.

---

### F8 — Community ratings (difficulty & favourites) · P1

**Description:** Let players up/down a challenge's difficulty rating and favourite challenges.

**Requirements:** One vote per user per challenge; a second vote **replaces** the first (never stacks); display community-adjusted difficulty alongside the author's rating (with a "no votes yet → shows author rating" fallback); favourites feed a personal list and a "most-loved" sort. Voting requires an account (anti-brigading).

**Acceptance criteria:** A signed-in user's difficulty vote updates the displayed community average; re-voting replaces their previous vote.

**Analytics:** `difficulty_voted`, `challenge_favourited`.

---

### F9 — Surprise Me · P2

**Description:** Lightweight discovery that Browse doesn't cover: a one-tap random *playable* pick. (This replaces the earlier "generator," which overlapped Browse+filter once narrowed to selecting an existing challenge. The Daily Challenge that was bundled here now lives in F0 as an MVP feature.)

**User story:** *As a Bored Veteran, I don't want to filter — I want the site to just hand me one good challenge I can play right now.*

**Requirements:**
- **"Surprise Me":** one tap returns a single random challenge that is **Playable** for the user (respects owned packs). Optional pre-filters (type/difficulty/length) narrow the random pool but the core action is "give me one, now". A "spin again" re-rolls.
- Produces a shareable link.
- **Out of scope for v1:** composing brand-new challenges from parts — a future consideration only.

**Acceptance criteria:** "Surprise Me" never returns a challenge requiring a pack the user doesn't own.

**Analytics:** `surprise_me_used`, `surprise_me_started`.

---

### F10 — Aggregation / import · P2

**Description:** Internal tooling to bring established external challenges into the standardised format (with permission/credit) faster. Process/curation tool, not a public feature; detailed spec deferred.

---

## 9. Scope & phased roadmap

Priorities map 1:1 to §8. No P0 feature depends on a P1/P2 feature.

| Phase | Theme | Features |
|:--|:--|:--|
| **MVP (P0)** | A trustworthy, pack-aware library | F0 Home (incl. Daily Challenge), F1 My Packs, F2 Browse+filter, F3 Detail, F4 Progress, F5 Search · 130 seeded challenges · legal + content-guidelines + privacy pages · consent banner · basic analytics |
| **Phase 2 (P1)** | Community | F6 Accounts, F7 Submissions+moderation, F8 Ratings/favourites |
| **Phase 3 (P2)** | Discovery & scale | F9 Surprise Me, F10 Aggregation, advanced personalisation |

MVP is intentionally **account-free**: everything works with local storage so the site is instantly useful and there's no signup wall before value.

---

## 10. Pack-capability database (the moat)

A structured table of every Sims 4 pack, maintained as canonical data. As of Feb 2026 there are ~98 DLCs (≈21 expansions, ≈12 game packs, ≈20 stuff packs, ≈45 kits; newest expansion *Royalty & Legacy*, Feb 2026). It must stay current as EA releases packs (roughly quarterly).

**Each pack record** (schema §11) carries **capability tags** describing what it enables — e.g. `vampires`, `werewolves`, `off-grid`, `seasons-weather`, `retail-business`, `restaurants`, `rental-property`, `university`, `pets`. Challenges reference packs by ID for the filter; capability tags power Surprise Me (F9) and "what this pack unlocks" explanations.

**Maintenance runbook (resolved — not one-person-dependent):**
- A short written procedure for adding a pack: name, abbreviation, type, release date, icon, capability tags, then bump the pack-DB `version`.
- **At least two people** hold edit access; the runbook lives alongside the content so anyone can follow it.
- A public **"Missing or incorrect pack?"** report link lets the community surface gaps/errors, which feed a review step.
- The pack DB is versioned so changes are auditable.

---

## 11. Data model / schemas

The standardised format **is** the data model.

**Taxonomy — how category, type and tag differ (resolved):**
- **`categories[]`** — the primary library *sections* (one or more of the 10, e.g. "Wealth & Progression"). Drives top-level navigation and sectioning. Usually one primary category.
- **`types[]`** — *playstyle* labels (Rags to Riches, Legacy, Occult, Survival, Build, etc.): what *kind* of challenge it is. Used by filters and Surprise Me (F9).
- **`tags[]`** — *cross-cutting facets* not captured above (e.g. `self-sufficiency`, `competitive`, `roleplay`, `family`). Used for search and discovery.

**Challenge**
```
id, slug, title, premise, backstory,
categories[], types[], tags[],
difficulty (1–5), 
length (enum: single-session | single-lifestage | single-lifetime |
  multi-session | generations | open-ended),
lengthDetail (nullable string, e.g. "10 generations"),
bestFor (string),
packsRequired[] (packIds), packsRecommended[] (packIds),
objective, failConditions,
setup { lot, funds, aging, sims, cheats[], other },
generalRules[], specificRules[],
strategyTips[], scoring (nullable),
wantItHarder[], milestones[ { id, text } ], variations[],
credit { isOriginal (bool), originalCreator, sourceUrl },
lastTested { patch, date },
status (draft | in-review | published | rejected | archived),
submittedBy (userId | "plumbob" | "former-contributor"),
featured (bool — drives Home Featured/curated "Popular"),
version (int), updatedBy, changeLog[] (published-edit history),
community { avgDifficulty, difficultyVotes, favourites },
createdAt, updatedAt
```
*Edit/versioning rules:* only moderators/admins (and the original submitter while a draft) may edit. Editing a **published** challenge bumps `version`, appends to `changeLog`, and preserves milestone IDs so user progress survives (F4).

*Deletion integrity (resolved):* when a creator deletes their account (F6), `submittedBy` on their **published** challenges is reset to the `"former-contributor"` sentinel (attributed classics keep their cited `credit.originalCreator`), so no published challenge points at a deleted user.

**Pack**
```
id, name, abbreviation, type (expansion | game | stuff | kit),
releaseDate, iconUrl, capabilityTags[], version
```

**User**
```
id, displayName, email, ownedPackIds[], favouriteChallengeIds[],
role (user | moderator | admin), createdAt
```

**Progress** *(accounts)*
```
userId, challengeId, milestonesCompleted[] (milestone ids),
status (not-started | in-progress | completed | abandoned | archived),
notes (nullable), startedAt, updatedAt
```
**Guest progress (resolved):** for users without an account, progress and pack selection are stored **client-side only** (localStorage), using the same shape, with **no server row and no guest id**. On sign-in, the client pushes local data to the server and merges per the F6 conflict rule.

**Notification** *(Phase 2 — supports F7 submission updates and F6 auth emails)*
```
id, userId, type (submission-approved | submission-rejected |
  edit-requested | system),
challengeId (nullable), message, read (bool),
channel (in-app | email), createdAt
```
*Delivery depends on a transactional email provider — see §17.*

---

## 12. Information architecture & navigation

**Top-level pages:** Home · My Packs · Browse · Challenge detail · Search · My Progress · Submit (P1) · Sign in (P1) · About/Legal · Community Guidelines · Privacy.

**Primary nav** (persistent): Browse · My Packs · My Progress · (Search) · (Account). The "X of N packs" indicator lives in the nav as a constant reminder and shortcut.

---

## 13. Content requirements & sourcing

- **Seed content:** the 130 challenges already written in the standardised format (standard and detailed editions) populate the MVP.
- **Format compliance:** every challenge — seeded or submitted — must conform to the §11 schema. The blank template is the contributor's source of truth.
- **Attribution policy:** established community challenges must credit their creator and link the source (e.g. the Legacy Challenge → Pinstar; Not So Berry → lilsimsie & alwaysimming; 100 Baby → its documented creators; Black Widow/Asylum → community originators). Before public launch, a pass must confirm classics carry correct creator credit, not just "community".
- **Freshness:** each challenge carries a `lastTested` patch/date; a review cadence flags stale entries.

---

## 14. Community & content guidelines

These apply to all user-submitted content (F7) and are enforced via the moderation queue and report flow.

**This game has a wide, largely young audience. Content must be age-appropriate and safe.**

**Allowed:** original or properly-attributed Sims 4 *gameplay* challenges; safe-for-work; respectful; written in the standardised format; clear and playable.

**Prohibited (rejection, and removal if published):**
- Sexual or NSFW content of any kind.
- **Any content that sexualises minors or otherwise endangers children — zero tolerance.** Such material is removed immediately and reported to the relevant authorities as required by law.
- Hateful, discriminatory, or harassing content; content targeting real people.
- Real-world harmful instructions.
- Plagiarism — posting others' challenges without credit and a source link.
- Spam, advertising, or off-topic content.

**Enforcement:** all submissions are reviewed before publishing; anyone can report published content; repeat or severe violations lead to submission bans. A visible, plain-language version of these guidelines is linked from the submission form and the site footer.

**Ownership & escalation (resolved):** a named **Trust & Safety owner** is accountable for content safety (a real person/role, not "the team"). Documented escalation procedure for the most serious cases:
1. Any moderator or automated flag for suspected child-endangerment **immediately removes/hides** the content and locks the submitting account, pending review.
2. The Trust & Safety owner is notified within the moderation tool and reviews without delay.
3. Confirmed cases are **preserved as evidence and reported to the appropriate authority/hotline** (e.g. NCMEC in the US, or the local equivalent) per legal obligation, then purged from public systems.
4. The action and outcome are logged.

This procedure is written down and at least two people know it, so it doesn't depend on one individual being online.

---

## 15. Design & brand

**Identity:** "Sir Plumbob" — a friendly knight-plumbob mascot. The **plumbob** (the green diamond from the games) is the signature motif and the **difficulty unit** (◆ meters, 1–5).

**Aesthetic (matches the prototype):** a dark teal "game-menu" look. Type pairing: **Sora** (headings), **Outfit** (body), **Space Mono** (stats/labels). Cards, badges and the plumbob meter are the recurring visual language.

**Critical accessibility rule:** difficulty must **never** be conveyed by colour/diamonds alone — always pair with text ("Hard (3/5)") for colour-blind and screen-reader users.

**Responsive:** desktop-first grid that collapses cleanly to a single mobile column.

---

## 16. Non-functional requirements

**Accessibility:** target WCAG 2.1 AA — keyboard navigable, sufficient contrast on the dark theme, alt text, ARIA labels on the milestone checkboxes and pack toggles, no colour-only meaning.

**Performance:** Browse and detail pages usable on mid-range mobile; lazy-load images; skeletons for async loads.

**SEO:** server-rendered or pre-rendered challenge pages with clean slugs (`/challenge/rags-to-riches`), meta tags and structured data — discovery via Google is a **primary acquisition channel** against incumbent sites. SEO capability is a deciding factor in the stack choice (§17); if MVP launches on a stack with weak SEO, treat full SEO as a fast-follow migration goal flagged by the Stack Decision Gate.

**Privacy, data handling & consent (resolved):**
- Collect minimal PII (email for accounts only).
- **Consent gating:** non-essential cookies and analytics fire **only after explicit user consent**, managed by a **consent-management mechanism** (a banner + stored preference; see §17 for the dependency). Functional local storage (pack selection, guest progress) is essential to the feature, not tracking, and is covered by a clear notice. The single **essential, aggregate, non-PII North Star counter** (§5) is exempt from consent because it stores no identifier and does no profiling.
- GDPR-style rights: export and delete account data (deletion behaviour per F6). Anonymised analytics. A clear privacy policy page.

**Error-handling strategy (global):** every async action defines loading, empty, and error states; errors offer retry and never dead-end the user; if filtering data is unavailable, show all challenges with a notice rather than a blank page.

---

## 17. Technical architecture & build options

The product is **content + filtering + light persistence** — not computationally heavy until F9.

### Stack Decision Gate (resolved — decide this first)

Two requirements decide the stack, and both must be validated **before** committing:

1. **Pack superset filter** — can the stack do "owned packs ⊇ required packs" filtering across ~98 packs × 130+ challenges, responsively?
2. **SEO** — can the stack deliver server/pre-rendered pages, clean slugs and structured data (the primary acquisition channel)?

Build a throwaway prototype of (1) on your candidate stack with ~10 challenges before building anything else.

### Options

| Path | Stack | Pros | Cons | Verdict |
|:--|:--|:--|:--|:--|
| **A — No-code** | Airtable + Softr | Fastest to launch; non-technical to maintain | **Array-superset filtering is hard/limited**, and **SEO control is limited** — the two things that decide this product | Use only if the filter prototype passes; otherwise skip |
| **B — Low-code** | Bubble | More logic/UX control; built-in accounts | Learning curve; can get unwieldy | Possible for Phase 2 if Path A held for MVP |
| **C — Custom** | Next.js + Supabase | Full control; **natively does both the filter logic and SEO**; scales to F9 | Requires dev skill/budget | **Recommended** unless no-code passes the gate |

**Recommendation (resolved):** because the **pack filter** and **SEO** are both core and both weak on no-code, default to **Path C (Next.js + Supabase)**. Only start on Path A if a quick prototype proves the superset filter works acceptably *and* you accept SEO as a fast-follow. Keep all canonical content in portable markdown/CSV (already done) so any migration is low-risk.

**Real-time:** none required; last-write-wins persistence is fine.

**Third-party dependencies (named so they're not discovered mid-build):**
- **Transactional email provider** (Phase 2) — required for F6 email verification & password reset and F7 submission-status notifications. Not needed for MVP.
- **Consent-management mechanism** (MVP) — the banner + stored preference that gates non-essential analytics (§16). Can be a lightweight library or a hosted CMP.
- **Analytics provider** (MVP) — privacy-friendly, consent-gated.

**File/image handling:** challenge images and pack icons need size/format limits and validation; **user submissions are text-only (no file uploads)** to keep moderation and storage simple.

---

## 18. Analytics & instrumentation

Track at minimum: `home_viewed`, `packs_set`, `pack_toggled`, `browse_viewed`, `filter_applied`, `only_playable_toggled`, `challenge_viewed`, `challenge_started`, `milestone_checked`, `challenge_completed`, `search_performed`, plus P1+ events (`signup`, `guest_data_merged`, `challenge_submitted`, `difficulty_voted`). These feed the §5 metrics.

**Consent:** all non-essential analytics events fire **only after the user accepts analytics consent** (§16). Until then, no analytics events are sent. The sole exception is the **essential, aggregate, non-PII North Star counter** (§5), which records a bare count of challenge-starts with no identifier or profiling and is therefore not consent-gated.

---

## 19. Legal & compliance

- **Unofficial fan project.** Prominent disclaimer: not affiliated with, endorsed by, or sponsored by EA/Maxis; "The Sims" trademarks belong to their owners.
- **User-generated content (P1):** contributors grant the site a licence to display their submission while retaining authorship/credit; submission terms incorporate the §14 guidelines and prohibit posting others' work without attribution.
- **Attribution & takedown:** correct creator credit on all catalogued classics; a clear takedown/DMCA process for any creator who objects to inclusion. A takedown triggers the F4 Archived behaviour for affected users.
- **Privacy & consent:** see §16.

---

## 20. Risks & mitigations

| Risk | Impact | Mitigation |
|:--|:--|:--|
| Content cold-start | Empty site = no value | **Already mitigated:** launch with 130 curated challenges |
| Pack filter infeasible on chosen stack | Core feature fails | **Stack Decision Gate (§17):** prototype the filter first; default to Path C |
| Weak SEO on chosen stack | Acquisition capped | Decided at the Stack Gate; Path C natively supports SEO |
| Pack DB goes stale | Filter accuracy decays | **Runbook + 2+ owners + public report link** (§10); DB versioned |
| Moderation burden (P1) | Quality/spam/safety/legal exposure | Text-only submissions, content guidelines (§14), approval queue, rate limits, report flow |
| Child-safety / inappropriate content | Severe harm + legal | §14 zero-tolerance policy, pre-publish moderation, report flow, authority reporting |
| EA/legal sensitivity | Takedown risk | Unofficial disclaimer, no mod/asset distribution, takedown process |
| Attribution disputes | Community goodwill | Strict credit policy; honour creator opt-outs |

---

## 21. Launch criteria (definition of done)

**MVP is shippable when:**
- Pack DB contains every current pack with correct types and capability tags, and the maintenance runbook is documented with ≥2 owners.
- All 130 seed challenges are live and schema-compliant (no empty required fields).
- F0–F5 work end-to-end, including playability badge correctness (no "Playable" challenge lists an unowned required pack with "only playable" on) and the correct pre-packs filter default (full library shown, nothing Locked).
- Search shows matching locked challenges (badged), not hidden.
- Pack selection and progress persist for guests across sessions; removed challenges move progress to Archived rather than deleting it.
- Responsive on mobile and desktop; passes a basic accessibility check (keyboard nav, contrast, no colour-only meaning).
- Legal/disclaimer, **community guidelines**, and privacy pages published; **consent banner live**.
- Core analytics firing **post-consent**.

**Phase 2 done when:** accounts merge guest data reliably (with the conflict rule); no submission publishes without moderator approval; submitters are notified on status changes; reports reach the queue; account deletion preserves published challenges; ratings/favourites work per-user.

---

## 22. Open questions / decisions needed

1. **Domain/TLD:** confirm and register `sirplumbobchallenges.com` (or alternative).
2. **Mods/CC-required challenges:** do we allow challenges that require mods (clearly flagged), or strictly base-game-and-packs only?
3. **Monetisation:** none at MVP — decide the Phase 2+ stance (donations/Patreon vs fully free).
4. **Pack-bundle/refresh handling:** how to represent EA's bundles or refreshed/free packs in the DB.
5. **Localisation:** English-only at launch; revisit if traffic warrants.
6. **Moderation staffing & SLA:** the content rules (§14) and the Trust & Safety escalation procedure are now defined — but *who* fills the moderator and Trust & Safety roles, and the review turnaround target, still need naming.

---

## 23. Appendix — glossary

- **Pack:** any Sims 4 DLC (Expansion / Game / Stuff / Kit).
- **Playable / Locked:** whether a user owns every pack a challenge *requires*.
- **Required vs Recommended:** required gates playability; recommended only enhances.
- **Plumbob:** the green diamond icon; our brand motif and difficulty unit.
- **Standardised format:** the fixed field structure every challenge follows (see §11).
- **Category / Type / Tag:** see §11 — section, playstyle label, and cross-cutting facet respectively.
- **Heir / Legacy / Matriarch / Rags to Riches:** community challenge terms used throughout the library.

*Source artifacts for this PRD: the build guide, challenge template, 130-challenge catalogue, the standard and detailed challenge books, and the working React prototype produced in this project.*
