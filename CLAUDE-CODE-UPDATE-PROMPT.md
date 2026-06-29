# Claude Code — update prompt (content-depth upgrade)

Paste the block below to Claude Code in the Sir Plumbob Challenges project.

---

The challenge content has been upgraded. Please update the app to match.

**What changed in the data (`challenges.json`):**
- There are now **131 challenges** (added "Very Veggie Legacy", id `very-veggie`).
- **Every challenge has four new fields:**
  - `allowed` — string array (permitted cheats / items / actions)
  - `notAllowed` — string array (explicit prohibitions)
  - `objectives` — string array (a concrete, checkable completion checklist)
  - `baseGameVersion` — string (how to play without the recommended packs; may occasionally be empty)
- Some challenges (themed multi-generation legacies: Not So Berry, Disney Princess, Very Veggie) also have:
  - `generationLadder` — array of `{ gen, colour, veggie?, career, aspiration, notes }` (absent on most challenges; render only when present)

**What to do:**
1. Replace the seeded `challenges.json` with the new file (131 records).
2. On the **challenge detail page**, render the new fields in this order, after the existing rules section:
   - **✅ What you can do** — `allowed` as a bulleted list
   - **⛔ What you can't do** — `notAllowed` as a bulleted list
   - **🎯 Objectives** — `objectives` as a checklist (reuse the existing milestone-style checkboxes; these can be ticked like milestones, persisted the same way)
   - **🎮 If you don't own the packs** — `baseGameVersion` as a callout/info box
   - **Generation ladder** — when `generationLadder` exists, render a per-generation table (Gen · Colour/Veggie · Career · Aspiration · Notes)
3. Keep all existing detail-page sections (stat block, goal, getting started, setup, rules, strategy tips, scoring, want-it-harder, milestones, variations, credit) exactly as they are.
4. **Match the existing bright, girlie styling** (pink/lavender/peach, Fredoka + Quicksand, hearts for difficulty) — no dark theme. Use the same card/section components already in use.

**Robustness:**
- Treat `baseGameVersion` and `generationLadder` as optional — hide the section if the field is empty or missing. Never crash on a missing field.
- `objectives` checkboxes should use client-side/localStorage persistence (same as milestones), no account required.

Everything else about the MVP (pack-aware filter, Surprise Me, static-JSON + localStorage, compliance scaffolding) is unchanged — only the detail page and the seed data need updating.

**Reference files:** `challenges.json` (data), `plumbob-challenge-template.md` (the standardised format, now updated to match), and the PRD §11 schema (v1.4) which documents all the fields above.
