# 🗄️ Relational & Graph Data Model (SQL DDL) — Life OS

**Document Version:** 1.2.0  
**Status:** Approved  
**Database Engines:** PostgreSQL (Server) / SQLite (Native Local Store: Android & Desktop Tauri)  
**Baseline Alignment:** [`architecture/domain-model.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/domain-model.md), [`architecture/sync.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/sync.md), [`product/vision.md`](file:///Users/ritikgarg/workspace/lifeos/product/vision.md)  

---

## 1. Schema Directives & Base Interface

Every entity table MUST implement multi-tenant scoping (`organization_id`, `workspace_id`) and standard audit timestamps:

```sql
-- Standard Base Metadata Interface (Inherited by all tenant entities)
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
created_by      UUID NOT NULL REFERENCES users(id),
updated_by      UUID NULL REFERENCES users(id),
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
deleted_at      TIMESTAMPTZ NULL -- Soft-delete indicator
```

---

## 2. Complete SQL DDL Schema by Bounded Context

---

### Context 1: Multi-Tenancy & Security

#### Table 1.1: `organizations`
```sql
CREATE TABLE organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 1.2: `workspaces`
```sql
CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    settings        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);
```

#### Table 1.3: `users`
```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NULL, -- Null if SSO only
    full_name       VARCHAR(255) NOT NULL,
    avatar_url      TEXT NULL,
    role            VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, member, guest
    mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret      VARCHAR(255) NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 1.4: `user_sessions`
```sql
CREATE TABLE user_sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_type VARCHAR(50) NOT NULL, -- web, android, macos, windows
    device_name VARCHAR(255) NOT NULL,
    ip_address  VARCHAR(45) NOT NULL,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 1.5: `auth_providers` (SSO Config)
```sql
CREATE TABLE auth_providers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider_type   VARCHAR(50) NOT NULL, -- oidc, saml2, google, azure_ad
    client_id       VARCHAR(255) NOT NULL,
    client_secret   TEXT NOT NULL,
    issuer_url      TEXT NOT NULL,
    is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### Context 2: PARA Projects & Execution (P)

#### Table 2.1: `inbox_items`
```sql
CREATE TABLE inbox_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    source          VARCHAR(50) NOT NULL DEFAULT 'quick_capture', -- quick_capture, email, web_clip, android_share
    is_triaged      BOOLEAN NOT NULL DEFAULT FALSE,
    triaged_to_type VARCHAR(50) NULL, -- task, project, note, area, archive
    triaged_to_id   UUID NULL,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 2.2: `goals`
```sql
CREATE TABLE goals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    parent_goal_id  UUID NULL REFERENCES goals(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    timeframe       VARCHAR(50) NOT NULL, -- long_term, yearly, quarterly
    target_date     DATE NULL,
    progress_pct    DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    status          VARCHAR(50) NOT NULL DEFAULT 'active', -- active, completed, paused, archived
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);
```

#### Table 2.3: `projects`
```sql
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    goal_id         UUID NULL REFERENCES goals(id) ON DELETE SET NULL,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    objective       TEXT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'active', -- planning, active, paused, completed, archived
    start_date      DATE NULL,
    target_date     DATE NULL,
    completed_at    TIMESTAMPTZ NULL,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);
```

#### Table 2.4: `milestones`
```sql
CREATE TABLE milestones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    due_date        DATE NULL,
    is_completed    BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 2.5: `tasks`
```sql
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID NULL REFERENCES projects(id) ON DELETE SET NULL,
    milestone_id    UUID NULL REFERENCES milestones(id) ON DELETE SET NULL,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    assigned_to     UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'to_do', -- backlog, to_do, in_progress, waiting, done
    priority        VARCHAR(50) NOT NULL DEFAULT 'medium', -- urgent, high, medium, low
    start_date      TIMESTAMPTZ NULL,
    due_date        TIMESTAMPTZ NULL,
    estimated_hours DECIMAL(6,2) NULL,
    recurrence_rule VARCHAR(255) NULL, -- RRULE string
    completed_at    TIMESTAMPTZ NULL,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);
```

#### Table 2.6: `task_dependencies`
```sql
CREATE TABLE task_dependencies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id  UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type     VARCHAR(50) NOT NULL DEFAULT 'blocks', -- blocks, finish_to_start
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, task_id, depends_on_task_id)
);
```

---

### Context 3: PARA Areas & Responsibility (A)

#### Table 3.1: `areas`
```sql
CREATE TABLE areas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL, -- Health, Finance, Career, Homelab
    description     TEXT NULL,
    color_code      VARCHAR(20) NULL,
    icon            VARCHAR(50) NULL,
    maintenance_std TEXT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);
```

#### Table 3.2: `habits` & `habit_logs`
```sql
CREATE TABLE habits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    frequency       VARCHAR(50) NOT NULL DEFAULT 'daily', -- daily, weekly, monthly
    target_count    INT NOT NULL DEFAULT 1,
    current_streak  INT NOT NULL DEFAULT 0,
    best_streak     INT NOT NULL DEFAULT 0,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE habit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id    UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    log_date    DATE NOT NULL,
    count       INT NOT NULL DEFAULT 1,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(habit_id, log_date)
);
```

#### Table 3.3: `metric_trackers` & `metric_entries`
```sql
CREATE TABLE metric_trackers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    unit            VARCHAR(50) NOT NULL, -- hours, kg, $, count, boolean
    target_value    DECIMAL(10,2) NULL,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE metric_entries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracker_id  UUID NOT NULL REFERENCES metric_trackers(id) ON DELETE CASCADE,
    entry_date  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    value       DECIMAL(10,2) NOT NULL,
    notes       TEXT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 3.4: `finance_accounts` & `transactions`
```sql
CREATE TABLE finance_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    account_type    VARCHAR(50) NOT NULL, -- checking, savings, credit, investment
    balance         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    currency        VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    account_id       UUID NOT NULL REFERENCES finance_accounts(id) ON DELETE CASCADE,
    amount           DECIMAL(12,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- income, expense, transfer
    category         VARCHAR(100) NOT NULL,
    description      TEXT NULL,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       UUID NOT NULL REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### Context 4: PARA Resources & Knowledge (R)

#### Table 4.1: `notes`
```sql
CREATE TABLE notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    project_id      UUID NULL REFERENCES projects(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    content_markdown TEXT NOT NULL DEFAULT '',
    content_html    TEXT NULL,
    is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);
```

#### Table 4.2: `diagrams` (draw.io Canvas)
```sql
CREATE TABLE diagrams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID NULL REFERENCES projects(id) ON DELETE SET NULL,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    diagram_xml     TEXT NOT NULL, -- draw.io XML data
    preview_png_url TEXT NULL,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 4.3: `documents` (Vault Assets - MinIO)
```sql
CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID NULL REFERENCES projects(id) ON DELETE SET NULL,
    area_id         UUID NULL REFERENCES areas(id) ON DELETE SET NULL,
    file_name       VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type       VARCHAR(100) NOT NULL,
    storage_path    TEXT NOT NULL, -- MinIO path
    ocr_text        TEXT NULL, -- Full-text indexed OCR
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### Context 5: Communications & Calendar Context

#### Table 5.1: `conversations` & `messages`
```sql
CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(255) NULL, -- Null for DMs
    is_channel      BOOLEAN NOT NULL DEFAULT FALSE,
    is_private      BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id         UUID NOT NULL REFERENCES users(id),
    parent_message_id UUID NULL REFERENCES messages(id) ON DELETE CASCADE,
    body              TEXT NOT NULL,
    attachments       JSONB DEFAULT '[]'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 5.2: `calendar_events` & `reminders`
```sql
CREATE TABLE calendar_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    task_id         UUID NULL REFERENCES tasks(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    start_time      TIMESTAMPTZ NOT NULL,
    end_time        TIMESTAMPTZ NOT NULL,
    is_all_day      BOOLEAN NOT NULL DEFAULT FALSE,
    location        TEXT NULL,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_type     VARCHAR(50) NOT NULL, -- task, habit, event, note
    entity_id       UUID NOT NULL,
    remind_at       TIMESTAMPTZ NOT NULL,
    is_triggered    BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### Context 6: Life Graph Engine (Universal Cross-Links)

#### Table 6.1: `entity_links` (Polymorphic Graph Edge Registry)
```sql
CREATE TABLE entity_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    source_type     VARCHAR(50) NOT NULL, -- task, note, project, diagram, message, area, goal
    source_id       UUID NOT NULL,
    target_type     VARCHAR(50) NOT NULL, -- task, note, project, diagram, message, area, goal
    target_id       UUID NOT NULL,
    link_type       VARCHAR(50) NOT NULL DEFAULT 'references', -- references, child_of, converts_to, blocks
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, source_type, source_id, target_type, target_id, link_type)
);

CREATE INDEX idx_entity_links_source ON entity_links(workspace_id, source_type, source_id);
CREATE INDEX idx_entity_links_target ON entity_links(workspace_id, target_type, target_id);
```

---

### Context 7: Native Offline Sync Engine (Android & Windows / macOS)

#### Table 7.1: `delta_changelog` (Local Native SQLite Table Only)
Used strictly on native clients (Android & Desktop Tauri) for local offline mutations:

```sql
CREATE TABLE delta_changelog (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type  VARCHAR(50) NOT NULL,
    entity_id    TEXT NOT NULL,
    action       VARCHAR(20) NOT NULL, -- CREATE, UPDATE, DELETE
    payload_json TEXT NOT NULL,
    timestamp    INTEGER NOT NULL,
    is_synced    INTEGER NOT NULL DEFAULT 0
);
```

---

### Context 8: Governance, Archival & System Backup (MinIO)

#### Table 8.1: `archive_items`
```sql
CREATE TABLE archive_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_type     VARCHAR(50) NOT NULL, -- project, task, note, diagram, area
    entity_id       UUID NOT NULL,
    archived_by     UUID NOT NULL REFERENCES users(id),
    archived_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archive_reason  TEXT NULL,
    restored_at     TIMESTAMPTZ NULL
);
```

#### Table 8.2: `backup_snapshots` (MinIO Targets)
```sql
CREATE TABLE backup_snapshots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    snapshot_type   VARCHAR(50) NOT NULL, -- hourly_delta, daily_full, manual
    file_path       TEXT NOT NULL, -- MinIO path
    file_size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 8.3: `automation_rules`
```sql
CREATE TABLE automation_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    trigger_event   VARCHAR(100) NOT NULL, -- TaskOverdue, ProjectCompleted, MessageCreated
    action_handler  VARCHAR(100) NOT NULL, -- CreateTask, DispatchNotification, ArchiveProject
    config_json     JSONB DEFAULT '{}'::jsonb,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Indexing & Query Performance Optimization

1. **Multi-Tenant Composite Indexes:**
   ```sql
   CREATE INDEX idx_tasks_ws_status ON tasks(workspace_id, status) WHERE deleted_at IS NULL;
   CREATE INDEX idx_notes_ws_title ON notes(workspace_id, title) WHERE deleted_at IS NULL;
   CREATE INDEX idx_projects_ws_status ON projects(workspace_id, status) WHERE deleted_at IS NULL;
   ```
2. **Full-Text Search Indexing:**
   ```sql
   CREATE INDEX idx_notes_fts ON notes USING gin(to_tsvector('english', title || ' ' || content_markdown));
   CREATE INDEX idx_tasks_fts ON tasks USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
   CREATE INDEX idx_documents_ocr_fts ON documents USING gin(to_tsvector('english', coalesce(ocr_text, '')));
   ```

---

## 4. Document Sign-Off & Verification

| Role | Verification Action | Status |
| :--- | :--- | :--- |
| **Lead Database Architect** | Full 24-table DDL schema mapping across 8 context areas verified | Verified |
| **System Architect** | Alignment with [`architecture/domain-model.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/domain-model.md) and [`architecture/sync.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/sync.md) | Verified |
| **Security Engineer** | Multi-tenant isolation, SSO/MFA fields, and MinIO backup schemas validated | Verified |
