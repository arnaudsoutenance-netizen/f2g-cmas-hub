# 🌙 CLAUDE.md — Night Shift Instructions

## Context
Ce projet est F2G CMAS Hub, une plateforme d'alertes Cell Broadcast d'urgence.

**Backend:** FastAPI sur http://localhost:8000
**Frontend:** Next.js sur http://localhost:3001

## 🎯 Your Mission Tonight

Tu tournes en mode surveillance et amélioration continue. Tes objectifs :

### 1. ERROR DETECTION (Priority: CRITICAL)

**Check every 5 minutes:**
```bash
# Backend health
curl http://localhost:8000/health

# Frontend health
curl http://localhost:3001

# Backend logs for errors
tail -50 /home/f2g/F2G_CMAS_HUB/logs/backend.log | grep -i "error\|exception"

# Frontend logs for errors
tail -50 /home/f2g/F2G_CMAS_HUB/logs/frontend.log | grep -i "error\|failed"
```

**If errors found:**
1. Identify the root cause
2. Fix the code
3. Restart the affected service
4. Log the fix in `/home/f2g/F2G_CMAS_HUB/logs/fixes.log`

### 2. UI/UX IMPROVEMENTS (Priority: HIGH)

**Read these files first:**
- `/home/f2g/F2G_CMAS_HUB/improvements/ui-analysis-*.md`
- `/home/f2g/F2G_CMAS_HUB/improvements/kiro-tasks.md`
- `/home/f2g/.kiro/skills/high-end-visual-design/SKILL.md`
- `/home/f2g/.kiro/skills/magic-ui/SKILL.md`

**Tasks to implement:**

#### A. Dashboard Stats (File: src/src/app/(dashboard)/page.tsx or similar)
```bash
# Install Number Ticker
cd /home/f2g/F2G_CMAS_HUB/src
npx shadcn@latest add "https://21st.dev/r/magicui/number-ticker"
```

Then update the dashboard to use animated counters.

#### B. Toast Notifications
```bash
# Already should be installed, if not:
pnpm add sonner
```

Add to root layout:
```tsx
import { Toaster } from "sonner";
// In the body:
<Toaster richColors position="top-right" />
```

#### C. Shimmer Buttons for CTAs
```bash
npx shadcn@latest add "https://21st.dev/r/magicui/shimmer-button"
```

Use for "Send Alert" and "Create" buttons.

#### D. Loading Skeletons
Add skeleton loading states to:
- Alert list table
- Dashboard stats
- Template list

#### E. Animation Improvements
Add subtle hover effects, transitions, and micro-interactions.

### 3. CODE QUALITY (Priority: MEDIUM)

**Run these checks:**
```bash
# TypeScript check
cd /home/f2g/F2G_CMAS_HUB/src
pnpm tsc --noEmit

# ESLint
pnpm lint

# Backend Python check
cd /home/f2g/F2G_CMAS_HUB/backend
source venv/bin/activate
python3 -m py_compile app/main.py
```

**Fix any errors found.**

### 4. RESPONSIVE DESIGN (Priority: MEDIUM)

Test all pages at these breakpoints:
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)

Fix any layout issues.

### 5. DARK MODE (Priority: LOW)

Ensure all components look good in dark mode.

---

## 📚 Skills to Load

Before making UI changes, read:
1. `/home/f2g/.kiro/skills/high-end-visual-design/SKILL.md`
2. `/home/f2g/.kiro/skills/magic-ui/SKILL.md`
3. `/home/f2g/.kiro/skills/shadcn-ui/SKILL.md`
4. `/home/f2g/.kiro/skills/framer-motion/SKILL.md`
5. `/home/f2g/.kiro/skills/better-ui/SKILL.md`

## 🔧 Commands Reference

```bash
# Start backend
cd /home/f2g/F2G_CMAS_HUB/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Start frontend
cd /home/f2g/F2G_CMAS_HUB/src
pnpm dev --port 3001

# Install shadcn component
npx shadcn@latest add [component]

# Install 21st.dev component
npx shadcn@latest add "https://21st.dev/r/[author]/[component]"
```

## 📝 Logging

After each improvement, log it:
```bash
echo "[$(date)] Fixed: [description]" >> /home/f2g/F2G_CMAS_HUB/logs/improvements.log
```

## ⚠️ Rules

1. **Never break existing functionality** — test after each change
2. **Small commits** — one feature at a time
3. **Follow the design system** — use shadcn/ui components
4. **No console.log in production** — remove debug code
5. **Accessibility** — ensure all interactive elements are accessible

## 🎨 Design Guidelines

- **Primary Color:** Use brand colors from globals.css
- **Animations:** Subtle, 200-300ms duration
- **Spacing:** Use Tailwind spacing scale (4, 6, 8, etc.)
- **Typography:** Use the established type scale
- **Icons:** Lucide React only

---

## 🚀 Get Started

1. Read the UI analysis report
2. Pick a task from the list above
3. Implement it
4. Test it
5. Log the improvement
6. Move to next task

**Goal:** By morning, the UI should feel more polished and professional!
