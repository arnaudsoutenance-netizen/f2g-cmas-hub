#!/bin/bash
#══════════════════════════════════════════════════════════════════════════════
# 🌙 NIGHT GUARDIAN — F2G CMAS Hub Continuous Monitoring & Improvement
#══════════════════════════════════════════════════════════════════════════════
# Ce script tourne toute la nuit pour:
# 1. Détecter les erreurs backend/frontend
# 2. Monitorer les logs en temps réel
# 3. Vérifier la santé des services
# 4. Logger tout pour analyse matinale
#══════════════════════════════════════════════════════════════════════════════

set -e

# Configuration
PROJECT_DIR="/home/f2g/F2G_CMAS_HUB"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/src"
LOG_DIR="$PROJECT_DIR/logs"
REPORT_DIR="$PROJECT_DIR/reports"

BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3001"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Créer les dossiers
mkdir -p "$LOG_DIR" "$REPORT_DIR"

# Timestamp
timestamp() {
    date "+%Y-%m-%d %H:%M:%S"
}

log() {
    echo -e "[$(timestamp)] $1" | tee -a "$LOG_DIR/night-guardian.log"
}

log_error() {
    echo -e "[$(timestamp)] ${RED}ERROR:${NC} $1" | tee -a "$LOG_DIR/errors.log" "$LOG_DIR/night-guardian.log"
}

log_success() {
    echo -e "[$(timestamp)] ${GREEN}OK:${NC} $1" | tee -a "$LOG_DIR/night-guardian.log"
}

log_warning() {
    echo -e "[$(timestamp)] ${YELLOW}WARN:${NC} $1" | tee -a "$LOG_DIR/warnings.log" "$LOG_DIR/night-guardian.log"
}

#══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECKS
#══════════════════════════════════════════════════════════════════════════════

check_backend() {
    log "${BLUE}[BACKEND]${NC} Checking health..."
    
    # Health endpoint
    HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null || echo "000")
    
    if [ "$HEALTH" == "200" ]; then
        log_success "Backend healthy (HTTP $HEALTH)"
        
        # Test API auth
        TOKEN=$(curl -s -X POST "$BACKEND_URL/api/v1/auth/login" \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "username=admin@f2g.cm&password=admin123" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || echo "")
        
        if [ -n "$TOKEN" ]; then
            log_success "Auth working - Token obtained"
            
            # Test protected endpoints
            for endpoint in "/api/v1/stats" "/api/v1/templates" "/api/v1/cells"; do
                STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BACKEND_URL$endpoint" 2>/dev/null || echo "000")
                if [ "$STATUS" == "200" ]; then
                    log_success "Endpoint $endpoint OK"
                else
                    log_error "Endpoint $endpoint FAILED (HTTP $STATUS)"
                fi
            done
        else
            log_error "Auth FAILED - Cannot get token"
        fi
    else
        log_error "Backend DOWN (HTTP $HEALTH)"
        
        # Tenter de redémarrer
        log_warning "Attempting to restart backend..."
        cd "$BACKEND_DIR"
        pkill -f "uvicorn app.main" 2>/dev/null || true
        sleep 2
        setsid env DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db" \
            "$BACKEND_DIR/venv/bin/uvicorn" app.main:app \
            --host 0.0.0.0 --port 8000 > "$LOG_DIR/backend.log" 2>&1 &
        sleep 5
        log "Backend restart attempted"
    fi
}

check_frontend() {
    log "${CYAN}[FRONTEND]${NC} Checking health..."
    
    HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null || echo "000")
    
    if [ "$HEALTH" == "200" ]; then
        log_success "Frontend healthy (HTTP $HEALTH)"
    else
        log_error "Frontend DOWN (HTTP $HEALTH)"
        
        # Tenter de redémarrer
        log_warning "Attempting to restart frontend..."
        cd "$FRONTEND_DIR"
        pkill -f "next dev" 2>/dev/null || true
        pkill -f "node.*3001" 2>/dev/null || true
        sleep 2
        setsid pnpm dev --port 3001 > "$LOG_DIR/frontend.log" 2>&1 &
        sleep 10
        log "Frontend restart attempted"
    fi
}

#══════════════════════════════════════════════════════════════════════════════
# ERROR DETECTION
#══════════════════════════════════════════════════════════════════════════════

scan_backend_errors() {
    log "${PURPLE}[SCAN]${NC} Scanning backend for errors..."
    
    cd "$BACKEND_DIR"
    
    # Python syntax check
    SYNTAX_ERRORS=$(find app -name "*.py" -exec python3 -m py_compile {} \; 2>&1 | grep -i "error" || true)
    if [ -n "$SYNTAX_ERRORS" ]; then
        log_error "Python syntax errors found:"
        echo "$SYNTAX_ERRORS" >> "$LOG_DIR/errors.log"
    else
        log_success "No Python syntax errors"
    fi
    
    # Check imports
    IMPORT_ERRORS=$(cd "$BACKEND_DIR" && source venv/bin/activate && python3 -c "
import sys
sys.path.insert(0, '.')
try:
    from app.main import app
    print('OK')
except Exception as e:
    print(f'IMPORT_ERROR: {e}')
" 2>&1)
    
    if [[ "$IMPORT_ERRORS" == *"IMPORT_ERROR"* ]]; then
        log_error "Import errors: $IMPORT_ERRORS"
    else
        log_success "All imports OK"
    fi
}

scan_frontend_errors() {
    log "${PURPLE}[SCAN]${NC} Scanning frontend for errors..."
    
    cd "$FRONTEND_DIR"
    
    # TypeScript check
    if [ -f "package.json" ]; then
        TS_ERRORS=$(pnpm tsc --noEmit 2>&1 | grep -E "error TS" | head -20 || true)
        if [ -n "$TS_ERRORS" ]; then
            log_error "TypeScript errors found:"
            echo "$TS_ERRORS" >> "$LOG_DIR/errors.log"
            echo "$TS_ERRORS" | head -10
        else
            log_success "No TypeScript errors"
        fi
        
        # ESLint check
        LINT_ERRORS=$(pnpm lint 2>&1 | grep -E "error|Error" | head -20 || true)
        if [ -n "$LINT_ERRORS" ]; then
            log_warning "ESLint warnings/errors:"
            echo "$LINT_ERRORS" >> "$LOG_DIR/warnings.log"
        else
            log_success "ESLint OK"
        fi
    fi
}

#══════════════════════════════════════════════════════════════════════════════
# LOG MONITORING
#══════════════════════════════════════════════════════════════════════════════

monitor_logs() {
    log "${YELLOW}[LOGS]${NC} Checking recent logs for errors..."
    
    # Backend logs
    if [ -f "$LOG_DIR/backend.log" ]; then
        BACKEND_ERRORS=$(tail -100 "$LOG_DIR/backend.log" 2>/dev/null | grep -iE "error|exception|traceback|failed" | tail -10 || true)
        if [ -n "$BACKEND_ERRORS" ]; then
            log_warning "Backend log errors detected:"
            echo "$BACKEND_ERRORS" >> "$LOG_DIR/errors.log"
        fi
    fi
    
    # Frontend logs
    if [ -f "$LOG_DIR/frontend.log" ]; then
        FRONTEND_ERRORS=$(tail -100 "$LOG_DIR/frontend.log" 2>/dev/null | grep -iE "error|failed|cannot" | tail -10 || true)
        if [ -n "$FRONTEND_ERRORS" ]; then
            log_warning "Frontend log errors detected:"
            echo "$FRONTEND_ERRORS" >> "$LOG_DIR/errors.log"
        fi
    fi
}

#══════════════════════════════════════════════════════════════════════════════
# PERFORMANCE CHECK
#══════════════════════════════════════════════════════════════════════════════

check_performance() {
    log "${GREEN}[PERF]${NC} Checking performance..."
    
    # Backend response time
    BACKEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BACKEND_URL/health" 2>/dev/null || echo "0")
    if (( $(echo "$BACKEND_TIME > 2.0" | bc -l 2>/dev/null || echo 0) )); then
        log_warning "Backend slow: ${BACKEND_TIME}s"
    else
        log_success "Backend response: ${BACKEND_TIME}s"
    fi
    
    # Frontend response time
    FRONTEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$FRONTEND_URL" 2>/dev/null || echo "0")
    if (( $(echo "$FRONTEND_TIME > 3.0" | bc -l 2>/dev/null || echo 0) )); then
        log_warning "Frontend slow: ${FRONTEND_TIME}s"
    else
        log_success "Frontend response: ${FRONTEND_TIME}s"
    fi
    
    # Memory usage
    MEM_USAGE=$(free -m | awk 'NR==2{printf "%.1f", $3*100/$2}')
    log "Memory usage: ${MEM_USAGE}%"
    
    # Disk usage
    DISK_USAGE=$(df -h "$PROJECT_DIR" | awk 'NR==2{print $5}' | tr -d '%')
    log "Disk usage: ${DISK_USAGE}%"
}

#══════════════════════════════════════════════════════════════════════════════
# GENERATE REPORT
#══════════════════════════════════════════════════════════════════════════════

generate_report() {
    REPORT_FILE="$REPORT_DIR/report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# 🌙 Night Guardian Report
**Generated:** $(timestamp)
**Project:** F2G CMAS Hub

## Summary

### Services Status
- Backend: $(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null || echo "DOWN")
- Frontend: $(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null || echo "DOWN")

### Errors Detected
\`\`\`
$(tail -20 "$LOG_DIR/errors.log" 2>/dev/null || echo "No errors logged")
\`\`\`

### Warnings
\`\`\`
$(tail -20 "$LOG_DIR/warnings.log" 2>/dev/null || echo "No warnings logged")
\`\`\`

### Performance
- Memory: $(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
- Disk: $(df -h "$PROJECT_DIR" | awk 'NR==2{print $5}')

---
*Report generated by Night Guardian*
EOF
    
    log "Report generated: $REPORT_FILE"
}

#══════════════════════════════════════════════════════════════════════════════
# MAIN LOOP
#══════════════════════════════════════════════════════════════════════════════

main() {
    echo ""
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}   🌙 NIGHT GUARDIAN — F2G CMAS Hub Monitoring${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    log "Starting Night Guardian..."
    log "Press Ctrl+C to stop"
    echo ""
    
    # Boucle infinie
    CYCLE=0
    while true; do
        CYCLE=$((CYCLE + 1))
        
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        log "Cycle #$CYCLE starting..."
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        # Health checks
        check_backend
        check_frontend
        
        # Error scanning (toutes les 5 cycles)
        if [ $((CYCLE % 5)) -eq 0 ]; then
            scan_backend_errors
            scan_frontend_errors
        fi
        
        # Log monitoring
        monitor_logs
        
        # Performance check
        check_performance
        
        # Generate report (toutes les 10 cycles)
        if [ $((CYCLE % 10)) -eq 0 ]; then
            generate_report
        fi
        
        echo ""
        log "Cycle #$CYCLE complete. Sleeping 60 seconds..."
        echo ""
        
        # Attendre 60 secondes
        sleep 60
    done
}

# Trap pour cleanup
cleanup() {
    echo ""
    log "Night Guardian stopping..."
    generate_report
    log "Final report generated. Goodbye!"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Lancer
main
