# F2G CMAS HUB — API Specification

**Version:** 1.0.0  
**Base URL:** `/api`  
**Format:** REST JSON

---

## 1. Authentication

### 1.1 Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "operator@f2g.cm",
  "password": "********"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "operator@f2g.cm",
    "name": "Jean Operator",
    "role": "OPERATOR"
  },
  "token": "eyJhbG..."
}
```

### 1.2 Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 2. Alerts

### 2.1 List Alerts

```http
GET /api/alerts?status=SCHEDULED&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (DRAFT, SCHEDULED, SENT, FAILED) |
| alertType | string | Filter by type (CMAS, ETWS) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| sortBy | string | Sort field (createdAt, scheduledAt) |
| sortOrder | string | Sort order (asc, desc) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "alertType": "CMAS",
      "messageId": 4370,
      "content": "ALERTE NATIONALE: Restez chez vous.",
      "status": "SCHEDULED",
      "scheduledAt": "2026-09-28T15:00:00Z",
      "sentAt": null,
      "expiresAt": "2026-09-28T16:00:00Z",
      "duration": 3600,
      "createdAt": "2026-09-28T10:00:00Z",
      "updatedAt": "2026-09-28T10:00:00Z",
      "cells": [
        {
          "cellId": "cell-001",
          "name": "Yaoundé Centre",
          "status": "pending"
        }
      ],
      "createdBy": {
        "id": "clx0987654321",
        "name": "Jean Operator"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 2.2 Get Alert by ID

```http
GET /api/alerts/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "clx1234567890",
  "alertType": "CMAS",
  "messageId": 4370,
  "content": "ALERTE NATIONALE: Restez chez vous.",
  "status": "SCHEDULED",
  "scheduledAt": "2026-09-28T15:00:00Z",
  "sentAt": null,
  "expiresAt": "2026-09-28T16:00:00Z",
  "duration": 3600,
  "createdAt": "2026-09-28T10:00:00Z",
  "updatedAt": "2026-09-28T10:00:00Z",
  "cells": [
    {
      "cellId": "cell-001",
      "name": "Yaoundé Centre",
      "status": "pending",
      "sentAt": null
    },
    {
      "cellId": "cell-002",
      "name": "Yaoundé Nord",
      "status": "pending",
      "sentAt": null
    }
  ],
  "logs": [
    {
      "id": "log-001",
      "action": "CREATED",
      "status": "success",
      "message": "Alert created",
      "timestamp": "2026-09-28T10:00:00Z"
    },
    {
      "id": "log-002",
      "action": "SCHEDULED",
      "status": "success",
      "message": "Alert scheduled for 2026-09-28T15:00:00Z",
      "timestamp": "2026-09-28T10:05:00Z"
    }
  ],
  "template": {
    "id": "tpl-001",
    "name": "Alerte Présidentielle"
  },
  "createdBy": {
    "id": "clx0987654321",
    "name": "Jean Operator",
    "email": "operator@f2g.cm"
  }
}
```

### 2.3 Create Alert

```http
POST /api/alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "alertType": "CMAS",
  "messageId": 4370,
  "content": "ALERTE NATIONALE: Restez chez vous.",
  "cellIds": ["cell-001", "cell-002"],
  "scheduledAt": "2026-09-28T15:00:00Z",
  "duration": 3600,
  "templateId": "tpl-001"
}
```

**Request Body Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| alertType | enum | Yes | CMAS or ETWS |
| messageId | number | Yes | 4370-4399 (CMAS) or 4352-4359 (ETWS) |
| content | string | Yes | Alert message (1-1395 chars) |
| cellIds | string[] | Yes | Target cell site IDs |
| scheduledAt | datetime | No | Schedule time (ISO 8601) |
| duration | number | No | Validity in seconds (default: 3600) |
| templateId | string | No | Template ID if using a template |

**Response 201:**
```json
{
  "id": "clx1234567890",
  "alertType": "CMAS",
  "messageId": 4370,
  "content": "ALERTE NATIONALE: Restez chez vous.",
  "status": "DRAFT",
  "createdAt": "2026-09-28T10:00:00Z"
}
```

**Error 400:**
```json
{
  "error": "Validation Error",
  "message": "Content exceeds maximum length of 1395 characters",
  "field": "content"
}
```

### 2.4 Update Alert

```http
PATCH /api/alerts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "ALERTE NATIONALE MODIFIÉE: Informations à suivre.",
  "scheduledAt": "2026-09-28T16:00:00Z"
}
```

**Note:** Only DRAFT or SCHEDULED alerts can be updated.

**Response 200:**
```json
{
  "id": "clx1234567890",
  "alertType": "CMAS",
  "messageId": 4370,
  "content": "ALERTE NATIONALE MODIFIÉE: Informations à suivre.",
  "status": "SCHEDULED",
  "scheduledAt": "2026-09-28T16:00:00Z",
  "updatedAt": "2026-09-28T10:30:00Z"
}
```

### 2.5 Delete Alert

```http
DELETE /api/alerts/:id
Authorization: Bearer <token>
```

**Note:** Only DRAFT alerts can be deleted. SCHEDULED must be cancelled first.

**Response 204:** No content

**Error 400:**
```json
{
  "error": "Cannot Delete",
  "message": "Alert is scheduled. Cancel it first."
}
```

### 2.6 Send Alert Immediately

```http
POST /api/alerts/:id/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "immediate": true,
  "skipConfirmation": false
}
```

**Response 200:**
```json
{
  "id": "clx1234567890",
  "status": "SENDING",
  "message": "Alert dispatch initiated",
  "estimatedCompletion": "2026-09-28T10:32:00Z"
}
```

**Response 202 (Async):**
```json
{
  "id": "clx1234567890",
  "status": "SENDING",
  "jobId": "job-12345",
  "message": "Alert queued for dispatch"
}
```

### 2.7 Cancel Scheduled Alert

```http
POST /api/alerts/:id/cancel
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "clx1234567890",
  "status": "CANCELLED",
  "message": "Alert cancelled successfully"
}
```

---

## 3. Templates

### 3.1 List Templates

```http
GET /api/templates?category=emergency
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "tpl-001",
      "name": "Alerte Présidentielle",
      "category": "emergency",
      "alertType": "CMAS",
      "messageId": 4370,
      "content": "ALERTE NATIONALE: [MESSAGE]",
      "defaultDuration": 3600,
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    {
      "id": "tpl-002",
      "name": "AMBER Alert - Enfant disparu",
      "category": "amber",
      "alertType": "CMAS",
      "messageId": 4375,
      "content": "ALERTE AMBER: [NOM] [AGE] ans. Vu dernièrement à [LIEU]. Contactez le 117.",
      "defaultDuration": 7200,
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### 3.2 Get Template

```http
GET /api/templates/:id
Authorization: Bearer <token>
```

### 3.3 Create Template

```http
POST /api/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Test Mensuel",
  "category": "test",
  "alertType": "CMAS",
  "messageId": 4376,
  "content": "TEST MENSUEL DU SYSTÈME D'ALERTE. Aucune action requise.",
  "defaultDuration": 1800
}
```

---

## 4. Cell Sites

### 4.1 List Cell Sites

```http
GET /api/cells?status=active
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "cell-001",
      "name": "Yaoundé Centre",
      "cellId": "YDE-001",
      "enbIp": "192.168.1.101",
      "enbPort": 22,
      "location": "3.8480° N, 11.5021° E",
      "status": "active",
      "lastSeen": "2026-09-28T10:00:00Z"
    },
    {
      "id": "cell-002",
      "name": "Yaoundé Nord",
      "cellId": "YDE-002",
      "enbIp": "192.168.1.102",
      "enbPort": 22,
      "location": "3.8680° N, 11.5121° E",
      "status": "active",
      "lastSeen": "2026-09-28T10:00:00Z"
    }
  ]
}
```

### 4.2 Get Cell Status

```http
GET /api/cells/:id/status
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "cell-001",
  "name": "Yaoundé Centre",
  "status": "active",
  "enbStatus": {
    "running": true,
    "pid": 12345,
    "uptime": "5 days 3 hours",
    "connectedUEs": 47,
    "lastConfigReload": "2026-09-28T09:30:00Z"
  },
  "lastHealthCheck": "2026-09-28T10:00:00Z"
}
```

### 4.3 Create Cell Site

```http
POST /api/cells
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Douala Centre",
  "cellId": "DLA-001",
  "enbIp": "192.168.2.101",
  "enbPort": 22,
  "location": "4.0511° N, 9.7679° E"
}
```

---

## 5. Dashboard Stats

### 5.1 Get Dashboard Statistics

```http
GET /api/stats
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "alerts": {
    "total": 156,
    "sent": 120,
    "scheduled": 15,
    "failed": 3,
    "draft": 18
  },
  "today": {
    "sent": 5,
    "scheduled": 2
  },
  "cells": {
    "total": 12,
    "active": 11,
    "offline": 1
  },
  "recentActivity": [
    {
      "type": "ALERT_SENT",
      "alertId": "clx1234567890",
      "message": "Presidential Alert sent to 3 cells",
      "timestamp": "2026-09-28T10:00:00Z"
    }
  ],
  "trends": {
    "alertsLastWeek": [3, 5, 2, 8, 4, 6, 5],
    "successRate": 97.5
  }
}
```

---

## 6. Logs

### 6.1 List Logs

```http
GET /api/logs?alertId=clx1234567890&action=SENT
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| alertId | string | Filter by alert ID |
| action | string | Filter by action type |
| from | datetime | Start date |
| to | datetime | End date |
| page | number | Page number |
| limit | number | Items per page |

**Response 200:**
```json
{
  "data": [
    {
      "id": "log-001",
      "alertId": "clx1234567890",
      "action": "CREATED",
      "status": "success",
      "message": "Alert created by Jean Operator",
      "metadata": {
        "userId": "user-001",
        "ip": "192.168.1.50"
      },
      "timestamp": "2026-09-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234
  }
}
```

### 6.2 Export Logs

```http
GET /api/logs/export?format=csv&from=2026-09-01&to=2026-09-28
Authorization: Bearer <token>
```

**Response 200:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="logs-2026-09.csv"

id,alertId,action,status,message,timestamp
log-001,clx1234567890,CREATED,success,"Alert created",2026-09-28T10:00:00Z
...
```

---

## 7. Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource state conflict |
| 422 | Unprocessable | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |

**Error Response Format:**
```json
{
  "error": "Error Type",
  "message": "Human-readable description",
  "field": "fieldName",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 8. Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth endpoints | 10 requests/minute |
| Read endpoints | 100 requests/minute |
| Write endpoints | 30 requests/minute |
| Send alert | 10 requests/minute |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1695900000
```

---

## 9. Webhooks (Future)

```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["alert.sent", "alert.failed"],
  "secret": "your-webhook-secret"
}
```

**Webhook Payload:**
```json
{
  "event": "alert.sent",
  "timestamp": "2026-09-28T10:00:00Z",
  "data": {
    "alertId": "clx1234567890",
    "status": "SENT",
    "cells": ["cell-001", "cell-002"]
  },
  "signature": "sha256=..."
}
```

---

*API Specification créée le 2026-09-28*  
*F2G Solutions — KFOKAM48 Telco Academy*
