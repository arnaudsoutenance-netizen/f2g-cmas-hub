# F2G CMAS HUB — Design System

**Version:** 1.0  
**Date:** 2026-09-28  
**Framework:** Next.js 14 + shadcn/ui + 21st.dev

---

## 1. Brand Identity

### 1.1 Colors

```css
/* Primary - Alert/Emergency Orange */
--primary: 24 95% 53%;           /* #F97316 - Orange vif */
--primary-foreground: 0 0% 100%; /* White */

/* Destructive - Danger Red */
--destructive: 0 84% 60%;        /* #EF4444 - Rouge alerte */
--destructive-foreground: 0 0% 100%;

/* Success - Green */
--success: 142 76% 36%;          /* #16A34A */
--success-foreground: 0 0% 100%;

/* Warning - Amber */
--warning: 38 92% 50%;           /* #F59E0B */
--warning-foreground: 0 0% 0%;

/* Background */
--background: 0 0% 100%;         /* White */
--foreground: 222 47% 11%;       /* Slate 900 */

/* Card */
--card: 0 0% 100%;
--card-foreground: 222 47% 11%;

/* Muted */
--muted: 210 40% 96%;            /* Slate 100 */
--muted-foreground: 215 16% 47%; /* Slate 500 */

/* Accent */
--accent: 210 40% 96%;
--accent-foreground: 222 47% 11%;

/* Border */
--border: 214 32% 91%;           /* Slate 200 */
--input: 214 32% 91%;
--ring: 24 95% 53%;              /* Orange focus ring */

/* Dark Mode */
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 217 33% 17%;
  --card-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 217 33% 25%;
  --input: 217 33% 25%;
}
```

### 1.2 Alert Severity Colors

```css
/* Alert Type Colors - For status badges and indicators */
.alert-presidential { background: #DC2626; color: white; }  /* Red-600 */
.alert-extreme      { background: #EA580C; color: white; }  /* Orange-600 */
.alert-severe       { background: #D97706; color: white; }  /* Amber-600 */
.alert-amber        { background: #CA8A04; color: white; }  /* Yellow-600 */
.alert-test         { background: #059669; color: white; }  /* Emerald-600 */
```

### 1.3 Typography

```css
/* Font Stack */
--font-sans: "Inter", "SF Pro Display", -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", monospace;

/* Type Scale */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */

/* Font Weights */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* Line Heights */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

---

## 2. Component Library

### 2.1 shadcn/ui Components (Required)

```bash
# Base components à installer
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add toast
npx shadcn@latest add tooltip
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add avatar
npx shadcn@latest add alert
npx shadcn@latest add progress
```

### 2.2 21st.dev Components (Premium)

```bash
# Magic UI Components
npx shadcn@latest add "https://21st.dev/r/magicui/animated-beam"
npx shadcn@latest add "https://21st.dev/r/magicui/bento-grid"
npx shadcn@latest add "https://21st.dev/r/magicui/number-ticker"
npx shadcn@latest add "https://21st.dev/r/magicui/marquee"
npx shadcn@latest add "https://21st.dev/r/magicui/shine-border"
npx shadcn@latest add "https://21st.dev/r/magicui/dock"
npx shadcn@latest add "https://21st.dev/r/magicui/particles"
npx shadcn@latest add "https://21st.dev/r/magicui/ripple"

# Aceternity Components
npx shadcn@latest add "https://21st.dev/r/aceternity/spotlight"
npx shadcn@latest add "https://21st.dev/r/aceternity/background-beams"
npx shadcn@latest add "https://21st.dev/r/aceternity/text-generate-effect"
npx shadcn@latest add "https://21st.dev/r/aceternity/card-hover-effect"
```

---

## 3. Layout Patterns

### 3.1 Dashboard Layout

```tsx
// Standard dashboard layout structure
<div className="flex h-screen bg-background">
  {/* Sidebar - Fixed */}
  <aside className="w-64 border-r bg-card">
    <Sidebar />
  </aside>
  
  {/* Main Content */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <header className="h-16 border-b bg-card px-6 flex items-center">
      <Header />
    </header>
    
    {/* Content Area */}
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
</div>
```

### 3.2 Card Grid (Bento Style)

```tsx
// Stats cards using Magic UI Bento Grid
<BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <BentoCard className="col-span-1">
    <NumberTicker value={12} />
    <p className="text-muted-foreground">Alertes envoyées</p>
  </BentoCard>
  {/* ... */}
</BentoGrid>
```

### 3.3 Form Layout

```tsx
// Standard form structure
<Card>
  <CardHeader>
    <CardTitle>Nouvelle Alerte</CardTitle>
    <CardDescription>Créez une alerte Cell Broadcast</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
      </form>
    </Form>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Annuler</Button>
    <Button type="submit">Créer</Button>
  </CardFooter>
</Card>
```

---

## 4. Component Specifications

### 4.1 Alert Card

```tsx
// components/alerts/alert-card.tsx
interface AlertCardProps {
  alert: Alert;
  onEdit?: () => void;
  onDelete?: () => void;
  onSend?: () => void;
}

export function AlertCard({ alert, onEdit, onDelete, onSend }: AlertCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {/* Status indicator bar */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        alert.status === 'SENT' && "bg-success",
        alert.status === 'SCHEDULED' && "bg-warning",
        alert.status === 'DRAFT' && "bg-muted",
        alert.status === 'FAILED' && "bg-destructive",
      )} />
      
      <CardContent className="pl-4">
        {/* Alert type badge */}
        <Badge variant={getAlertVariant(alert.messageId)}>
          {getAlertTypeName(alert.messageId)}
        </Badge>
        
        {/* Content preview */}
        <p className="mt-2 line-clamp-2 text-sm">
          {alert.content}
        </p>
        
        {/* Metadata */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatDate(alert.scheduledAt)}</span>
          <span>{alert.cells.length} cellules</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4.2 Stats Card

```tsx
// components/dashboard/stats-card.tsx
interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <NumberTicker 
              value={value} 
              className="text-3xl font-bold tracking-tight"
            />
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {trend !== undefined && (
          <p className={cn(
            "mt-2 text-xs",
            trend > 0 ? "text-success" : "text-destructive"
          )}>
            {trend > 0 ? "+" : ""}{trend}% depuis hier
          </p>
        )}
      </CardContent>
      <Ripple className="absolute inset-0" />
    </Card>
  );
}
```

### 4.3 Status Badge

```tsx
// components/alerts/alert-status-badge.tsx
const statusConfig = {
  DRAFT: { label: "Brouillon", variant: "secondary" },
  SCHEDULED: { label: "Programmée", variant: "warning" },
  SENDING: { label: "En cours", variant: "default" },
  SENT: { label: "Envoyée", variant: "success" },
  FAILED: { label: "Échec", variant: "destructive" },
  CANCELLED: { label: "Annulée", variant: "outline" },
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
}
```

---

## 5. Animation Guidelines

### 5.1 Page Transitions

```tsx
// Use Framer Motion for page transitions
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```

### 5.2 Micro-interactions

```tsx
// Button hover effect
<Button className="transition-all duration-200 hover:scale-105 active:scale-95">
  Send Alert
</Button>

// Card hover
<Card className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
  ...
</Card>

// Status indicator pulse
<div className="relative">
  <div className="absolute w-3 h-3 bg-success rounded-full animate-ping" />
  <div className="w-3 h-3 bg-success rounded-full" />
</div>
```

---

## 6. Iconography

### 6.1 Icon Library

```tsx
// Use Lucide React exclusively
import {
  AlertTriangle,    // Emergency alerts
  Bell,             // Notifications
  Send,             // Send action
  Clock,            // Scheduled
  CheckCircle,      // Success
  XCircle,          // Failed
  FileText,         // Templates
  Settings,         // Settings
  Users,            // Users
  Radio,            // Cell tower / broadcast
  Activity,         // Status / monitoring
  Calendar,         // Scheduling
  History,          // Logs
  Plus,             // Add new
  Edit,             // Edit
  Trash2,           // Delete
  MoreVertical,     // More options
  ChevronRight,     // Navigation
  Search,           // Search
  Filter,           // Filter
  Download,         // Export
  Upload,           // Import
} from "lucide-react";
```

### 6.2 Icon Sizes

```tsx
// Standard sizes
<Icon className="h-4 w-4" />  // Small (buttons, inline)
<Icon className="h-5 w-5" />  // Default (menu items)
<Icon className="h-6 w-6" />  // Large (cards, features)
<Icon className="h-8 w-8" />  // XL (empty states)
```

---

## 7. Spacing System

```css
/* Tailwind spacing scale (rem) */
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

### 7.1 Standard Spacing Usage

| Context | Spacing |
|---------|---------|
| Card padding | `p-6` (24px) |
| Section gap | `gap-6` or `gap-8` |
| Form field gap | `space-y-4` (16px) |
| Button group gap | `gap-2` (8px) |
| Icon to text | `gap-2` (8px) |
| List items | `space-y-2` (8px) |

---

## 8. Accessibility Guidelines

### 8.1 Focus States

```css
/* All interactive elements must have visible focus */
.focus-visible:outline-none 
.focus-visible:ring-2 
.focus-visible:ring-ring 
.focus-visible:ring-offset-2
```

### 8.2 Color Contrast

- Text on background: minimum 4.5:1 ratio
- Large text (24px+): minimum 3:1 ratio
- UI components: minimum 3:1 ratio

### 8.3 ARIA Labels

```tsx
// Always provide accessible labels
<Button aria-label="Créer une nouvelle alerte">
  <Plus className="h-4 w-4" />
</Button>

<Input 
  aria-label="Message de l'alerte"
  aria-describedby="message-hint"
/>
<p id="message-hint" className="sr-only">
  Maximum 1395 caractères
</p>
```

---

## 9. Dark Mode Support

```tsx
// Use theme-aware classes
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <p className="text-muted-foreground">Secondary text</p>
  </Card>
</div>

// Never use fixed colors like text-black, text-gray-500
// Always use semantic tokens: text-foreground, text-muted-foreground
```

---

## 10. Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### 10.1 Mobile-First Patterns

```tsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>

// Sidebar responsive
<aside className="hidden md:block w-64">
  <Sidebar />
</aside>

// Mobile sidebar (Sheet)
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <Sidebar />
  </SheetContent>
</Sheet>
```

---

## 11. Do's and Don'ts

### ✅ DO

- Use shadcn/ui components for all base UI
- Use 21st.dev for premium animations and effects
- Follow the color system strictly
- Maintain consistent spacing
- Test in both light and dark modes
- Use semantic color tokens
- Add loading states to all async actions
- Provide feedback for user actions (toast)

### ❌ DON'T

- Don't use raw HTML elements (`<button>`, `<input>`)
- Don't hardcode colors (`text-black`, `bg-gray-100`)
- Don't skip focus states
- Don't use inline styles
- Don't mix icon libraries
- Don't forget mobile responsiveness
- Don't use emojis in UI (use icons instead)

---

## 12. File Structure

```
src/
├── app/
│   ├── globals.css           # Global styles + CSS variables
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── magic-ui/             # 21st.dev Magic UI
│   ├── aceternity/           # 21st.dev Aceternity
│   └── [feature]/            # Feature components
├── lib/
│   ├── utils.ts              # cn() helper
│   └── constants.ts          # Design tokens as JS
└── styles/
    └── themes.css            # Theme overrides
```

---

*Design System créé le 2026-09-28*  
*F2G Solutions — KFOKAM48 Telco Academy*
