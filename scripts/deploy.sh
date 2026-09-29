#!/usr/bin/env bash
# F2G CMAS Hub: verify and deploy.
#
#   bash scripts/deploy.sh check      # typecheck, lint, tests, build (front) + pytest (back) + health checks
#   API_URL=https://<api>/api/v1 bash scripts/deploy.sh preview   # Vercel preview (never production)
#   API_URL=https://<api>/api/v1 CONFIRM_PROD=oui bash scripts/deploy.sh prod   # production, explicit only
#
# Never deploys the backend: it must run inside the lab network (see docs/HANDOFF-KIRO.md §7).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT="$ROOT/src"
BACK="$ROOT/backend"
MODE="${1:-check}"
API_URL="${API_URL:-http://localhost:8000/api/v1}"

step() { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }
ok()   { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }

check_frontend() {
  step "Frontend: typecheck, lint, tests, build ($FRONT)"
  cd "$FRONT"
  pnpm install --frozen-lockfile
  pnpm typecheck
  pnpm lint
  pnpm test
  if grep -rn --include='*.ts' --include='*.tsx' -E ':\s*any\b|as any\b|<any>' src | grep -v 'types/api.gen.ts'; then
    fail "TypeScript 'any' found (project rule: zero any)"
  fi
  if grep -rn --include='*.ts' --include='*.tsx' 'console\.log' src; then
    fail "console.log found (project rule: none in production code)"
  fi
  NEXT_PUBLIC_API_URL="$API_URL" pnpm build
  ok "Frontend OK"
}

check_backend() {
  step "Backend: pytest ($BACK)"
  cd "$BACK"
  # shellcheck disable=SC1091
  source venv/bin/activate
  DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db" pytest -q
  deactivate
  ok "Backend OK"
}

health() {
  step "Health checks (local services)"
  local api front
  api=$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://localhost:8000/health || true)
  front=$(curl -s -o /dev/null -m 10 -w '%{http_code}' http://localhost:3001/login || true)
  echo "API http://localhost:8000/health → $api"
  echo "Front http://localhost:3001/login → $front"
  [[ "$api" == "200" ]] || echo "  (API not running locally: cd backend && bash start.sh)"
}

git_clean() {
  local dir="$1"
  [[ -z "$(git -C "$dir" status --porcelain)" ]] || fail "Uncommitted changes in $dir. Commit first."
}

deploy_vercel() {
  local target="$1"
  command -v vercel >/dev/null || fail "vercel CLI missing (npm i -g vercel)"
  git_clean "$FRONT"
  [[ "$API_URL" == http://localhost* ]] && echo "⚠ API_URL is localhost: the deployed site will only work from this PC."
  cd "$FRONT"
  if [[ "$target" == "prod" ]]; then
    [[ "${CONFIRM_PROD:-}" == "oui" ]] || fail "Production refused: set CONFIRM_PROD=oui after Arnaud's explicit approval."
    [[ "$(git branch --show-current)" == "main" ]] || fail "Production deploys only from main (merge the PR first)."
    step "Vercel PRODUCTION deploy (training ribbon removed)"
    vercel deploy --prod --build-env NEXT_PUBLIC_API_URL="$API_URL" --build-env NEXT_PUBLIC_ENV=production --env NEXT_PUBLIC_API_URL="$API_URL" --env NEXT_PUBLIC_ENV=production
  else
    step "Vercel PREVIEW deploy (training ribbon kept)"
    vercel deploy --build-env NEXT_PUBLIC_API_URL="$API_URL" --build-env NEXT_PUBLIC_ENV=training --env NEXT_PUBLIC_API_URL="$API_URL" --env NEXT_PUBLIC_ENV=training
  fi
}

case "$MODE" in
  check)   check_frontend; check_backend; health; ok "All checks passed" ;;
  preview) check_frontend; check_backend; deploy_vercel preview ;;
  prod)    check_frontend; check_backend; deploy_vercel prod ;;
  *)       fail "Unknown mode '$MODE' (check | preview | prod)" ;;
esac
