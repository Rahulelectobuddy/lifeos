# 🗺️ Information Architecture (IA) — Life OS

**Document Version:** 1.2.0  
**Status:** Approved  
**Target Platforms:** Web Browser (Phase 1 Core MVP), macOS / Windows Desktop & Android Mobile (Phase 2 Expansion)  

---

## 1. Executive Summary

This document defines the **Information Architecture (IA)** and platform-specific layout wireframes for **Life OS**. It covers:
- Complete PARA-structured Sitemap Taxonomy.
- **Web Browser View** (Responsive 3-Column Online-First Interface).
- **macOS / Windows Desktop App View** (Tauri Native Window, System Menu Bar Tray, Global `Cmd+Shift+C` Quick Capture Window, Local SQLite Sync Status).
- **Android Mobile App View** (React Native 5-Tab Bottom Navigation, Slide-out Navigation Drawer, Floating Action Button, Share Intent Sheet, Mobile Graph Context Inspector).

---

## 2. Complete Sitemap & Navigation Tree

```text
Life OS
│
├── 🏠 1. Home (Dashboard & Command Center)
├── 📥 2. Inbox (Universal Capture & PARA Triage)
│
├── 🎯 3. PROJECTS (P - Execution Layer)
│   ├── 📋 Tasks (Today, Upcoming, Kanban, Priority Matrix)
│   ├── 📦 Projects (Active Dashboards, Milestones)
│   └── 🎯 Goals (Strategic Hierarchy & Milestones)
│
├── 🧩 4. AREAS (A - Responsibility Layer)
│   ├── 🌐 Areas of Life (Health, Finance, Career, Homelab)
│   ├── 🔁 Habits & Routines
│   ├── 📊 Trackers & Life Metrics
│   └── 💰 Finance Management
│
├── 📚 5. RESOURCES (R - Knowledge Layer)
│   ├── 🧠 Second Brain (Notes, Wiki-links, Backlinks, Graph View)
│   ├── 🎨 Whiteboard (Draw.io Visual Canvas)
│   └── 📁 Documents Vault (PDFs, MinIO Attachments, OCR)
│
├── 💬 6. COMMUNICATION
│   ├── 💬 Chat & Channels (Channels, DMs, Threads, Actionable Converters)
│   └── 📅 Calendar & Schedule (Time-Blocking, System Sync)
│
├── 📝 7. JOURNAL & REFLECTION
│   ├── 📓 Daily Log (Auto YYYY-MM-DD template & activity log)
│   └── 📈 Reviews (Weekly, Monthly, Yearly Wizards)
│
├── 🤖 8. AI & AUTOMATION (Phase 3)
│   ├── 🤖 AI Assistant Chat
│   ├── ⚡ Multi-Agent Swarms (Planner, Knowledge, Finance)
│   └── ⚙️ Automation Rules Engine
│
├── 📦 9. ARCHIVES (A - Historical Layer)
│   └── Archived Projects, Tasks, Notes, Areas
│
└── ⚙️ 10. SETTINGS & ADMIN
    ├── Organization & Workspace Scoping
    ├── Security (SSO, MFA, Active Sessions)
    ├── Auto Backup & Restore Engine (MinIO)
    └── Custom Fields & PARA Schema Customizer
```

---

## 3. Web Browser View Layout Architecture (Vite + React - Online-First)

Designed for desktop and laptop web browsers ($> 1024\text{px}$ viewport width). Operates in an **Online-First** mode communicating directly with Backend REST & WebSocket APIs.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ WEB HEADER: [Logo] [Workspace Switcher ▾]            [ Search / Cmd+K ]  [+ Capture] [🔔] [👤]│
├──────────────┬──────────────────────────────────────────────────────────┬──────────────┤
│ PRIMARY      │ MAIN WORKSPACE CANVAS                                    │ RIGHT        │
│ NAVIGATION   │                                                          │ CONTEXT      │
│ SIDEBAR      │ (Markdown Editor / Board / Canvas / Chat Stream)        │ PANEL        │
│ ($240\text{px}$) │                                                          │ ($320\text{px}$) │
│              │ # Note / Project Title                                   │ (Life Graph) │
│ • Home       │                                                          │              │
│ • Inbox      │ Content area with rich formatting, code blocks, tables.  │ 📌 PARA Tag  │
│ 🎯 PROJECTS  │                                                          │ 🔗 Links     │
│ 🧩 AREAS     │                                                          │ ⬅️ Backlinks │
│ 📚 RESOURCES │                                                          │ 🤖 AI Context│
└──────────────┴──────────────────────────────────────────────────────────┴──────────────┤
│ WEB FOOTER:  [Server Connection: Online 🌐]                        [Web Client v1.2.0] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. macOS / Windows Desktop Native App View (Tauri - Local-First & Global Overlay)

Designed for native desktop operating systems. Built using **Tauri** with native window controls, macOS Vibrancy backdrop blur, system tray status, local SQLite storage, and system-wide global hotkeys.

### 4.1 Native Desktop Main Window Wireframe

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔴 🟡 🟢 [macOS Titlebar] [Workspace ▾]               [ Quick Search / Cmd+K ]    [🔔] [👤] │
├──────────────┬──────────────────────────────────────────────────────────┬──────────────┤
│ TAURI SIDEBAR│ NATIVE MAIN CANVAS                                       │ RIGHT        │
│ (Vibrancy Blur│                                                          │ CONTEXT      │
│  $240\text{px}$) │ (Markdown Editor / Kanban Board / Draw.io Canvas)        │ INSPECTOR    │
│              │                                                          │ ($320\text{px}$) │
│ • Home       │ # Homelab GPU Passthrough Setup                          │              │
│ • Inbox      │                                                          │ 📌 PARA      │
│ 🎯 PROJECTS  │ Status: In Progress | Area: Homelab                      │ Resource (R) │
│ 🧩 AREAS     │                                                          │              │
│ 📚 RESOURCES │ Tasks:                                                   │ 🔗 LINKED    │
│ 💬 CHAT      │ - [x] Install Proxmox VE 8.1                             │ • Task #42   │
│ ⚙️ SETTINGS  │ - [ ] Configure PCIe Passthrough                         │ • Diagram #3 │
└──────────────┴──────────────────────────────────────────────────────────┴──────────────┤
│ DESKTOP STATUS BAR: [Local SQLite: Synced ✓]                       [Tauri App v1.2.0] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 System Tray Menu Bar & Global Quick Capture Overlay Window

```text
  macOS Menu Bar Icon: [ 🧠 LifeOS ▾ ]
  ┌──────────────────────────────────────────────┐
  │ Quick Capture...            (Cmd+Shift+C)    │
  │ Open Main Window             (Cmd+O)          │
  │ Local Sync: Synced ✓                         │
  │ Quit Life OS                                 │
  └──────────────────────────────────────────────┘

  Floating Quick Capture Window (Pops up above any active app upon pressing Cmd+Shift+C):
  ┌──────────────────────────────────────────────────────────────┐
  │ ⚡ Quick Capture to Inbox                                    │
  ├──────────────────────────────────────────────────────────────┤
  │ Type anything (task, note, link, thought)...                 │
  │                                                              │
  ├──────────────────────────────────────────────────────────────┤
  │ [Press Enter to Save] [Esc to Dismiss]    [Triage: Inbox ▾]  │
  └──────────────────────────────────────────────────────────────┘
```

---

## 5. Android Mobile App View Architecture (React Native - Local-First & Touch UI)

Designed for Android smartphones ($< 768\text{px}$ viewport width). Built using **React Native** with embedded local SQLite storage, 5-Tab Bottom Navigation, Slide-out Navigation Drawer, Floating Action Button (FAB), Share Intent Receiver (`Share to LifeOS`), and Mobile Graph Context Inspector.

### 5.1 Main Android Screen & Bottom Navigation

```text
┌────────────────────────────────────────┐
│ TOP APP BAR                            │
│ [☰ Menu] [Workspace Switcher ▾] [🔍] [🔔] │
├────────────────────────────────────────┤
│ MAIN MOBILE VIEWPORT                   │
│                                        │
│ 📥 Today's Execution                   │
│ ────────────────────────────────────── │
│ • [ ] Review Proxmox Backup            │
│ • [ ] Log Daily Habits                 │
│                                        │
│ 📦 Active Projects (P)                 │
│ ────────────────────────────────────── │
│ ▓▓▓▓▓░░░ Homelab Upgrade (65%)        │
│                                        │
│ 🧠 Recent Notes (R)                    │
│ ────────────────────────────────────── │
│ • [[Homelab GPU Setup]]                │
│                                        │
├────────────────────────────────────────┤
│ BOTTOM NAVIGATION BAR (5 FIXED TABS)   │
│ [🏠 Home] [📥 Inbox] [📋 Tasks] [🧠 Notes] [💬 Chat]│
├────────────────────────────────────────┤
│ FAB: [+ Quick Capture Floating Button] │
└────────────────────────────────────────┘
```

### 5.2 Slide-out Navigation Drawer (☰ Menu)

```text
┌────────────────────────────────────────┐
│ 👤 User Profile & Workspace Info       │
├────────────────────────────────────────┤
│ 🏠 Home Dashboard                      │
│ 📥 Inbox & Triage                      │
├────────────────────────────────────────┤
│ 🎯 PROJECTS (P)                        │
│   📋 Tasks & Board                     │
│   📦 Projects                          │
│   🎯 Goals                             │
├────────────────────────────────────────┤
│ 🧩 AREAS (A)                           │
│   🌐 Areas of Life                     │
│   🔁 Habits & Routines                 │
│   📊 Trackers & Metrics                │
│   💰 Finance Ledger                    │
├────────────────────────────────────────┤
│ 📚 RESOURCES (R)                       │
│   🧠 Second Brain Notes                │
│   🎨 Whiteboard Diagrams               │
│   📁 Documents Vault                   │
├────────────────────────────────────────┤
│ 📦 ARCHIVES (A)                        │
│ ⚙️ Settings & Admin                    │
└────────────────────────────────────────┘
```

### 5.3 Mobile Context Inspector Bottom Sheet (Life Graph View)

When tapping "View Graph Context" on mobile, a slide-up **Bottom Sheet Inspector** appears:

```text
┌────────────────────────────────────────┐
│ ═══ (Drag Bar to Expand/Dismiss) ═══    │
│ 📌 ENTITY CONTEXT: Homelab GPU Setup    │
├────────────────────────────────────────┤
│ 🏷️ CATEGORY: Resource (R)              │
│ 🔗 LINKED ENTITIES (3):                 │
│   • 📋 Task: Test GPU Passthrough      │
│   • 🎨 Diagram: Proxmox Topology.xml   │
│ ⬅️ BACKLINKS (2):                      │
│   • 📓 Daily Log 2026-09-10            │
│ 🤖 AI SUMMARY:                         │
│   "Step-by-step guide for RTX 4090."   │
└────────────────────────────────────────┘
```

---

## 6. Layout Comparison Matrix across Target Platforms

| Feature | Web Browser (Vite + React) | macOS / Windows Desktop (Tauri) | Android Mobile (React Native) |
| :--- | :--- | :--- | :--- |
| **Architectural Model** | Online-First | Native Local-First (SQLite) | Native Local-First (SQLite) |
| **Primary Navigation** | Left Sidebar ($240\text{px}$) | Native Sidebar with Backdrop Blur | Bottom Nav (5 Tabs) + Drawer (☰) |
| **Context Inspection** | Right Context Panel ($320\text{px}$) | Right Context Panel ($320\text{px}$) | Slide-up Mobile Bottom Sheet |
| **Quick Capture** | Web In-App Modal (`Cmd+K`) | System-Wide Overlay (`Cmd+Shift+C`) | Floating Action Button (FAB) & Share Sheet |
| **System Tray / Status** | Footer Web Status Bar | Native System Menu Bar Tray | Top App Bar Notifications & Indicators |

---

### 6.1 Penpot Web Application Interactive Prototype Workspace ('Cypher LifeOS')

The Penpot file **'Cypher LifeOS'** features a **6-screen end-to-end Web Application Wireframe Suite** ($1440 \times 900\text{ px}$ per board) configured with **89 live prototyping click transitions (`addInteraction("click", { type: "navigate-to" })`)**:

```text
Penpot Workspace Layout (Page 1)
│
├── ROW 1: CORE WEB WORKSPACE SUITE (Y = 0)
│   ├── [X=0]    "Web - Home Dashboard & Command Center"          (1440x900) -> 24 Interactive Triggers
│   ├── [X=1520] "Web - Second Brain Note Workspace"              (1440x900) -> 10 Interactive Triggers
│   └── [X=3040] "Web - Tasks & Project Management"               (1440x900) -> 16 Interactive Triggers
│
└── ROW 2: REFLECTION, GRAPH & COMMAND OVERLAY SUITE (Y = 960)
    ├── [X=0]    "Web - Daily Journal & Habit Tracker"            (1440x900) -> 9 Interactive Triggers
    ├── [X=1520] "Web - Interactive Knowledge Graph Explorer"     (1440x900) -> 14 Interactive Triggers
    └── [X=3040] "Web - Universal Command Palette Modal (⌘K)"     (1440x900) -> 16 Interactive Triggers
```

---

## 7. Verification & Sign-Off

| Role | Verification Action | Status |
| :--- | :--- | :--- |
| **UX Architect** | Complete Web-focused end-to-end wireframes for Vite/React web application verified | Verified |
| **Frontend Architect** | Alignment with Vite/React, Tauri desktop, and Web design system specs | Verified |
| **System Lead** | Navigation mapping matches [`prd.md`](file:///Users/ritikgarg/workspace/lifeos/prd.md) and [`architecture/system-architecture.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/system-architecture.md) | Verified |


