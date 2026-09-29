# F2G CMAS Hub — Design System & Direction

> Version 1.0 · 2026-09-29 · Owner: F2G Laboratory
> Scope: every screen in `src/src/app`. Base primitives stay in `components/ui/` (shadcn, style `base-nova`, `@base-ui/react`).
> Everything here is meant to be implemented as written. Where a value is given, use that value.

> **Direction update — 2026-09-29 (owner decision): "Berry × F2G".** Arnaud asked for the layout and feel of the Berry admin template (codedthemes), in F2G colours, on every screen. This overrides §0, §4.1 (shell), §6.8 (KPI panel) and §7.1–7.2 (login, dashboard):
> - White shell (sidebar + header, `--shell`) around a rounded grey content well (`--well` #EEF2F6 light / #0A1120 dark). Sidebar items: active = `bg-navy-tint text-primary`, rounded 12 px.
> - Hero stat cards in the Berry style with decorative circles: navy card `#1F3864` (white text 11.6:1) and orange card `#B85418` (white text 4.9:1); brand orange `#EC8236` only for decoration. Berry purple → F2G navy, Berry blue → F2G orange.
> - Charts with recharts. Every number is real API data: no fake trend chips.
> - Unchanged: the severity scale, status dots, the send-path rules (§5.3), the confirmation levels (§6.7), the training ribbon, and the "stale data is never green" rule.

---

## 0. Direction in one paragraph

**"Navy Rail, Signal Field."** The console is a quiet, paper-and-ink instrument. The chrome is the F2G identity: a deep **navy rail** holds navigation, the logo and the only orange in the product. The working area is a calm **cream (light) / navy-black (dark) field** with ink typography and hairline structure. **Colour inside the field is reserved for meaning.** It encodes alert severity (a strict, separate scale) and, much more quietly, status. The operator's eye goes to colour, and colour always means "this is about people's safety". The references are a flight instrument panel, a newspaper front page and Linear's restraint. This is not a SaaS landing page: no glass blobs, no gradients, no pill-everything.

---

## 1. Design principles

1. **Colour is a signal, never decoration.** Severity hues appear only where an alert class is being shown or chosen. Chrome is navy, ink and cream. If you remove every severity colour, the UI should still look finished.
2. **Say it twice, never once.** Every severity and status pairs colour with a second channel: an icon, a label and the **message ID in mono** (`4370`). The UI must be colour-blind safe and survive grayscale printouts of incident reports.
3. **What you see is what the phone shows.** The operator never sends text they have not seen rendered in the handset preview, together with its encoding cost (GSM-7 vs UCS-2, pages). The preview is part of the form, not a nice-to-have.
4. **Friction is proportional to blast radius.** Test and Exercise alerts send with one confirmation. Extreme, Severe, AMBER and ETWS require an explicit checklist. **Presidential** alerts require type-to-confirm with the full message re-displayed. Friction comes from decisions, **never from timers or animations**.
5. **Nothing moves unless it tells you something.** Motion confirms a state change (sent, sending, failed) or orients you (page enter). Motion never gates, delays or decorates a send action. With reduced motion on, the product is fully functional and static.
6. **The network is always in view.** CBC link state and cell health live in the top bar on every screen. An operator must never compose an alert without knowing how many cells can actually carry it.
7. **Density with air.** This is an ops tool: tables are dense (44 px rows), numbers are tabular and panels share hairlines instead of floating as separate cards. The page still breathes through generous gutters and a strict baseline rhythm.

### Anti-patterns (hard bans)

- No generic row of 3 or 4 identical KPI cards with an icon in the top-right corner and a "+12%" chip.
- No gradient blobs, mesh backgrounds, glassmorphism on content, noise overlays, glowing orbs or shimmer buttons. The existing `ShimmerButton`, `Ripple`, `ShineBorder` and `AnimatedBeam` magicui components must **not** be used on any operational screen.
- No purple or violet anywhere. That includes the current `combined: bg-purple-700` in `types/index.ts`.
- No brand orange inside the content field: not on buttons, charts, badges, links or focus rings. Orange lives on the navy rail only (section 2.3).
- No severity colour used for non-alert UI. Red "Delete" buttons use the `danger` token, which is a different red from `extreme` (see 2.5), and they are outline-only.
- No pill-shaped primary buttons, no `rounded-[2rem]` squircles and no "button-in-button" arrow circles. This is a console, not a portfolio.
- No emoji. No stock Inter/Geist. (Geist is currently wired in `globals.css` and must be removed.)
- No spinners in the middle of a page. Skeletons must match the final layout.
- No count-down "Sending in 5… 4…" timers and no hold-to-confirm on the send button.
- No em-dashes as UI decoration and no "BETA" or version eyebrows.
- No `text-black`, `text-gray-*`, `bg-white` or raw Tailwind palette classes in components. Use tokens only.

---

## 2. Colour

All values are hex. HSL is given for the structural tokens. Themes switch on the `.dark` class (next-themes, `attribute="class"`).

### 2.1 Neutrals and structure — Light ("Paper")

| Token | Hex | HSL | Use |
|---|---|---|---|
| `--canvas` | `#FAF6F0` | 36 50% 96% | App background (F2G Cream) |
| `--surface` | `#FFFFFF` | 0 0% 100% | Panels, tables, dialogs |
| `--surface-sunken` | `#F2EDE4` | 39 35% 92% | Wells, table header, input bg on canvas, code blocks |
| `--surface-hover` | `#F6F1E9` | — | Row hover |
| `--hairline` | `#E3DCD0` | 38 25% 85% | Dividers, panel borders (decorative) |
| `--hairline-strong` | `#D6CDBE` | — | Table header underline, selected row edge |
| `--control-border` | `#8C8373` | 38 10% 50% | Input, checkbox and select boundaries (3:1 required) |
| `--ink` | `#0E1A30` | 219 55% 12% | Primary text |
| `--ink-2` | `#3B4760` | 221 24% 30% | Secondary text, labels |
| `--ink-3` | `#5A6478` | 220 14% 41% | Tertiary text, placeholders, timestamps |
| `--ink-disabled` | `#9AA1AE` | — | Disabled text (exempt) |
| `--primary` | `#1F3864` | 218 53% 26% | F2G Navy: primary buttons, links, selected states |
| `--primary-fg` | `#FAF6F0` | — | Text on primary |
| `--primary-tint` | `#E8EDF6` | — | Selected row, active tab background |
| `--focus` | `#2E62D9` | 222 69% 52% | Focus ring (2 px + 2 px offset) |
| `--danger` | `#B42318` | — | Destructive actions (outline + text only) |

### 2.2 Neutrals and structure — Dark ("Night Watch")

| Token | Hex | HSL | Use |
|---|---|---|---|
| `--canvas` | `#0A1120` | 221 52% 8% | App background (navy-black, never pure black) |
| `--surface` | `#111A2C` | 220 44% 12% | Panels, tables |
| `--surface-raised` | `#182338` | 219 40% 16% | Popovers, dialogs, hovered panels |
| `--surface-sunken` | `#0D1526` | — | Wells, table header |
| `--surface-hover` | `#16203A` | — | Row hover |
| `--hairline` | `#1F2B44` | 221 37% 19% | Dividers |
| `--hairline-strong` | `#263555` | 221 38% 24% | Table header underline |
| `--control-border` | `#58688A` | — | Input boundaries (3:1 required) |
| `--ink` | `#F3EEE6` | 37 35% 93% | Primary text (warm off-white: cream heritage, less glare) |
| `--ink-2` | `#B4BDCD` | 218 20% 75% | Secondary |
| `--ink-3` | `#8A96AB` | 218 16% 61% | Tertiary, placeholders |
| `--ink-disabled` | `#5B667A` | — | Disabled (exempt) |
| `--primary` | `#F3EEE6` | — | Primary button = inverted ink (cream) |
| `--primary-fg` | `#0E1A30` | — | Text on primary |
| `--primary-tint` | `#17233D` | — | Selected row, active tab |
| `--link` | `#A9BCE6` | — | Links / navy-as-text in dark |
| `--focus` | `#7FA6FF` | 222 100% 75% | Focus ring |
| `--danger` | `#F97066` | — | Destructive (outline + text) |

**Why the primary inverts in dark mode:** a navy button on a navy-black field disappears, and a saturated blue would collide with ETWS blue. Cream-on-navy keeps the primary action the brightest non-signal object on screen.

### 2.3 Brand (chrome only)

| Token | Light | Dark | Rule |
|---|---|---|---|
| `--rail` | `#13223F` | `#0D1830` | Navigation rail background, both themes navy |
| `--rail-item-active` | `#1C2E52` | `#16264A` | Active nav item fill |
| `--rail-ink` | `#F3EEE6` | `#F3EEE6` | Rail labels |
| `--rail-ink-2` | `#A9B6CF` | `#A9B6CF` | Rail secondary text, section headings |
| `--brand-orange` | `#EC8236` | `#EC8236` | Logo mark, active-item 3 px indicator bar, login accent rule |
| `--brand-navy` | `#1F3864` | `#1F3864` | Logo wordmark, login panel |

**Orange rule:** `#EC8236` only ever sits on navy (`--rail`, `--rail-item-active`, login panel), where it reaches 5.0 to 6.8:1. On cream it measures **2.50:1**, which fails even the 3:1 non-text threshold, so it is banned from the light content field for accessibility as well as semantic reasons.

### 2.4 Severity scale (alert class), strictly semantic

Mapping to message IDs, per 3GPP TS 23.041. This is the only source of truth.

| Severity key | Class | Message IDs | Opt-out | Icon (lucide-react 1.48) |
|---|---|---|---|---|
| `presidential` | CMAS Presidential | 4370 | **No** | `Landmark` |
| `extreme` | CMAS Extreme | 4371, 4372 | per handset | `OctagonAlert` |
| `severe` | CMAS Severe | 4373–4378 | per handset | `TriangleAlert` |
| `amber` | CMAS AMBER (child abduction) | 4379 | per handset | `UserSearch` |
| `test` | CMAS Required Monthly Test | 4380 | per handset | `CalendarCheck` |
| `test` | CMAS Exercise | 4381 | per handset | `ClipboardCheck` |
| `etws` | ETWS Earthquake | 4352 | — | `Activity` |
| `etws` | ETWS Tsunami | 4353 | — | `WavesArrowUp` |
| `etws` | ETWS Earthquake + Tsunami | 4354 | — | `Activity` + `WavesArrowUp` |
| `test` | ETWS Test | 4355 | — | `FlaskConical` |

Sub-labels in the picker for the ranged IDs, shown as urgency/certainty (the backend must confirm the IDs are identical): 4371 Immédiate · Observée, 4372 Immédiate · Probable, 4373 Attendue · Observée, 4374 Attendue · Probable, 4375 Immédiate · Observée, 4376 Immédiate · Probable, 4377 Attendue · Observée, 4378 Attendue · Probable.

Each severity has 5 tokens: `solid` (fill), `on` (text on solid), `tint` (soft background), `fg` (text on tint and on canvas), `edge` (border, bar, dot, 3:1 vs canvas).

**Light**

| Key | `solid` | `on` | `tint` | `fg` | `edge` |
|---|---|---|---|---|---|
| presidential | `#9D174D` | `#FFFFFF` | `#FCE7F1` | `#831843` | `#9D174D` |
| extreme | `#B91C1C` | `#FFFFFF` | `#FDECEA` | `#991B1B` | `#B91C1C` |
| severe | `#E9B516` | `#1F1600` | `#FCF3D5` | `#7A5200` | `#9A7400` |
| amber | `#0F766E` | `#FFFFFF` | `#DDF3F0` | `#0B5A53` | `#0F766E` |
| etws | `#1D4ED8` | `#FFFFFF` | `#E5ECFD` | `#1E3A8A` | `#1D4ED8` |
| test | `#4B5567` | `#FFFFFF` | `#ECEEF2` | `#3A4456` | `#4B5567` (dashed) |

**Dark**

| Key | `solid` | `on` | `tint` | `fg` | `edge` |
|---|---|---|---|---|---|
| presidential | `#B0135A` | `#FFFFFF` | `#2A0D1C` | `#F9A8D4` | `#F0529C` |
| extreme | `#C62828` | `#FFFFFF` | `#2A1111` | `#FCA5A5` | `#EF4444` |
| severe | `#F0C232` | `#1F1600` | `#262010` | `#F5D36A` | `#F0C232` |
| amber | `#2DD4BF` | `#04201D` | `#0B2926` | `#6EE7D6` | `#2DD4BF` |
| etws | `#2563EB` | `#FFFFFF` | `#0F1D3D` | `#A5BFFF` | `#3B82F6` |
| test | `#5B667A` | `#FFFFFF` | `#1A2233` | `#C4CCD9` | `#8A96AB` (dashed) |

Design decisions behind the scale:

- **Presidential is crimson-magenta (hue 336), not red.** A red Presidential next to a red Extreme measured only ΔE2000 = 7.4 to 8.7 in dark mode, which is too close for a life-safety distinction. At hue 336 the gap is ΔE 17.5 to 21.6. Presidential is also the only class that is **always rendered solid**, and it carries a lock (`LockKeyhole`, "Sans désactivation").
- **Severe is gold (hue 45), not orange.** This removes the collision with brand `#EC8236` (hue 25): ΔE2000 is 22.5 (light) and 24.8 (dark), clearly distinct, and orange never appears in the field anyway. The light gold fill measures only 1.76:1 against cream, so **light Severe solids must always carry a 1 px `edge` ring (`#9A7400`, 4.0:1)**. Bars and dots use `edge`, never `solid`.
- **AMBER is teal.** It is a public appeal, not a hazard level, so it sits outside the red-to-gold heat ladder. The name "AMBER" is an acronym and does not imply the colour amber, which would also collide with Severe gold.
- **ETWS is a single "geophysical blue" family.** The individual hazard is carried by the icon and label. ETWS blue against Navy primary is ΔE 16.3, and it is never used for buttons.
- **Test/Exercise is deliberately colourless:** slate, a **dashed** border and a diagonal hatch (`.sev-hatch`). A test must never look like a real alert, and a real alert must never look like a test.

### 2.5 Status scale (lifecycle), quiet by design

Rule: **severity is a field of colour, status is a dot.** A status pill is a neutral surface with a coloured dot and ink text. Only FAILED escalates to a tinted background. Severity and status therefore never compete, even where hues are related (SENDING blue vs ETWS blue, FAILED red vs Extreme red): shape, position and weight differ.

| Status | FR label | Dot light | Dot dark | Pill bg / text | Icon | Special |
|---|---|---|---|---|---|---|
| DRAFT | Brouillon | `#7A8394` hollow | `#7C879B` hollow | `surface-sunken` / `ink-2` | `PencilLine` | dashed pill border |
| SCHEDULED | Programmée | `#1F3864` | `#9DB1D9` | `primary-tint` / `primary` or `#C7D3EC` | `Clock3` | shows `dans 2 h 14` in mono |
| SENDING | En cours | `#2563EB` | `#60A5FA` | `surface-sunken` / `ink` | — | pulsing ring (5.3) + `37/42` counter |
| SENT | Envoyée | `#15803D` | `#4ADE80` | `#E3F4E8` / `#166534` · dark `#0F2A1B` / `#86EFAC` | `CircleCheck` | — |
| FAILED | Échec | `#C81E1E` | `#F87171` | `#FDECEA` / `#991B1B` · dark `#2A1111` / `#FCA5A5` | `CircleX` | bold label, always shown first in sorting |
| CANCELLED | Annulée | `#7A8394` | `#7C879B` | transparent / `ink-3` | `Ban` | label with `line-through decoration-1` |

Cell site status uses the same dot language: **active** `#15803D` / `#4ADE80`, **offline** `#C81E1E` / `#F87171` with a steady (non-pulsing) dot, `SignalZero` icon and the text "Hors ligne", **maintenance** as a hollow `ink-3` ring plus `Wrench` icon. Maintenance is intentionally not gold, so it cannot be read as Severe.

### 2.6 Contrast verification (WCAG 2.2 AA)

Computed with the WCAG relative-luminance formula. Text needs at least 4.5:1, non-text UI (borders, bars, dots, focus) at least 3:1.

**Light**

| Pair | Ratio | Req. | Pass |
|---|---|---|---|
| `ink` #0E1A30 on canvas #FAF6F0 | 16.13 | 4.5 | yes |
| `ink` on surface #FFFFFF | 17.37 | 4.5 | yes |
| `ink` on sunken #F2EDE4 | 14.89 | 4.5 | yes |
| `ink-2` #3B4760 on canvas / sunken / surface | 8.65 / 7.98 / 9.31 | 4.5 | yes |
| `ink-3` #5A6478 on canvas / surface / sunken | 5.53 / 5.95 / 5.10 | 4.5 | yes |
| `primary-fg` #FAF6F0 on primary #1F3864 | 10.79 | 4.5 | yes |
| `primary` #1F3864 as link on surface | 11.62 | 4.5 | yes |
| `primary` on `primary-tint` #E8EDF6 | 9.89 | 4.5 | yes |
| `danger` #B42318 on canvas / surface / `danger-tint` | 6.11 / 6.57 / 5.75 | 4.5 | yes |
| `rail` #13223F on orange (sidebar-primary pair) | 5.88 | 4.5 | yes |
| draft hollow ring #7A8394 on canvas | 3.55 | 3.0 | yes |
| `control-border` #8C8373 on canvas / surface | 3.48 / 3.74 | 3.0 | yes |
| `focus` #2E62D9 on canvas / surface | 5.05 / 5.43 | 3.0 | yes |
| brand orange #EC8236 on canvas | **2.50** | 3.0 | **no, banned there** |
| brand orange on rail #13223F / active #1C2E52 | 5.88 / 5.00 | 3.0 | yes |
| `rail-ink` #F3EEE6 on rail / active | 13.69 / 11.64 | 4.5 | yes |
| `rail-ink-2` #A9B6CF on rail | 7.74 | 4.5 | yes |
| presidential `on` on `solid` #9D174D | 7.88 | 4.5 | yes |
| extreme `on` on `solid` #B91C1C | 6.47 | 4.5 | yes |
| severe `on` #1F1600 on `solid` #E9B516 | 9.45 | 4.5 | yes |
| amber `on` on `solid` #0F766E | 5.47 | 4.5 | yes |
| etws `on` on `solid` #1D4ED8 | 6.70 | 4.5 | yes |
| test `on` on `solid` #4B5567 | 7.51 | 4.5 | yes |
| presidential `fg` on `tint` / on canvas | 8.20 / 8.96 | 4.5 | yes |
| extreme `fg` on `tint` / on canvas | 7.27 / 7.72 | 4.5 | yes |
| severe `fg` on `tint` / on canvas / on surface | 6.24 / 6.43 / 6.92 | 4.5 | yes |
| amber `fg` on `tint` / on canvas | 6.98 / 7.50 | 4.5 | yes |
| etws `fg` on `tint` / on canvas | 8.75 / 9.62 | 4.5 | yes |
| test `fg` on `tint` | 8.44 | 4.5 | yes |
| edges on canvas: pres / ext / severe / amber / etws / test | 7.32 / 6.01 / 4.00 / 5.08 / 6.22 / 6.98 | 3.0 | yes |
| severe **solid** #E9B516 on canvas | **1.76** | 3.0 | no, hence the mandatory `edge` ring |
| status dots on surface: scheduled / sending / sent / failed / draft | 11.62 / 5.17 / 5.02 / 5.74 / 3.82 | 3.0 | yes |
| SENT text #166534 on #E3F4E8 | 6.24 | 4.5 | yes |
| FAILED text #991B1B on #FDECEA | 7.27 | 4.5 | yes |

**Dark**

| Pair | Ratio | Req. | Pass |
|---|---|---|---|
| `ink` #F3EEE6 on canvas / surface / raised | 16.32 / 15.05 / 13.61 | 4.5 | yes |
| `ink-2` #B4BDCD on canvas / surface / raised | 9.97 / 9.19 / 8.31 | 4.5 | yes |
| `ink-3` #8A96AB on canvas / surface / raised | 6.31 / 5.82 / 5.26 | 4.5 | yes |
| `primary-fg` #0E1A30 on primary #F3EEE6 | 15.04 | 4.5 | yes |
| `link` #A9BCE6 on canvas | 9.90 | 4.5 | yes |
| scheduled text #C7D3EC on #17233D | 10.38 | 4.5 | yes |
| `danger` #F97066 on canvas / surface / raised | 6.77 / 6.24 / 5.64 | 4.5 | yes |
| `control-border` #58688A on canvas / surface | 3.38 / 3.11 | 3.0 | yes |
| `focus` #7FA6FF on canvas / raised | 7.90 / 6.59 | 3.0 | yes |
| brand orange on rail #0D1830 | 6.56 | 3.0 | yes |
| `rail-ink` / `rail-ink-2` on rail #0D1830 | 15.27 / 8.63 | 4.5 | yes |
| presidential `on` on #B0135A | 6.80 | 4.5 | yes |
| extreme `on` on #C62828 | 5.62 | 4.5 | yes |
| severe `on` #1F1600 on #F0C232 | 10.63 | 4.5 | yes |
| amber `on` #04201D on #2DD4BF | 9.18 | 4.5 | yes |
| etws `on` on #2563EB | 5.17 | 4.5 | yes |
| test `on` on #5B667A | 5.79 | 4.5 | yes |
| tints (fg on tint): pres / ext / severe / amber / etws / test | 9.87 / 9.32 / 11.11 / 10.35 / 9.10 / 9.83 | 4.5 | yes |
| edges on canvas: pres #F0529C / ext #EF4444 / severe / amber / etws #3B82F6 / test #8A96AB | 5.74 / 5.01 / 11.19 / 10.13 / 5.13 / 6.31 | 3.0 | yes |
| status dots on surface: scheduled / sending / sent / failed / draft | 8.05 / 6.84 / 9.98 / 6.28 / 4.80 | 3.0 | yes |
| SENT #86EFAC on #0F2A1B · FAILED #FCA5A5 on #2A1111 | 10.94 / 9.32 | 4.5 | yes |
| warning text #F5D36A / error #FCA5A5 on surface | 11.93 / 9.16 | 4.5 | yes |

Note: `#B0135A` and `#C62828` are for fills with white text only. As bars or dots on the dark canvas they are too dim (`#BE123C` measures exactly 3.00), so always use `edge` for bars and dots.

---

## 3. Typography

### 3.1 Families (via `next/font/google`, self-hosted at build)

| Role | Family | Weights | Variable |
|---|---|---|---|
| Display | **Baloo 2** | 500, 600, 700 | `--font-display` |
| UI / body | **IBM Plex Sans** | 400, 500, 600 (+ italic 400) | `--font-sans` |
| Data / IDs / codes | **IBM Plex Mono** | 400, 500, 600 | `--font-mono` |
| Handset preview | device stack: `system-ui, -apple-system, "Segoe UI", sans-serif` | — | `--font-device` |

**Baloo 2 is used sparingly**, because its rounded warmth must not soften operational text. Allowed: wordmark, page H1, login headline, empty-state titles and the **severity class name in the AlertClassPicker**. Banned: table text, buttons, labels, KPI numbers and anything inside the confirmation dialog except its title.

Numerals: Plex Sans digits are already equal-width. Still apply `tabular-nums` (explicit and future-proof) and `slashed-zero` wherever IDs or counts appear. Plex Mono ships a `zero` feature. Baloo 2 digits are proportional, so if a number is ever set in Baloo 2, add `tabular-nums` (it ships `tnum`).

### 3.2 Scale (desktop; mobile rules below)

| Token | Family | Size / line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display` | Baloo 2 | 32 / 36 | 600 | -0.01em | Login headline, dashboard H1 |
| `title-1` | Baloo 2 | 24 / 30 | 600 | -0.005em | Page H1 |
| `title-2` | Plex Sans | 18 / 26 | 600 | -0.01em | Panel titles, dialog titles |
| `title-3` | Plex Sans | 15 / 22 | 600 | 0 | Section headings in forms |
| `body` | Plex Sans | 14 / 22 | 400 | 0 | Default |
| `body-strong` | Plex Sans | 14 / 22 | 500 | 0 | Table primary cell |
| `body-sm` | Plex Sans | 13 / 20 | 400 | 0 | Helper text, table secondary |
| `label` | Plex Sans | 12 / 16 | 500 | 0.01em | Form labels, pills |
| `overline` | Plex Sans | 11 / 16 | 600 | 0.08em, uppercase | Panel eyebrows, severity tag label |
| `mono` | Plex Mono | 12.5 / 18 | 500 | 0 | Message IDs, cell IDs, IPs, durations |
| `kpi-xl` | Plex Sans | 48 / 48 | 500 | -0.03em | Success rate hero number |
| `kpi` | Plex Sans | 28 / 32 | 500 | -0.02em | Ledger counts |
| `kpi-unit` | Plex Sans | 14 / 20 | 500 | 0 | `%`, `/124` suffixes, `ink-3` |
| `message` | Plex Sans | 16 / 26 | 400 | 0 | Composer textarea (large, readable) |

Mobile (<640 px): `display` 26/30, `title-1` 20/26, `kpi-xl` 40/40. Everything else is unchanged.

Rules: sentence case everywhere except the `overline` and severity tags. Max line length 68ch for prose. Numbers are right-aligned in tables.

---

## 4. Layout

### 4.1 App shell

```
┌────────────┬───────────────────────────────────────────────────────────────┐
│ ▣ F2G      │ Alertes / Nouvelle alerte     ●CBC connecté  ▮▮▮▮▮▮▯ 118/124 │ ⌘K  ◐  AD ▾
│ CMAS Hub   ├───────────────────────────────────────────────────────────────┤  ← top bar 56px, sticky
│            │ [ActiveAlertBanner — only when an alert is SENDING or live]   │
│ OPÉRATIONS │                                                               │
│ ▌Tableau   │  page content (max-w-[1440px], px-6 lg:px-8, py-6 lg:py-8)    │
│  Alertes   │                                                               │
│  Nouvelle  │                                                               │
│  Modèles   │                                                               │
│ RÉSEAU     │                                                               │
│  Cellules  │                                                               │
│ SYSTÈME    │                                                               │
│  Paramètres│                                                               │
│            │                                                               │
│ ─────────  │                                                               │
│ Env: PROD  │                                                               │
│ v1.0 · F2G │                                                               │
└────────────┴───────────────────────────────────────────────────────────────┘
  rail 240px (collapsible to 64px, icons only + tooltips)
```

- **Rail**: `bg-rail text-rail-ink w-60 data-[collapsed=true]:w-16`, full height, `border-r border-black/20`. Logo mark (orange square glyph) plus the wordmark "CMAS Hub" in Baloo 2 600 17 px. Section headings are `overline` in `rail-ink-2`. Nav items are 36 px tall, `rounded-md mx-2 px-3 gap-3`, icon 18 px stroke 1.75. Active item: `bg-rail-item-active` plus a **3 px orange bar** on the left edge (`before:absolute before:left-0 before:inset-y-2 before:w-[3px] before:rounded-r before:bg-brand-orange`). Hover: `bg-white/5`.
- **"Nouvelle alerte"** is not a nav link styled as a CTA. It is a normal item with the shortcut hint `N` in mono on the right, so the rail stays calm.
- **Environment tag** at the rail bottom: `PROD` in `rail-ink-2`. When `NEXT_PUBLIC_ENV !== "production"`, a **hatched ribbon** runs across the top of the content column: `ENVIRONNEMENT DE FORMATION — les alertes ne sont pas diffusées` (test hatch, `test-fg` text). This is critical for training sessions.
- **Top bar**: `h-14 sticky top-0 z-[var(--z-sticky)] bg-canvas/85 backdrop-blur-md border-b border-hairline`. Blur is allowed here only, because the bar is sticky. Left: breadcrumb (`body-sm ink-3` › `title-3 ink`). Right: **NetworkStatus**, then the `⌘K` trigger, theme toggle and user menu.
- **NetworkStatus** (persistent, every screen): a button, `h-8 rounded-md border border-hairline px-2.5 gap-2`.
  - Segment 1: CBC link dot (sent-green / failed-red) plus the label `CBC` in mono.
  - Segment 2: a 7-segment micro-bar (`w-14 h-1.5` split into 7 ticks; ticks fill in `sent` dot colour in proportion to active/total, and offline ticks use the `failed` dot colour) plus `118/124` in mono tabular.
  - With offline cells > 0, append `· 3 hors ligne` in `failed` fg.
  - Click opens a Popover (w-80) listing offline and maintenance cells with last-seen time and a "Voir les cellules" link. Tooltip: "Mis à jour il y a 12 s". Poll every 15 s. On poll failure the link dot turns hollow `ink-3` and the label reads `Liaison inconnue`. Never show stale green.
- **Mobile (<1024 px)**: the rail becomes a left `Sheet` opened from a menu button in the top bar. NetworkStatus collapses to the dot and `118/124`. On <640 px the top bar shows the page title only, and the ⌘K trigger becomes a search icon button.

### 4.2 Command palette (cmdk, `Ctrl/⌘+K`)

`CommandDialog` at `max-w-[640px] top-[18vh]`, `surface-raised`, `rounded-xl`, shadow `e3`. Input 48 px with a `Search` icon. Groups:
1. **Actions**: Nouvelle alerte (`N`), Vérifier toutes les cellules, Basculer le thème.
2. **Aller à**: Tableau de bord (`G D`), Alertes (`G A`), Modèles (`G T`), Cellules (`G C`), Paramètres (`G S`).
3. **Alertes récentes**: search by ID, content or message ID. Each row shows a SeverityBadge (sm) plus the status dot.
4. **Cellules**: by name or cell ID. Each row shows the status dot.
5. **Modèles**: "Utiliser le modèle…" opens the composer prefilled.

Safety rule: the palette can **open** the composer, prefilled or not. It can never send, schedule or cancel anything.

Single-key shortcuts (`N`, `G x`) are disabled while focus is in an input or textarea, or while a dialog is open.

### 4.3 Grid, spacing, radii

- **Grid**: 12 columns, `gap-6` (24 px) at lg and above, `gap-4` below. Content `max-w-[1440px] mx-auto`. Forms max width 720 px, except the composer (section 7.4).
- **Spacing**: 4 px base, Tailwind default scale. Use only 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12 and 16. Panel padding `p-5` (20 px), with `p-4` below sm. Between page sections `space-y-6 lg:space-y-8`.
- **Radii** (precise, not bubbly):

| Token | px | Use |
|---|---|---|
| `--radius-xs` | 4 | Severity tags, kbd, dots-with-label |
| `--radius-sm` | 6 | Inputs, buttons, pills (status pills are `rounded-full`, the one exception) |
| `--radius-md` | 8 | Menu items, small tiles |
| `--radius-lg` | 12 | Panels, tables, popovers |
| `--radius-xl` | 16 | Dialogs, handset popup |
| `--radius-device` | 44 | Phone frame (outer), 36 inner screen |

### 4.4 Elevation

Light uses hairlines plus very soft, navy-tinted shadows. Dark uses surface lightness steps plus a 1 px top inner highlight. Shadows are never pure black in light mode and never harsh.

| Token | Light | Dark |
|---|---|---|
| `e0` panel | `border border-hairline`, no shadow | `border border-hairline` |
| `e1` raised tile / hover | `0 1px 2px rgb(14 26 48 / .06), 0 1px 0 rgb(14 26 48 / .03)` | `inset 0 1px 0 rgb(255 255 255 / .04)` + `surface-raised` |
| `e2` popover, menu | `0 8px 24px -6px rgb(14 26 48 / .14), 0 2px 6px -2px rgb(14 26 48 / .08)` | `0 12px 32px -8px rgb(0 0 0 / .55), inset 0 1px 0 rgb(255 255 255 / .05)` |
| `e3` dialog, palette | `0 24px 64px -12px rgb(14 26 48 / .28)` | `0 28px 72px -12px rgb(0 0 0 / .7), inset 0 1px 0 rgb(255 255 255 / .06)` |

Overlay: `bg-[#0A1120]/40` (light) and `/65` (dark). No `backdrop-blur` on overlays, which keeps them fast and predictable.

**Z-index scale** (CSS vars, no ad-hoc `z-50`): `--z-sticky: 20`, `--z-rail: 30`, `--z-banner: 25`, `--z-popover: 40`, `--z-overlay: 50`, `--z-dialog: 60`, `--z-toast: 70`, `--z-palette: 80`.

### 4.5 Density

- Table rows: 44 px (comfortable, default) or 36 px (compact, a Settings toggle stored in localStorage). Header row 36 px on `surface-sunken`, `overline` style.
- Buttons: `sm` 32 px, `md` 36 px (default), `lg` 44 px (send actions only). Touch targets are at least 44 px on mobile.
- Icons 16 px inline, 18 px nav and buttons, stroke width 1.75 globally (`<LucideProvider>` or a `className="[&_svg]:stroke-[1.75]"` wrapper).

---

## 5. Motion

Library: `framer-motion` (installed, v13). Import from `"framer-motion"`. Wrap the app in `<MotionConfig reducedMotion="user">` and use `LazyMotion features={domAnimation}` with `m.*` components to keep the bundle small.

### 5.1 Tokens (`lib/motion.ts`)

```ts
export const dur = { instant: 0, fast: 0.12, base: 0.18, moderate: 0.24, slow: 0.36 } as const;
export const ease = {
  standard: [0.2, 0, 0, 1],     // enter / state change
  exit:     [0.4, 0, 1, 1],     // leave
  emphasized: [0.32, 0.72, 0, 1] // dialogs, banner
} as const;
export const spring = {
  snappy: { type: "spring", stiffness: 520, damping: 40, mass: 0.8 }, // toggles, selection indicator
  layout: { type: "spring", stiffness: 400, damping: 36 },             // layoutId moves
  gentle: { type: "spring", stiffness: 260, damping: 30 },             // handset popup
} as const;
```

CSS transitions (hover, colour) use `duration-150 ease-[cubic-bezier(0.2,0,0,1)]`. Never `linear` except for progress and pulse keyframes.

### 5.2 What animates

| Interaction | Spec | Reduced motion |
|---|---|---|
| Page enter | `opacity 0→1, y 6→0`, `dur.base`, `ease.standard`. No exit animation, because App Router navigation must feel instant. | opacity only, 0.01 s |
| List / table stagger | first 8 rows only, `staggerChildren: 0.024`, `opacity 0→1, y 4→0`. Rows after 8 appear instantly. Refetches never re-stagger. | none |
| KPI count-up | **first mount only**, 600 ms, `ease.standard`, via `useMotionValue` + `animate` (the existing magicui `number-ticker` is acceptable if it honours reduced motion). On refetch, the new value swaps instantly and the digit container flashes `bg-primary-tint` for 400 ms. | final value immediately |
| Selection indicator (class picker, tabs, rail active bar) | `layoutId`, `spring.layout` | instant |
| SENDING pulse | CSS keyframe on the dot's `::after` ring: `scale 1→2.4, opacity .5→0`, 1.6 s, infinite, `cubic-bezier(0,0,.2,1)`. CSS, not JS, so it costs nothing on large tables. | static 2 px ring in the sending colour; the text label carries the meaning |
| SENDING progress | per-cell counter `37/42`, digits swap instantly; a 2 px bar under the banner, `transform: scaleX()`, 240 ms | same, no transition |
| ActiveAlertBanner enter | `opacity 0→1, y -8→0`, `dur.moderate`, `ease.emphasized`; content below moves with `layout` + `spring.layout` | instant |
| Dialog | overlay opacity `dur.base`; panel `opacity 0→1, scale .98→1`, `dur.moderate`, `ease.emphasized`; exit `dur.fast` | opacity only |
| Handset preview on class change | popup cross-fade + `scale .96→1`, `spring.gentle`; phone `x: [0,-2,2,-1,0]` once (vibration cue), 280 ms | cross-fade only, no shake |
| Handset preview while typing | **no animation**; text updates on every keystroke | same |
| Toasts (sonner) | default sonner motion | sonner respects reduced motion |
| Cell tile status change | dot colour transition 240 ms; tile gets a 1 s `ring-2` in the new status edge colour, fading out | colour swap only |

### 5.3 Send-path rule (non-negotiable)

- `onClick` of the final send button calls the mutation **synchronously as its first statement**. Closing the dialog, toasts and banner animations happen in parallel and never await anything.
- The send button shows its pending state (`LoaderCircle` spinning 16 px + "Diffusion…") in the same frame. No transition may hide or disable the button before the request is dispatched.
- No exit animation may block navigation to the alert detail page after success. Navigate with `router.push` immediately.
- Keyboard: in the confirmation dialog, `Enter` activates send **only** once the confirmation requirement is met (checkbox or typed phrase). `Esc` always cancels.

---

## 6. Signature components

A shared helper `lib/alert-classes.ts` is the single source of truth: `getAlertClass(messageId) → { key: SeverityKey; family: "CMAS" | "ETWS"; label: string; shortLabel: string; icon: LucideIcon; optOut: boolean; isTest: boolean; confirmLevel: "light" | "standard" | "presidential"; handsetTitle: string }`. Every component below consumes it. **No component hard-codes IDs or colours.**

`type SeverityKey = "presidential" | "extreme" | "severe" | "amber" | "etws" | "test"`.

Confirmation levels: `presidential` → 4370. `standard` → 4371–4379, 4352–4354. `light` → 4380, 4381, 4355.

### 6.1 SeverityBadge

Props: `{ messageId: number; variant?: "solid" | "tint" | "outline"; size?: "sm" | "md"; showId?: boolean /* default true */; className?: string }`

Anatomy: `[icon][LABEL][divider][ID]`, for example `▣ PRÉSIDENTIELLE │ 4370`.

- Base: `inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] font-sans text-[11px] leading-4 font-semibold uppercase tracking-[0.06em] h-6 px-2` (sm: `h-5 px-1.5 text-[10px]`, icon 12 px).
- ID segment: `font-mono font-medium tracking-normal tabular-nums pl-1.5 border-l border-current/25`.
- `tint` (default in tables): `bg-sev-{k}-tint text-sev-{k}-fg ring-1 ring-inset ring-sev-{k}-edge/35`.
- `solid`: `bg-sev-{k} text-sev-{k}-on`. Light severe adds `ring-1 ring-inset ring-sev-severe-edge`.
- **Presidential is always solid**, whatever variant is passed, and adds `LockKeyhole` 12 px after the label.
- **Test** adds `sev-hatch` and a dashed ring: `ring-0 outline outline-1 outline-dashed outline-sev-test-edge -outline-offset-1`.
- a11y: `aria-label="Classe {label}, identifiant {id}"`; icons are `aria-hidden`.

### 6.2 AlertStatusPill

Props: `{ status: AlertStatus; progress?: { done: number; total: number }; scheduledAt?: Date; size?: "sm" | "md" }`

- Base: `inline-flex items-center gap-1.5 h-6 rounded-full px-2.5 text-xs font-medium`. The dot is `size-2 rounded-full` (DRAFT/maintenance: `ring-[1.5px] ring-inset` with a transparent fill).
- SENDING: dot gets `.status-pulse`; label "En cours" plus ` 37/42` in mono tabular `ink-2`. `aria-live="polite"` on the progress text, throttled to one update every 5 s for screen readers.
- SCHEDULED: label plus ` · dans 2 h 14` (`date-fns` `formatDistanceToNowStrict`, `fr` locale), with an absolute time in the tooltip.
- FAILED: `font-semibold` and a tinted background (2.5).
- Colours per 2.5. The status pill never uses a severity token.

### 6.3 AlertClassPicker

Props: `{ value: number | null; onChange: (messageId: number) => void; allowed?: number[] /* role-based */; disabled?: boolean }`

Layout: a `radiogroup` of two families, **CMAS** and **ETWS**, as labelled columns on lg and above (CMAS 8 columns, ETWS 4) and stacked below.

```
CMAS ─────────────────────────────────────────────  ETWS ───────────────────
┌──────────────────────────────┐ ┌───────────────┐  ┌──────────────────────┐
│▌▣ Présidentielle   4370  [lock]│ │▌⬡ Extrême     │  │▌∿ Séisme       4352  │
│  Diffusion nationale, aucune │ │ 4371 · 4372 ▾ │  │▌≋ Tsunami      4353  │
│  désactivation possible      │ └───────────────┘  │▌∿≋ Séisme+Tsunami 4354│
└──────────────────────────────┘ ┌───────────────┐  │┆ Test ETWS     4355  │
┌───────────────┐┌─────────────┐ │▌△ Grave       │  └──────────────────────┘
│▌⌕ AMBER  4379 ││┆ Test mensuel│ │ 4373–4378  ▾  │
└───────────────┘│   4380      │ └───────────────┘
                 │┆ Exercice 4381│
                 └─────────────┘
```

- Each option is a tile: `relative rounded-[var(--radius-md)] border border-hairline bg-surface p-3.5 text-left`, with a **4 px severity edge bar on the left** (`before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r before:bg-sev-{k}-edge`). Name in **Baloo 2 600 16 px**, one-line description `body-sm ink-3`, ID in `mono` at the right.
- Presidential tile spans two columns and two rows on lg: it is the heaviest option and must never be picked by mis-click proximity. It sits first, but separated by `gap-4` (other tiles use `gap-2`).
- Ranged classes (Extreme, Severe) open an inline `Select` after selection for the exact ID with its urgency/certainty sub-label (2.4). The default is the first ID in the range.
- **Selected state**: `bg-sev-{k}-tint border-sev-{k}-edge ring-1 ring-sev-{k}-edge` plus a `CircleCheck` 16 px at the top-right in `sev-{k}-fg`. A shared `layoutId="class-selection"` ring moves between tiles with `spring.layout`.
- Hover: `bg-surface-hover`. Focus: `focus-visible:ring-2 ring-focus ring-offset-2 ring-offset-canvas`. Arrow keys move within the radiogroup (use base-ui `RadioGroup`, styled; not native inputs).
- Disabled class (role not allowed): `opacity-50`, `aria-disabled`, tooltip "Réservé aux administrateurs".

### 6.4 MessageComposer

Props: `{ value: string; onChange(v: string): void; language?: "fr" | "en" | "fr+en"; templateName?: string }`, which exposes `encoding` and stats through `useCbsEncoding(value)`.

**Encoding logic** (in `lib/cbs-encoding.ts`, with vitest tests):
- CBS page = 82 octets, max 15 pages.
- **GSM-7**: 93 characters per page, **max 1395**. Characters from the GSM 03.38 extension table (`^ { } \ [ ~ ] | €`, form feed) count as **2**.
- **UCS-2**: 41 characters per page, **max 615**. Any single character outside GSM-7 switches the whole message.
- French pitfall to surface: `ê â î ô û ë ï ç œ` and the typographic `’ « » …` are **not** GSM-7 (`é è ù à ì ò É Ç` are). A single `ê` cuts capacity from 1395 to 615.

Anatomy:

```
┌ Message ─────────────────────────────────────────── [FR] [EN] [FR+EN] ┐
│                                                                        │
│  Textarea, message type 16/26, min-h 220px, surface bg,               │
│  auto-grow to 420px then scroll                                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ ▮▮▮▯▯▯▯▯▯▯▯▯▯▯▯  3/15 pages     GSM-7 ✓        247 / 1395 caractères   │
└────────────────────────────────────────────────────────────────────────┘
  ⚠ 2 caractères forcent l'encodage UCS-2 : ê (×1), ’ (×1)   [Convertir en GSM-7]
```

- Wrapper: `rounded-[var(--radius-lg)] border border-control-border bg-surface focus-within:ring-2 focus-within:ring-focus`.
- **Footer meter** (`h-10 border-t border-hairline bg-surface-sunken px-3 flex items-center gap-4 text-xs`):
  - 15-tick page meter (`w-[120px]`, ticks `h-2 w-1.5 rounded-[1px]`), filled ticks in `ink-2`, empty in `hairline-strong`.
  - Encoding chip: `GSM-7` in mono with `CircleCheck` (`sent` fg), or `UCS-2` in mono in `sev-severe-fg` with `TriangleAlert`. Tooltip: "UCS-2 : 41 caractères par page au lieu de 93".
  - Counter right-aligned, mono tabular: `247 / 1395`. At ≥ 90 % of the limit the counter turns `sev-severe-fg`; over the limit it turns `danger`, gains `aria-invalid` on the textarea and blocks the next step.
- **UCS-2 notice** (only when UCS-2): `text-sm text-sev-severe-fg` row listing the offending characters as `kbd` chips (`font-mono bg-sev-severe-tint px-1 rounded-[4px]`), plus the ghost button **"Convertir en GSM-7"**. The button replaces `ê→e, â→a, î→i, ô→o, û→u, ç→c, œ→oe, ’→', «»→", …→...` and offers a single sonner "Annuler" undo. It never runs silently.
- **Bilingual (FR+EN)**: two stacked textareas, "Français" and "English", sharing one combined meter, since they are joined with a `\n\n` separator. The official FR/EN bilingualism of Cameroon makes this the recommended default for national alerts.
- Live region: the counter has `aria-live="polite"`, announcing only on page or encoding change, not on every character.

### 6.5 CellTargetSelector

Props: `{ cells: CellSite[]; value: string[]; onChange(ids: string[]): void; mode?: "list" | "region" }`

```
┌ Cellules ciblées ───────────────────────── 42 sélectionnées / 118 actives ┐
│ [Search cellules…        ] [Région ▾] [Statut: Actives ▾]  [Tout ▾]      │
├──────────────────────────────────────────────────────────────────────────┤
│ ☑ Région Centre            18/18   ────────────────────────────────── ▾  │
│   ☑ ● YDE-Bastos-01   CID 41021  10.12.0.21     vu il y a 8 s           │
│   ☑ ● YDE-Mvan-03     CID 41033  …                                      │
│   ☐ ○ YDE-Nlongkak-02 CID 41040  en maintenance  (non sélectionnable)   │
│ ☐ Région Littoral          0/24                                        ▸ │
├──────────────────────────────────────────────────────────────────────────┤
│ ⚠ 2 cellules sélectionnées sont hors ligne et ne recevront pas l'alerte  │
└──────────────────────────────────────────────────────────────────────────┘
```

- Groups by region, derived from `location` (fallback "Sans région"). Group header: tri-state `Checkbox`, `n/m` in mono.
- Quick scopes in the `Tout ▾` menu: "Toutes les cellules actives (national)", "Aucune", "Inverser". For **Presidential**, the default is "national", and deselecting cells shows an inline `sev-presidential-fg` note: "Une alerte présidentielle est normalement nationale."
- Rows: 40 px, status dot, name `body-strong`, `CID` in mono `ink-3`. Offline cells can be selected but carry a red dot and a warning footer. Maintenance cells are disabled.
- Sticky footer summary with the count and warnings. Virtualise the list above 200 cells.
- Keyboard: Space toggles, Shift-click range-selects.

### 6.6 HandsetAlertPreview

Props: `{ messageId: number | null; message: string; language?: string; receivedAt?: Date; platform?: "android" | "ios" }`

The one place where the "double-bezel" hardware treatment is justified: a physical object.

- **Frame**: outer `w-[300px] aspect-[9/19.5] rounded-[var(--radius-device)] p-2.5 bg-[#0B0F17] ring-1 ring-black/40 shadow-e3`. Inner screen `rounded-[36px] overflow-hidden`, with a blurred dim wallpaper built from a flat `#1C2230` plus a 10 % navy radial (no external image). Status bar: 09:41, signal and battery glyphs (lucide `SignalHigh`, `BatteryMedium`) at 11 px.
- **Popup (Android, default)**: centred card `mx-3 rounded-[var(--radius-xl)] bg-[#1C2230] text-white p-4 shadow-e2`.
  - Header strip: `-mx-4 -mt-4 mb-3 px-4 py-2.5 rounded-t-[var(--radius-xl)] bg-sev-{k}-solid text-sev-{k}-on`, containing the class icon and the handset title in `font-device` 600 15 px.
  - Handset titles (FR): Présidentielle "Alerte présidentielle"; Extrême "Alerte extrême"; Grave "Alerte grave"; AMBER "Alerte enlèvement d'enfant"; RMT "Test mensuel obligatoire"; Exercice "Exercice"; 4352 "Alerte séisme"; 4353 "Alerte tsunami"; 4354 "Alerte séisme et tsunami"; 4355 "Test ETWS".
  - Body `font-device text-[14px] leading-[21px] text-white whitespace-pre-wrap`; `max-h-[52%] overflow-y-auto` with a fading bottom mask when it overflows (that is the real handset behaviour).
  - Footer: timestamp `text-[#C9CED8] text-xs` (10.07:1) and an "OK" text button right-aligned.
- **iOS variant**: a banner-style card at the top (`mt-12 mx-2 rounded-[22px] bg-[#1C2230]/95`) with a bold title line "Alerte d'urgence" plus the class name. It exists for fidelity; toggle with a segmented control under the phone.
- Empty message: body shows `ink-3` italics "Votre message apparaîtra ici". No class selected: the frame shows a dim lock screen with "Choisissez une classe d'alerte".
- **Honesty caption** under the phone (`body-sm ink-3`): "Aperçu indicatif. Le titre et le son sont définis par le téléphone ; seule la zone de texte est contrôlée par la console."
- Test classes: a diagonal "TEST" watermark on the popup (`text-white/8 text-5xl font-display rotate-[-18deg]`).
- `role="img"` with `aria-label="Aperçu téléphone : {title}. {message}"`.

### 6.7 SendConfirmation

Props: `{ open: boolean; onOpenChange(o: boolean): void; draft: AlertDraft; onConfirm(): void; pending: boolean }`. The level comes from `getAlertClass(draft.messageId).confirmLevel`.

Common anatomy (Dialog `max-w-[560px]`, `e3`, `rounded-[var(--radius-xl)]`):

```
┌──────────────────────────────────────────────────────────────┐
│ ▌ (4px top bar in sev edge colour, full width)               │
│ Confirmer la diffusion                           [×]         │
│ [SeverityBadge solid] · CMAS                                 │
│                                                              │
│  ┌ message recap (surface-sunken, message 15/24, max-h 160) ┐│
│  └───────────────────────────────────────────────────────────┘│
│  Cellules      42 (Centre 18, Littoral 24) · 2 hors ligne    │
│  Durée         30 min  (répétition CBC)                       │
│  Envoi         Immédiat  /  Programmé le 03/10 à 14:00        │
│  Encodage      GSM-7 · 3 pages                               │
│                                                              │
│  [confirmation requirement, per level]                       │
│                                                              │
│            [Annuler]   [■ Diffuser sur 42 cellules]  ← lg 44px │
└──────────────────────────────────────────────────────────────┘
```

- **light** (4380, 4381, 4355): the recap plus a primary button in `test` solid. Label: "Diffuser le test".
- **standard**: checkbox "J'ai relu le message et vérifié les cellules ciblées" (required). Button: `bg-sev-{k} text-sev-{k}-on` (light severe with the edge ring). The button is disabled until the box is checked.
- **presidential** (4370):
  - The dialog is `max-w-[640px]`, the top bar is 6 px, and the title reads "Alerte présidentielle : diffusion nationale".
  - A callout (`bg-sev-presidential-tint text-sev-presidential-fg rounded-md p-3`, icon `LockKeyhole`): "Cette alerte ne peut pas être désactivée par les destinataires. Elle sera diffusée sur {n} cellules."
  - The message recap is shown **in full** (no max-height) at 16/26.
  - **Type-to-confirm**: label "Pour confirmer, saisissez **DIFFUSION NATIONALE**". The Input is mono, uppercase-transformed and `autocomplete="off"`. Match is exact after trim and is case-insensitive. Pasting is allowed (accessibility), and no timer applies.
  - The button stays disabled until it matches; on match it becomes `bg-sev-presidential` with the label "Diffuser l'alerte présidentielle". There is no shake animation on mismatch, only helper text `ink-3` "Saisie incomplète".
  - The operator name and time are displayed ("Signée par A. Djoum · 14:02:31") for audit.
- Pending: the button shows `LoaderCircle` + "Diffusion…", and cancel stays enabled until the server acknowledges. Errors render inline in the dialog (`danger` callout) with a "Réessayer" action. The draft is never lost.

### 6.8 KPI instrument panel (dashboard). Not cards.

One continuous panel (`rounded-[var(--radius-lg)] border border-hairline bg-surface`), divided internally by 1 px hairlines like an instrument cluster. No per-KPI card, no icon badge, no fake trend chips.

```
┌──────────────────────┬──────────────────────────────────────────┬──────────────┐
│ TAUX DE SUCCÈS       │ REGISTRE DES ALERTES               1 284 │ AUJOURD'HUI  │
│                      │ ██████████████████▓▓▓░░░▒                 │ 12  envoyées │
│  97,4 %              │ Envoyées 1 187 · Programmées 31 ·        │  3  programm.│
│  (kpi-xl)            │ Brouillons 49 · Échecs 17                │              │
│ ▁▂▂▃▂▃▅▅▆▆▇ 30 j     │  (each count: kpi 28px + label overline) │              │
└──────────────────────┴──────────────────────────────────────────┴──────────────┘
   col-span 3              col-span 6                                  col-span 3
```

- **Success rate**: `kpi-xl` tabular; `%` as `kpi-unit`. Under it a 30-day sparkline (inline SVG path, stroke `ink-2` 1.5 px, no fill, no gradient). Below 95 % the number turns `sev-severe-fg`; below 90 % it turns `danger`.
- **Ledger**: a single stacked bar `h-2 rounded-full overflow-hidden` with segments in status dot colours (sent, scheduled, draft hollow-grey, failed). Under it, 4 inline counts; each is a link that opens the alert list pre-filtered. The total sits top-right in `kpi`.
- **Today**: two stacked numbers, `kpi` size.
- **Network health** is a separate panel (7.2), not a KPI tile.
- Mobile: the three segments stack, with hairlines becoming horizontal.
- Count-up on first mount per 5.2. Skeleton: the same panel with `Skeleton` blocks at the exact number sizes.

### 6.9 ActiveAlertBanner

Shown on every page (below the top bar, `z-[var(--z-banner)]`) while any alert is SENDING, or SENT and still within its broadcast duration.

```
▌●((pulse)) EN COURS  [▣ PRÉSIDENTIELLE │ 4370]  « Évacuation immédiate des zones… »  37/42 cellules · reste 24:13   [Voir] [Arrêter]
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ progress 2px (scaleX) ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

- `bg-sev-{k}-tint border-b border-sev-{k}-edge/40 text-sev-{k}-fg`, height 48 px, with a 4 px left bar in `sev-{k}-edge`. For Presidential the whole banner uses `bg-sev-presidential text-sev-presidential-on` (solid).
- Message excerpt: one line, truncated, `max-w-[48ch]`, with the full text in the tooltip.
- Countdown `reste mm:ss` in mono tabular, ticking once per second (no animation).
- "Arrêter" (admins only) is an outline button that opens a small confirmation ("Arrêter la diffusion sur 42 cellules ?").
- Several active alerts: show the highest severity, plus "+2 autres" opening a popover list.
- `role="status"`, `aria-live="polite"`; only start and end are announced.

### 6.10 AlertTimeline (recent alerts)

A vertical time rail, not a card list.

```
14:02  ●─┬ [▣ PRÉSIDENTIELLE 4370]  [● En cours 37/42]
         │  « Évacuation immédiate des zones côtières de Kribi… »
         │  42 cellules · A. Djoum                                →
11:40  ●─┼ [△ GRAVE 4375]  [✓ Envoyée]
         │  « Crue du Wouri : … »
HIER ────┼──────────────────────────
18:15  ●─┴ [┆ EXERCICE 4381]  [✓ Envoyée]
```

- Left column `w-14` time in mono `ink-3`. The rail is a 1 px `hairline-strong` line, and nodes are 10 px dots in the **severity edge** colour (the timeline is about what happened, so severity leads). Day separators use `overline` sticky labels.
- The item is a `Link` row: `rounded-md -mx-2 px-2 py-2.5 hover:bg-surface-hover`. The excerpt is 2 lines clamped, `body-sm ink-2`.
- Stagger per 5.2. The empty state is described in 6.12.

### 6.11 CellSiteTile

Props: `{ cell: CellSite; onHealthCheck(id: string): Promise<void>; selected?: boolean }`

```
┌───────────────────────────────────────┐
│ ● Active                 vu il y a 8 s │
│ YDE-Bastos-01                         │  title-3
│ CID 41021 · 10.12.0.21:48049          │  mono ink-3
│ Yaoundé · Centre                      │  body-sm ink-2
│ ─────────────────────────────────────  │
│ [↻ Vérifier]            12 alertes/30j│
└───────────────────────────────────────┘
```

- `rounded-[var(--radius-lg)] border border-hairline bg-surface p-4`, hover `e1`. **Offline**: a `border-l-[3px] border-l-status-failed` left edge, the status label in `failed` fg, and last-seen in `failed` fg ("vu il y a 3 h"). **Maintenance**: `sev-hatch` at 50 % opacity in the header area plus `Wrench`.
- Last-seen: relative time, refreshed every 15 s with the absolute time in the tooltip. Beyond 5 minutes without contact while "active" → show `ink-3` "données anciennes". Never show a confident green on stale data.
- Health check: a ghost `sm` button with `RefreshCw`. While running the icon spins (CSS `animate-spin`, reduced motion shows static text "Vérification…"). On result, show the tile ring flash (5.2) and a sonner toast only on failure.

### 6.12 EmptyState / ErrorState / skeletons

- **EmptyState**: left-aligned (not centred) inside the panel, `py-12`. A 40 px icon in a `size-10 rounded-md bg-surface-sunken` square, title in **Baloo 2 600 18 px**, one sentence `body-sm ink-2`, one action. Copy examples: "Aucune alerte pour ces filtres" + "Réinitialiser les filtres"; "Aucun modèle" + "Créer un modèle". No illustrations, no emoji.
- **ErrorState**: `border border-danger/30 bg-surface` panel, `CircleX` in `danger`, title "Impossible de charger les alertes", the technical detail in a mono `surface-sunken` block (collapsed by default), and a "Réessayer" button. Errors are shown **in place**, never as a full-page takeover, so the rest of the console stays usable during incidents.
- **Skeletons**: shadcn `Skeleton` with `bg-surface-sunken` (light) / `bg-surface-raised` (dark), with a subtle opacity pulse; reduced motion keeps it static. Each skeleton mirrors its component: table skeleton = 8 rows with a 64 px badge block, a 60 % text block and a 56 px pill; KPI skeleton = the instrument panel with number-sized blocks; timeline skeleton = dots plus two lines.

---

## 7. Screens

All page H1s use `title-1` (Baloo 2), with the primary page action right-aligned on the same line.

### 7.1 Login

```
┌──────────────────────────────┬──────────────────────────────────────┐
│  NAVY PANEL (bg-rail)        │  CREAM FIELD                         │
│                              │                                      │
│  ▣ F2G                       │   Connexion                (title-1) │
│                              │   Accès réservé aux opérateurs       │
│  Diffusion d'alertes         │   habilités.                         │
│  d'urgence                   │                                      │
│  (display, rail-ink)         │   Email       [                    ] │
│  ━━━ (48px orange rule)      │   Mot de passe[             (eye)] │
│                              │   [ Se connecter            ] (lg)   │
│  République du Cameroun ·    │                                      │
│  Cell Broadcast CMAS/ETWS    │   Problème d'accès ? Contactez       │
│                              │   l'administrateur système.          │
│  F2G Laboratory | Confidential│                                     │
└──────────────────────────────┴──────────────────────────────────────┘
      md:w-[44%]                            form max-w-[380px]
```

- Split layout, left-aligned. The only other place where orange appears is the 48×3 px rule on navy.
- Mobile: the navy panel shrinks to an 88 px header with the logo only.
- Errors: inline under the form (`danger`), with no toast. Lockout message after 5 attempts.
- No marketing copy, no illustrations, no background imagery.

### 7.2 Dashboard

```
Tableau de bord                                   [ + Nouvelle alerte ] (primary)
Mardi 29 septembre · 14:02 WAT (body-sm ink-3)

[ActiveAlertBanner if any — global]

┌ KPI instrument panel (col-span-12) ─────────────────────────────────────────┐
└──────────────────────────────────────────────────────────────────────────────┘
┌ Alertes récentes · AlertTimeline (col-span-8) ─┐ ┌ Réseau (col-span-4) ─────┐
│                                                │ │ 118 actives / 124        │
│                                                │ │ ● 118  ● 3 hors ligne    │
│                                                │ │ ○ 3 maintenance          │
│                                                │ │ ┌ cell matrix ─────────┐ │
│                                                │ │ │ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪ │ │
│                                                │ │ │ ▪▪▪▪▪▪▪▫▪▪▪▪▪▪▪▪▪▪▪▪ │ │
│                                                │ │ └──────────────────────┘ │
│                                                │ │ Hors ligne               │
│                                                │ │  YDE-Mvan-03  il y a 3 h │
│ Voir toutes les alertes →                      │ │ Voir les cellules →      │
└────────────────────────────────────────────────┘ └──────────────────────────┘
```

- **Cell matrix**: one 8 px square per cell (`rounded-[2px]`, `gap-1`, `grid-cols-[repeat(auto-fill,8px)]`), coloured by status dot colour, hatched for maintenance. Hover shows a tooltip with the name and last-seen; click opens the cell. It is dense, honest and memorable, and replaces three separate "cells" KPIs.
- Quick templates: a compact row under the timeline listing the 4 most-used templates as `outline sm` buttons with a SeverityBadge (sm).
- There is no "welcome" hero.

### 7.3 Alert list

```
Alertes                                                   [ + Nouvelle alerte ]
┌ Filtres (sticky under top bar) ──────────────────────────────────────────────┐
│ [Search ID / texte…] [Statut ▾] [Classe ▾] [Période ▾] [Opérateur ▾]  Réinit.│
│ chips: ×Échec ×Présidentielle                                                │
└──────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────┐
│ ID       CLASSE               MESSAGE                   CELL.  STATUT    DATE  ⋯ │
│ #A-0412  [▣ PRÉS. │ 4370]     Évacuation immédiate…       42  ● En cours 14:02 ⋯ │
│ #A-0411  [△ GRAVE │ 4375]     Crue du Wouri…              18  ✓ Envoyée  11:40 ⋯ │
├──────────────────────────────────────────────────────────────────────────────┤
│ 1–25 sur 1 284            [25 ▾]              ‹ 1 2 3 … 52 ›                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Filters sync to the URL search params (shareable during incidents). Filter state has a visible count ("3 filtres").
- Columns: ID (mono), Classe (SeverityBadge tint sm), Message (1 line truncated, `max-w-[44ch]`), Cellules (right, tabular), Statut (pill), Date (relative, absolute in tooltip), row actions `DropdownMenu` (`Ellipsis`): Voir, Dupliquer, Enregistrer comme modèle, Annuler (only SCHEDULED, `danger`).
- Default sort: FAILED and SENDING pinned on top, then date descending.
- Row click opens the detail page. Selected row: `bg-primary-tint`.
- Mobile (<768 px): rows become 2-line stacked items (badge + pill on line 1, message on line 2); the table header is hidden.

### 7.4 New alert composer (core flow)

Single page, **not** a multi-page wizard: the operator sees everything. Steps are sections with a sticky step index on the left and the handset preview sticky on the right.

```
Nouvelle alerte                             [Charger un modèle ▾]  Brouillon enregistré 14:01
┌ steps (lg:col-span-2, sticky) ┐┌ form (lg:col-span-6) ─────────────┐┌ preview (lg:col-span-4, sticky top-20) ┐
│ ① Classe          ✓           ││ ① Classe d'alerte                 ││      ┌──────────────┐                  │
│ ② Message         ✓           ││   AlertClassPicker                ││      │  phone frame │                  │
│ ③ Cellules        42          ││ ② Message                         ││      │   popup      │                  │
│ ④ Durée & envoi   30 min      ││   MessageComposer                 ││      └──────────────┘                  │
│ ⑤ Vérification                ││ ③ Cellules ciblées                ││  [Android | iOS]                       │
│                               ││   CellTargetSelector              ││  Aperçu indicatif…                     │
│                               ││ ④ Durée et programmation          ││  ┌ Récapitulatif ────────────┐        │
│                               ││   Durée: [slider 60 s … 24 h]     ││  │ Classe  PRÉS 4370         │        │
│                               ││   presets: 5 min · 30 min · 1 h · ││  │ Cellules 42 · Encod. GSM-7│        │
│                               ││            6 h · 24 h  [__ min]   ││  │ Durée 30 min · Immédiat   │        │
│                               ││   Envoi: (•) Immédiat ( ) Programmé│ │  └───────────────────────────┘        │
│                               ││          [date] [heure] WAT        ││  [ Vérifier et diffuser ] (lg, full)  │
└───────────────────────────────┘└───────────────────────────────────┘└────────────────────────────────────────┘
```

- Step index: numbers in mono inside `size-6 rounded-full border`; completed steps show a `Check` in `sent` fg with a one-line summary; invalid steps show a `danger` dot. Clicking scrolls to the section (`scroll-mt-20`).
- **Duration**: a `Slider` on a non-linear scale (log-like stops: 60 s, 5 min, 15 min, 30 min, 1 h, 3 h, 6 h, 12 h, 24 h), preset `ToggleGroup` chips, and an exact input in minutes. Values are always displayed as `30 min` / `2 h 30` in mono. Min 60 s, max 86 400 s, enforced by zod.
- **Schedule**: `Popover` + `Calendar` + time input. The timezone is shown explicitly as `WAT (UTC+1)`. Past times are rejected inline.
- The **primary action** "Vérifier et diffuser" lives under the preview (and in a sticky bottom bar on mobile). It is **disabled with a reason tooltip** until the class, a message within limits and at least 1 cell are provided. Clicking opens SendConfirmation. The button colour is neutral primary; the severity colour appears only inside the confirmation.
- Secondary actions: "Enregistrer le brouillon" (ghost). Autosave to the server every 10 s and on blur, with the "Brouillon enregistré 14:01" indicator in `ink-3`.
- Leaving with unsaved changes → confirm dialog.
- Mobile: a single column; the preview becomes a `Tabs` switch "Formulaire | Aperçu" at the top plus a sticky bottom bar with the counter and the primary action.
- Scheduling a Presidential alert still requires the type-to-confirm step.

### 7.5 Alert detail

```
‹ Alertes   #A-0412                                   [Dupliquer] [Arrêter] (if active)
[▣ PRÉSIDENTIELLE │ 4370]  [● En cours 37/42]   créée par A. Djoum · 14:02:31

┌ Message (col-span-8) ─────────────────────────┐ ┌ Aperçu (col-span-4) ──┐
│ full text, message 16/26                       │ │ HandsetAlertPreview   │
│ GSM-7 · 3 pages · 247 car.                     │ │ (static, scale .85)   │
└────────────────────────────────────────────────┘ └───────────────────────┘
┌ Diffusion ────────────────────────────────────────────────────────────────┐
│ 37 envoyées · 3 en attente · 2 échecs   ████████████████████▓▓▒  (stacked)│
│ Durée 30 min · reste 24:13 · Début 14:02:31 · Fin prévue 14:32:31         │
└────────────────────────────────────────────────────────────────────────────┘
┌ Journal par cellule ─────────────── [Tous ▾] [Relancer les échecs] ───────┐
│ CELLULE          CID     STATUT        HEURE      DÉTAIL                   │
│ YDE-Bastos-01    41021   ✓ Envoyée     14:02:33   WRITE-REPLACE OK         │
│ DLA-Akwa-07      52007   ✕ Échec       14:02:40   Timeout SBc-AP (5 s)     │
└────────────────────────────────────────────────────────────────────────────┘
┌ Historique (audit log, mono timestamps) ───────────────────────────────────┐
```

- The per-cell log shows failures first; the failed row detail is in mono. "Relancer les échecs" appears only with ≥ 1 failure and the right role.
- While SENDING, the log rows update in place (no re-stagger); new status changes flash the row background `primary-tint` for 600 ms.
- The audit log is a compact list with mono timestamps (`14:02:31.482`) and actor names.

### 7.6 Templates gallery

- Grid `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`, but tiles are **grouped by severity** in sections (Présidentielle, Extrême, Grave, AMBER, ETWS, Tests), each with an `overline` header and count. This is a library, not a card wall.
- Template tile: a 3 px top edge in `sev-{k}-edge`, the name in `title-3`, SeverityBadge (sm), a 3-line message excerpt in `body-sm ink-2` with GSM-7/UCS-2 and page count in mono at the bottom, and the default duration. Actions: "Utiliser" (outline, opens the composer prefilled) and a `⋯` menu (Modifier, Dupliquer, Désactiver).
- Inactive templates: `opacity-60` plus a "Désactivé" pill, filtered out by default.
- Search plus a class filter at the top. Empty state per 6.12.

### 7.7 Cell sites

```
Cellules                                             [↻ Vérifier tout] (outline)
118 actives · 3 hors ligne · 3 maintenance  (dot legend, tabular)
[Search…] [Région ▾] [Statut ▾]                         [Grille | Liste]
Région Centre (18) ───────────────────────────────────────────────────────
[CellSiteTile][CellSiteTile][CellSiteTile][CellSiteTile]
Région Littoral (24) ─────────────────────────────────────────────────────
...
```

- Grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3`, grouped by region, with offline tiles sorted first within each group.
- The list view uses the standard table, which is better for more than 100 cells.
- "Vérifier tout" runs checks with a concurrency of 5 and shows inline progress `12/124` next to the button (no modal).
- Admins get "Ajouter une cellule" (Sheet from the right, form with IP/port validation).

### 7.8 Settings

- Left sub-nav (`w-56`, sticky) plus a content column `max-w-[720px]`. Sections: Profil, Apparence (theme: Système/Clair/Sombre as a segmented control; density: Confortable/Compact), Connexion CBC (endpoint, timeout, test button with inline result), Utilisateurs et rôles (admin), Valeurs par défaut (default duration, default language FR+EN), Sécurité (session timeout, the type-to-confirm phrase is **read-only** and shown for transparency).
- Each section is a panel with a `title-2` header, a description in `body-sm ink-3`, and fields in a 2-column label/control layout on lg (`grid-cols-[220px_1fr]`).
- Save per section with a sticky "Modifications non enregistrées" bar at the bottom of the section when dirty.

---

## 8. Tailwind v4 implementation

### 8.1 Fonts (`app/layout.tsx`)

```tsx
import { Baloo_2, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
const display = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-baloo", display: "swap" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-plex-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono", display: "swap" });
// <html lang="fr" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
// <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
```

Remove every Geist import and variable.

### 8.2 `globals.css` (replaces the current token block)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* structure */
  --canvas: #FAF6F0; --surface: #FFFFFF; --surface-raised: #FFFFFF; --surface-sunken: #F2EDE4; --surface-hover: #F6F1E9;
  --hairline: #E3DCD0; --hairline-strong: #D6CDBE; --control-border: #8C8373;
  --ink: #0E1A30; --ink-2: #3B4760; --ink-3: #5A6478; --ink-disabled: #9AA1AE;
  --primary: #1F3864; --primary-fg: #FAF6F0; --primary-tint: #E8EDF6; --link: #1F3864;
  --focus: #2E62D9; --danger: #B42318; --danger-tint: #FDECEA;
  /* brand / rail */
  --rail: #13223F; --rail-item-active: #1C2E52; --rail-ink: #F3EEE6; --rail-ink-2: #A9B6CF;
  --brand-orange: #EC8236; --brand-navy: #1F3864;
  /* severity: solid / on / tint / fg / edge */
  --sev-presidential: #9D174D; --sev-presidential-on: #FFFFFF; --sev-presidential-tint: #FCE7F1; --sev-presidential-fg: #831843; --sev-presidential-edge: #9D174D;
  --sev-extreme: #B91C1C;      --sev-extreme-on: #FFFFFF;      --sev-extreme-tint: #FDECEA;      --sev-extreme-fg: #991B1B;      --sev-extreme-edge: #B91C1C;
  --sev-severe: #E9B516;       --sev-severe-on: #1F1600;       --sev-severe-tint: #FCF3D5;       --sev-severe-fg: #7A5200;       --sev-severe-edge: #9A7400;
  --sev-amber: #0F766E;        --sev-amber-on: #FFFFFF;        --sev-amber-tint: #DDF3F0;        --sev-amber-fg: #0B5A53;        --sev-amber-edge: #0F766E;
  --sev-etws: #1D4ED8;         --sev-etws-on: #FFFFFF;         --sev-etws-tint: #E5ECFD;         --sev-etws-fg: #1E3A8A;         --sev-etws-edge: #1D4ED8;
  --sev-test: #4B5567;         --sev-test-on: #FFFFFF;         --sev-test-tint: #ECEEF2;         --sev-test-fg: #3A4456;         --sev-test-edge: #4B5567;
  /* status dots + pill tints */
  --st-draft: #7A8394; --st-scheduled: #1F3864; --st-sending: #2563EB; --st-sent: #15803D; --st-failed: #C81E1E; --st-cancelled: #7A8394;
  --st-sent-tint: #E3F4E8; --st-sent-fg: #166534; --st-failed-tint: #FDECEA; --st-failed-fg: #991B1B; --st-scheduled-tint: #E8EDF6; --st-scheduled-fg: #1F3864;
  /* elevation */
  --shadow-e1: 0 1px 2px rgb(14 26 48 / .06), 0 1px 0 rgb(14 26 48 / .03);
  --shadow-e2: 0 8px 24px -6px rgb(14 26 48 / .14), 0 2px 6px -2px rgb(14 26 48 / .08);
  --shadow-e3: 0 24px 64px -12px rgb(14 26 48 / .28);
  /* z */
  --z-sticky: 20; --z-banner: 25; --z-rail: 30; --z-popover: 40; --z-overlay: 50; --z-dialog: 60; --z-toast: 70; --z-palette: 80;
  --radius: 0.75rem; /* 12px = lg */

  /* shadcn contract (consumed by components/ui) */
  --background: var(--canvas); --foreground: var(--ink);
  --card: var(--surface); --card-foreground: var(--ink);
  --popover: var(--surface-raised); --popover-foreground: var(--ink);
  --primary-foreground: var(--primary-fg);
  --secondary: var(--surface-sunken); --secondary-foreground: var(--ink);
  --muted: var(--surface-sunken); --muted-foreground: var(--ink-3);
  --accent: var(--surface-hover); --accent-foreground: var(--ink);
  --destructive: var(--danger);
  --border: var(--hairline); --input: var(--control-border); --ring: var(--focus);
  --sidebar: var(--rail); --sidebar-foreground: var(--rail-ink); --sidebar-primary: var(--brand-orange); --sidebar-primary-foreground: var(--rail);
  --sidebar-accent: var(--rail-item-active); --sidebar-accent-foreground: var(--rail-ink); --sidebar-border: rgb(0 0 0 / .2); --sidebar-ring: var(--focus);
  --chart-1: var(--st-sent); --chart-2: var(--st-scheduled); --chart-3: var(--st-draft); --chart-4: var(--st-failed); --chart-5: var(--ink-2);
}

.dark {
  --canvas: #0A1120; --surface: #111A2C; --surface-raised: #182338; --surface-sunken: #0D1526; --surface-hover: #16203A;
  --hairline: #1F2B44; --hairline-strong: #263555; --control-border: #58688A;
  --ink: #F3EEE6; --ink-2: #B4BDCD; --ink-3: #8A96AB; --ink-disabled: #5B667A;
  --primary: #F3EEE6; --primary-fg: #0E1A30; --primary-tint: #17233D; --link: #A9BCE6;
  --focus: #7FA6FF; --danger: #F97066; --danger-tint: #2A1111;
  --rail: #0D1830; --rail-item-active: #16264A;
  --sev-presidential: #B0135A; --sev-presidential-tint: #2A0D1C; --sev-presidential-fg: #F9A8D4; --sev-presidential-edge: #F0529C;
  --sev-extreme: #C62828;      --sev-extreme-tint: #2A1111;      --sev-extreme-fg: #FCA5A5;      --sev-extreme-edge: #EF4444;
  --sev-severe: #F0C232;       --sev-severe-tint: #262010;       --sev-severe-fg: #F5D36A;       --sev-severe-edge: #F0C232;
  --sev-amber: #2DD4BF;        --sev-amber-on: #04201D; --sev-amber-tint: #0B2926; --sev-amber-fg: #6EE7D6; --sev-amber-edge: #2DD4BF;
  --sev-etws: #2563EB;         --sev-etws-tint: #0F1D3D;         --sev-etws-fg: #A5BFFF;         --sev-etws-edge: #3B82F6;
  --sev-test: #5B667A;         --sev-test-tint: #1A2233;         --sev-test-fg: #C4CCD9;         --sev-test-edge: #8A96AB;
  --st-draft: #7C879B; --st-scheduled: #9DB1D9; --st-sending: #60A5FA; --st-sent: #4ADE80; --st-failed: #F87171; --st-cancelled: #7C879B;
  --st-sent-tint: #0F2A1B; --st-sent-fg: #86EFAC; --st-failed-tint: #2A1111; --st-failed-fg: #FCA5A5; --st-scheduled-tint: #17233D; --st-scheduled-fg: #C7D3EC;
  --shadow-e1: inset 0 1px 0 rgb(255 255 255 / .04);
  --shadow-e2: 0 12px 32px -8px rgb(0 0 0 / .55), inset 0 1px 0 rgb(255 255 255 / .05);
  --shadow-e3: 0 28px 72px -12px rgb(0 0 0 / .7), inset 0 1px 0 rgb(255 255 255 / .06);
}

@theme inline {
  --font-display: var(--font-baloo), ui-rounded, system-ui, sans-serif;
  --font-sans: var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
  --font-device: system-ui, -apple-system, "Segoe UI", sans-serif;

  --color-canvas: var(--canvas); --color-surface: var(--surface); --color-surface-raised: var(--surface-raised);
  --color-surface-sunken: var(--surface-sunken); --color-surface-hover: var(--surface-hover);
  --color-hairline: var(--hairline); --color-hairline-strong: var(--hairline-strong); --color-control-border: var(--control-border);
  --color-ink: var(--ink); --color-ink-2: var(--ink-2); --color-ink-3: var(--ink-3); --color-ink-disabled: var(--ink-disabled);
  --color-primary-tint: var(--primary-tint); --color-link: var(--link); --color-focus: var(--focus);
  --color-danger: var(--danger); --color-danger-tint: var(--danger-tint);
  --color-rail: var(--rail); --color-rail-item-active: var(--rail-item-active); --color-rail-ink: var(--rail-ink); --color-rail-ink-2: var(--rail-ink-2);
  --color-brand-orange: var(--brand-orange); --color-brand-navy: var(--brand-navy);
  /* severity: bg-sev-extreme, text-sev-extreme-on, bg-sev-extreme-tint, text-sev-extreme-fg, border-sev-extreme-edge … */
  --color-sev-presidential: var(--sev-presidential); --color-sev-presidential-on: var(--sev-presidential-on); --color-sev-presidential-tint: var(--sev-presidential-tint); --color-sev-presidential-fg: var(--sev-presidential-fg); --color-sev-presidential-edge: var(--sev-presidential-edge);
  --color-sev-extreme: var(--sev-extreme); --color-sev-extreme-on: var(--sev-extreme-on); --color-sev-extreme-tint: var(--sev-extreme-tint); --color-sev-extreme-fg: var(--sev-extreme-fg); --color-sev-extreme-edge: var(--sev-extreme-edge);
  --color-sev-severe: var(--sev-severe); --color-sev-severe-on: var(--sev-severe-on); --color-sev-severe-tint: var(--sev-severe-tint); --color-sev-severe-fg: var(--sev-severe-fg); --color-sev-severe-edge: var(--sev-severe-edge);
  --color-sev-amber: var(--sev-amber); --color-sev-amber-on: var(--sev-amber-on); --color-sev-amber-tint: var(--sev-amber-tint); --color-sev-amber-fg: var(--sev-amber-fg); --color-sev-amber-edge: var(--sev-amber-edge);
  --color-sev-etws: var(--sev-etws); --color-sev-etws-on: var(--sev-etws-on); --color-sev-etws-tint: var(--sev-etws-tint); --color-sev-etws-fg: var(--sev-etws-fg); --color-sev-etws-edge: var(--sev-etws-edge);
  --color-sev-test: var(--sev-test); --color-sev-test-on: var(--sev-test-on); --color-sev-test-tint: var(--sev-test-tint); --color-sev-test-fg: var(--sev-test-fg); --color-sev-test-edge: var(--sev-test-edge);
  --color-st-draft: var(--st-draft); --color-st-scheduled: var(--st-scheduled); --color-st-sending: var(--st-sending);
  --color-st-sent: var(--st-sent); --color-st-failed: var(--st-failed); --color-st-cancelled: var(--st-cancelled);
  --color-st-sent-tint: var(--st-sent-tint); --color-st-sent-fg: var(--st-sent-fg); --color-st-failed-tint: var(--st-failed-tint);
  --color-st-failed-fg: var(--st-failed-fg); --color-st-scheduled-tint: var(--st-scheduled-tint); --color-st-scheduled-fg: var(--st-scheduled-fg);

  /* shadcn mapping */
  --color-background: var(--background); --color-foreground: var(--foreground);
  --color-card: var(--card); --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover); --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary); --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary); --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted); --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent); --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive); --color-border: var(--border); --color-input: var(--input); --color-ring: var(--ring);
  --color-sidebar: var(--sidebar); --color-sidebar-foreground: var(--sidebar-foreground); --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground); --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground); --color-sidebar-border: var(--sidebar-border); --color-sidebar-ring: var(--sidebar-ring);
  --color-chart-1: var(--chart-1); --color-chart-2: var(--chart-2); --color-chart-3: var(--chart-3); --color-chart-4: var(--chart-4); --color-chart-5: var(--chart-5);

  --radius-xs: 4px; --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-device: 44px;
  --shadow-e1: var(--shadow-e1); --shadow-e2: var(--shadow-e2); --shadow-e3: var(--shadow-e3);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1); --ease-emphasized: cubic-bezier(0.32, 0.72, 0, 1);
}

@layer base {
  * { @apply border-hairline; }
  html { font-feature-settings: "ss02" 0; }
  body { @apply bg-canvas text-ink font-sans antialiased; font-size: 14px; line-height: 22px; }
  :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
  .tnum { font-variant-numeric: tabular-nums slashed-zero; }
}

@layer components {
  .sev-hatch { background-image: repeating-linear-gradient(135deg, var(--sev-test-tint) 0 6px, transparent 6px 12px); }
  .status-pulse { position: relative; }
  .status-pulse::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: currentColor;
    animation: status-pulse 1.6s cubic-bezier(0, 0, .2, 1) infinite; }
  @keyframes status-pulse { from { transform: scale(1); opacity: .5; } to { transform: scale(2.4); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .status-pulse::after { animation: none; transform: none; opacity: 1; background: transparent; box-shadow: 0 0 0 2px currentColor; }
    .animate-spin, .animate-pulse { animation: none; }
  }
}
```

Notes:
- next/font sets `--font-baloo`, `--font-plex-sans` and `--font-plex-mono` on `<html>`. The `@theme inline` block maps them to `--font-display`, `--font-sans` and `--font-mono` under different names on purpose, to avoid a self-referencing variable.
- Severity classes are built from a static map in `lib/alert-classes.ts` (for example `sevClass.presidential.tint = "bg-sev-presidential-tint text-sev-presidential-fg ring-sev-presidential-edge/35"`). **Never build class names with string interpolation** (`bg-sev-${k}`), because Tailwind v4's scanner will not see them.
- The shadcn `Button` variants to add or override (in `components/ui/button.tsx` via cva): `default` = `bg-primary text-primary-foreground hover:bg-primary/90`, `outline` = `border border-control-border bg-surface hover:bg-surface-hover`, `ghost`, `danger-outline` = `border border-danger/40 text-danger hover:bg-danger-tint`, and `size: { sm: "h-8 px-3", md: "h-9 px-3.5", lg: "h-11 px-5 text-[15px]" }`, all `rounded-[var(--radius-sm)] font-medium`. Severity send buttons are **not** cva variants; SendConfirmation composes them from the static severity map.
- Sonner: `<Toaster position="bottom-right" closeButton toastOptions={{ classNames: { toast: "bg-surface-raised text-ink border border-hairline shadow-e2 rounded-[var(--radius-lg)]", description: "text-ink-2" } }} />`. Do not use `richColors`, which would introduce off-palette greens and reds. Error toasts get a left 3 px `danger` bar via `classNames.error`.

---

## 9. Implementer watch-list

1. **Fix the message-ID table in `src/src/types/index.ts`.** It currently maps AMBER→4375, RMT→4376, Exercise→4377 and "Operator"→4378, which contradicts TS 23.041 (AMBER 4379, RMT 4380, Exercise 4381; 4373–4378 Severe). It also uses `purple-700`. Replace `MESSAGE_IDS` and `ALERT_COLORS` with `lib/alert-classes.ts` and check that the backend uses the same IDs.
2. **1395 is only the GSM-7 limit.** UCS-2 allows 615. Common French characters (`ê ç ô ’`) silently trigger UCS-2. Cover `lib/cbs-encoding.ts` with vitest tests (extension-table double counting, page maths, conversion).
3. **Brand orange never enters the content field** (it fails contrast on cream at 2.50:1). Severe is gold and needs its `edge` ring on light backgrounds.
4. **Send path**: mutation first, animation never awaited, no timers, and the palette cannot send.
5. **Status is a dot, severity is a field.** Do not colour whole rows by status.
6. **Remove** Geist, `richColors`, shimmer/ripple/shine/beam usage and raw palette classes (`bg-red-600`, `text-gray-*`).
7. **Stale data is not green.** NetworkStatus and CellSiteTile must degrade to "unknown" when polling fails or last-seen is older than 5 minutes.
8. The training-environment ribbon must be impossible to miss whenever the build is not production.
