# 🔭 Product Vision — Life OS

**Document Version:** 1.0.0  
**Status:** Approved  
**Target Platforms:** Web (Phase 1 Core MVP), Android & macOS (Phase 2 Expansion)  

---

## 1. Executive Vision & Core Equation

**Life OS** is an integrated, multi-tenant operating system for personal, team, and workspace management. It unifies second-brain knowledge management, project execution, real-time communication, visual whiteboarding, life tracking, and AI-driven automation into a single interconnected system structured on the **PARA Framework** (Projects, Areas, Resources, Archives).

### The Product Equation
> **Life OS = Second Brain + Project Management + Personal Management + Communication + Visual Workspace + Life Tracking + AI + Automation**

---

## 2. The Three Pillars

```text
                             LIFE OS PILLARS
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       │                            │                            │
       ▼                            ▼                            ▼
 1. 🧠 REMEMBER                2. ⚡ ACT                    3. 🤖 UNDERSTAND
(Knowledge Layer)            (Execution Layer)            (Intelligence Layer)
 • Second Brain Notes         • Tasks & Subtasks           • Universal Life Graph
 • Document Vault & OCR       • Projects & Milestones      • Semantic RAG Search
 • Whiteboard Diagrams        • Strategic Goals            • Context AI Assistant
 • Chat Message History       • Calendar & Time Block      • Multi-Agent Swarms
 • Journal Reflections        • Habits & Routines          • Event Automations
```

---

## 3. The PARA Framework Organizational Backbone

Life OS adopts the **PARA Framework** as its primary structural organization across all clients and workspaces:

1. **P - Projects:** Series of tasks linked to a goal with a specific deadline and outcome (e.g., *Migrate Homelab to Proxmox VE*, *Launch Product v1.0*).
2. **A - Areas:** Spheres of responsibility with standards to maintain over time, with no end date (e.g., *Health*, *Finance*, *Homelab Maintenance*, *Career*).
3. **R - Resources:** Topic-based reference materials, knowledge assets, notes, and media of ongoing utility (e.g., *Proxmox Configuration Notes*, *Python Cheat Sheets*, *Architecture Diagrams*).
4. **A - Archives:** Inactive or completed items from Projects, Areas, and Resources preserved for historical reference and auditability.

---

## 4. Key Architectural Directives

1. **Multi-Tenancy & Privacy (Day 1):** Strict Organization, Workspace, and User data isolation with Role-Based Access Control (RBAC).
2. **Enterprise Security:** Support Single Sign-On (SSO via OIDC/SAML2) and Multi-Factor Authentication (MFA via TOTP/Passkeys).
3. **Multi-Platform Phased Support:** **Phase 1 strictly delivers the Web Application** (Vite + React online-first), while **Phase 2 expands to native clients** for **Android** (Mobile app with Share Intent & push notifications) and **macOS / Windows** (Desktop app with global system shortcuts and menu bar access).
4. **Local-First & Offline-Sync:** Low-latency local read/writes with background transactional delta synchronization.
5. **Universal Linkability:** Bidirectional relationship graph connecting any two entities across PARA buckets (The Life Graph).
6. **Automated Backup & Disaster Recovery:** Native scheduled automated backups and one-click workspace point-in-time restoration.
7. **Hybrid AI Integration:** Abstraction gateway supporting both privacy-preserving local LLMs (Ollama/vLLM) and managed cloud AI services (Google Gemini, OpenAI).
