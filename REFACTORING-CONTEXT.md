# 🚨 F2G CMAS HUB — CONTEXTE COMPLET POUR REFACTORING

**Date:** 2026-09-28
**Mission:** Refactoring complet du frontend — AUCUN composant générique

---

## 📋 RÉSUMÉ DU PROJET

**F2G CMAS Hub** est une plateforme web de gestion d'alertes Cell Broadcast d'urgence pour le Cameroun (CMAS/ETWS).

### URLs
- **Frontend Production:** https://f2g-cmas-hub.vercel.app
- **Frontend Local:** http://localhost:3001
- **Backend Local:** http://localhost:8000
- **Swagger API:** http://localhost:8000/api/v1/docs

### Credentials
- **Admin:** admin@f2g.cm / admin123

---

## 🏗️ ARCHITECTURE

### Backend (FastAPI) — TERMINÉ ✅
```
/home/f2g/F2G_CMAS_HUB/backend/
├── app/
│   ├── main.py                    # Application FastAPI
│   ├── core/
│   │   ├── config.py              # Settings Pydantic
│   │   ├── database.py            # SQLAlchemy async (SQLite)
│   │   └── security.py            # JWT + bcrypt
│   ├── models/
│   │   ├── user.py                # User (ADMIN/OPERATOR/VIEWER)
│   │   ├── alert.py               # Alert, AlertCell, AlertLog
│   │   ├── template.py            # Template
│   │   └── cell_site.py           # CellSite
│   ├── schemas/                   # Pydantic schemas
│   ├── services/
│   │   └── enb_controller.py      # SIB12Generator, ENBController
│   └── api/endpoints/
│       ├── auth.py                # /auth/login, /register, /me
│       ├── alerts.py              # CRUD + /send, /cancel
│       ├── templates.py           # CRUD templates
│       ├── cells.py               # CRUD cells + /status
│       └── stats.py               # Dashboard stats
├── tests/
│   └── test_api.py                # 25 tests (tous passent ✅)
├── venv/
├── cmas_hub.db                    # SQLite database
└── requirements.txt
```

### Frontend (Next.js) — À REFACTORER 🔧
```
/home/f2g/F2G_CMAS_HUB/src/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Redirect to dashboard
│   │   ├── globals.css            # Tailwind styles
│   │   └── (dashboard)/
│   │       ├── layout.tsx         # Dashboard layout avec sidebar
│   │       ├── page.tsx           # Dashboard principal
│   │       ├── alerts/
│   │       │   ├── page.tsx       # Liste des alertes
│   │       │   └── new/
│   │       │       └── page.tsx   # Création d'alerte
│   │       └── templates/
│   │           └── page.tsx       # Liste des templates
│   ├── components/
│   │   ├── ui/                    # 28 composants shadcn/ui
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   └── header.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-alerts.tsx
│   │   │   └── quick-actions.tsx
│   │   └── magicui/
│   │       ├── animated-beam.tsx
│   │       ├── bento-grid.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── utils.ts               # cn() helper
│   │   └── stores/
│   │       └── alert-store.ts     # Mock data
│   └── types/
│       └── index.ts               # TypeScript types
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── vercel.json
```

---

## 🎯 OBJECTIF DU REFACTORING

### ❌ CE QU'IL FAUT ÉLIMINER

1. **Composants génériques** — Tout composant qui ressemble à du template
2. **Mock data** — Remplacer par vraies API calls
3. **Code dupliqué** — Factoriser
4. **Styles inline** — Utiliser Tailwind proprement
5. **any** TypeScript — Typage strict

### ✅ CE QU'IL FAUT CRÉER

1. **Composants métier spécifiques** au domain CMAS/Emergency Alerts
2. **Hooks personnalisés** pour l'API
3. **State management** propre avec Zustand
4. **Error boundaries** et loading states
5. **Animations premium** avec Framer Motion

---

## 📊 DONNÉES MÉTIER

### Types d'alertes (CMAS)
```typescript
// Message IDs selon 3GPP TS 23.041
const CMAS_MESSAGE_IDS = {
  // Presidential Alert (priorité max, pas de désactivation)
  PRESIDENTIAL: 4370,
  
  // Extreme Alerts (menace imminente)
  EXTREME_IMMEDIATE: 4371,
  EXTREME_EXPECTED: 4372,
  
  // Severe Alerts
  SEVERE_IMMEDIATE: 4373,
  SEVERE_EXPECTED: 4374,
  
  // AMBER Alert (enfants disparus)
  AMBER: 4375,
  
  // Test Messages
  TEST: 4376,
  EXERCISE: 4377,
  OPERATOR_DEFINED: 4378,
};

// ETWS (Earthquake/Tsunami Warning)
const ETWS_MESSAGE_IDS = {
  EARTHQUAKE: 4352,
  TSUNAMI: 4353,
  EARTHQUAKE_AND_TSUNAMI: 4354,
  TEST: 4355,
};
```

### Statuts d'alerte
```typescript
type AlertStatus = 
  | "DRAFT"      // Brouillon
  | "SCHEDULED"  // Programmée
  | "SENDING"    // En cours d'envoi
  | "SENT"       // Envoyée
  | "FAILED"     // Échec
  | "CANCELLED"; // Annulée
```

### Structure des données
```typescript
interface Alert {
  id: string;
  title: string;
  content: string;           // Max 1395 caractères
  alert_type: "CMAS" | "ETWS";
  message_id: number;
  status: AlertStatus;
  severity: "presidential" | "extreme" | "severe" | "amber" | "test";
  duration: number;          // Secondes
  scheduled_at?: string;
  sent_at?: string;
  expires_at?: string;
  cells: CellSite[];
  created_by: string;
  created_at: string;
}

interface CellSite {
  id: string;
  name: string;
  cell_id: string;           // Ex: "YDE-001"
  enb_ip: string;
  enb_port: number;
  status: "active" | "offline" | "maintenance";
  location: string;          // "3.8480° N, 11.5021° E"
  last_seen?: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  alert_type: "CMAS" | "ETWS";
  message_id: number;
  default_duration: number;
  is_active: boolean;
}

interface DashboardStats {
  alerts: {
    total: number;
    sent: number;
    scheduled: number;
    failed: number;
    draft: number;
  };
  today: {
    sent: number;
    scheduled: number;
  };
  cells: {
    total: number;
    active: number;
    offline: number;
  };
  success_rate: number;
}
```

---

## 🔌 API ENDPOINTS

### Auth
```
POST /api/v1/auth/login          # Login → JWT token
POST /api/v1/auth/register       # Register new user
GET  /api/v1/auth/me             # Current user info
```

### Alerts
```
GET    /api/v1/alerts            # List (paginated, filterable)
POST   /api/v1/alerts            # Create alert
GET    /api/v1/alerts/{id}       # Get alert details
PATCH  /api/v1/alerts/{id}       # Update alert
DELETE /api/v1/alerts/{id}       # Delete (DRAFT only)
POST   /api/v1/alerts/{id}/send  # Send alert to eNBs
POST   /api/v1/alerts/{id}/cancel # Cancel scheduled alert
```

### Templates
```
GET    /api/v1/templates         # List all templates
POST   /api/v1/templates         # Create template (Admin)
GET    /api/v1/templates/{id}    # Get template
PATCH  /api/v1/templates/{id}    # Update template
DELETE /api/v1/templates/{id}    # Delete template
```

### Cells
```
GET    /api/v1/cells             # List all cell sites
POST   /api/v1/cells             # Add cell site (Admin)
GET    /api/v1/cells/{id}        # Get cell details
PATCH  /api/v1/cells/{id}        # Update cell
DELETE /api/v1/cells/{id}        # Remove cell
GET    /api/v1/cells/{id}/status # Real-time eNB status via SSH
POST   /api/v1/cells/health-check # Check all cells health
```

### Stats
```
GET    /api/v1/stats             # Dashboard statistics
```

---

## 🎨 DESIGN SYSTEM

### Couleurs par sévérité
```css
/* Couleurs d'alerte */
--alert-presidential: hsl(220, 90%, 56%);  /* Bleu roi */
--alert-extreme: hsl(0, 84%, 60%);          /* Rouge */
--alert-severe: hsl(25, 95%, 53%);          /* Orange */
--alert-amber: hsl(45, 93%, 47%);           /* Jaune/Ambre */
--alert-test: hsl(142, 76%, 36%);           /* Vert */
```

### Palette principale
```css
--primary: hsl(220, 90%, 56%);       /* Bleu CMAS */
--destructive: hsl(0, 84%, 60%);     /* Rouge urgence */
--warning: hsl(38, 92%, 50%);        /* Orange avertissement */
--success: hsl(142, 76%, 36%);       /* Vert succès */
```

### Typographie
- **Titres:** Inter ou Geist Sans, bold
- **Corps:** Inter, regular
- **Mono:** Geist Mono (pour IDs, codes)

---

## 🧩 COMPOSANTS À CRÉER

### Dashboard
```
AlertDashboard
├── AlertStatsGrid           # KPIs avec NumberTicker animé
├── ActiveAlertsBanner       # Alertes en cours (pulsing)
├── RecentAlertsTimeline     # Timeline verticale
├── CellStatusMap            # Carte des cellules (optionnel)
└── QuickActionsPanel        # Actions rapides
```

### Alerts
```
AlertList
├── AlertFilters             # Filtres status/type/date
├── AlertTable               # Table avec actions
│   └── AlertRow             # Ligne avec status badge
├── AlertPagination          # Pagination
└── AlertEmptyState          # État vide illustré

AlertForm
├── AlertTypeSelector        # Sélection visuelle du type
├── MessageComposer          # Éditeur avec compteur
├── CellSelector             # Multi-select des cellules
├── SchedulePicker           # Date/heure programmation
├── DurationSelector         # Durée de validité
└── AlertPreview             # Aperçu avant envoi
```

### Templates
```
TemplateGallery
├── TemplateCard             # Carte avec preview
├── TemplateEditor           # Modal d'édition
└── TemplatePreview          # Preview du message
```

### Cells
```
CellManager
├── CellGrid                 # Grille de cellules
│   └── CellCard             # Carte avec status live
├── CellStatusIndicator      # Indicateur temps réel
└── CellHealthCheck          # Bouton vérification
```

### Shared
```
StatusBadge                  # Badge avec couleur par status
SeverityIndicator            # Indicateur visuel sévérité
ConfirmDialog                # Dialog de confirmation
LoadingState                 # Skeleton loaders
ErrorState                   # État d'erreur avec retry
EmptyState                   # État vide illustré
Toast                        # Notifications Sonner
```

---

## 🔧 HOOKS À CRÉER

```typescript
// API hooks avec React Query
useAlerts(filters?)          // Liste des alertes
useAlert(id)                 // Détail d'une alerte
useCreateAlert()             // Mutation création
useUpdateAlert()             // Mutation update
useSendAlert()               // Mutation envoi
useCancelAlert()             // Mutation annulation

useTemplates()               // Liste des templates
useTemplate(id)              // Détail template

useCells()                   // Liste des cellules
useCellStatus(id)            // Status temps réel

useStats()                   // Stats dashboard

useAuth()                    // Auth state + actions
useCurrentUser()             // User actuel
```

---

## 📁 STRUCTURE CIBLE

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── alerts/
│   │   │   ├── page.tsx          # Liste
│   │   │   ├── new/page.tsx      # Création
│   │   │   └── [id]/page.tsx     # Détail/Edit
│   │   ├── templates/
│   │   │   └── page.tsx
│   │   ├── cells/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── alerts/                   # Composants alertes
│   ├── templates/                # Composants templates
│   ├── cells/                    # Composants cellules
│   ├── dashboard/                # Composants dashboard
│   ├── layout/                   # Layout components
│   └── shared/                   # Composants partagés
├── hooks/
│   ├── use-alerts.ts
│   ├── use-templates.ts
│   ├── use-cells.ts
│   ├── use-stats.ts
│   └── use-auth.ts
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios/fetch config
│   │   ├── alerts.ts             # API alerts
│   │   ├── templates.ts          # API templates
│   │   ├── cells.ts              # API cells
│   │   └── auth.ts               # API auth
│   ├── stores/
│   │   └── auth-store.ts         # Zustand auth
│   └── utils/
│       ├── cn.ts                 # Class names
│       ├── format.ts             # Formatters
│       └── constants.ts          # Constants
├── types/
│   ├── alert.ts
│   ├── template.ts
│   ├── cell.ts
│   ├── user.ts
│   └── api.ts
└── styles/
    └── animations.css            # Animations custom
```

---

## ⚡ SKILLS DISPONIBLES

Ces skills sont installés dans `/home/f2g/.kiro/skills/` :

1. **high-end-visual-design** — Design premium anti-générique
2. **magic-ui** — Composants animés (NumberTicker, BorderBeam, etc.)
3. **framer-motion** — Animations avancées
4. **shadcn-ui** — Base components (à personnaliser)
5. **better-ui** — Polish et micro-interactions
6. **design-taste-frontend** — Anti-slop frontend

---

## 🚫 RÈGLES STRICTES

1. **AUCUN composant qui ressemble à un template**
2. **AUCUN placeholder "Lorem ipsum"**
3. **AUCUN "TODO" ou "FIXME" laissé**
4. **AUCUN `any` TypeScript**
5. **AUCUN console.log en production**
6. **AUCUNE dépendance non justifiée**

---

## ✅ CHECKLIST REFACTORING

- [ ] Supprimer tous les mock data
- [ ] Créer le client API avec interceptors
- [ ] Implémenter tous les hooks React Query
- [ ] Créer les composants métier spécifiques
- [ ] Ajouter les animations Framer Motion
- [ ] Implémenter l'authentification complète
- [ ] Ajouter les error boundaries
- [ ] Tester tous les flows utilisateur
- [ ] Optimiser les performances (lazy loading, memoization)
- [ ] Vérifier l'accessibilité (a11y)

---

## 🚀 COMMANDES

```bash
# Développement
cd /home/f2g/F2G_CMAS_HUB/src
pnpm dev --port 3001

# Build
pnpm build

# Lint
pnpm lint

# TypeScript check
pnpm tsc --noEmit

# Backend (autre terminal)
cd /home/f2g/F2G_CMAS_HUB/backend
source venv/bin/activate
DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db" uvicorn app.main:app --port 8000

# Tests backend
DATABASE_URL="sqlite+aiosqlite:///./cmas_hub.db" pytest
```

---

**IMPORTANT:** Le backend est 100% fonctionnel avec 25 tests qui passent. Le refactoring concerne UNIQUEMENT le frontend. L'API est stable et documentée sur Swagger.

*Contexte généré le 2026-09-28 23:54*
