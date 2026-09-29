# F2G CMAS HUB — Technical Design Document

**Version:** 1.0  
**Date:** 2026-09-28  
**Auteur:** Arnaud DJOUM — F2G Solutions  
**Statut:** Draft

---

## 1. System Overview

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           F2G CMAS HUB ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │         WEB BROWSER                  │
                    │    (Chrome/Firefox/Edge)            │
                    └──────────────┬──────────────────────┘
                                   │ HTTPS
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Next.js 14 (App Router)                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │   │
│  │  │Dashboard │ │  Alerts  │ │Templates │ │ Settings │              │   │
│  │  │  Page    │ │   Page   │ │   Page   │ │   Page   │              │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │   │
│  │                                                                      │   │
│  │  Components: shadcn/ui + 21st.dev (Magic UI, Aceternity)            │   │
│  │  State: React Query + Zustand                                        │   │
│  │  Forms: React Hook Form + Zod                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ REST API / Server Actions
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   Next.js API Routes / FastAPI                       │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │   │
│  │  │ Alert CRUD   │ │  Scheduler   │ │  Dispatcher  │               │   │
│  │  │   Service    │ │   Service    │ │   Service    │               │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐       │
│  │   PostgreSQL    │    │     Redis       │    │  Config Store   │       │
│  │   (Alerts DB)   │    │  (Job Queue)    │    │  (SIB Files)    │       │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ SSH / ZMQ
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RAN INFRASTRUCTURE                                 │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                         eNB Controller                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │ SIB12 Gen    │  │ Config Push  │  │ SIGHUP Reload│               │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                    ┌──────────────┼──────────────┐                         │
│                    ▼              ▼              ▼                         │
│             ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│             │  eNB #1  │  │  eNB #2  │  │  eNB #3  │                      │
│             │ srsRAN   │  │ srsRAN   │  │ srsRAN   │                      │
│             └──────────┘  └──────────┘  └──────────┘                      │
│                    │              │              │                         │
│                    ▼              ▼              ▼                         │
│             ┌──────────────────────────────────────────┐                   │
│             │            CELL BROADCAST                │                   │
│             │       📱 📱 📱 📱 📱 📱 📱 📱          │                   │
│             │           UEs (Téléphones)               │                   │
│             └──────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js | 14.x | App Router, SSR, API Routes |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| UI Components | shadcn/ui | latest | Base components |
| UI Components | 21st.dev | latest | Premium components |
| Animation | Framer Motion | 11.x | Animations |
| State | Zustand | 4.x | Global state |
| Data Fetching | TanStack Query | 5.x | Server state |
| Forms | React Hook Form | 7.x | Form handling |
| Validation | Zod | 3.x | Schema validation |
| Icons | Lucide React | latest | Icon library |
| Toast | Sonner | 1.x | Notifications |

### 2.2 Backend

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| API | Next.js API Routes | 14.x | REST endpoints |
| ORM | Prisma | 5.x | Database access |
| Database | PostgreSQL | 15+ | Primary storage |
| Cache/Queue | Redis | 7.x | Job scheduling |
| Validation | Zod | 3.x | Input validation |

### 2.3 Infrastructure

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| eNB Control | SSH2 (Node) | 1.x | Remote commands |
| Config Gen | Custom | - | SIB12 generation |
| Scheduler | node-cron | 3.x | Scheduled jobs |

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                  │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │     alerts      │       │    templates    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──────<│ created_by (FK) │       │ id (PK)         │
│ email           │       │ id (PK)         │>──────│ name            │
│ name            │       │ template_id(FK) │       │ category        │
│ role            │       │ alert_type      │       │ alert_type      │
│ password_hash   │       │ message_id      │       │ message_id      │
│ created_at      │       │ content         │       │ content         │
│ updated_at      │       │ cells           │       │ default_cells   │
└─────────────────┘       │ status          │       │ default_duration│
                          │ scheduled_at    │       │ created_at      │
┌─────────────────┐       │ sent_at         │       │ updated_at      │
│    cell_sites   │       │ expires_at      │       └─────────────────┘
├─────────────────┤       │ created_at      │
│ id (PK)         │       │ updated_at      │
│ name            │       └─────────────────┘
│ cell_id         │               │
│ enb_ip          │               │
│ enb_port        │       ┌───────┴───────┐
│ location        │       ▼               ▼
│ status          │┌─────────────┐ ┌─────────────┐
│ created_at      ││alert_cells  │ │ alert_logs  │
└─────────────────┘├─────────────┤ ├─────────────┤
        │          │ alert_id(FK)│ │ id (PK)     │
        │          │ cell_id(FK) │ │ alert_id(FK)│
        └─────────<│             │ │ action      │
                   └─────────────┘ │ status      │
                                   │ message     │
                                   │ timestamp   │
                                   └─────────────┘
```

### 3.2 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  OPERATOR
  VIEWER
}

enum AlertType {
  CMAS
  ETWS
}

enum AlertStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
  CANCELLED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  role         UserRole @default(OPERATOR)
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  alerts       Alert[]

  @@map("users")
}

model Alert {
  id          String      @id @default(cuid())
  alertType   AlertType   @map("alert_type")
  messageId   Int         @map("message_id")
  content     String
  status      AlertStatus @default(DRAFT)
  scheduledAt DateTime?   @map("scheduled_at")
  sentAt      DateTime?   @map("sent_at")
  expiresAt   DateTime?   @map("expires_at")
  duration    Int         @default(3600) // seconds
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")
  
  // Relations
  createdBy   User        @relation(fields: [createdById], references: [id])
  createdById String      @map("created_by")
  template    Template?   @relation(fields: [templateId], references: [id])
  templateId  String?     @map("template_id")
  cells       AlertCell[]
  logs        AlertLog[]

  @@map("alerts")
}

model Template {
  id              String    @id @default(cuid())
  name            String
  category        String
  alertType       AlertType @map("alert_type")
  messageId       Int       @map("message_id")
  content         String
  defaultDuration Int       @default(3600) @map("default_duration")
  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  alerts          Alert[]

  @@map("templates")
}

model CellSite {
  id        String      @id @default(cuid())
  name      String
  cellId    String      @unique @map("cell_id")
  enbIp     String      @map("enb_ip")
  enbPort   Int         @default(22) @map("enb_port")
  location  String?
  status    String      @default("active")
  createdAt DateTime    @default(now()) @map("created_at")
  updatedAt DateTime    @updatedAt @map("updated_at")
  alerts    AlertCell[]

  @@map("cell_sites")
}

model AlertCell {
  alert     Alert    @relation(fields: [alertId], references: [id], onDelete: Cascade)
  alertId   String   @map("alert_id")
  cell      CellSite @relation(fields: [cellId], references: [id])
  cellId    String   @map("cell_id")
  status    String   @default("pending")
  sentAt    DateTime? @map("sent_at")

  @@id([alertId, cellId])
  @@map("alert_cells")
}

model AlertLog {
  id        String   @id @default(cuid())
  alert     Alert    @relation(fields: [alertId], references: [id], onDelete: Cascade)
  alertId   String   @map("alert_id")
  action    String
  status    String
  message   String?
  metadata  Json?
  timestamp DateTime @default(now())

  @@map("alert_logs")
}
```

---

## 4. API Specification

### 4.1 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List all alerts |
| POST | `/api/alerts` | Create new alert |
| GET | `/api/alerts/:id` | Get alert details |
| PATCH | `/api/alerts/:id` | Update alert |
| DELETE | `/api/alerts/:id` | Delete alert |
| POST | `/api/alerts/:id/send` | Send alert immediately |
| POST | `/api/alerts/:id/cancel` | Cancel scheduled alert |
| GET | `/api/templates` | List templates |
| GET | `/api/cells` | List cell sites |
| GET | `/api/stats` | Get dashboard stats |
| GET | `/api/logs` | Get alert logs |

### 4.2 API Schemas (Zod)

```typescript
// schemas/alert.ts
import { z } from 'zod';

export const AlertTypeEnum = z.enum(['CMAS', 'ETWS']);
export const AlertStatusEnum = z.enum([
  'DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELLED'
]);

export const CreateAlertSchema = z.object({
  alertType: AlertTypeEnum,
  messageId: z.number().int().min(4370).max(4399),
  content: z.string().min(1).max(1395),
  cellIds: z.array(z.string()).min(1),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().min(60).max(86400).default(3600),
  templateId: z.string().optional(),
});

export const UpdateAlertSchema = CreateAlertSchema.partial();

export const SendAlertSchema = z.object({
  immediate: z.boolean().default(true),
});
```

---

## 5. Component Architecture

### 5.1 Page Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── page.tsx                    # Dashboard
│   ├── alerts/
│   │   ├── page.tsx                # Alerts list
│   │   ├── new/
│   │   │   └── page.tsx            # Create alert
│   │   └── [id]/
│   │       └── page.tsx            # Alert details
│   ├── templates/
│   │   └── page.tsx                # Templates library
│   ├── history/
│   │   └── page.tsx                # Logs & history
│   ├── settings/
│   │   └── page.tsx                # Settings
│   └── layout.tsx                  # Dashboard layout
├── api/
│   ├── alerts/
│   │   ├── route.ts                # GET, POST
│   │   └── [id]/
│   │       ├── route.ts            # GET, PATCH, DELETE
│   │       ├── send/
│   │       │   └── route.ts        # POST
│   │       └── cancel/
│   │           └── route.ts        # POST
│   ├── templates/
│   │   └── route.ts
│   ├── cells/
│   │   └── route.ts
│   └── stats/
│       └── route.ts
├── globals.css
└── layout.tsx
```

### 5.2 Component Hierarchy

```
components/
├── ui/                             # shadcn/ui base
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   └── ...
├── magic-ui/                       # 21st.dev Magic UI
│   ├── animated-beam.tsx
│   ├── bento-grid.tsx
│   ├── number-ticker.tsx
│   ├── marquee.tsx
│   └── ...
├── aceternity/                     # 21st.dev Aceternity
│   ├── spotlight.tsx
│   ├── background-beams.tsx
│   └── ...
├── alerts/
│   ├── alert-card.tsx
│   ├── alert-form.tsx
│   ├── alert-list.tsx
│   ├── alert-status-badge.tsx
│   ├── alert-type-selector.tsx
│   ├── message-id-selector.tsx
│   └── cell-selector.tsx
├── dashboard/
│   ├── stats-cards.tsx
│   ├── recent-alerts.tsx
│   ├── enb-status.tsx
│   └── quick-actions.tsx
├── templates/
│   ├── template-card.tsx
│   ├── template-list.tsx
│   └── template-picker.tsx
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── nav-item.tsx
│   └── user-menu.tsx
└── shared/
    ├── loading-spinner.tsx
    ├── empty-state.tsx
    ├── error-boundary.tsx
    └── confirm-dialog.tsx
```

---

## 6. Message ID Reference (3GPP)

### 6.1 CMAS Message IDs (TS 23.041)

| ID | Name | Description | Opt-out |
|----|------|-------------|---------|
| 4370 | Presidential | National emergency (highest priority) | No |
| 4371 | Extreme Immediate | Extreme threat, immediate action | No |
| 4372 | Extreme Likely | Extreme threat, expected soon | No |
| 4373 | Severe Immediate | Severe threat, immediate action | Yes |
| 4374 | Severe Likely | Severe threat, expected soon | Yes |
| 4375 | AMBER Alert | Child abduction emergency | Yes |
| 4376 | RMT | Required Monthly Test | Yes |
| 4377 | Exercise | Exercise/drill alert | Yes |
| 4378 | Operator | Operator-defined alert | Yes |
| 4379 | Presidential Spanish | Presidential in Spanish | No |
| 4380-4382 | Extreme Spanish | Extreme alerts in Spanish | No/Yes |
| 4383-4392 | Severe/AMBER Spanish | Other alerts in Spanish | Yes |

### 6.2 ETWS Message IDs

| ID | Name | Description |
|----|------|-------------|
| 4352 | Earthquake | Earthquake warning |
| 4353 | Tsunami | Tsunami warning |
| 4354 | Earthquake+Tsunami | Combined warning |
| 4355 | Test | ETWS test message |
| 4356-4359 | Reserved | Future use |

---

## 7. SIB12 Configuration Format

### 7.1 srsRAN SIB12 Structure

```yaml
# sib12.conf - Cell Broadcast Configuration
sib12 =
{
  message_identifier = 4370;
  serial_number = 0x3000;
  warning_type = 0;  # 0=earthquake, 1=tsunami, 2=combined, 3=test
  data_coding_scheme = 0x01;  # GSM 7-bit
  warning_message = "ALERTE NATIONALE: Restez chez vous.";
  number_of_pages = 1;
  cb_data = "";  # Hex-encoded if needed
};
```

### 7.2 Config Generator (TypeScript)

```typescript
// lib/sib12-generator.ts

interface SIB12Config {
  messageIdentifier: number;
  serialNumber: number;
  warningType: number;
  dataCodingScheme: number;
  warningMessage: string;
  numberOfPages: number;
}

export function generateSIB12Config(alert: Alert): string {
  const config: SIB12Config = {
    messageIdentifier: alert.messageId,
    serialNumber: generateSerialNumber(),
    warningType: getWarningType(alert.alertType),
    dataCodingScheme: 0x01, // GSM 7-bit
    warningMessage: alert.content,
    numberOfPages: Math.ceil(alert.content.length / 93),
  };

  return `
sib12 =
{
  message_identifier = ${config.messageIdentifier};
  serial_number = ${config.serialNumber};
  warning_type = ${config.warningType};
  data_coding_scheme = ${config.dataCodingScheme};
  warning_message = "${escapeString(config.warningMessage)}";
  number_of_pages = ${config.numberOfPages};
  cb_data = "";
};
`.trim();
}

function generateSerialNumber(): number {
  // Format: 0xGGSS where GG=geographic scope, SS=message code
  const geoScope = 0x30; // Cell-wide
  const messageCode = Math.floor(Math.random() * 256);
  return (geoScope << 8) | messageCode;
}

function getWarningType(alertType: AlertType): number {
  switch (alertType) {
    case 'ETWS': return 0;
    case 'CMAS': return 3;
    default: return 3;
  }
}

function escapeString(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
```

---

## 8. eNB Control Protocol

### 8.1 Hot-Reload Mechanism

```
┌─────────────────────────────────────────────────────────────────────┐
│                    eNB HOT-RELOAD SEQUENCE                          │
└─────────────────────────────────────────────────────────────────────┘

  CMAS Hub                    SSH                      eNB (srsRAN)
     │                         │                            │
     │  1. Generate SIB12      │                            │
     │  ─────────────────►     │                            │
     │                         │                            │
     │  2. SFTP Upload Config  │                            │
     │  ────────────────────────────────────────────────►   │
     │                         │                            │
     │  3. SSH Command         │                            │
     │  ─────────────────►     │                            │
     │                         │  kill -SIGHUP <pid>        │
     │                         │  ─────────────────────►    │
     │                         │                            │
     │                         │       Config Reloaded      │
     │                         │  ◄─────────────────────    │
     │                         │                            │
     │  4. Verify (optional)   │                            │
     │  ────────────────────────────────────────────────►   │
     │                         │                            │
     │       OK / Error        │                            │
     │  ◄────────────────────────────────────────────────   │
     │                         │                            │
```

### 8.2 SSH Controller (Node.js)

```typescript
// lib/enb-controller.ts
import { Client } from 'ssh2';

interface ENBConnection {
  host: string;
  port: number;
  username: string;
  privateKey: string;
}

interface ENBController {
  connect(): Promise<void>;
  uploadConfig(localPath: string, remotePath: string): Promise<void>;
  reloadConfig(): Promise<void>;
  getStatus(): Promise<ENBStatus>;
  disconnect(): void;
}

export async function createENBController(conn: ENBConnection): Promise<ENBController> {
  const client = new Client();
  
  return {
    async connect() {
      return new Promise((resolve, reject) => {
        client.on('ready', resolve);
        client.on('error', reject);
        client.connect({
          host: conn.host,
          port: conn.port,
          username: conn.username,
          privateKey: conn.privateKey,
        });
      });
    },

    async uploadConfig(localPath: string, remotePath: string) {
      return new Promise((resolve, reject) => {
        client.sftp((err, sftp) => {
          if (err) return reject(err);
          sftp.fastPut(localPath, remotePath, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    },

    async reloadConfig() {
      return new Promise((resolve, reject) => {
        // Find srsENB process and send SIGHUP
        const cmd = `
          PID=$(pgrep -f srsenb)
          if [ -n "$PID" ]; then
            kill -SIGHUP $PID
            echo "SIGHUP sent to PID $PID"
          else
            echo "ERROR: srsenb not running"
            exit 1
          fi
        `;
        client.exec(cmd, (err, stream) => {
          if (err) return reject(err);
          let output = '';
          stream.on('data', (data: Buffer) => output += data.toString());
          stream.on('close', (code: number) => {
            if (code === 0) resolve(output);
            else reject(new Error(output));
          });
        });
      });
    },

    async getStatus() {
      return new Promise((resolve, reject) => {
        const cmd = 'pgrep -f srsenb && echo "RUNNING" || echo "STOPPED"';
        client.exec(cmd, (err, stream) => {
          if (err) return reject(err);
          let output = '';
          stream.on('data', (data: Buffer) => output += data.toString());
          stream.on('close', () => {
            resolve({
              running: output.includes('RUNNING'),
              pid: output.match(/^\d+/)?.[0],
            });
          });
        });
      });
    },

    disconnect() {
      client.end();
    },
  };
}
```

---

## 9. Scheduling System

### 9.1 Job Queue Architecture

```typescript
// lib/scheduler.ts
import cron from 'node-cron';
import { prisma } from './prisma';
import { dispatchAlert } from './dispatcher';

// Check for scheduled alerts every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  
  const pendingAlerts = await prisma.alert.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: {
        lte: now,
      },
    },
    include: {
      cells: {
        include: {
          cell: true,
        },
      },
    },
  });

  for (const alert of pendingAlerts) {
    try {
      await dispatchAlert(alert);
    } catch (error) {
      console.error(`Failed to dispatch alert ${alert.id}:`, error);
      await prisma.alert.update({
        where: { id: alert.id },
        data: { status: 'FAILED' },
      });
    }
  }
});
```

---

## 10. Security Considerations

### 10.1 Authentication

- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt (cost factor 12)
- Session timeout: 8 hours

### 10.2 Authorization

| Role | Permissions |
|------|-------------|
| ADMIN | Full access, user management |
| OPERATOR | Create, edit, send alerts |
| VIEWER | Read-only access |

### 10.3 Input Validation

- All inputs validated with Zod schemas
- SQL injection prevented by Prisma ORM
- XSS prevented by React's automatic escaping
- CSRF protection with SameSite cookies

### 10.4 Network Security

- HTTPS mandatory in production
- SSH key authentication for eNB control
- API rate limiting: 100 requests/minute

---

## 11. Deployment

### 11.1 Development

```bash
# Start development server
pnpm dev

# Run database migrations
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate
```

### 11.2 Production

```bash
# Build
pnpm build

# Start
pnpm start

# Or with PM2
pm2 start ecosystem.config.js
```

### 11.3 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/cmas_hub"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-secret-key"
NEXTAUTH_URL="https://cmas.f2g.cm"

# eNB Configuration
ENB_SSH_HOST="192.168.1.100"
ENB_SSH_USER="enb"
ENB_SSH_KEY_PATH="/path/to/key"
ENB_CONFIG_PATH="/etc/srsenb/sib.conf"
```

---

## 12. Testing Strategy

### 12.1 Unit Tests

```typescript
// __tests__/sib12-generator.test.ts
import { generateSIB12Config } from '@/lib/sib12-generator';

describe('SIB12 Generator', () => {
  it('should generate valid config for CMAS alert', () => {
    const alert = {
      messageId: 4370,
      alertType: 'CMAS',
      content: 'Test alert message',
    };
    
    const config = generateSIB12Config(alert);
    
    expect(config).toContain('message_identifier = 4370');
    expect(config).toContain('Test alert message');
  });
});
```

### 12.2 Integration Tests

- API endpoint tests with supertest
- Database tests with test containers
- SSH mock for eNB controller tests

### 12.3 E2E Tests

- Playwright tests for critical flows
- Alert creation flow
- Alert dispatch flow

---

*Document créé le 2026-09-28*  
*F2G Solutions — KFOKAM48 Telco Academy*
