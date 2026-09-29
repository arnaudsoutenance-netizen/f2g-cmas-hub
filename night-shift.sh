#!/bin/bash
#══════════════════════════════════════════════════════════════════════════════
# 🌙 NIGHT SHIFT — Script principal pour surveillance nocturne
#══════════════════════════════════════════════════════════════════════════════
# Lance tous les processus de monitoring et d'amélioration pour la nuit
#══════════════════════════════════════════════════════════════════════════════

PROJECT_DIR="/home/f2g/F2G_CMAS_HUB"
LOG_DIR="$PROJECT_DIR/logs"

mkdir -p "$LOG_DIR"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo ""
echo -e "${PURPLE}"
cat << 'BANNER'
  ███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗    ███████╗██╗  ██╗██╗███████╗████████╗
  ████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝    ██╔════╝██║  ██║██║██╔════╝╚══██╔══╝
  ██╔██╗ ██║██║██║  ███╗███████║   ██║       ███████╗███████║██║█████╗     ██║   
  ██║╚██╗██║██║██║   ██║██╔══██║   ██║       ╚════██║██╔══██║██║██╔══╝     ██║   
  ██║ ╚████║██║╚██████╔╝██║  ██║   ██║       ███████║██║  ██║██║██║        ██║   
  ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
                                                                                 
                     F2G CMAS Hub — Automated Night Operations                   
BANNER
echo -e "${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "  Started: $(date)"
echo "  Project: F2G CMAS Hub"
echo "  Mode: Continuous Monitoring + UI/UX Enhancement"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

#══════════════════════════════════════════════════════════════════════════════
# Vérifier que les services sont up
#══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[1/4]${NC} Checking services..."

# Backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/health" 2>/dev/null || echo "000")
if [ "$BACKEND_STATUS" == "200" ]; then
    echo -e "  ${GREEN}✓${NC} Backend running on http://localhost:8000"
else
    echo -e "  ${YELLOW}⚠${NC} Backend not running, starting..."
    cd "$PROJECT_DIR/backend"
    setsid env DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db" \
        "$PROJECT_DIR/backend/venv/bin/uvicorn" app.main:app \
        --host 0.0.0.0 --port 8000 > "$LOG_DIR/backend.log" 2>&1 &
    sleep 5
    echo -e "  ${GREEN}✓${NC} Backend started"
fi

# Frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001" 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" == "200" ]; then
    echo -e "  ${GREEN}✓${NC} Frontend running on http://localhost:3001"
else
    echo -e "  ${YELLOW}⚠${NC} Frontend not running, starting..."
    cd "$PROJECT_DIR/src"
    setsid pnpm dev --port 3001 > "$LOG_DIR/frontend.log" 2>&1 &
    sleep 10
    echo -e "  ${GREEN}✓${NC} Frontend started"
fi

echo ""

#══════════════════════════════════════════════════════════════════════════════
# Lancer l'analyse UI/UX
#══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[2/4]${NC} Running UI/UX analysis..."
chmod +x "$PROJECT_DIR/ui-enhancer.sh"
bash "$PROJECT_DIR/ui-enhancer.sh" > "$LOG_DIR/ui-enhancer.log" 2>&1
echo -e "  ${GREEN}✓${NC} UI/UX analysis complete"
echo -e "  📄 Report: $PROJECT_DIR/improvements/ui-analysis-$(date +%Y%m%d).md"
echo ""

#══════════════════════════════════════════════════════════════════════════════
# Installer les composants UI manquants
#══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[3/4]${NC} Installing recommended UI components..."

cd "$PROJECT_DIR/src"

# Vérifier si sonner est installé
if ! grep -q "sonner" package.json 2>/dev/null; then
    echo "  Installing sonner (toast notifications)..."
    pnpm add sonner 2>/dev/null || npm install sonner 2>/dev/null || true
fi

echo -e "  ${GREEN}✓${NC} Dependencies checked"
echo ""

#══════════════════════════════════════════════════════════════════════════════
# Lancer le Night Guardian
#══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[4/4]${NC} Starting Night Guardian..."
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${CYAN}Night Shift is now active!${NC}"
echo ""
echo "  📊 Monitoring:"
echo "     • Backend health checks every 60s"
echo "     • Frontend health checks every 60s"
echo "     • Error scanning every 5 minutes"
echo "     • Performance checks every cycle"
echo "     • Reports generated every 10 minutes"
echo ""
echo "  📁 Logs:"
echo "     • Main log: $LOG_DIR/night-guardian.log"
echo "     • Errors: $LOG_DIR/errors.log"
echo "     • Backend: $LOG_DIR/backend.log"
echo "     • Frontend: $LOG_DIR/frontend.log"
echo ""
echo "  📄 Reports:"
echo "     • $PROJECT_DIR/reports/"
echo "     • $PROJECT_DIR/improvements/"
echo ""
echo "  ⌨️  Press Ctrl+C to stop"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Lancer le guardian
chmod +x "$PROJECT_DIR/night-guardian.sh"
exec bash "$PROJECT_DIR/night-guardian.sh"
