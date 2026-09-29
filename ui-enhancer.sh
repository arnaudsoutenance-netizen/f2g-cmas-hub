#!/bin/bash
#══════════════════════════════════════════════════════════════════════════════
# 🎨 UI/UX ENHANCER — Amélioration automatique de l'interface
#══════════════════════════════════════════════════════════════════════════════
# Ce script:
# 1. Analyse les composants UI existants
# 2. Recherche les meilleurs patterns sur GitHub
# 3. Génère des recommandations d'amélioration
# 4. Crée un rapport pour Kiro/Claude
#══════════════════════════════════════════════════════════════════════════════

set -e

PROJECT_DIR="/home/f2g/F2G_CMAS_HUB"
FRONTEND_DIR="$PROJECT_DIR/src"
SKILLS_DIR="/home/f2g/.kiro/skills"
REPORT_DIR="$PROJECT_DIR/reports"
IMPROVEMENTS_DIR="$PROJECT_DIR/improvements"

mkdir -p "$REPORT_DIR" "$IMPROVEMENTS_DIR"

timestamp() {
    date "+%Y-%m-%d %H:%M:%S"
}

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🎨 UI/UX ENHANCER — F2G CMAS Hub"
echo "  Started: $(timestamp)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

#══════════════════════════════════════════════════════════════════════════════
# 1. ANALYSE DES COMPOSANTS EXISTANTS
#══════════════════════════════════════════════════════════════════════════════

echo "📊 [1/5] Analyzing existing components..."

# Lister tous les composants
COMPONENTS=$(find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.jsx" 2>/dev/null | wc -l)
echo "  Found $COMPONENTS component files"

# Analyser l'utilisation de shadcn
SHADCN_IMPORTS=$(grep -r "from \"@/components/ui" "$FRONTEND_DIR" 2>/dev/null | wc -l || echo "0")
echo "  shadcn/ui imports: $SHADCN_IMPORTS"

# Analyser les animations
MOTION_IMPORTS=$(grep -r "from \"framer-motion\|from \"motion" "$FRONTEND_DIR" 2>/dev/null | wc -l || echo "0")
echo "  Motion/Framer imports: $MOTION_IMPORTS"

# Magic UI usage
MAGIC_UI=$(grep -r "magicui\|magic-ui" "$FRONTEND_DIR" 2>/dev/null | wc -l || echo "0")
echo "  Magic UI usage: $MAGIC_UI"

#══════════════════════════════════════════════════════════════════════════════
# 2. CRÉER LE RAPPORT D'ANALYSE
#══════════════════════════════════════════════════════════════════════════════

echo ""
echo "📝 [2/5] Creating analysis report..."

ANALYSIS_REPORT="$IMPROVEMENTS_DIR/ui-analysis-$(date +%Y%m%d).md"

cat > "$ANALYSIS_REPORT" << 'EOF'
# 🎨 UI/UX Analysis Report — F2G CMAS Hub

## Current State Analysis

### Component Inventory
EOF

echo "" >> "$ANALYSIS_REPORT"
echo "| Category | Count |" >> "$ANALYSIS_REPORT"
echo "|----------|-------|" >> "$ANALYSIS_REPORT"
echo "| Total TSX/JSX files | $COMPONENTS |" >> "$ANALYSIS_REPORT"
echo "| shadcn/ui imports | $SHADCN_IMPORTS |" >> "$ANALYSIS_REPORT"
echo "| Motion animations | $MOTION_IMPORTS |" >> "$ANALYSIS_REPORT"
echo "| Magic UI components | $MAGIC_UI |" >> "$ANALYSIS_REPORT"

cat >> "$ANALYSIS_REPORT" << 'EOF'

### Files Structure
EOF

find "$FRONTEND_DIR" -name "*.tsx" 2>/dev/null | head -30 | while read file; do
    echo "- \`${file#$PROJECT_DIR/}\`" >> "$ANALYSIS_REPORT"
done

cat >> "$ANALYSIS_REPORT" << 'EOF'

---

## 🎯 Recommended Improvements

### 1. Animation Enhancements (Priority: HIGH)

**Current:** Basic or no animations
**Target:** Premium micro-interactions

**Install these Magic UI components:**
```bash
# Animated components for dashboard
npx shadcn@latest add "https://21st.dev/r/magicui/animated-beam"
npx shadcn@latest add "https://21st.dev/r/magicui/number-ticker"
npx shadcn@latest add "https://21st.dev/r/magicui/shimmer-button"
npx shadcn@latest add "https://21st.dev/r/magicui/border-beam"

# Background effects
npx shadcn@latest add "https://21st.dev/r/aceternity/background-beams"
npx shadcn@latest add "https://21st.dev/r/aceternity/spotlight"
```

### 2. Dashboard KPI Cards

**Before:** Static numbers
**After:** Animated counters with visual feedback

```tsx
import { NumberTicker } from "@/components/ui/number-ticker";

// Replace static numbers with animated
<NumberTicker value={stats.alerts.total} className="text-4xl font-bold" />
```

### 3. Alert Status Indicators

**Recommended:** Add pulsing animations for active alerts

```tsx
// Active alert indicator
<div className="relative">
  <span className="absolute -top-1 -right-1 flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
  </span>
</div>
```

### 4. Table Enhancements

**Install:**
```bash
npx shadcn@latest add table
```

**Features to add:**
- Row hover animations
- Loading skeletons
- Empty state illustrations
- Sorting indicators with transitions

### 5. Form Improvements

**Current forms → Enhanced UX:**
- Add field validation feedback with animations
- Success/error toast notifications (Sonner)
- Loading states on buttons
- Auto-save indicators

```bash
# Install Sonner for toasts
pnpm add sonner
```

### 6. Navigation & Layout

**Sidebar improvements:**
- Collapsible with smooth animation
- Active route indicator with border beam
- Hover effects on menu items

**Install:**
```bash
npx shadcn@latest add "https://21st.dev/r/magicui/dock"
```

### 7. Loading States

**Replace spinners with skeletons:**
```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Loading state
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

### 8. Color System Enhancement

**Add semantic colors for alerts:**
```css
/* globals.css additions */
:root {
  --alert-presidential: 220 90% 56%;  /* Blue - highest priority */
  --alert-extreme: 0 84% 60%;          /* Red - extreme danger */
  --alert-severe: 25 95% 53%;          /* Orange - severe */
  --alert-amber: 45 93% 47%;           /* Yellow - AMBER alerts */
  --alert-test: 142 76% 36%;           /* Green - test only */
}
```

### 9. Responsive Design Audit

**Check these breakpoints:**
- Mobile: 640px (sm)
- Tablet: 768px (md)
- Desktop: 1024px (lg)
- Large: 1280px (xl)

**Priority fixes:**
- Dashboard cards should stack on mobile
- Alert form should be full-width on mobile
- Table should scroll horizontally on small screens

### 10. Accessibility Improvements

**Required:**
- [ ] All buttons have aria-labels
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Screen reader announcements for alerts
- [ ] Keyboard navigation for all interactive elements

---

## 🔧 Implementation Checklist

### Phase 1: Quick Wins (Tonight)
- [ ] Install Number Ticker for dashboard stats
- [ ] Add Shimmer Button for primary actions
- [ ] Install Sonner for toast notifications
- [ ] Add loading skeletons

### Phase 2: Visual Polish (Tomorrow)
- [ ] Add background effects (Spotlight/Beams)
- [ ] Implement border beam on active cards
- [ ] Add micro-interactions on hover
- [ ] Improve form validation UX

### Phase 3: Advanced (This Week)
- [ ] Full responsive audit
- [ ] Accessibility compliance
- [ ] Performance optimization
- [ ] Dark mode refinement

---

## 📚 Reference Skills to Load

For implementation, load these skills:
1. `/home/f2g/.kiro/skills/magic-ui/SKILL.md`
2. `/home/f2g/.kiro/skills/high-end-visual-design/SKILL.md`
3. `/home/f2g/.kiro/skills/framer-motion/SKILL.md`
4. `/home/f2g/.kiro/skills/shadcn-ui/SKILL.md`
5. `/home/f2g/.kiro/skills/better-ui/SKILL.md`

---

*Report generated: $(date)*
EOF

echo "  Report saved: $ANALYSIS_REPORT"

#══════════════════════════════════════════════════════════════════════════════
# 3. RECHERCHER LES MEILLEURS PATTERNS GITHUB
#══════════════════════════════════════════════════════════════════════════════

echo ""
echo "🔍 [3/5] Searching best UI patterns on GitHub..."

GITHUB_PATTERNS="$IMPROVEMENTS_DIR/github-patterns.md"

cat > "$GITHUB_PATTERNS" << 'EOF'
# 🌟 Best UI/UX Patterns from GitHub

## Dashboard Patterns

### 1. shadcn/ui Dashboard Example
**Repo:** shadcn-ui/ui
**URL:** https://ui.shadcn.com/examples/dashboard

**Features:**
- Clean card-based layout
- Data tables with sorting/filtering
- Chart integration (Recharts)
- Responsive sidebar

### 2. Taxonomy (Best Next.js Dashboard)
**Repo:** shadcn-ui/taxonomy
**Stars:** 18k+

**Features:**
- Modern dashboard layout
- Dark/light mode
- Command palette (⌘K)
- Mobile responsive

### 3. Cal.com (Open Source Calendly)
**Repo:** calcom/cal.com
**Stars:** 30k+

**UI Patterns to copy:**
- Form design
- Booking flow
- Settings pages
- Toast notifications

## Alert System UI Patterns

### 1. Novu (Notification Infrastructure)
**Repo:** novuhq/novu
**Stars:** 34k+

**Patterns:**
- Notification center component
- Real-time updates
- Priority indicators
- Read/unread states

### 2. Incident.io
**Website:** incident.io

**Patterns:**
- Alert severity badges
- Status timeline
- Quick actions
- Mobile-first design

## Animation Patterns

### 1. Framer Motion Examples
**Repo:** framer/motion
**URL:** https://www.framer.com/motion/examples/

### 2. React Spring
**Repo:** pmndrs/react-spring

### 3. Auto Animate
**Repo:** formkit/auto-animate
**Note:** Drop-in animation for lists

## Component Libraries to Explore

| Library | Stars | Best For |
|---------|-------|----------|
| shadcn/ui | 65k+ | Base components |
| Magic UI | 12k+ | Animated components |
| Aceternity UI | 8k+ | Background effects |
| React Bits | 5k+ | Creative animations |
| Radix UI | 15k+ | Accessible primitives |

## Color Palette Inspiration

### Alert Systems
- **Presidential/Critical:** `#DC2626` (red-600)
- **Extreme:** `#EA580C` (orange-600)
- **Severe:** `#CA8A04` (yellow-600)
- **Test/Info:** `#2563EB` (blue-600)
- **Success:** `#16A34A` (green-600)

### Dashboard
- **Primary:** Brand color
- **Secondary:** Muted gray
- **Accent:** Highlight actions
- **Background:** Near-white/dark gray

---

## 🔗 Quick Install Commands

```bash
# Must-have components
npx shadcn@latest add button card dialog table form input select textarea badge avatar dropdown-menu sheet tabs toast

# Animation components
npx shadcn@latest add "https://21st.dev/r/magicui/animated-beam"
npx shadcn@latest add "https://21st.dev/r/magicui/number-ticker"
npx shadcn@latest add "https://21st.dev/r/magicui/border-beam"
npx shadcn@latest add "https://21st.dev/r/magicui/shimmer-button"
npx shadcn@latest add "https://21st.dev/r/magicui/particles"

# Background effects
npx shadcn@latest add "https://21st.dev/r/aceternity/spotlight"
npx shadcn@latest add "https://21st.dev/r/aceternity/background-beams"

# Utilities
pnpm add sonner lucide-react @radix-ui/react-slot
```

EOF

echo "  Patterns saved: $GITHUB_PATTERNS"

#══════════════════════════════════════════════════════════════════════════════
# 4. GÉNÉRER LES TÂCHES POUR KIRO
#══════════════════════════════════════════════════════════════════════════════

echo ""
echo "📋 [4/5] Generating tasks for Kiro..."

KIRO_TASKS="$IMPROVEMENTS_DIR/kiro-tasks.md"

cat > "$KIRO_TASKS" << 'EOF'
# 🤖 Kiro Tasks — UI/UX Enhancement

## Instructions for Kiro

Read these files before starting:
1. `/home/f2g/.kiro/skills/high-end-visual-design/SKILL.md`
2. `/home/f2g/.kiro/skills/magic-ui/SKILL.md`
3. `/home/f2g/.kiro/skills/better-ui/SKILL.md`

## Priority Tasks

### Task 1: Dashboard Stats Animation
**File:** `src/src/app/(dashboard)/page.tsx` or similar

**Action:**
1. Install Number Ticker: `npx shadcn@latest add "https://21st.dev/r/magicui/number-ticker"`
2. Replace static numbers with animated counters
3. Add hover effects on stat cards

### Task 2: Install Toast System
**Action:**
1. Run: `pnpm add sonner`
2. Add Toaster to root layout
3. Replace any alert() calls with toast()

### Task 3: Table Enhancement
**File:** Alert list page

**Action:**
1. Add loading skeleton state
2. Add row hover effects
3. Add empty state with illustration
4. Add sorting with visual indicators

### Task 4: Button Improvements
**Action:**
1. Install Shimmer Button: `npx shadcn@latest add "https://21st.dev/r/magicui/shimmer-button"`
2. Use for primary CTAs (Send Alert, Create Template)
3. Add loading state with spinner

### Task 5: Form Polish
**Files:** Alert creation form, Template form

**Action:**
1. Add field validation with inline errors
2. Add character counter for message field
3. Add success animation on submit
4. Improve select dropdowns

### Task 6: Navigation Enhancement
**Action:**
1. Add active route indicator with animation
2. Add hover effects on menu items
3. Improve mobile menu

### Task 7: Dark Mode Refinement
**Action:**
1. Audit all colors for dark mode
2. Fix any contrast issues
3. Add smooth transition between modes

### Task 8: Responsive Fixes
**Action:**
1. Test all pages at 375px, 768px, 1024px
2. Fix any layout breaks
3. Ensure touch targets are 44px minimum

---

## Code Templates

### Animated Stat Card
```tsx
import { NumberTicker } from "@/components/ui/number-ticker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <NumberTicker 
          value={value} 
          className="text-3xl font-bold"
        />
      </CardContent>
    </Card>
  );
}
```

### Toast Integration
```tsx
// In layout.tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

// Usage
import { toast } from "sonner";

// Success
toast.success("Alert sent successfully!");

// Error
toast.error("Failed to send alert");

// Loading
toast.promise(sendAlert(), {
  loading: "Sending alert...",
  success: "Alert sent!",
  error: "Failed to send"
});
```

### Loading Skeleton
```tsx
import { Skeleton } from "@/components/ui/skeleton";

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Validation Checklist

After each change:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Works on mobile (375px)
- [ ] Works in dark mode
- [ ] No console errors
- [ ] Animations are smooth (60fps)

EOF

echo "  Tasks saved: $KIRO_TASKS"

#══════════════════════════════════════════════════════════════════════════════
# 5. RÉSUMÉ FINAL
#══════════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ UI/UX Enhancer Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  📄 Files Generated:"
echo "     • $ANALYSIS_REPORT"
echo "     • $GITHUB_PATTERNS"
echo "     • $KIRO_TASKS"
echo ""
echo "  📌 Next Steps:"
echo "     1. Review the analysis report"
echo "     2. Run: pnpm add sonner"
echo "     3. Install Magic UI components"
echo "     4. Follow Kiro tasks for implementation"
echo ""
echo "  💡 For Kiro to implement:"
echo "     cat $KIRO_TASKS"
echo ""
