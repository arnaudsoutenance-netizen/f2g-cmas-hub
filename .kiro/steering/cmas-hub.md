---
inclusion: always
---

# F2G CMAS Hub: project steering (Kiro)

Before any work on this project, read `/home/f2g/F2G_CMAS_HUB/docs/HANDOFF-KIRO.md` completely, then `/home/f2g/F2G_CMAS_HUB/docs/DESIGN.md` (start with the "Berry × F2G" note).

Non-negotiable rules:

1. **Never trigger a real broadcast.** `POST /api/v1/alerts/{id}/send` makes the backend SSH into lab eNodeBs, which is a real radio alert. Only with Arnaud's explicit "oui" in chat.
2. **Message IDs per 3GPP TS 23.041**:
   - AMBER **4379**;
   - monthly test **4380**;
   - exercise **4381**;
   - Severe 4373–4378;
   - Extreme 4371–4372;
   - Presidential 4370;
   - ETWS 4352–4355.

   The single source is `src/src/lib/cmas/alert-classes.ts`. `REFACTORING-CONTEXT.md` is wrong on this.
3. **Types come from the API**: `pnpm gen:api` → `src/src/types/api.gen.ts`, aliases in `src/src/types/domain.ts`. No hand-written API types, zero `any`, no `console.log`.
4. **Motion**: use `m.*` from `framer-motion` (LazyMotion strict), never `motion.*`. **Tailwind v4**: static class strings only. **Base UI**: `render={…}`, not `asChild`.
5. **Next.js 16**: read `src/node_modules/next/dist/docs/` before using an API; `params` and `searchParams` are Promises.
6. **Design rules**:
   - no shimmer/ripple/beam/glass;
   - no `richColors`;
   - no raw palette classes;
   - brand orange `#EC8236` is decoration only (cards use `#B85418`);
   - severity colours for alerts only.
7. **Git**:
   - single repo `rush-limitless/f2g-cmas-hub` (git root = `/home/f2g/F2G_CMAS_HUB`, frontend `src/`, backend `backend/`); work on `develop` or a feature branch off it;
   - never push to `main`/`master` without a PR;
   - `git push -u` for new branches;
   - no force-push or hard reset without confirmation;
   - conventional commits.
8. **Do not restart** `night-guardian.sh`, `night-shift.sh`, `ui-enhancer.sh` or `orchestrator.sh` on `src/` while the refactor is open. The root `CLAUDE.md` "night shift" instructions contradict DESIGN.md.
9. **Deploy**:
   - `bash scripts/deploy.sh check` always;
   - `preview` for Vercel previews;
   - `prod` only with `CONFIRM_PROD=oui`, from `main`, after Arnaud approves;
   - the backend stays on the lab network (SSH to eNodeBs) behind a tunnel. Never Render/Vercel as-is.
10. **Reporting**: in French, with screenshots, and a progress table with per-phase % and overall % at every step.
