# F2G CMAS Hub: handoff to Kiro (deployment + remaining work)

> Written 2026-09-29 by Claude Code (session "refactoring frontend CMAS Hub").
> Owner: Arnaud DJOUM (F2G). Language: French for UI and user-facing reports.
> Read this file completely before touching anything.

---

## 1. What the product is

F2G CMAS Hub is a web console that lets authorities compose and broadcast **national emergency Cell Broadcast alerts** (CMAS/ETWS, 3GPP TS 23.041) to phones in Cameroon, through the F2G 4G lab: Open5GS + srsRAN eNodeB on a bladeRF xA4, Band 3.

**Safety first:**
- A real send (`POST /alerts/{id}/send`) makes the backend SSH into the eNodeBs and write the SIB12/SIB11 config. That is **a real radio broadcast on the lab**.
- Never click "Diffuser" or call `/send` in a test unless Arnaud has explicitly asked for a live test.

---

## 2. Where everything is

| Item | Path / value |
|---|---|
| Project root | `/home/f2g/F2G_CMAS_HUB/` |
| Frontend (Next.js 16, own git repo) | `/home/f2g/F2G_CMAS_HUB/src/` |
| Frontend source | `/home/f2g/F2G_CMAS_HUB/src/src/` |
| Backend (FastAPI, own git repo) | `/home/f2g/F2G_CMAS_HUB/backend/` |
| Design system (**source of truth for UI**) | `/home/f2g/F2G_CMAS_HUB/docs/DESIGN.md` (read the "Berry × F2G" note at the top first) |
| Widget-grid review (dashboard plan) | `/home/f2g/F2G_CMAS_HUB/docs/candidates/draggable-widget-grid-review.md` |
| Original brief | `/home/f2g/F2G_CMAS_HUB/REFACTORING-CONTEXT.md`. **Warning:** its message-ID table and its `Alert` type are wrong; see §5. |
| Deploy/verify script | `/home/f2g/F2G_CMAS_HUB/scripts/deploy.sh` |
| Kiro steering for this project | `/home/f2g/F2G_CMAS_HUB/.kiro/steering/cmas-hub.md` |
| SQLite DB (dev) | `backend/cmas_hub.db` (backup: `backend/cmas_hub.db.bak-20260929`) |
| Vercel project | `src/.vercel/project.json` (projectName `src`, projectId `prj_dTtYtycHgx7KSt4EiVZmIP1DNaIt`) |
| Local URLs | Frontend http://localhost:3001 · API http://localhost:8000 · Swagger http://localhost:8000/api/v1/docs |
| Dev login | `admin@f2g.cm` / `admin123` (**dev seed only**) |

---

## 3. Git state (single monorepo)

Since 2026-09-29 the project is **one private repository**: `rush-limitless/f2g-cmas-hub` (https://github.com/rush-limitless/f2g-cmas-hub). The git root is `/home/f2g/F2G_CMAS_HUB/`; the frontend lives in `src/` and the backend in `backend/`, with their full commit history preserved under those paths.

| Branch | Content |
|---|---|
| `main` | Baseline: original frontend `main` + backend `master`. |
| `develop` | Current work: frontend refactor (typed API, Berry × F2G shell, composer, English login) + backend message-ID fix (AMBER 4379, monthly test 4380). |

The former repos `f2g-cmas-hub-web` and `f2g-cmas-hub-api` are **archived** (read-only). Do not push to them and do not create new per-part repos. The old local `.git` folders are kept in `/home/f2g/F2G_CMAS_HUB.git-backup-20260929/`.

Rules (from Arnaud's CLAUDE.md):
- Never push to `main`/`master` without a PR.
- Use `git push -u` for new branches.
- No `git reset --hard` or `git push --force` without explicit confirmation.
- Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`).

**B1 (resolved 2026-09-29):** single private repo `rush-limitless/f2g-cmas-hub`. Never make it public: the code references lab IPs.

---

## 4. What is done (verified)

Frontend (`src/`, branch `develop`):
- **API layer.** Types are generated from the live OpenAPI spec (`pnpm gen:api` → `src/types/api.gen.ts`; domain aliases in `src/types/domain.ts`). The fetch client (`src/lib/api/client.ts`) adds the JWT, signs out on 401 and parses FastAPI errors. Endpoints live in `src/lib/api/endpoints.ts`.
- **React Query hooks** (`src/hooks/`):
  - `use-alerts.ts`: list, detail, create, update, delete, send and cancel; polls while SENDING.
  - `use-network.ts`: stats, templates, cells (15 s poll), health check.
  - `use-session.ts`, plus the Zustand persisted session in `src/lib/stores/session-store.ts`.
- **3GPP core** (`src/lib/cmas/`):
  - `alert-classes.ts`: 10 classes with correct IDs, FR labels and confirm levels.
  - `cbs-encoding.ts`: GSM-7 93 chars per page, UCS-2 41 chars per page, 15 pages max.
  - `composer-utils.ts`: durations, GSM-7 conversion of French typography, grouping of cells by city prefix.
  - `severity-styles.ts`: static Tailwind classes. Never interpolate class names.
- **Tests**: 31 vitest tests (`pnpm test`), all green.
- **Theme**: `src/app/globals.css` holds the DESIGN.md tokens plus the Berry tokens (`--well`, `--shell`, `--orange-deep`, `--orange-tint`, `--navy-tint`…). Fonts are Baloo 2 / IBM Plex Sans / Plex Mono via next/font. Light and dark via next-themes.
- **Shell (Berry × F2G)**: `src/components/shell/`, made of:
  - a white sidebar with a network card;
  - a header with search, active-alerts bell and avatar menu (theme, sign out);
  - a rounded grey content well;
  - the **training ribbon**, shown whenever `NEXT_PUBLIC_ENV !== "production"`;
  - `SessionGate` for the client-side guard.
- **Login**: `src/app/(auth)/login/page.tsx` + `src/components/auth/login-form.tsx`. Berry centred card, safe `?next=` redirect.
- **Dashboard (interim)**: `src/app/(dashboard)/page.tsx`, with a KPI instrument panel, a severity timeline and a cell matrix. It shows "—" when there are no deliveries; the backend returns 100 % in that case.
- **Composer**: `src/app/(dashboard)/alerts/new/page.tsx` + `src/components/composer/*`:
  - class picker;
  - message composer with page meter and undoable UCS-2→GSM-7 conversion;
  - cell selector grouped by city (offline cells are not selectable, because the backend rejects them);
  - duration slider;
  - Android/iOS handset preview;
  - `SendConfirmation` at 3 levels: light / checkbox / type `DIFFUSION NATIONALE` for Presidential;
  - create-then-send with inline error recovery;
  - `?template=<id>` prefill.
  - Verified in Chrome up to the confirmation dialog (not sent).
- Old magicui components (beam, bento, etc.) are being phased out. `components/magicui/*` is still used by the old templates page.

Backend (`backend/`, branch `develop`):
- Seed templates are corrected: AMBER 4375→**4379** and monthly test 4376→**4380**, per TS 23.041.
- The two affected rows in the dev DB are updated.
- 25/25 pytest pass.
- 4 old draft alerts still carry 4375/4376. Those are history; leave them.

---

## 5. Facts you must not get wrong

- **Message IDs (TS 23.041):**
  - Presidential 4370, no opt-out;
  - Extreme 4371–4372;
  - Severe 4373–4378;
  - **AMBER 4379**;
  - **Required Monthly Test 4380**;
  - **Exercise 4381**;
  - ETWS Earthquake 4352, Tsunami 4353, Earthquake+Tsunami 4354, Test 4355.
  - The only source in code is `src/src/lib/cmas/alert-classes.ts`.
  - `src/src/types/index.ts` (old) is WRONG; delete it once no page imports it.
- **The API `Alert` has no `title` and no `severity`.** Severity is derived from `message_id`. Use `src/types/domain.ts`, never hand-written types.
- **UCS-2 limit is 615 characters, not 1395.** Any `ê â î ô û ç œ ’ « » …` switches the whole message to UCS-2.
- **The backend has no scheduler.** A `scheduled_at` alert stays SCHEDULED forever, which is why the composer disables "Programmé".
- **The backend refuses offline cells** (HTTP 400).
- **Design rules** (DESIGN.md):
  - no brand orange `#EC8236` as text or background inside content; it is decoration only, and `#B85418` is used for orange cards with white text;
  - severity colours only for alerts;
  - status is a dot;
  - no shimmer/ripple/beam/glass;
  - no raw Tailwind palette classes (`bg-blue-500`…);
  - sonner without `richColors`.
- **Send path:** the mutation is dispatched first; no timers, no animation before a send.
- **Framer Motion:** the app uses `<LazyMotion features={domAnimation} strict>`. Use `m.*`, **never `motion.*`**, because that throws at runtime. Drag/layout needs `domMax` loaded locally.
- **Tailwind v4:** static class strings only.
- **Next.js 16:**
  - read `src/node_modules/next/dist/docs/` before using an API;
  - `params`/`searchParams` are async;
  - `middleware` is renamed `proxy`;
  - `useSearchParams` needs `<Suspense>`.
- **Base UI (not Radix):** triggers take `render={<Link …/>}`, not `asChild`. Use `LinkButton` (`src/components/shared/link-button.tsx`) for link-buttons.

---

## 6. Remaining work, in order (progress ≈ 62 %)

Always run `pnpm typecheck && pnpm lint && pnpm test` and look at the page in the browser before each commit. Show Arnaud screenshots and a progress table (per-phase % plus overall %) at every step.

### Phase 4: dashboard, alert list, alert detail (15 %, 25 % done)

1. **Dashboard as a Berry widget grid**, per `docs/candidates/draggable-widget-grid-review.md`. The component source is the 21st.dev `DraggableWidgetGrid` that Arnaud pasted. Rewrite it to `m.*` from `framer-motion` and remove its internal `MotionConfig`.
   - Step 1 is non-editable (`editable={false}`). The 9 widgets, all real API data:
     - `hero-sent` (wide, navy card #1F3864 with decorative circles);
     - `hero-cells` (wide, orange card #B85418);
     - `alerts-by-month` (lg, recharts stacked bars by class, computed client-side from `/alerts?limit=100`);
     - `recent-alerts` (tall);
     - `cell-matrix` (tall);
     - `success-rate`, `today`, `failures`, `scheduled-queue` (sm).
   - Step 2 adds a "Personnaliser" toggle with reorder only, `localStorage` key `cmas.dashboard.layout.v1:<userId>` and a reset button. It auto-exits edit mode when an alert is SENDING, and editing is disabled below `md`.
   - Check the 21st.dev licence before copying.
2. **Alert list** `src/app/(dashboard)/alerts/page.tsx` (replace the old page):
   - filters synced to the URL (`status`, `alert_type`, `q`, `page`);
   - table columns: ID mono, SeverityBadge, message 1 line, cell count, AlertStatusPill, relative date, row menu with Voir / Dupliquer / Annuler (SCHEDULED only);
   - FAILED and SENDING pinned first; pagination from `pagination`;
   - on mobile, 2-line rows.
3. **Alert detail** `src/app/(dashboard)/alerts/[id]/page.tsx` (new; `params` is a Promise, so use `React.use(params)` in a client page):
   - header with badge, pill and creator;
   - message and a static `HandsetPreview`;
   - delivery stacked bar;
   - per-cell log from `cells[]` (failures first);
   - audit log from `logs[]` in mono timestamps;
   - actions: Dupliquer (→ `/alerts/new?template=` is not enough, so add `?from=<alertId>` prefill), Envoyer (DRAFT → reuse `SendConfirmation`), Annuler (SCHEDULED).
4. **ActiveAlertBanner** (DESIGN.md §6.9) in `AppShell`, shown while any alert is SENDING.

### Phase 5: templates and cells (10 %)

5. **Templates gallery** `src/app/(dashboard)/templates/page.tsx` (replace the old page, then delete `components/magicui/*`):
   - sections grouped by severity;
   - each tile has a 3 px severity top edge, a badge, a 3-line excerpt, the GSM-7/UCS-2 page count and the default duration;
   - "Utiliser" → `/alerts/new?template=<id>`;
   - admin create/edit dialog using `MessageComposer`.
6. **Cells** `src/app/(dashboard)/cells/page.tsx` (new):
   - grouped by city (`groupCellsByRegion`), offline first;
   - `CellSiteTile` with live dot, last-seen and "données anciennes" beyond 5 min;
   - "Vérifier tout" (`POST /cells/health-check`) with inline progress;
   - admin add/edit Sheet with IP/port validation.

### Phase 6: finish and build (10 %)

7. Settings page (profile, appearance, defaults; read-only confirmation phrase).
8. Command palette (cmdk, Ctrl/⌘+K). It can open pages and the composer, and **never** send.
9. Remove dead code: `src/types/index.ts`, `src/lib/stores/alert-store.ts`, `components/magicui/*`, unused `components/ui/*` if any.
10. Accessibility pass (keyboard, focus, `prefers-reduced-motion`; recharts `isAnimationActive={!reduce}`), responsive at 375/768/1024/1440, light and dark.
11. `pnpm build` green, zero `any`, zero `console.log`.

### Backend follow-ups (separate branch each, PR each)

- **B2 scheduler:** send SCHEDULED alerts at `scheduled_at` (APScheduler in-process, or a periodic task). Then re-enable "Programmé" in `src/components/composer/duration-field.tsx` (date + time with WAT UTC+1 shown; past times rejected).
- **B3 success rate:** return `null` (not 100) when nothing has been sent.
- **B4 security for any non-local deploy:**
  - `SECRET_KEY` from env (the default is hard-coded in `app/core/config.py`);
  - change or remove the `admin123` seed;
  - add the production origin to `CORS_ORIGINS`.
- **B5 optional:** `/stats/alerts-by-month` endpoint for the dashboard chart.

---

## 7. Deployment: how it must work

### Architecture decision (read carefully)

- The backend **must run inside the F2G lab network**. It SSHes to the eNodeBs (`cell_sites.enb_ip`, lab LAN) to write SIB12/SIB11.
- A cloud host (Render or Vercel serverless) can never reach them. The existing `backend/render.yaml` also uses SQLite on an ephemeral disk with `gunicorn -w 4`, which loses data and breaks SQLite locking. **Do not deploy the backend to Render as-is.**
- Recommended:
  - backend on the lab PC as a systemd service (uvicorn, 1 worker, SQLite, or Postgres later);
  - exposed to the internet only through a **Cloudflare Tunnel or Tailscale Funnel** with HTTPS;
  - the frontend on Vercel pointing to that URL.
- This is **blocker B6: ask Arnaud** which tunnel and domain to use.

### Current live state (checked 2026-09-29)

- `https://f2g-cmas-hub.vercel.app` is behind **Vercel SSO protection** (302 to vercel.com/sso-api).
- `https://src-sigma-brown.vercel.app` returns 200 (the old build).
- `src/vercel.json` sets `NEXT_PUBLIC_API_URL=https://f2g-cmas-api.vercel.app/api/v1`, which **does not exist (404)**. No backend is deployed anywhere.

### Steps

1. **Local verification** (always): `bash /home/f2g/F2G_CMAS_HUB/scripts/deploy.sh check`. It runs frontend typecheck, lint, tests and build, backend pytest, and the API/frontend health checks.
2. **Preview deploy of the frontend** (safe, not production), with `API_URL` set to the tunnel URL once B6 is decided:
   ```
   API_URL=https://<tunnel>/api/v1 bash scripts/deploy.sh preview
   ```
   Until then it builds against localhost, and the preview can only be tested from Arnaud's PC.
3. **Production deploy** (only after Arnaud says "oui" in the chat, and only from a merged `main`):
   ```
   API_URL=https://<tunnel>/api/v1 CONFIRM_PROD=oui bash scripts/deploy.sh prod
   ```
   - It sets `NEXT_PUBLIC_ENV=production`, which removes the training ribbon. **Only do that when the system really broadcasts to the public.** Otherwise keep a preview/training build.
4. **Update `src/vercel.json`** so `NEXT_PUBLIC_API_URL` points to the real API, or remove it and set it in the Vercel project env instead (preferred).
5. **Backend on the lab** (after B6 and B4):
   - systemd unit running `uvicorn app.main:app --host 127.0.0.1 --port 8000` from `backend/venv`;
   - the tunnel forwards HTTPS to `127.0.0.1:8000`;
   - `SECRET_KEY` and `CORS_ORIGINS` in the environment file;
   - back up `cmas_hub.db` daily.

---

## 8. Things Claude Code stopped on purpose

- **The earlier "night shift" automation.** `night-guardian.sh`, the Kiro orchestrator loop and the root `CLAUDE.md` "Night Shift Instructions" were stopped during the refactor.
  - That `CLAUDE.md` asks for shimmer buttons and `<Toaster richColors>`, which contradicts DESIGN.md.
  - **Do not restart those loops** on `src/` while the refactor branch is open, or they will undo design decisions.
  - Update or retire that `CLAUDE.md` with Arnaud's agreement.
- **No real send was performed.** The composer was tested up to the confirmation dialog.
