# 🔄 Core User Flows & Journeys — Life OS

**Document Version:** 1.2.0  
**Status:** Approved  
**Baseline Specs:** [`product/vision.md`](file:///Users/ritikgarg/workspace/lifeos/product/vision.md), [`ux/information-architecture.md`](file:///Users/ritikgarg/workspace/lifeos/ux/information-architecture.md), [`architecture/domain-model.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/domain-model.md)  

---

## 1. Executive Summary

This document defines the complete end-to-end user interaction flows for **Life OS**. It covers daily operations (task checking, note editing, daily journaling, habit tracking), workflow conversions (inbox triage, message-to-task), strategic reviews, and system maintenance.

---

## 2. Comprehensive User Flows

---

### Flow 1: Universal Quick Capture & PARA Triage
**Goal:** Capture thoughts, links, files, or tasks instantly and triage them into the PARA framework.

```text
  [ User Thought / Web Clip / Native Share Intent ]
                          │
                          ▼
  [ Global Hotkey (Cmd+Shift+C) / Android Share / Cmd+K ]
                          │
                          ▼
             [ Ingest to Inbox (< 100ms) ]
                          │
                          ▼
                [ Inbox Triage View ]
                          │
    ┌─────────────────────┼─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼                     ▼
[Project / Task]      [Area Habit]       [Resource Note]       [Archive Item]
 (Projects - P)        (Areas - A)       (Resources - R)       (Archives - A)
```

1. User triggers Quick Capture via macOS global shortcut (`Cmd+Shift+C` / `Ctrl+Shift+C`), Android Share Intent (`Share to LifeOS`), or Web Command Palette (`Cmd+K`).
2. Payload ingests into `inbox_items` in $< 100\text{ ms}$ with toast confirmation.
3. User opens Inbox Triage view and routes item:
   - **Triage to Project (P):** Converts into Task or Project with due date and priority.
   - **Triage to Area (A):** Converts into Area standard, habit, or financial account entry.
   - **Triage to Resource (R):** Converts into Second Brain note, document, or whiteboard diagram.
   - **Archive (A):** Stores in Archives or discards.

---

### Flow 2: Direct Task Creation, Editing & Completion
**Goal:** Create, modify, check off, and track task progress directly from Today, Kanban, or Project views.

```text
  [ Open Today / Kanban / Project View ]
                     │
                     ▼
  [ Click "+ Add Task" or Press "Shift + T" ]
                     │
                     ▼
  [ Enter Title, Due Date, Priority, Project (P) / Area (A) ]
                     │
                     ▼
  [ Task Appears in Execution List & Today View ]
                     │
                     ▼
  [ User Checks Off Task (Status: Done) ]
                     │
                     ▼
  [ Trigger Event: TaskCompletedEvent ]
                     │
    ┌────────────────┴────────────────┐
    ▼                                 ▼
[ Update Project Progress % ]   [ Append to Daily Journal Log ]
```

1. User views Today list, Kanban Board, or active Project tab.
2. Presses `Shift+T` or clicks `+ Add Task` to open inline task editor.
3. Sets Task attributes: Title, Priority (`Urgent`, `High`, `Medium`, `Low`), Due Date, linked Project (P) or Area (A).
4. When task execution is complete, user checks off the checkbox (Status $\rightarrow$ `Done`).
5. **System Automation:**
   - Emits `TaskCompletedEvent`.
   - Recalculates parent Project milestone progress percentage.
   - Appends completed task entry to today's Daily Journal log.

---

### Flow 3: Note Editing, Wiki-Linking & Context Inspector Sync (Second Brain - R)
**Goal:** Create or update a Second Brain note, link entities via inline `[[Wiki-links]]`, and inspect graph context.

```text
  [ Open Notes / Press "Shift + N" ]
                 │
                 ▼
  [ Write Markdown Content in Rich Editor ]
                 │
                 ▼
  [ Type "[[" -> Select Target Entity / Note Title ]
                 │
                 ▼
  [ System Generates Bidirectional EntityLink ]
                 │
                 ▼
  [ Right Context Panel Updates Graph View & Backlinks ]
```

1. User opens Second Brain notes module and creates/edits a Markdown note.
2. Types `[[` to invoke inline auto-complete search for matching notes, tasks, or projects.
3. Selecting a target creates a Wiki-link (`[[Homelab GPU Setup]]`).
4. System automatically registers a bidirectional relationship in `entity_links`.
5. Opening the **Right Context Panel (`Cmd+.`)** instantly renders:
   - Linked Entities list (Tasks, Projects, Diagrams referenced).
   - Backlinks panel (other notes or daily logs pointing to this note).
   - AI context summary.

---

### Flow 4: Daily Journaling & Automated Activity Aggregation
**Goal:** Complete daily reflections while automatically logging completed work, habits, and metrics.

```text
  [ Navigate to Journal / Open Today's Daily Log ]
                         │
                         ▼
  [ Auto-Generated Template (YYYY-MM-DD) ]
                         │
  ┌──────────────────────┴──────────────────────┐
  ▼                                             ▼
[ System Auto-Populates Activity Log ]     [ User Writes Manual Reflection ]
• Tasks completed today                    • Morning Intentions
• Habits checked off                       • Evening Reflections
• Financial transactions recorded          • Mood & Energy Rating
  │                                             │
  └──────────────────────┬──────────────────────┘
                         ▼
           [ Save Daily Journal Record ]
```

1. User opens Journal section. System auto-provisions or loads today's date entry (`2026-09-10`).
2. System queries event log and auto-attaches:
   - Completed tasks for today.
   - Completed habit streaks.
   - Logged metric entries and transactions.
3. User writes personal reflections (Intentions, Wins, Reflections, Energy rating).
4. Journal entry saves and links to active Areas of Life (A).

---

### Flow 5: Habit Tracking & Routine Execution
**Goal:** Track daily habits and execute structured checklists (Morning Routine, Evening Shutdown).

```text
  [ Open Habits / Routines Tab ]
                 │
                 ▼
  [ View Daily Habit Grid & Streaks ]
                 │
                 ▼
  [ Click Habit Checkbox (e.g. "Read 30 Mins") ]
                 │
                 ▼
  [ System Increments Current Streak (+1) ]
                 │
                 ▼
  [ Emit HabitCompletedEvent -> Log to HabitLog ]
```

1. User views Habits tab or Home Dashboard widget.
2. Clicks habit check-box on desktop or taps mobile widget.
3. System updates streak count (`Current Streak: 12 Days`), records timestamped `HabitLog` entry, and updates Area of Life health status.

---

### Flow 6: Whiteboard Diagramming & Project Embedding (Resource - R)
**Goal:** Create a visual system/architecture diagram in draw.io and link it to a Project or Area.

```text
  [ Open Whiteboard / Click "+ New Diagram" ]
                      │
                      ▼
  [ Embedded draw.io Canvas Interface Opens ]
                      │
                      ▼
  [ Draw Flowchart / Network Topology / ERD ]
                      │
                      ▼
  [ Save Diagram & Link to Project (P) / Area (A) ]
                      │
                      ▼
  [ System Renders Vector PNG Preview in Project Dashboard ]
```

1. User opens Whiteboard module and launches embedded draw.io editor.
2. Draws architectural diagram or flowchart.
3. Links diagram to Project (P) (e.g. *Homelab Architecture* $\rightarrow$ *Proxmox Upgrade Project*).
4. Saving generates XML model and PNG vector preview thumbnail embedded on Project Dashboard.

---

### Flow 7: Actionable Chat Message Conversion
**Goal:** Transform raw chat communication into an actionable Task, Note, or Reminder.

```text
  [ Reading Message in Chat Channel / DM ]
                     │
                     ▼
  [ Click Message Option (...) -> "Convert to Task" ]
                     │
                     ▼
  [ Pre-filled Modal Appears (Title & Message Link) ]
                     │
                     ▼
  [ Save Task -> Registers Message <-> Task EntityLink ]
```

1. User reads a message in a team/personal channel (e.g. *"Remember to order 128GB RAM for server"*).
2. Clicks message context menu `...` $\rightarrow$ **Convert to Task**.
3. System opens pre-filled task modal containing message body and channel link.
4. User sets due date and saves task. Bidirectional link registered in `entity_links`.

---

### Flow 8: Metric Tracking & Financial Transaction Entry
**Goal:** Record daily quantitative metrics and log personal/workspace financial transactions.

```text
  [ Open Finance / Trackers Tab ]
                │
                ▼
  [ Select Tracker / Account (e.g. Homelab Expenses) ]
                │
                ▼
  [ Enter Amount / Metric Value & Category ]
                │
                ▼
  [ System Recalculates Account Balance & Trend Graph ]
```

1. User opens Finance or Trackers tab.
2. Clicks `+ New Transaction`.
3. Inputs Amount, Type (`Expense`), Category (`Hardware`), and Account (`Checking`).
4. System updates account balance, category budget usage, and monthly cashflow reports.

---

### Flow 9: Weekly & Monthly Review Wizard
**Goal:** Perform periodic system maintenance to keep workspace organized under PARA.

```text
  [ Launch Weekly Review Wizard ]
                 │
                 ▼
  Step 1: Clear & Triage All Inbox Items
                 │
                 ▼
  Step 2: Review Due/Overdue Tasks & Active Projects (P)
                 │
                 ▼
  Step 3: Review Area (A) Maintenance Standards & Habit Streaks
                 │
                 ▼
  Step 4: Move Completed Projects to Archives (A)
                 │
                 ▼
  [ Generate Signed-Off Weekly Summary Log ]
```

1. User launches Weekly Review Wizard every Sunday.
2. Step-by-step guided workflow:
   - **Step 1:** Triage remaining Inbox items into PARA.
   - **Step 2:** Audit active Projects (P) and update milestone target dates.
   - **Step 3:** Review Area (A) habit completion rates and budget variances.
   - **Step 4:** Move completed projects and associated tasks to Archives (A).
3. System generates Weekly Review Summary saved to Second Brain notes.

---

### Flow 10: Search, Filtering & Life Graph Exploration
**Goal:** Query workspace entities using `Cmd+K` and explore graph relationships.

```text
  [ Press Cmd+K / Ctrl+K ]
             │
             ▼
  [ Type Query (e.g. "Proxmox") & Apply Filter "category:resource" ]
             │
             ▼
  [ Instant Results Rendered (< 250ms) ]
             │
             ▼
  [ Select Result -> Open Entity Canvas + Right Context Panel Inspector ]
```

1. User hits `Cmd+K` from any screen.
2. Enters search query and filters by PARA category (`category:resource`).
3. Clicks matching Note result.
4. Canvas opens note while Right Context Panel displays all linked tasks, projects, diagrams, and backlinks.

---

### Flow 11: Automated Backup & One-Click Restore
**Goal:** Administer background automated backups and execute point-in-time disaster recovery.

```text
  [ Admin Navigation -> Settings -> Security & Backup ]
                           │
                           ▼
          [ Click "Restore Snapshot" Wizard ]
                           │
                           ▼
          [ Select Encrypted MinIO Snapshot & Verify SHA256 ]
                           │
                           ▼
          [ Execute One-Click Workspace Restoration ]
                           │
                           ▼
          [ State Restored cleanly (RPO < 1h, RTO < 15m) ]
```

1. Admin navigates to Workspace Settings $\rightarrow$ Security & Backup.
2. System displays automated backup schedule status (MinIO encrypted snapshot backups).
3. In event of data recovery requirement, admin selects snapshot and clicks **Restore Snapshot**.
4. System verifies SHA-256 checksum and executes point-in-time restoration.

---

## 3. Penpot Web-Focused Interactive Wireframe Screen Matrix & Flow Mapping

The Penpot design workspace **'Cypher LifeOS'** features a **6-screen end-to-end Web Application Wireframe Suite** ($1440 \times 900\text{ px}$ resolution per canvas) equipped with **89 live prototyping click interactions (`addInteraction("click", { type: "navigate-to" })`)**.

### 💻 Web Application Interactive Screen Suite ($1440 \times 900\text{ px}$)

| Board Name | Position | Primary Role & Features | Interactive Click Connections |
| :--- | :--- | :--- | :--- |
| **`Web - Home Dashboard & Command Center`** | $X=0, Y=0$ | Central command hub, 3-column desktop layout, navigation sidebar, 4 key metrics cards, today's priority focus banner, task execution queue, mini knowledge graph preview, daily habits tracker, local SQLite sync indicator. | • Navigation Sidebar $\rightarrow$ `Second Brain`, `Tasks & Projects`, `Daily Journal`, `Life Graph`, `Command Palette`<br>• Search Input Bar / Quick Add $\rightarrow$ `Web - Universal Command Palette Modal (⌘K)`<br>• Metric Cards $\rightarrow$ `Tasks & Projects` / `Daily Journal` / `Second Brain`<br>• Task Queue Items $\rightarrow$ `Web - Tasks & Project Management`<br>• Mini Graph Box $\rightarrow$ `Web - Interactive Knowledge Graph Explorer` |
| **`Web - Second Brain Note Workspace`** | $X=1520, Y=0$ | 3-column knowledge editor sheet, folder explorer tree (*Architecture*, *Engineering*, *Personal*, *Vault*), Markdown WYSIWYG sheet with code syntax blocks & callout boxes, right context inspector with 2D graph nodes & backlinks excerpts. | • Navigation Sidebar $\rightarrow$ `Dashboard`, `Tasks & Projects`, `Daily Journal`, `Life Graph`<br>• `✓ 3 Linked Tasks` Badge $\rightarrow$ `Web - Tasks & Project Management`<br>• `🌐 14 Backlinks` Badge $\rightarrow$ `Web - Interactive Knowledge Graph Explorer`<br>• `⚡ Capture` Button $\rightarrow$ `Web - Universal Command Palette Modal (⌘K)`<br>• Backlink Excerpt Cards $\rightarrow$ Note Detail Navigation |
| **`Web - Tasks & Project Management`** | $X=3040, Y=0$ | 4-column Kanban Board (*Backlog & Inbox*, *In Progress*, *Waiting & Blocked*, *Completed*), view mode switcher (*Kanban*, *List*, *Calendar*, *Timeline*), task progress bars, priority badges. | • Navigation Sidebar $\rightarrow$ `Dashboard`, `Second Brain`, `Daily Journal`, `Life Graph`<br>• `+ New Task` Button $\rightarrow$ `Web - Universal Command Palette Modal (⌘K)`<br>• Task Cards $\rightarrow$ `Web - Second Brain Note Workspace` |
| **`Web - Daily Journal & Habit Tracker`** | $X=0, Y=960$ | 3-column reflection workspace, journal archive list (`2026-09-11`, `2026-09-10`), daily log sheet with Morning Intentions, auto-aggregated task/focus activity log, energy/mood badges, right daily habit grid with streaks. | • Navigation Sidebar $\rightarrow$ `Dashboard`, `Second Brain`, `Tasks & Projects`, `Life Graph`<br>• Search Bar $\rightarrow$ `Web - Universal Command Palette Modal (⌘K)` |
| **`Web - Interactive Knowledge Graph Explorer`** | $X=1520, Y=960$ | Full 2D knowledge graph viewport ($860\text{ px}$ canvas width), central node cluster (`LifeOS Core` $\rightarrow$ `Local-First`, `SQLite-vec`, `ElectricSQL`, `CRDT Sync`), node physics controls, right node inspector panel. | • Navigation Sidebar $\rightarrow$ `Dashboard`, `Second Brain`, `Tasks & Projects`, `Daily Journal`<br>• Connected Node Cards / `Open Full Note →` $\rightarrow$ `Web - Second Brain Note Workspace` |
| **`Web - Universal Command Palette Modal (⌘K)`** | $X=3040, Y=960$ | Spotlight modal window preview ($720 \times 440\text{ px}$) over 40% dark overlay, quick category filter pills (*All*, *Tasks*, *Notes*, *Journal*), instant search results with shortcut key legends. | • Search Result Items $\rightarrow$ Navigates directly to `Tasks & Projects` / `Second Brain` / `Daily Journal` / `Life Graph`<br>• Destination Filter Pills $\rightarrow$ Switches view category |

---

## 4. Document Sign-Off & Verification

| Role | Verification Action | Status |
| :--- | :--- | :--- |
| **UX Architect** | Complete coverage of Web-focused end-to-end task checking, note updating, journaling, habits, reviews, and interactive Penpot 6-screen wireframe click flow mapping | Verified |
| **System Lead** | Alignment with [`ux/information-architecture.md`](file:///Users/ritikgarg/workspace/lifeos/ux/information-architecture.md) and [`architecture/domain-model.md`](file:///Users/ritikgarg/workspace/lifeos/architecture/domain-model.md) | Verified |


