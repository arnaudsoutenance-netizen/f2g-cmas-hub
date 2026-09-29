#!/bin/bash
cd /home/f2g/F2G_CMAS_HUB/backend
source venv/bin/activate
export DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
