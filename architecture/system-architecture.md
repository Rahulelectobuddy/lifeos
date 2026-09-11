# 🏗️ System Architecture & Infrastructure — Life OS

**Document Version:** 1.1.0  
**Status:** Approved  
**Target Platforms:** Web (Phase 1 Core MVP), Android & macOS Desktop (Phase 2 Expansion)  

---

## 1. High-Level Architecture Diagram

```text
                                  CLIENT LAYERS
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
  Desktop Native (Tauri)          Android Native (React Native)  Responsive Web (Online-First)
  (macOS / Windows)               (Mobile App)                    (Vite + React Browser)
  • Local SQLite & Sync           • Local SQLite & Sync           • Direct REST & WebSockets
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        │ (HTTP/REST + WebSockets)
                                        ▼
                                 API GATEWAY / PROXY
                                        │
                                  BACKEND API
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
    Core Domain                     Knowledge                       Communication
    • Tasks & Projects              • Notes & Docs                  • Real-time Chat
    • Goals & Areas                 • Whiteboard Diagrams           • Channels & DMs
    • Habits & Finance              • Search Indexing               • Notifications
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        │
                                    DATA LAYER
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
    PostgreSQL                       Redis                            MinIO
  (Core Data & Graph)            (Cache & Queues)             (Documents & Attachments)
```

---

## 2. Infrastructure & Application Components

1. **Native Desktop App (Tauri - macOS & Windows):** Native desktop client built with Tauri, featuring global system hotkeys (`Cmd+Shift+C` / `Ctrl+Shift+C`), menu bar icon, local SQLite database, and offline sync.
2. **Native Mobile App (React Native - Android):** Native Android mobile app supporting system Share Intent (`Share to LifeOS`), native push notifications, local SQLite database, and background delta sync.
3. **Web Browser Client (Vite + React):** Online-first web application communicating directly with Backend API via REST endpoints and WebSockets for real-time chat and workspace updates.
4. **Backend API Services:** Modular backend API exposing RESTful JSON endpoints and WebSocket connections for real-time messaging.
5. **PostgreSQL Relational & Graph Database:** Central multi-tenant relational store housing core entity tables and the `entity_links` polymorphic graph table.
6. **Redis In-Memory Cache & Message Queue:** Session caching, rate limiting, and pub/sub message broker for domain events.
7. **Object Storage (MinIO):** Vault object storage for documents, receipts, PDFs, image attachments, and vector diagram files.
8. **OpenTelemetry & Observability:** Distributed tracing, metric collection, and structured logging exportable to Grafana/Tempo/Loki.
