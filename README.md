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
- `<!-- EDIT: ... -->` markers remain for: operating status, support contacts, and review date / owner.
- MFA links to the official guide at `mfa.ku.edu.kw`. The Ivanti client is downloaded from the
  `ku-vpn.ku.edu.kw` portal after sign-in (it downloads automatically if not installed).
- The `[TO CONFIRM: ...]` chip style (`.tbc`) stays in `style.css` for future gaps; none render now.
  Never fill a gap with a guess.

## Confirmed facts (2026-10-22)

- VPN: faculty and staff only; request on SupportMe (`Security Services` > `VPN Request`); client is
  the Ivanti Secure Access Client (previously Pulse Secure); server `ku-vpn.ku.edu.kw`; sign in with
  full university email; MFA required since 3 Sep 2026; personal devices only.
- Support: IT Security (itsecurity@ku.edu.kw, three WhatsApp numbers, emergencies only) covers VPN and MFA;
  E-Learning Center (elc@ku.edu.kw, +965 24987693, WhatsApp 24983452) covers Moodle and exams,
  Sunday-Thursday 7:00-15:00.
- Moodle guides and playlists from elc.ku.edu.kw / YouTube; exams: Proctorio (students, Chrome),
  SEB / Respondus / Proctorio (faculty).
- Content owner: Portal and Supporting Applications Department, Center of Information Systems.
