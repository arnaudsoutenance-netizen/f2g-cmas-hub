# F2G CMAS Hub — Developer Handoff Context

## 🎯 Project Overview

**F2G CMAS Hub** is a Cell Broadcast Alert System (CMAS/ETWS) web dashboard for emergency alert broadcasting in Cameroon. It allows operators to create, schedule, and broadcast alerts to mobile phones via 4G cell towers.

### Architecture
```
┌─────────────────────────────────────────────────────────────────────────┐
│                           VERCEL (Frontend)                             │
│                    https://f2g-cmas-hub.vercel.app                      │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Next.js 14 (App Router)                        │  │
│  │  • TypeScript strict                                               │  │
│  │  • Tailwind CSS + shadcn/ui                                        │  │
│  │  • Framer Motion (via LazyMotion)                                  │  │
│  │  • TanStack Query for data fetching                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS (Tailscale Funnel)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       LAB PC (Backend + Telecom)                        │
│          https://f2g-yoga-7-2-in-1-14iml9.tail2c3e06.ts.net             │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    FastAPI Backend (Port 8000)                     │  │
│  │  • REST API at /api/v1/*                                           │  │
│  │  • SQLite database                                                 │  │
│  │  • SSH access to eNodeB for real broadcast                         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                    │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Open5GS + srsRAN (4G Core)                      │  │
│  │  • MME, HSS, PCRF, SGW, PGW (Docker)                               │  │
│  │  • srsENB connected via bladeRF xA4                                │  │
│  │  • Real cell broadcast over the air                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
/home/f2g/F2G_CMAS_HUB/
├── src/                          # ← Vercel Root Directory
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── (auth)/           # Auth pages (login)
│   │   │   ├── (dashboard)/      # Protected dashboard pages
│   │   │   │   ├── page.tsx      # Dashboard home
│   │   │   │   ├── alerts/       # /alerts, /alerts/new, /alerts/[id]
│   │   │   │   ├── cells/        # /cells
│   │   │   │   ├── templates/    # /templates
│   │   │   │   ├── settings/     # /settings
│   │   │   │   └── history/      # /history
│   │   │   ├── api/              # API routes (proxy to backend)
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── globals.css       # Global styles + CSS variables
│   │   │
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── shell/            # App shell (sidebar, topbar)
│   │   │   ├── dashboard/        # Dashboard-specific components
│   │   │   ├── alerts/           # Alert-related components
│   │   │   ├── composer/         # Alert creation wizard
│   │   │   └── providers/        # Context providers
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities, API client
│   │   └── types/                # TypeScript types
│   │
│   ├── package.json              # Dependencies (pnpm)
│   ├── tailwind.config.ts        # Tailwind configuration
│   ├── tsconfig.json             # TypeScript config
│   └── vercel.json               # Vercel deployment config
│
├── backend/                      # FastAPI backend (stays on lab PC)
│   ├── main.py                   # FastAPI app
│   ├── f2g-cmas-hub.service      # Systemd service
│   └── f2g-cmas-funnel.service   # Tailscale service
│
└── docs/
    └── DESIGN.md                 # Design system documentation
```

---

## 🚀 Development & Deployment Workflow

### Local Development
```bash
cd /home/f2g/F2G_CMAS_HUB/src
pnpm install          # Install dependencies
pnpm dev              # Start dev server at localhost:3000
pnpm build            # Build for production
pnpm tsc --noEmit     # Type check
```

### Deployment Pipeline
```
1. Make changes locally
2. Test with: pnpm tsc --noEmit --skipLibCheck
3. Commit:    git add -A && git commit -m "feat: description"
4. Push:      git push origin develop
5. Vercel auto-builds from develop branch
6. Update alias: vercel alias set <deploy-url> f2g-cmas-hub.vercel.app
```

### Git Configuration
- **Repository**: `github.com:arnaudsoutenance-netizen/f2g-cmas-hub`
- **Branch**: `develop` (auto-deploys to Vercel Preview)
- **Main**: Only merge after validation

---

## 🔧 Key Configuration Files

### vercel.json
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://f2g-yoga-7-2-in-1-14iml9.tail2c3e06.ts.net/api/v1"
  }
}
```

### Environment Variables (Vercel)
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://f2g-yoga-7-2-in-1-14iml9.tail2c3e06.ts.net/api/v1` |

---

## 🎨 Design System

### Colors (CSS Variables in globals.css)
```css
:root {
  --primary: #1F3864;        /* Navy - primary brand */
  --brand-orange: #B85418;   /* Orange - secondary accent */
  --ink: #1a1a1a;            /* Primary text */
  --ink-2: #4a4a4a;          /* Secondary text */
  --ink-3: #8a8a8a;          /* Tertiary text */
  --surface: #ffffff;        /* Card backgrounds */
  --surface-sunken: #f5f5f5; /* Sunken areas */
  --hairline: #e5e5e5;       /* Borders */
}
```

### Typography
- **Display**: Baloo 2 (headings)
- **Body**: IBM Plex Sans
- **Mono**: IBM Plex Mono (code)

### Components
- All UI components use **shadcn/ui**
- Animations use **Framer Motion** via `LazyMotion` + `m.*` (not `motion.*`)
- Icons from **Lucide React**

### Design Rules (from DESIGN.md)
❌ **FORBIDDEN**: shimmer, beam, ripple, gradient blobs, glassmorphism, particles, glow effects
✅ **ALLOWED**: Solid colors, subtle shadows, clean borders, simple transitions

---

## 🔌 API Endpoints

### Backend API (FastAPI)
Base URL: `https://f2g-yoga-7-2-in-1-14iml9.tail2c3e06.ts.net/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/alerts` | GET | List alerts |
| `/alerts` | POST | Create alert |
| `/alerts/{id}` | GET | Get alert details |
| `/alerts/{id}/send` | POST | ⚠️ **DANGEROUS** - Broadcasts alert |
| `/alerts/{id}/cancel` | POST | Cancel alert |
| `/cells` | GET | List cells |
| `/stats` | GET | Dashboard statistics |
| `/templates` | GET | List templates |

### Frontend API Routes (Next.js)
The frontend proxies API calls through `/api/*` routes to the backend.

---

## 🔐 Authentication

- **Login**: Email/password via `/api/auth/login`
- **Session**: JWT stored in httpOnly cookie
- **Test credentials**: `admin@f2g.cm` / `admin123`

---

## ⚠️ Critical Warnings

### NEVER trigger `/send` endpoint
The backend controls real radio hardware. Calling `/alerts/{id}/send` will broadcast to actual cell towers and mobile phones.

### Backend must stay on lab PC
The backend needs SSH access to eNodeB equipment. It cannot be deployed to Vercel.

### Change password before production
Current password `admin123` is for development only.

---

## 📍 URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://f2g-cmas-hub.vercel.app |
| **Backend API** | https://f2g-yoga-7-2-in-1-14iml9.tail2c3e06.ts.net |
| **GitHub** | github.com/arnaudsoutenance-netizen/f2g-cmas-hub |

---

## 🛠 Common Tasks

### Add a new page
1. Create `src/src/app/(dashboard)/newpage/page.tsx`
2. Add to navigation in `src/src/components/shell/nav-items.ts`
3. Build and test: `pnpm tsc --noEmit`

### Add a component
1. Use shadcn CLI: `pnpm dlx shadcn@latest add <component>`
2. Or create in `src/src/components/`

### Update deployment
```bash
git add -A
git commit -m "feat: description"
git push origin develop
# Wait ~45 seconds for build
vercel alias set <new-url> f2g-cmas-hub.vercel.app
```

---

## 📦 Key Dependencies

```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "@tanstack/react-query": "5.x",
  "framer-motion": "11.x",
  "tailwindcss": "3.x",
  "next-themes": "^0.3.0",
  "date-fns": "^3.x",
  "lucide-react": "^0.400.x",
  "sonner": "^1.x"
}
```

---

*Last updated: 2026-09-29*
*Maintainer: Arnaud DJOUM (arnaudchewa65@gmail.com)*
