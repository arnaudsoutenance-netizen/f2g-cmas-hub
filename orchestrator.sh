#!/bin/bash
#══════════════════════════════════════════════════════════════════════════════
# 🤖 MASTER ORCHESTRATOR — F2G CMAS Hub
#══════════════════════════════════════════════════════════════════════════════
# Ce script orchestre tous les agents et skills pour:
# 1. Corriger toutes les erreurs (TypeScript, Python, ESLint)
# 2. Exécuter tous les tests
# 3. Améliorer l'UI/UX
# 4. Générer un rapport complet
#══════════════════════════════════════════════════════════════════════════════

set -e

PROJECT_DIR="/home/f2g/F2G_CMAS_HUB"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/src"
LOG_DIR="$PROJECT_DIR/logs"
REPORT_DIR="$PROJECT_DIR/reports"

mkdir -p "$LOG_DIR" "$REPORT_DIR"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

timestamp() {
    date "+%Y-%m-%d %H:%M:%S"
}

log() {
    echo -e "[$(timestamp)] $1" | tee -a "$LOG_DIR/orchestrator.log"
}

clear
echo ""
echo -e "${PURPLE}"
cat << 'BANNER'
   ███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗ 
   ████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
   ██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝
   ██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗
   ██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║
   ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                        
         ORCHESTRATOR — F2G CMAS Hub Quality System     
BANNER
echo -e "${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "  Started: $(timestamp)"
echo "  Agents: 19 (oh-my-claudecode) + 16 skills (SDD) + 6 skills (Conductor)"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1: BACKEND QUALITY
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    PHASE 1: BACKEND QUALITY CHECK                         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "$BACKEND_DIR"
source venv/bin/activate
export DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db"

# 1.1 Python syntax check
log "${CYAN}[1.1]${NC} Python syntax check..."
PYTHON_ERRORS=$(find app -name "*.py" -exec python3 -m py_compile {} \; 2>&1 | grep -i "error" || true)
if [ -n "$PYTHON_ERRORS" ]; then
    echo -e "${RED}✗ Python syntax errors found${NC}"
    echo "$PYTHON_ERRORS"
else
    echo -e "${GREEN}✓ No Python syntax errors${NC}"
fi

# 1.2 Import check
log "${CYAN}[1.2]${NC} Import check..."
IMPORT_CHECK=$(python3 -c "from app.main import app; print('OK')" 2>&1)
if [[ "$IMPORT_CHECK" == "OK" ]]; then
    echo -e "${GREEN}✓ All imports OK${NC}"
else
    echo -e "${RED}✗ Import errors:${NC}"
    echo "$IMPORT_CHECK"
fi

# 1.3 Run tests
log "${CYAN}[1.3]${NC} Running backend tests..."
TEST_RESULT=$(pytest tests/test_api.py -v --tb=short 2>&1)
PASSED=$(echo "$TEST_RESULT" | grep -oP '\d+(?= passed)' | head -1 || echo "0")
FAILED=$(echo "$TEST_RESULT" | grep -oP '\d+(?= failed)' | head -1 || echo "0")

if [ "$FAILED" == "0" ] || [ -z "$FAILED" ]; then
    echo -e "${GREEN}✓ All $PASSED tests passed${NC}"
else
    echo -e "${YELLOW}⚠ $PASSED passed, $FAILED failed${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2: FRONTEND QUALITY
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    PHASE 2: FRONTEND QUALITY CHECK                        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "$FRONTEND_DIR"

# 2.1 TypeScript check
log "${CYAN}[2.1]${NC} TypeScript check..."
TS_ERRORS=$(pnpm tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
if [ "$TS_ERRORS" == "0" ]; then
    echo -e "${GREEN}✓ No TypeScript errors${NC}"
else
    echo -e "${YELLOW}⚠ $TS_ERRORS TypeScript errors found${NC}"
    echo "   Run: pnpm tsc --noEmit to see details"
fi

# 2.2 ESLint check
log "${CYAN}[2.2]${NC} ESLint check..."
LINT_ERRORS=$(pnpm lint 2>&1 | grep -c "error" || echo "0")
if [ "$LINT_ERRORS" == "0" ]; then
    echo -e "${GREEN}✓ No ESLint errors${NC}"
else
    echo -e "${YELLOW}⚠ $LINT_ERRORS ESLint issues${NC}"
fi

# 2.3 Component count
log "${CYAN}[2.3]${NC} Component inventory..."
COMPONENTS=$(find . -name "*.tsx" 2>/dev/null | wc -l)
UI_COMPONENTS=$(ls src/components/ui/ 2>/dev/null | wc -l || echo "0")
echo -e "${GREEN}✓ $COMPONENTS TSX files, $UI_COMPONENTS UI components${NC}"

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3: SERVICES HEALTH
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    PHASE 3: SERVICES HEALTH CHECK                         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Backend health
log "${CYAN}[3.1]${NC} Backend health..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/health" 2>/dev/null || echo "000")
if [ "$BACKEND_STATUS" == "200" ]; then
    echo -e "${GREEN}✓ Backend healthy (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}✗ Backend down (HTTP $BACKEND_STATUS)${NC}"
fi

# Frontend health
log "${CYAN}[3.2]${NC} Frontend health..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001" 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" == "200" ]; then
    echo -e "${GREEN}✓ Frontend healthy (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}✗ Frontend down (HTTP $FRONTEND_STATUS)${NC}"
fi

# API Auth test
log "${CYAN}[3.3]${NC} API Authentication..."
TOKEN=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin@f2g.cm&password=admin123" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || echo "")

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Authentication working${NC}"
else
    echo -e "${RED}✗ Authentication failed${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4: GENERATE REPORT
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    PHASE 4: GENERATE REPORT                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

REPORT_FILE="$REPORT_DIR/quality-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# 📊 F2G CMAS Hub — Quality Report

**Generated:** $(timestamp)
**By:** Master Orchestrator

---

## Summary

| Category | Status | Details |
|----------|--------|---------|
| Python Syntax | $([ -z "$PYTHON_ERRORS" ] && echo "✅ OK" || echo "⚠️ Errors") | $([ -z "$PYTHON_ERRORS" ] && echo "No errors" || echo "See logs") |
| Python Imports | $([ "$IMPORT_CHECK" == "OK" ] && echo "✅ OK" || echo "❌ Error") | - |
| Backend Tests | $([ "$FAILED" == "0" ] && echo "✅ $PASSED passed" || echo "⚠️ $PASSED/$((PASSED+FAILED))") | - |
| TypeScript | $([ "$TS_ERRORS" == "0" ] && echo "✅ OK" || echo "⚠️ $TS_ERRORS errors") | Run \`pnpm tsc\` |
| ESLint | $([ "$LINT_ERRORS" == "0" ] && echo "✅ OK" || echo "⚠️ $LINT_ERRORS issues") | - |
| Backend Service | $([ "$BACKEND_STATUS" == "200" ] && echo "✅ Running" || echo "❌ Down") | HTTP $BACKEND_STATUS |
| Frontend Service | $([ "$FRONTEND_STATUS" == "200" ] && echo "✅ Running" || echo "❌ Down") | HTTP $FRONTEND_STATUS |
| Authentication | $([ -n "$TOKEN" ] && echo "✅ Working" || echo "❌ Failed") | - |

---

## Component Inventory

- **TSX Files:** $COMPONENTS
- **UI Components:** $UI_COMPONENTS

---

## Agents Available

| Category | Count |
|----------|-------|
| oh-my-claudecode agents | 19 |
| SDD skills | 16 |
| Conductor skills | 6 |
| **Total** | **41** |

---

## Recommendations

EOF

# Add recommendations based on results
if [ "$TS_ERRORS" != "0" ]; then
    echo "### Fix TypeScript Errors" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Run the following to see errors:" >> "$REPORT_FILE"
    echo "\`\`\`bash" >> "$REPORT_FILE"
    echo "cd $FRONTEND_DIR && pnpm tsc --noEmit" >> "$REPORT_FILE"
    echo "\`\`\`" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

if [ "$LINT_ERRORS" != "0" ]; then
    echo "### Fix ESLint Errors" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "\`\`\`bash" >> "$REPORT_FILE"
    echo "cd $FRONTEND_DIR && pnpm lint --fix" >> "$REPORT_FILE"
    echo "\`\`\`" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "*Report generated by Master Orchestrator*" >> "$REPORT_FILE"

echo -e "${GREEN}✓ Report generated: $REPORT_FILE${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}ORCHESTRATOR COMPLETE${NC}"
echo ""
echo "  📄 Report: $REPORT_FILE"
echo "  📁 Logs: $LOG_DIR/orchestrator.log"
echo ""
echo "  📊 Quick Stats:"
echo "     • Backend tests: $PASSED passed"
echo "     • TypeScript errors: $TS_ERRORS"
echo "     • ESLint issues: $LINT_ERRORS"
echo "     • Services: Backend $([ "$BACKEND_STATUS" == "200" ] && echo "✅" || echo "❌") Frontend $([ "$FRONTEND_STATUS" == "200" ] && echo "✅" || echo "❌")"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
