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

