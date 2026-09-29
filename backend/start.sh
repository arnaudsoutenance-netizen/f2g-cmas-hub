#!/bin/bash
cd /home/f2g/F2G_CMAS_HUB/backend
source venv/bin/activate
export DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db"
# JWT signing key: random, kept outside the repo (see docs/HANDOFF-KIRO.md)
export SECRET_KEY="$(cat "$HOME/.config/f2g-cmas-hub/secret_key")"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
