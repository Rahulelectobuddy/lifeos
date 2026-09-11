# 🚀 Life OS — Spec-Driven AI-Native Operating System

**Life OS** is an integrated, multi-tenant operating system for personal, team, and workspace management. It unifies second-brain knowledge management, project execution, real-time communication, visual whiteboarding, life tracking, and AI-driven automation into a single interconnected system structured on the **PARA Framework** (Projects, Areas, Resources, Archives). **Phase 1 strictly delivers the Web Application (Vite + React)**, with native Android and macOS desktop clients targeted for Phase 2 system expansion.

> **Life OS = Second Brain + Project Management + Personal Management + Communication + Visual Workspace + Life Tracking + AI + Automation**

---

## 🗂️ Spec-Driven Repository Structure

```text
lifeos/
├── 📁 product/                         # Product Specifications & Roadmap
│   ├── 📄 vision.md                    # Vision Statement, Product Equation & 3 Pillars
│   ├── 📄 features.md                  # Complete 27-Module Feature Catalog
│   ├── 📄 roadmap.md                   # 3-Tier Roadmap Phasing Strategy (Phase 1, 2, 3)
│   └── 📄 user-stories.md              # Epic User Stories & Acceptance Criteria
│
├── 📁 ux/                              # UX Architecture & Interface Design
│   ├── 📄 information-architecture.md  # PARA Sitemap & Full Navigation Hierarchy
│   ├── 📄 user-flows.md                # Key User Journeys & Conversion Workflows
│   ├── 📄 design-system.md             # Dark Mode Tokens, HSL Palette & Glassmorphism
│   └── 📄 screen-specs.md              # Desktop (Tauri), Android & Web Screen Specs
│
├── 📁 architecture/                    # Systems & Data Architecture
│   ├── 📄 system-architecture.md       # High-Level Infrastructure (Tauri, RN, React, MinIO)
│   ├── 📄 backend-architecture.md      # FastAPI Modular Monolith, Layered Architecture & Workers
│   ├── 📄 domain-model.md              # Bounded Contexts & Life Graph Topology
│   ├── 📄 data-model.md                # Complete SQL DDL Schemas (7 Bounded Contexts)
│   ├── 📄 api-spec.md                  # RESTful API Contracts & Endpoints
│   ├── 📄 sync.md                      # Native Local-First (Android/Windows/macOS) & Web Online-First
│   ├── 📄 search.md                    # Multi-Tier Search Engine (Structured, FTS, RAG)
│   └── 📄 ai-architecture.md           # Multi-Agent Swarm & Hybrid LLM Gateway
│
├── 📁 backend/                         # Backend Services Implementation (Modular API / FastAPI)
├── 📁 frontend/                        # Web (Vite + React), Mobile (React Native), Desktop (Tauri)
├── 📁 deployment/                      # Docker Compose Stack, NGINX Reverse Proxy (Port 80) & Guide
├── 📁 agents/                          # Autonomous Multi-Agent Definitions & Tool Bindings
└── 📁 docs/                            # Development Methodology & SDLC Guidelines
    └── 📄 sdlc.md                      # Master Software Development Life Cycle Guide
```

---

## 🏛️ The Three Pillars & PARA Framework

1. 🧠 **Remember (Knowledge Layer):** Notes, Second Brain, Document Vault (MinIO OCR), Whiteboard Diagrams (draw.io), Chat History.
2. ⚡ **Act (Execution Layer):** Tasks, Projects, Milestones, Strategic Goals, Calendar Time-Blocking, Habits & Routines.
3. 🤖 **Understand (Intelligence Layer):** Life Graph Universal Links (`entity_links`), Semantic RAG Search, Context AI Assistant, Multi-Agent Swarms, and Event Automations.

---

## 🛡️ Architecture & Client Modes
- **Native Local-First (Android & Windows / macOS):** Built using React Native (Android) and Tauri (Desktop). Uses embedded local SQLite database and background Delta Sync Engine for offline operations.
- **Web Browser Online-First (Web):** Built using Vite + React. Operates in online-first mode with direct REST/WebSocket communication to Backend API.
- **Multi-Tenancy & Security:** Day 1 Organization and Workspace isolation, Single Sign-On (SSO via OIDC/SAML), and Multi-Factor Authentication (MFA via TOTP/Passkeys).
- **Auto Backup & Restore:** Automated scheduled backup routines (`AES-256 GCM`) with point-in-time recovery (PITR) targeting MinIO storage.
