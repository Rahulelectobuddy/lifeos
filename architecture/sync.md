# 🔄 Offline-First & Sync Architecture — Life OS

**Document Version:** 1.1.0  
**Status:** Approved  
**Applicability Scope:** Native Clients Only (Android & Desktop: Windows / macOS)  

---

## 1. Sync Architecture by Client Type

Life OS differentiates sync architecture between **Native Apps** and **Web Browser** clients:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT ARCHITECTURE COMPARISON                       │
├─────────────────────────────────────────┬───────────────────────────────────────┤
│ NATIVE CLIENTS (Android & Windows/macOS)│ WEB BROWSER CLIENT (Vite + React)     │
│ • Local-First Architecture              │ • Online-First Architecture           │
│ • Embedded SQLite Store                 │ • Direct REST / WebSocket API calls   │
│ • Offline Delta Queue & Background Sync │ • Ephemeral UI Cache (No Offline Sync)│
└─────────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Native Local-First Synchronization Flow (Android & Windows / macOS)

Native clients (React Native for Android, Tauri for Windows / macOS) implement a **Local-First** model:

```text
               NATIVE UI (Android / Windows / macOS)
                                │
                                ▼
                      LOCAL SQLITE STORE
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
      OFFLINE QUEUE                           ONLINE STATE
     (Delta Changelog)                             │
             │                                     ▼
             └──────────────────┬──────────────────┘
                                ▼
                        SYNC ENGINE
              (Conflict Resolution Protocol)
                                │
                                ▼
                          BACKEND API
```

### 2.1 Native Storage & Execution Engine
1. **Client Storage (SQLite):** Operations execute against an embedded local SQLite database on native devices in $< 16\text{ ms}$.
2. **Offline Delta Queue:** When offline, mutations are recorded into a local `delta_changelog` table (`entity_type`, `entity_id`, `action`, `payload`, `timestamp`).
3. **Background Delta Sync:** Upon network reconnection, the native Sync Engine pushes pending local deltas to `/api/v1/workspaces/:ws_id/sync/push` and pulls server updates via `/api/v1/workspaces/:ws_id/sync/pull`.
4. **Conflict Resolution:** Timestamp LWW (Last-Write-Wins) with server validation fallback and CRDT resolution for text content.

---

## 3. Web Browser Architecture (Online-First)

Web browser clients (Vite + React) follow an **Online-First** model:
- **Direct API Execution:** Read and write requests are sent directly to the backend API via HTTPS REST and WebSocket channels.
- **In-Memory Caching:** UI state and active workspace data are cached in browser memory (React Query / Zustand) for fast rendering during the active browser session.
- **Network Dependency:** Requires an active network connection to perform workspace operations. No local SQLite database or offline sync queue is maintained in the browser.
