# KU remote work & learning hub (mockup)

Bilingual (Arabic-first / English) redesign mockup of Kuwait University's remote work and
learning portal (today: `https://www.ku.edu.kw/ar/remote`, via `remote.ku.edu.kw`).
Static files, no build step, no external libraries: open `index.html` in a browser.
Modelled on the sibling `ku-mfa` self-help page and reuses its CSS and JS patterns.

**Mockup only. Not an official KU page. Not published anywhere.**

## What is on the page

1. Status strip (green normal / commented-out red "remote mode active" variant).
2. Role picker (Student / Faculty / Staff / Show all) filters tiles, sub-blocks and checklist
   items through `data-roles="student faculty staff"`. Remembered locally and shown as `?role=`.
3. Readiness checklist; ticks are remembered in this browser only. Each item links to its tile.
4. Search with Arabic normalisation and `data-keys` synonyms; no match points to "Get help".
5. Task tiles (`<details class="topic">`, one open at a time, each with a stable `id`).
6. Quick links and footer (anti-phishing line, review date, owner, mockup badge).

## Editing

- All text is in `index.html`; each string appears twice (`class="ar"` / `class="en"`).
- Tile ids are direct links (`index.html#vpn`); do not rename after sharing.
- `?lang=en|ar` forces a language; `?role=student|faculty|staff` forces a role.
- `<!-- EDIT: ... -->` marks status, MFA link, guide URL, support contacts, review date.
- `[TO CONFIRM: ...]` chips (gold, dashed) are open gaps. They render on purpose so reviewers
  see them; resolve each before any real publication. Never fill one with a guess.
