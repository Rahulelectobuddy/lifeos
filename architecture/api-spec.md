# 🔌 API Specification & Contracts — Life OS

**Document Version:** 1.2.0  
**Status:** Approved  
**API Protocol:** RESTful JSON (HTTPS) + WebSockets (Real-time Messaging)  
**Base URL:** `https://api.lifeos.internal/api/v1`  
**Tenant Scoping:** `/api/v1/organizations/{org_id}/workspaces/{ws_id}`  

---

## 1. Standard Request / Response Envelope & Error Codes

All RESTful API responses implement a standardized JSON envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2026-09-10T09:35:00Z",
    "request_id": "req_8f9a2b1c"
  }
}
```

### Standard HTTP Error Codes

| Code | Status Name | Usage / Description |
| :--- | :--- | :--- |
| `200` | `OK` | Request executed successfully |
| `201` | `Created` | Resource created successfully |
| `400` | `Bad Request` | Validation failure or malformed JSON payload |
| `401` | `Unauthorized` | Missing or expired JWT token / MFA challenge required |
| `403` | `Forbidden` | User lacks workspace permissions or cross-tenant access attempt |
| `404` | `Not Found` | Target entity or workspace does not exist |
| `409` | `Conflict` | Duplicate entity or unique constraint violation |
| `422` | `Unprocessable Entity` | Business invariant rule violation |
| `500` | `Internal Server Error` | Backend system exception |

---

## 2. Authentication & Identity API Contracts

### 2.1 Single Sign-On / Password Login (`POST /api/v1/auth/login`)
- **Request Body:**
  ```json
  {
    "email": "user@org.com",
    "password": "SecretPassword123!",
    "provider_type": "credentials" // "credentials", "oidc", "saml2"
  }
  ```
- **Response `200 OK` (MFA Required):**
  ```json
  {
    "success": true,
    "data": {
      "mfa_required": true,
      "mfa_token": "mfa_challenge_tmp_token_xyz"
    }
  }
  ```

### 2.2 Verify MFA Challenge (`POST /api/v1/auth/mfa/verify`)
- **Request Body:**
  ```json
  {
    "mfa_token": "mfa_challenge_tmp_token_xyz",
    "totp_code": "123456"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbGciOiJKV1QiLC...",
      "refresh_token": "ref_8f9a2b1c...",
      "expires_in": 3600,
      "user": {
        "id": "u_9876",
        "email": "user@org.com",
        "role": "admin"
      }
    }
  }
  ```

---

## 3. Complete REST Endpoint Inventory by Domain Context

---

### Context 1: Universal Capture & Inbox (Triage)
- `GET    /organizations/{org_id}/workspaces/{ws_id}/inbox` — List untriaged inbox items
- `POST   /organizations/{org_id}/workspaces/{ws_id}/inbox` — Quick capture inbox item (`Cmd+Shift+C` / Share Sheet)
- `POST   /organizations/{org_id}/workspaces/{ws_id}/inbox/{id}/triage` — Triage item into PARA bucket (Project P, Area A, Resource R, Archive A)
- `DELETE /organizations/{org_id}/workspaces/{ws_id}/inbox/{id}` — Discard inbox item

---

### Context 2: PARA Projects & Execution (P)

#### Goals & Milestones
- `GET    /organizations/{org_id}/workspaces/{ws_id}/goals` — List strategic goals & progress
- `POST   /organizations/{org_id}/workspaces/{ws_id}/goals` — Create strategic goal
- `GET    /organizations/{org_id}/workspaces/{ws_id}/projects/{project_id}/milestones` — List project milestones

#### Projects
- `GET    /organizations/{org_id}/workspaces/{ws_id}/projects` — List active projects (P)
- `POST   /organizations/{org_id}/workspaces/{ws_id}/projects` — Create project
- `GET    /organizations/{org_id}/workspaces/{ws_id}/projects/{id}` — Fetch project dashboard assets
- `PATCH  /organizations/{org_id}/workspaces/{ws_id}/projects/{id}` — Update project status / target date

#### Tasks
- `GET    /organizations/{org_id}/workspaces/{ws_id}/tasks` — Query tasks (filter by `status`, `priority`, `project_id`, `area_id`, `today`)
- `POST   /organizations/{org_id}/workspaces/{ws_id}/tasks` — Create task
- `GET    /organizations/{org_id}/workspaces/{ws_id}/tasks/{id}` — Fetch task details & dependencies
- `PATCH  /organizations/{org_id}/workspaces/{ws_id}/tasks/{id}` — Update task (status, priority, due date)
- `POST   /organizations/{org_id}/workspaces/{ws_id}/tasks/{id}/complete` — Check off task (`Done`)
- `DELETE /organizations/{org_id}/workspaces/{ws_id}/tasks/{id}` — Soft delete task

---

### Context 3: PARA Areas & Responsibility (A)

#### Areas of Life & Habits
- `GET    /organizations/{org_id}/workspaces/{ws_id}/areas` — List Areas of Life (Health, Finance, Career, Homelab)
- `POST   /organizations/{org_id}/workspaces/{ws_id}/areas` — Create Area of Life
- `GET    /organizations/{org_id}/workspaces/{ws_id}/habits` — List habits & current streaks
- `POST   /organizations/{org_id}/workspaces/{ws_id}/habits` — Create habit tracker
- `POST   /organizations/{org_id}/workspaces/{ws_id}/habits/{id}/log` — Check off daily habit

#### Metrics & Personal Finance
- `GET    /organizations/{org_id}/workspaces/{ws_id}/metrics/trackers` — List metric trackers
- `POST   /organizations/{org_id}/workspaces/{ws_id}/metrics/trackers/{id}/entries` — Log numerical metric entry
- `GET    /organizations/{org_id}/workspaces/{ws_id}/finance/accounts` — List finance account balances
- `POST   /organizations/{org_id}/workspaces/{ws_id}/finance/transactions` — Record transaction (Income/Expense)

---

### Context 4: PARA Resources & Knowledge (R)

#### Second Brain Notes
- `GET    /organizations/{org_id}/workspaces/{ws_id}/notes` — Search & list Second Brain notes
- `POST   /organizations/{org_id}/workspaces/{ws_id}/notes` — Create markdown note
- `GET    /organizations/{org_id}/workspaces/{ws_id}/notes/{id}` — Fetch note content & backlinks
- `PUT    /organizations/{org_id}/workspaces/{ws_id}/notes/{id}` — Save updated markdown content

#### Whiteboard Diagrams & Document Vault
- `GET    /organizations/{org_id}/workspaces/{ws_id}/diagrams` — List visual draw.io diagrams
- `POST   /organizations/{org_id}/workspaces/{ws_id}/diagrams` — Save draw.io XML diagram payload
- `POST   /organizations/{org_id}/workspaces/{ws_id}/documents/upload` — Upload asset file to MinIO vault
- `GET    /organizations/{org_id}/workspaces/{ws_id}/documents/{id}/ocr` — Fetch OCR text index

---

### Context 5: Communications & Real-Time Chat
- `GET    /organizations/{org_id}/workspaces/{ws_id}/conversations` — List chat channels & DMs
- `POST   /organizations/{org_id}/workspaces/{ws_id}/conversations` — Create channel / DM thread
- `GET    /organizations/{org_id}/workspaces/{ws_id}/conversations/{id}/messages` — Fetch message history
- `POST   /organizations/{org_id}/workspaces/{ws_id}/messages` — Post message
- `POST   /organizations/{org_id}/workspaces/{ws_id}/messages/{id}/convert-to-task` — Convert message into Task (P)

---

### Context 6: Life Graph Engine (Universal Cross-Links)

#### 6.1 Create Bidirectional Entity Link (`POST /organizations/{org_id}/workspaces/{ws_id}/graph/links`)
- **Request Body:**
  ```json
  {
    "source_type": "task",
    "source_id": "tsk_12345",
    "target_type": "note",
    "target_id": "nt_67890",
    "link_type": "references"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "link_id": "lnk_998877",
      "source_type": "task",
      "source_id": "tsk_12345",
      "target_type": "note",
      "target_id": "nt_67890",
      "bidirectional": true
    }
  }
  ```

#### 6.2 Fetch Life Graph Context Inspector Payload (`GET /organizations/{org_id}/workspaces/{ws_id}/graph/context/{entity_type}/{entity_id}`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "entity": { "id": "nt_67890", "type": "note", "title": "Homelab GPU Setup" },
      "para_category": "Resource (R)",
      "linked_entities": [
        { "id": "tsk_12345", "type": "task", "title": "Test GPU Passthrough", "status": "to_do" },
        { "id": "diag_44332", "type": "diagram", "title": "Proxmox Topology.xml" }
      ],
      "backlinks": [
        { "id": "jrn_20260910", "type": "journal", "title": "Daily Log 2026-09-10" }
      ],
      "ai_summary": "Guide for RTX 4090 GPU passthrough on Proxmox VE 8.1."
    }
  }
  ```

---

### Context 7: Native Offline Sync Engine (Android & Windows / macOS Tauri)

#### 7.1 Push Native Delta Mutations (`POST /organizations/{org_id}/workspaces/{ws_id}/sync/push`)
- **Request Body (Offline Delta Queue from local SQLite):**
  ```json
  {
    "client_type": "android",
    "last_sync_timestamp": 1789012345,
    "deltas": [
      {
        "entity_type": "task",
        "entity_id": "tsk_12345",
        "action": "UPDATE",
        "payload": { "status": "done", "completed_at": "2026-09-10T09:30:00Z" },
        "timestamp": 1789012400
      }
    ]
  }
  ```

#### 7.2 Pull Server Delta Updates (`GET /organizations/{org_id}/workspaces/{ws_id}/sync/pull?since=1789012345`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "server_timestamp": 1789012500,
      "updated_entities": [
        { "entity_type": "note", "entity_id": "nt_67890", "action": "UPSERT", "data": {...} }
      ]
    }
  }
  ```

---

### Context 8: System Governance, Archival & MinIO Backup

#### Archival
- `GET    /organizations/{org_id}/workspaces/{ws_id}/archives` — Search archived items
- `POST   /organizations/{org_id}/workspaces/{ws_id}/archives/{id}/restore` — Restore archived entity to active

#### MinIO Auto Backup & One-Click Restore
- `POST   /organizations/{org_id}/workspaces/{ws_id}/backups/trigger` — Trigger manual encrypted backup to MinIO
- `GET    /organizations/{org_id}/workspaces/{ws_id}/backups` — List backup snapshots
- `POST   /organizations/{org_id}/workspaces/{ws_id}/backups/restore` — One-click disaster recovery restore

---

## 4. Document Sign-Off & Verification

| Role | Verification Action | Status |
| :--- | :--- | :--- |
| **API Architect** | REST endpoint matrix, JSON request/response payloads & status codes verified | Verified |
| **System Lead** | Alignment with [`architecture/domain-model.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/domain-model.md), [`architecture/sync.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/sync.md), and [`architecture/data-model.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/data-model.md) | Verified |
| **Security Engineer** | Multi-tenant route scoping, JWT auth header, and MFA/SSO endpoints validated | Verified |
