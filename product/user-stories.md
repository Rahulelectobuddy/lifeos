# 📖 Epic User Stories & Acceptance Criteria — Life OS

**Document Version:** 1.0.0  
**Status:** Approved  

---

## Story 1: Multi-Tenant Workspace SSO & MFA Authentication
**As a** workspace user,  
**I want to** log in using SSO (OIDC/SAML) and verify my identity using MFA (TOTP or Passkey),  
**So that** my personal and team data remains protected by enterprise authentication standards.

### Acceptance Criteria:
- **Given** an unauthenticated user, **When** they select "Log in with SSO" and complete OIDC/SAML authentication followed by TOTP/Passkey MFA verification, **Then** the system issues a secure session token scoped to their Organization and Workspace.
- **Given** an authenticated session on macOS or Android, **When** a user views active sessions, **Then** all connected devices (Web, Android, macOS) are listed with IP address and remote log-out capability.
- **Given** a user in Workspace A, **When** they attempt to access an API endpoint or entity belonging to Workspace B, **Then** the system returns an `HTTP 403 Forbidden` error.

---

## Story 2: Universal Capture & PARA Inbox Triage Across Platforms
**As a** busy user on macOS or Android,  
**I want to** quickly capture thoughts via native global shortcuts or share intents into an Inbox and triage them into Projects (P), Areas (A), or Resources (R),  
**So that** my workspace remains organized according to the PARA framework.

### Acceptance Criteria:
- **Given** a macOS user, **When** they press `Cmd+Shift+C`, **Then** a floating quick-capture overlay appears instantly over any active window in $< 100\text{ ms}$.
- **Given** an Android user reading a webpage, **When** they tap "Share to LifeOS", **Then** the content is ingested into the Inbox with title and URL pre-filled.
- **Given** an item in the Inbox, **When** the user selects "Triage to Project", **Then** a Project Task creation dialog opens, assigning the item to a Project (P) and marking the Inbox item triaged.

---

## Story 3: Task Execution & Project Assignment (Projects - P)
**As a** project lead,  
**I want to** create a task assigned to an active Project (P) with a due date,  
**So that** my daily work contributes directly to strategic outcomes.

### Acceptance Criteria:
- **Given** an active project, **When** a user creates a new task linked to this project, **Then** the task appears on the Project Dashboard and the user's Today view if due today.
- **Given** a project with all tasks completed, **When** the project is marked completed, **Then** the system prompts to move the project and tasks to **Archives (A)**.

---

## Story 4: Second Brain Resource Note & Universal Linkage (Resources - R)
**As a** researcher,  
**I want to** write a markdown note in Resources (R) and link it bi-directionally to a Project (P) and an Area (A) using wiki-links (`[[Note Name]]`),  
**So that** my knowledge base and execution workspace remain unified.

### Acceptance Criteria:
- **Given** a note editor on Web, Android, or macOS, **When** a user types `[[` followed by an existing note title, **Then** an auto-complete dropdown lists matching notes.
- **Given** Note A (Resource) linked to Task B (Project), **When** inspecting Task B, **Then** Note A is explicitly listed in Task B's linked knowledge section (bidirectional relationship).

---

## Story 5: Structured & PARA Filtered Search
**As a** user searching for past information,  
**I want to** query keywords across all my workspace entities and filter by PARA category (`category:project`, `category:resource`),  
**So that** I can retrieve notes, tasks, and project specs instantly.

### Acceptance Criteria:
- **Given** a workspace containing tasks and notes, **When** the user searches `"Homelab category:resource"`, **Then** the results list matching Resource notes, documents, and diagrams within $< 250\text{ ms}$.

---

## Story 6: Automated Backup & One-Click Workspace Restore
**As a** workspace administrator,  
**I want to** schedule automated daily backups and restore workspace snapshots on demand,  
**So that** our workspace data is protected against accidental data loss.

### Acceptance Criteria:
- **Given** an active workspace, **When** the automated daily backup trigger executes, **Then** an encrypted snapshot (`AES-256 GCM`) of all database entities and files is saved to configured backup storage.
- **Given** a backup snapshot, **When** an admin selects "Restore Snapshot", **Then** the system validates snapshot integrity and restores workspace state cleanly with point-in-time recovery.
